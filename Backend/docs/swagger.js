import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "PhotoDock API",
            version: "1.0.0",
            description: "API for PhotoDock",
        },
        servers: [
            { url: "http://localhost:3001", description: "Local" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                // ... Existing User Schemas
                User: {
                    type: "object",
                    properties: {
                        userId: { type: "string", format: "uuid" },
                        fullName: { type: "string" },
                        emailId: { type: "string", format: "email" },
                        createdAt: { type: "string", format: "date-time" }
                    }
                },
                RegisterInput: {
                    type: "object",
                    required: ["fullName", "emailId", "password"],
                    properties: {
                        fullName: { type: "string" },
                        emailId: { type: "string", format: "email" },
                        password: { type: "string" }
                    }
                },
                LoginInput: {
                    type: "object",
                    required: ["emailId", "password"],
                    properties: {
                        emailId: { type: "string", format: "email" },
                        password: { type: "string" }
                    }
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        userId: { type: "string", format: "uuid" },
                        fullName: { type: "string" },
                        emailId: { type: "string", format: "email" },
                        token: { type: "string" }
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        success: { type: "number" },
                        message: { type: "string" },
                        data: { type: "object", nullable: true }
                    }
                },
                // ... New Schemas
                PaginationMeta: {
                    type: "object",
                    properties: {
                        total: { type: "integer" },
                        page: { type: "integer" },
                        limit: { type: "integer" },
                        totalPages: { type: "integer" }
                    }
                }
            }
        },
        paths: {
            // ... User paths (kept same)
            "/api/users/register": {
                post: {
                    summary: "Register a new user",
                    tags: ["Users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/RegisterInput" }
                            }
                        }
                    },
                    responses: {
                        "201": {
                            description: "User registered successfully",
                            content: { "application/json": { schema: { type: "object", properties: { success: { type: "number" }, message: { type: "string" }, data: { $ref: "#/components/schemas/User" } } } } }
                        },
                        "400": { description: "Validation error" },
                        "409": { description: "Email already exists" }
                    }
                }
            },
            "/api/users/login": {
                post: {
                    summary: "User login",
                    tags: ["Users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: { $ref: "#/components/schemas/LoginInput" }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Login successful",
                            content: { "application/json": { schema: { type: "object", properties: { success: { type: "number" }, message: { type: "string" }, data: { $ref: "#/components/schemas/LoginResponse" } } } } }
                        },
                        "401": { description: "Invalid credentials" }
                    }
                }
            }
        }
    },
    apis: [
        "./routes/**/*.js"
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
