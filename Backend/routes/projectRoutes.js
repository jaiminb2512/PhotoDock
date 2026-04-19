import { Router } from "express";
import {
    getAllProject,
    updateProject,
    createUserAndProject,
    getProjectByProjectName
} from "../controllers/projectController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/:projectName", getProjectByProjectName); // get /api/project/:projectName

// Define protected routes and attach controllers
router.put("/", authenticate, isAdmin, updateProject); // put /api/project

// Admin specialized route
router.get("/", authenticate, isAdmin, getAllProject); // get /api/project
router.post("/admin-create", authenticate, createUserAndProject); // post /api/project/admin-create

export default router;
