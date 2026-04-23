import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

// Get all projects with detailed association for Admin
export const getAllProject = async (req, res) => {
    try {
        const projects = await prisma.project.findMany({
            include: {
                user: {
                    select: {
                        userId: true,
                        fullName: true,
                        emailId: true,
                    }
                },
                usages: {
                    where: { status: 'ACTIVE' },
                    include: {
                        plan: {
                            select: {
                                planName: true,
                                billingCycle: true,
                                price: true
                            }
                        }
                    },
                    take: 1
                },
                _count: {
                    select: { photos: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return sendResponse(res, 200, "Projects retrieved successfully", projects);
    } catch (error) {
        console.error("getAllProject error:", error);
        return sendResponse(res, 500, "Failed to retrieve projects", { error: error.message });
    }
};

// Update existing project details
export const updateProject = async (req, res) => {
    try {
        const {
            projectId,
            projectName,
            projectDescription,
            displayMessage,
            tagline,
            twitterUrl,
            instagramUrl,
            facebookUrl,
            planId // New field
        } = req.body;

        if (!projectId) {
            return sendResponse(res, 400, "projectId is required");
        }

        const project = await prisma.project.findUnique({
            where: { projectId },
            include: { user: true }
        });

        if (!project) {
            return sendResponse(res, 404, "Project not found");
        }

        let selectedPlan = null;
        if (planId) {
            selectedPlan = await prisma.subscriptionPlan.findUnique({
                where: { planId }
            });
            if (!selectedPlan) {
                return sendResponse(res, 404, "Subscription plan not found");
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1. Update project details
            const updatedProject = await tx.project.update({
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

            // 2. Handle Plan Change
            if (planId && project.user) {
                // Find current active usage for this user (could be linked to project or be initial null)
                const currentUsage = await tx.usage.findFirst({
                    where: {
                        userId: project.user.userId,
                        status: 'ACTIVE'
                    }
                });

                // Mark current usage as CANCELLED if it exists
                if (currentUsage) {
                    await tx.usage.update({
                        where: { usageId: currentUsage.usageId },
                        data: { status: 'CANCELLED' }
                    });
                }

                // Calculate end date based on plan duration
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + selectedPlan.durationDays);

                // Create new usage record linked to this project
                await tx.usage.create({
                    data: {
                        usageId: randomUUID(),
                        userId: project.user.userId,
                        projectId: projectId, // Link it to the project now
                        planId: selectedPlan.planId,
                        maxPhotos: selectedPlan.maxPhotos,
                        monthlyPhotoUploadsLimit: selectedPlan.monthlyPhotoUploads,
                        maxOnlineBookingAllowed: selectedPlan.maxOnlineBookingAllowed,
                        status: 'ACTIVE',
                        startDate: new Date(),
                        endDate: endDate
                    }
                });
            }

            return updatedProject;
        });

        return sendResponse(res, 200, "Project updated successfully", result);
    } catch (error) {
        console.error("updateProject error:", error);
        return sendResponse(res, 500, "Failed to update project", { error: error.message });
    }
};

// Admin: Create a new User and their associated Project together
export const createUserAndProject = async (req, res) => {
    try {
        const {
            fullName,
            emailId,
            password,
            projectName,
            projectDescription,
            displayMessage,
            tagline,
            twitterUrl,
            instagramUrl,
            facebookUrl,
            planId
        } = req.body;

        if (!fullName || !emailId || !password || !projectName || !projectDescription || !displayMessage) {
            return sendResponse(res, 400, "fullName, emailId, password, projectName, projectDescription, and displayMessage are required");
        }

        const existingUser = await prisma.user.findUnique({
            where: { emailId: emailId.trim().toLowerCase() }
        });

        if (existingUser) {
            return sendResponse(res, 409, "User with this email already exists");
        }

        let selectedPlan = null;
        if (planId) {
            selectedPlan = await prisma.subscriptionPlan.findUnique({
                where: { planId }
            });
            if (!selectedPlan) {
                return sendResponse(res, 404, "Specified subscription plan not found");
            }
        } else {
            selectedPlan = await prisma.subscriptionPlan.findFirst({
                where: { isDefault: true }
            });

            if (!selectedPlan) {
                return sendResponse(res, 400, "Subscription plan is required. No planId provided and no default plan configured.");
            }
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);
        const userId = randomUUID();
        const projectId = randomUUID();

        const today = new Date();

        const planEndDate = new Date(today);
        planEndDate.setDate(planEndDate.getDate() + selectedPlan.durationDays);

        // Use a transaction to ensure everything is created successfully or nothing is
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
                    facebookUrl: facebookUrl?.trim() || null,
                    planEndDate: planEndDate
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
                    updatePassword: true,
                },
                select: {
                    userId: true,
                    fullName: true,
                    emailId: true,
                    role: true,
                    projectId: true
                }
            });

            // Calculate end date based on plan duration
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + selectedPlan.durationDays);

            // Create initial usage record
            await tx.usage.create({
                data: {
                    usageId: randomUUID(),
                    userId: user.userId,
                    projectId: project.projectId,
                    planId: selectedPlan.planId,
                    maxPhotos: selectedPlan.maxPhotos,
                    monthlyPhotoUploadsLimit: selectedPlan.monthlyPhotoUploads,
                    maxOnlineBookingAllowed: selectedPlan.maxOnlineBookingAllowed,
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate: endDate
                }
            });

            return { user, project, plan: selectedPlan.planName };
        });

        return sendResponse(res, 201, "User, Project and Subscription initialized successfully", result);
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