import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { search } from "duck-duck-scrape";
import dotenv from "dotenv";

dotenv.config();

const duckDuckGoSearch = tool(
    async ({ query, maxResults = 5 }) => {
        try {
            const results = await search(query, { safeSearch: "ON" });

            if (!results?.results?.length) {
                return `No search results found for: "${query}"`;
            }

            const topResults = results.results.slice(0, maxResults);

            const formatted = topResults.map((r, i) =>
                `[${i + 1}] ${r.title}\nURL: ${r.url}\nSnippet: ${r.description || "No description available"}`
            ).join("\n\n");

            return `DuckDuckGo Search Results for "${query}":\n\n${formatted}`;
        } catch (err) {
            return `Search failed: ${err.message}`;
        }
    },
    {
        name: "duckduckgo_search",
        description:
            "Search the internet using DuckDuckGo. Use this when you need up-to-date information, real-world facts, current events, or anything that may not be in your training data.",
        schema: z.object({
            query: z.string().describe("The search query to look up on DuckDuckGo"),
            maxResults: z.number().optional().describe("Maximum number of results to return (default: 5)"),
        }),
    }
);

const buildChat = (model, extraOptions = {}) => {
    const chat = new ChatGoogleGenerativeAI({
        model,
        apiKey: process.env.GEMINI_API_KEY,
        ...extraOptions,
    });
    return chat.bindTools([duckDuckGoSearch]);
};

/**
 * Resolves tool calls in a response and appends the tool result messages.
 * Returns the final list of messages with tool results included.
 */
const resolveToolCalls = async (response, messages) => {
    const allMessages = [...messages, response];

    if (!response.tool_calls?.length) return allMessages;

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
        response.tool_calls.map(async (tc) => {
            const result = await duckDuckGoSearch.invoke(tc.args);
            return {
                role: "tool",
                tool_call_id: tc.id,
                content: result,
            };
        })
    );

    return [...allMessages, ...toolResults];
};

export const generateMessage = async (systemPrompt, messages, provider, model) => {
    const chat = buildChat(model);

    const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
    ];

    // First call – may trigger tool use
    let response = await chat.invoke(fullMessages);

    // Agentic loop: keep resolving tool calls until the model is done
    while (response.tool_calls?.length) {
        const messagesWithResults = await resolveToolCalls(response, fullMessages);
        response = await chat.invoke(messagesWithResults);
    }

    return response;
};

export const streamMessage = async (systemPrompt, messages, provider, model) => {
    const chat = new ChatGoogleGenerativeAI({
        model,
        apiKey: process.env.GEMINI_API_KEY,
        streamUsage: true,
    });
    const chatWithTools = chat.bindTools([duckDuckGoSearch]);

    const fullMessages = [
        { role: "system", content: systemPrompt },
        ...messages,
    ];

    // First call (non-streamed) to detect tool use
    const firstResponse = await chatWithTools.invoke(fullMessages);

    console.log("firstResponse [streamMessage]", firstResponse);

    if (firstResponse.tool_calls?.length) {
        // Resolve all tool calls
        const messagesWithResults = await resolveToolCalls(firstResponse, fullMessages);
        // Stream the final answer after tool results are injected
        return await chatWithTools.stream(messagesWithResults);
    }

    // No tools needed — stream directly from scratch
    return await chatWithTools.stream(fullMessages);
};
