import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// Get all projects
export const getAllProject = async (req, res) => {
    try {
        const project = await prisma.project.findMany();

        return sendResponse(res, 200, "Project retrieved successfully", project);
    } catch (error) {
        console.error("getProject error:", error);
        return sendResponse(res, 500, "Failed to retrieve project", { error: error.message });
    }
};

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { projectName, projectDescription, displayMessage, tagline, twitterUrl, instagramUrl, facebookUrl } = req.body;

        if (!projectName || !projectDescription || !displayMessage) {
            return sendResponse(res, 400, "projectName, projectDescription and displayMessage are required");
        }

        const id = randomUUID();

        const newProject = await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    projectId: id,
                    projectName: projectName.trim(),
                    projectDescription: projectDescription.trim(),
                    displayMessage: displayMessage.trim(),
                    tagline: tagline?.trim() || null,
                    twitterUrl: twitterUrl?.trim() || null,
                    instagramUrl: instagramUrl?.trim() || null,
                    facebookUrl: facebookUrl?.trim() || null
                }
            });

            return project;
        });

        return sendResponse(res, 201, "Project created successfully", newProject);
    } catch (error) {
        console.error("createProject error:", error);
        return sendResponse(res, 500, "Failed to create project", { error: error.message });
    }
};

// Update existing project details
export const updateProject = async (req, res) => {
    try {
        const { projectId, projectName, projectDescription, displayMessage, tagline, twitterUrl, instagramUrl, facebookUrl } = req.body;

        const updatedProject = await prisma.project.update({
            where: { projectId: projectId },
            data: {
                ...(projectName && { projectName: projectName.trim() }),
                ...(projectDescription && { projectDescription: projectDescription.trim() }),
                ...(displayMessage && { displayMessage: displayMessage.trim() }),
                ...(tagline !== undefined && { tagline: tagline?.trim() || null }),
                ...(twitterUrl !== undefined && { twitterUrl: twitterUrl?.trim() || null }),
                ...(instagramUrl !== undefined && { instagramUrl: instagramUrl?.trim() || null }),
                ...(facebookUrl !== undefined && { facebookUrl: facebookUrl?.trim() || null })
            }
        });

        return sendResponse(res, 200, "Project updated successfully", updatedProject);
    } catch (error) {
        console.error("updateProject error:", error);
        return sendResponse(res, 500, "Failed to update project", { error: error.message });
    }
};

// Admin: Create a new User and their associated Project together
export const createUserAndProject = async (req, res) => {
    try {
        const { fullName, emailId, password, projectName, projectDescription, displayMessage, tagline, twitterUrl, instagramUrl, facebookUrl } = req.body;

        if (!fullName || !emailId || !password || !projectName || !projectDescription || !displayMessage) {
            return sendResponse(res, 400, "fullName, emailId, password, projectName, projectDescription, and displayMessage are required");
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { emailId: emailId.trim().toLowerCase() }
        });

        if (existingUser) {
            return sendResponse(res, 409, "User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const userId = randomUUID();
        const projectId = randomUUID();

        // Use a transaction to ensure both are created successfully or neither is
        const result = await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    projectId,
                    projectName: projectName.trim(),
                    projectDescription: projectDescription.trim(),
                    displayMessage: displayMessage.trim(),
                    tagline: tagline?.trim() || null,
                    twitterUrl: twitterUrl?.trim() || null,
                    instagramUrl: instagramUrl?.trim() || null,
                    facebookUrl: facebookUrl?.trim() || null
                }
            });

            const user = await tx.user.create({
                data: {
                    userId,
                    fullName: fullName.trim(),
                    emailId: emailId.trim().toLowerCase(),
                    password: hashedPassword,
                    role: 'USER',
                    projectId: project.projectId,
                    updatePassword: true
                },
                select: {
                    userId: true,
                    fullName: true,
                    emailId: true,
                    role: true,
                    projectId: true
                }
            });

            return { user, project };
        });

        return sendResponse(res, 201, "User and Project created successfully", result);
    } catch (error) {
        console.error("createUserAndProject error:", error);
        return sendResponse(res, 500, "Failed to create User and Project", { error: error.message });
    }
};

// Get specific project data for display by projectName
export const getProjectByProjectName = async (req, res) => {
    try {
        const { projectName } = req.params;

        if (!projectName) {
            return sendResponse(res, 400, "projectName is required");
        }

        const project = await prisma.project.findFirst({
            where: {
                projectName: {
                    equals: projectName.trim(),
                    mode: 'insensitive'
                }
            },
            select: {
                projectId: true,
                projectName: true,
                displayMessage: true,
                tagline: true,
                twitterUrl: true,
                instagramUrl: true,
                facebookUrl: true
            }
        });

        if (!project) {
            return sendResponse(res, 404, "Project not found");
        }

        return sendResponse(res, 200, "Project profile retrieved successfully", project);
    } catch (error) {
        console.error("getProjectByProjectName error:", error);
        return sendResponse(res, 500, "Failed to retrieve project profile", { error: error.message });
    }
};