import { verifyToken } from "../utils/jwt.js";
import sendResponse from "../utils/response.js";
import prisma from "../dbConnect/prismaClient.js";

/**
 * Common helper function to verify token and get user
 * Handles all common authentication checks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object|null} - User object (without password) or null if authentication fails
 */
export const verifyAndGetUser = async (req, res) => {
    try {
        // Check for authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            sendResponse(res, 401, "Authorization token is required");
            return null;
        }

        // Extract token
        const token = authHeader.substring(7); // Remove "Bearer " prefix

        if (!token) {
            sendResponse(res, 401, "Authorization token is required");
            return null;
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            sendResponse(res, 401, "Invalid or expired token");
            return null;
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { userId: decoded.userId }
        });

        if (!user) {
            sendResponse(res, 401, "User not found");
            return null;
        }

        // Check if user is deleted
        if (user.isDeleted) {
            sendResponse(res, 401, "User account is deactivated");
            return null;
        }

        // Return user without password
        const { password, ...userDetails } = user;
        return userDetails;
    } catch (error) {
        console.error("Token verification error:", error);
        sendResponse(res, 500, "Authentication failed", { error: error.message });
        return null;
    }
}

export const loggedIn = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        sendResponse(res, 401, "Authorization token is required");
        return null;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
        sendResponse(res, 401, "Authorization token is required");
        return null;
    }

    // Verify token
    const decoded = verifyToken(token);

    if (!decoded) {
        sendResponse(res, 401, "Invalid or expired token");
        return null;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
        where: { userId: decoded.userId }
    });

    if (!user) {
        sendResponse(res, 401, "User not found");
        return null;
    }

    // Check if user is deleted
    if (user.isDeleted) {
        sendResponse(res, 401, "User account is deactivated");
        return null;
    }

    // Return user without password
    const { password, ...userDetails } = user;
    req.user = userDetails;
    next();
};

export const authenticate = async (req, res, next) => {
    const user = await verifyAndGetUser(req, res);

    if (!user) {
        return; // Response already sent by verifyAndGetUser
    }

    // Attach user details to request object
    req.user = user;
    next();
};