import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";
import { google } from 'googleapis';
import { Readable } from 'stream';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

const uploadToDrive = async (file) => {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: `${Date.now()}-${file.originalname}`,
                parents: GOOGLE_DRIVE_FOLDER_ID ? [GOOGLE_DRIVE_FOLDER_ID] : []
            },
            media: {
                mimeType: file.mimetype,
                body: Readable.from(file.buffer)
            }
        });

        const fileId = response.data.id;

        // Set file permissions to public view
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        });

        // Get web view link
        const fileData = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink'
        });

        return fileData.data.webViewLink;
    } catch (error) {
        console.error('Google Drive Upload Error:', error);
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
            return sendResponse(res, 400, "ProjectId is required")
        }

        if (!setNo) {
            return sendResponse(res, 400, "SetNo is required")
        }

        const project = await prisma.project.findUnique({
            where: { projectId: projectId }
        });

        if (!project) {
            return sendResponse(res, 404, "Project not found");
        }

        const photosData = [];
        let currentSequence = parseInt(sequence) || 0;

        for (const file of files) {
            const photoUrl = await uploadToDrive(file);
            const id = randomUUID();

            const newPhoto = await prisma.photo.create({
                data: {
                    photoId: id,
                    projectId: projectId,
                    setNo: setNo,
                    photoName: photoName?.trim() || file.originalname,
                    photoDescription: photoDescription?.trim() || "",
                    photoUrl: photoUrl,
                    sequence: currentSequence++
                }
            });
            photosData.push(newPhoto);
        }

        return sendResponse(res, 201, "Photos created and uploaded successfully", photosData);
    } catch (error) {
        console.error("savePhoto error:", error);
        return sendResponse(res, 500, "Failed to create photo", { error: error.message });
    }
};