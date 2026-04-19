import { Router } from "express";
import userRoutes from "./userRoutes.js";
import photoRoutes from "./photoRoutes.js";
import serviceRoutes from "./serviceRoutes.js";
import projectRoutes from "./projectRoutes.js";
import subscriptionPlanRoutes from "./subscriptionPlanRoutes.js";

const router = Router();
router.use("/users", userRoutes);
router.use("/photos", photoRoutes);
router.use("/services", serviceRoutes);
router.use("/projects", projectRoutes);
router.use("/subscription-plans", subscriptionPlanRoutes);

export default router;