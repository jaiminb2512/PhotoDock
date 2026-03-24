import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";

// Get all photos ordered by sequence
export const getPhotos = async (req, res) => {
    try {
        const photos = await prisma.photo.findMany({
            orderBy: {
                sequence: 'asc'
            }
        });

        return sendResponse(res, 200, "Photos retrieved successfully", photos);
    } catch (error) {
        console.error("getPhotos error:", error);
        return sendResponse(res, 500, "Failed to retrieve photos", { error: error.message });
    }
};

// Create a new photo (Admin only ideally, but keeping it simple for now)
export const createPhoto = async (req, res) => {
    try {
        const { projectId, photoName, photoDescription, photoUrl, sequence } = req.body;

        if (!photoName || !photoUrl) {
            return sendResponse(res, 400, "photoName and photoUrl are required");
        }

        const id = randomUUID();

        if (!projectId) {
            return sendResponse(res, 400, "ProjectId is required")
        }
        else {
            const project = await prisma.project.findUnique({
                where: {
                    projectId: projectId
                }
            })

            if (!project) {
                return sendResponse(res, 404, "Project not found")
            }
        }

        const newPhoto = await prisma.photo.create({
            data: {
                photoId: projectId,
                photoName: photoName.trim(),
                photoDescription: photoDescription?.trim() || "",
                photoUrl: photoUrl.trim(),
                sequence: sequence || 0
            }
        });

        return sendResponse(res, 201, "Photo created successfully", newPhoto);
    } catch (error) {
        console.error("createPhoto error:", error);
        return sendResponse(res, 500, "Failed to create photo", { error: error.message });
    }
};
