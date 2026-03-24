import prisma from "../dbConnect/prismaClient.js";
import sendResponse from "../utils/response.js";
import { randomUUID } from "crypto";

// Get all services
export const getServices = async (req, res) => {
    try {
        const { projectName } = req.params;

        if (!projectName) {
            return sendResponse(res, 400, "projectName is required as a parameter");
        }

        const services = await prisma.service.findMany({
            where: {
                project: {
                    projectName: projectName
                }
            }
        });

        return sendResponse(res, 200, "Services retrieved successfully", services);
    } catch (error) {
        console.error("getServices error:", error);
        return sendResponse(res, 500, "Failed to retrieve services", { error: error.message });
    }
};

// Create a new service
export const createService = async (req, res) => {
    try {
        const { serviceName, serviceDescription, servicePrice } = req.body;

        if (!serviceName || !servicePrice) {
            return sendResponse(res, 400, "serviceName and servicePrice are required");
        }

        const id = randomUUID()

        console.log(req.project);

        const newService = await prisma.service.create({
            data: {
                serviceId: id,
                serviceName: serviceName.trim(),
                serviceDescription: serviceDescription?.trim() || "",
                servicePrice: servicePrice.toString(),
                projectId: req.project.projectId
            }
        });

        return sendResponse(res, 201, "Service created successfully", newService);
    } catch (error) {
        console.error("createService error:", error);
        return sendResponse(res, 500, "Failed to create service", { error: error.message });
    }
};

// Update an existing service
export const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { serviceName, serviceDescription, servicePrice } = req.body;

        const existingService = await prisma.service.findFirst({
            where: { serviceId: id, projectId: req.user.projectId }
        });

        if (!existingService) {
            return sendResponse(res, 404, "Service not found");
        }

        const updatedService = await prisma.service.update({
            where: { serviceId: id },
            data: {
                ...(serviceName && { serviceName: serviceName.trim() }),
                ...(serviceDescription !== undefined && { serviceDescription: serviceDescription.trim() }),
                ...(servicePrice && { servicePrice: servicePrice.toString() }),
                updatedBy: req.user.userId
            }
        });

        return sendResponse(res, 200, "Service updated successfully", updatedService);
    } catch (error) {
        console.error("updateService error:", error);
        return sendResponse(res, 500, "Failed to update service", { error: error.message });
    }
};

// Hard delete a service
export const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const existingService = await prisma.service.findFirst({
            where: { serviceId: id, projectId: req.user.projectId }
        });

        if (!existingService) {
            return sendResponse(res, 404, "Service not found");
        }

        await prisma.service.delete({
            where: { serviceId: id }
        });

        return sendResponse(res, 200, "Service deleted successfully");
    } catch (error) {
        console.error("deleteService error:", error);
        return sendResponse(res, 500, "Failed to delete service", { error: error.message });
    }
};
