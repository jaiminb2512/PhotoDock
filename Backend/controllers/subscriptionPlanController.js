import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";

// Get all subscription plans
export const getSubscriptionPlans = async (req, res) => {
    try {
        const plans = await prisma.subscriptionPlan.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return sendResponse(res, 200, "Subscription plans retrieved successfully", plans);
    } catch (error) {
        console.error("getSubscriptionPlans error:", error);
        return sendResponse(res, 500, "Failed to retrieve subscription plans", { error: error.message });
    }
};

// Get a single subscription plan by ID
export const getSubscriptionPlanById = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await prisma.subscriptionPlan.findUnique({
            where: { planId: id }
        });

        if (!plan) {
            return sendResponse(res, 404, "Subscription plan not found");
        }

        return sendResponse(res, 200, "Subscription plan retrieved successfully", plan);
    } catch (error) {
        console.error("getSubscriptionPlanById error:", error);
        return sendResponse(res, 500, "Failed to retrieve subscription plan", { error: error.message });
    }
};

// Create a new subscription plan
export const createSubscriptionPlan = async (req, res) => {
    try {
        const {
            planName,
            description,
            price,
            billingCycle,
            durationDays,
            maxPhotos,
            monthlyPhotoUploads,
            onlineBookingAllowed,
            maxOnlineBookingAllowed,
            isDefault
        } = req.body;

        if (!planName) {
            return sendResponse(res, 400, "planName is required");
        }

        if (price === undefined || price === null || price === "") {
            return sendResponse(res, 400, "price is required");
        }

        if (!billingCycle) {
            return sendResponse(res, 400, "billingCycle is required");
        }

        if (durationDays === undefined || durationDays === null || durationDays === "") {
            return sendResponse(res, 400, "durationDays is required");
        }

        // Check if plan with same name exists
        const planExists = await prisma.subscriptionPlan.findFirst({
            where: { planName: planName.trim() }
        });

        if (planExists) {
            return sendResponse(res, 400, "A subscription plan with this name already exists");
        }

        // If this is set as default, unset other default plans
        if (isDefault) {
            await prisma.subscriptionPlan.updateMany({
                where: { isDefault: true },
                data: { isDefault: false }
            });
        }

        const id = randomUUID();

        const newPlan = await prisma.subscriptionPlan.create({
            data: {
                planId: id,
                planName: planName.trim(),
                description: description?.trim() || "",
                price: price.toString(),
                billingCycle: billingCycle,
                durationDays: parseInt(durationDays),
                maxPhotos: parseInt(maxPhotos) || 0,
                monthlyPhotoUploads: parseInt(monthlyPhotoUploads) || 0,
                onlineBookingAllowed: !!onlineBookingAllowed,
                maxOnlineBookingAllowed: maxOnlineBookingAllowed ? parseInt(maxOnlineBookingAllowed) : null,
                isDefault: !!isDefault
            }
        });

        return sendResponse(res, 201, "Subscription plan created successfully", newPlan);
    } catch (error) {
        console.error("createSubscriptionPlan error:", error);
        return sendResponse(res, 500, "Failed to create subscription plan", { error: error.message });
    }
};

// Update an existing subscription plan
export const updateSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            planName,
            description,
            price,
            billingCycle,
            durationDays,
            maxPhotos,
            monthlyPhotoUploads,
            onlineBookingAllowed,
            maxOnlineBookingAllowed,
            isDefault
        } = req.body;

        const existingPlan = await prisma.subscriptionPlan.findUnique({
            where: { planId: id }
        });

        if (!existingPlan) {
            return sendResponse(res, 404, "Subscription plan not found");
        }

        // If this is set as default, unset other default plans
        if (isDefault) {
            await prisma.subscriptionPlan.updateMany({
                where: {
                    isDefault: true,
                    NOT: { planId: id }
                },
                data: { isDefault: false }
            });
        }

        const updatedPlan = await prisma.subscriptionPlan.update({
            where: { planId: id },
            data: {
                ...(planName && { planName: planName.trim() }),
                ...(description !== undefined && { description: description.trim() }),
                ...((price !== undefined && price !== null && price !== "") && { price: price.toString() }),
                ...(billingCycle && { billingCycle }),
                ...(durationDays !== undefined && durationDays !== null && durationDays !== "" && { durationDays: parseInt(durationDays) }),
                ...(maxPhotos !== undefined && maxPhotos !== null && maxPhotos !== "" && { maxPhotos: parseInt(maxPhotos) }),
                ...(monthlyPhotoUploads !== undefined && monthlyPhotoUploads !== null && monthlyPhotoUploads !== "" && { monthlyPhotoUploads: parseInt(monthlyPhotoUploads) }),
                ...(onlineBookingAllowed !== undefined && { onlineBookingAllowed: !!onlineBookingAllowed }),
                ...(maxOnlineBookingAllowed !== undefined && { maxOnlineBookingAllowed: maxOnlineBookingAllowed ? parseInt(maxOnlineBookingAllowed) : null }),
                ...(isDefault !== undefined && { isDefault: !!isDefault })
            }
        });

        return sendResponse(res, 200, "Subscription plan updated successfully", updatedPlan);
    } catch (error) {
        console.error("updateSubscriptionPlan error:", error);
        return sendResponse(res, 500, "Failed to update subscription plan", { error: error.message });
    }
};

// Delete a subscription plan
export const deleteSubscriptionPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const existingPlan = await prisma.subscriptionPlan.findUnique({
            where: { planId: id },
            include: { usages: true }
        });

        if (!existingPlan) {
            return sendResponse(res, 404, "Subscription plan not found");
        }

        // Check if plan is in use
        if (existingPlan.usages.length > 0) {
            return sendResponse(res, 400, "Cannot delete subscription plan as it is currently being used by users");
        }

        await prisma.subscriptionPlan.delete({
            where: { planId: id }
        });

        return sendResponse(res, 200, "Subscription plan deleted successfully");
    } catch (error) {
        console.error("deleteSubscriptionPlan error:", error);
        return sendResponse(res, 500, "Failed to delete subscription plan", { error: error.message });
    }
};
