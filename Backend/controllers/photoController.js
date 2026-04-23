import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";
import { v2 as cloudinary } from 'cloudinary';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const uploadPhoto = async (project, file) => {
    if (project.currentImageProvider === "cloudinary") {
        return await uploadToCloudinary(file);
    } else {
        return null;
    }
};

const uploadToCloudinary = async (file) => {
    try {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    public_id: `PhotoDock/${Date.now()}-${Math.random().toString(36).substring(7)}`,
                    overwrite: true
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });
    } catch (error) {
        console.error('Cloudinary Upload Error:', error);
        throw error;
    }
};

// Get all photos ordered by sequence
export const getPhotos = async (req, res) => {
    try {
        const { projectId, projectName } = req.query;

        let whereClause = {};

        if (projectId) {
            whereClause = { projectId: projectId };
        } else if (projectName) {
            // Find project first if only projectName provided
            const project = await prisma.project.findFirst({
                where: {
                    projectName: {
                        equals: projectName.trim(),
                        mode: 'insensitive'
                    }
                }
            });

            if (project) {
                whereClause = { projectId: project.projectId };
            }
            else {
                // If projectName provided but not found, return empty array
                return sendResponse(res, 200, "Project not found, returning empty photos", []);
            }
        }

        const photos = await prisma.photo.findMany({
            where: whereClause,
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

// save multiple photos
export const savePhoto = async (req, res) => {
    try {
        const { projectId, photoName, photoDescription, sequence, setNo } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return sendResponse(res, 400, "At least one photo is required");
        }

        if (!projectId) {
            return sendResponse(res, 400, "ProjectId is required");
        }

        if (!setNo) {
            return sendResponse(res, 400, "SetNo is required");
        }

        const setNoValue = parseInt(setNo);
        if (Number.isNaN(setNoValue)) {
            return sendResponse(res, 400, "SetNo must be a valid number");
        }

        // 1. Get Project with active usage and current photo count
        const project = await prisma.project.findUnique({
            where: { projectId: projectId },
        });

        if (!project) {
            return sendResponse(res, 404, "Project not found");
        }

        const activeUsage = await prisma.usage.findFirst({
            where: {
                usageId: project.currentUsageId,
                status: 'ACTIVE'
            }
        })
        if (!activeUsage) {
            return sendResponse(res, 403, "No active subscription found for this project");
        }

        // 2. Check Limits
        const newPhotosCount = files.length;

        // Check hard limit (maxPhotos)
        if (activeUsage.maxPhotosUsed + newPhotosCount > activeUsage.maxPhotos) {
            return sendResponse(res, 403, `Upload failed. Max photos limit reached (${activeUsage.maxPhotos}). Current photos: ${activeUsage.maxPhotosUsed}, Trying to upload: ${newPhotosCount}`);
        }

        // Check monthly limit
        if (activeUsage.monthlyPhotoUploadsUsed + newPhotosCount > activeUsage.monthlyPhotoUploadsLimit) {
            return sendResponse(res, 403, `Upload failed. Monthly upload limit reached. Left: ${activeUsage.monthlyPhotoUploadsLimit - activeUsage.monthlyPhotoUploadsUsed}, Trying to upload: ${newPhotosCount}`);
        }

        const names = Array.isArray(photoName) ? photoName : photoName ? [photoName] : [];
        const descriptions = Array.isArray(photoDescription) ? photoDescription : photoDescription ? [photoDescription] : [];
        const sequences = Array.isArray(sequence) ? sequence : sequence ? [sequence] : [];

        let defaultSequence = 1;
        if (!Array.isArray(sequence) && sequence !== undefined && sequence !== null) {
            const parsed = parseInt(sequence);
            defaultSequence = Number.isNaN(parsed) ? 1 : parsed;
        }

        // 3. Upload photos to Cloudinary
        // const uploadPromises = files.map(file => uploadPhoto(project, file));
        // const photoUrls = await Promise.all(uploadPromises);

        const photoUrls = ["https://dummy.com/1", "https://dummy.com/2", "https://dummy.com/3"];

        // 4. Create photo records and update usage in transaction
        const result = await prisma.$transaction(async (tx) => {
            const photosData = [];
            let sequenceCounter = defaultSequence;

            for (let index = 0; index < photoUrls.length; index++) {
                const photoUrl = photoUrls[index];
                const file = files[index];
                const id = randomUUID();

                const name = names[index]?.trim() || file.originalname;
                const description = descriptions[index]?.trim() || "";
                const seqValue = Array.isArray(sequences)
                    ? parseInt(sequences[index])
                    : Number.isNaN(parseInt(sequence))
                        ? sequenceCounter
                        : parseInt(sequence);

                const photoSequence = Number.isInteger(seqValue) ? seqValue : sequenceCounter;
                if (!Array.isArray(sequences)) {
                    sequenceCounter += 1;
                }

                const newPhoto = await tx.photo.create({
                    data: {
                        photoId: id,
                        projectId: projectId,
                        setNo: setNoValue,
                        photoName: name,
                        photoDescription: description,
                        photoUrl: photoUrl,
                        sequence: photoSequence,
                        imageProvider: project.currentImageProvider
                    }
                });

                photosData.push(newPhoto);
            }

            // Update usage record
            await tx.usage.update({
                where: { usageId: activeUsage.usageId },
                data: {
                    monthlyPhotoUploadsUsed: {
                        increment: newPhotosCount
                    }
                }
            });

            return photosData;
        });

        return sendResponse(res, 201, "Photos created and uploaded successfully", result);
    } catch (error) {
        console.error("savePhoto error:", error);
        return sendResponse(res, 500, "Failed to create photo", { error: error.message });
    }
};