import { Router } from "express";
import {
    getAllProject,
    createProject,
    updateProject,
    createUserAndProject
} from "../controllers/projectController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// Define routes and attach controllers
router.get("/", authenticate, getAllProject); // get /api/project
router.post("/", authenticate, createProject); // post /api/project
router.put("/", authenticate, updateProject); // put /api/project

// Admin specialized route
router.post("/admin-create", authenticate, createUserAndProject); // post /api/project/admin-create

export default router;
