import { Router } from "express";
import {
    getAllProject,
    createProject,
    updateProject,
    createUserAndProject,
    getProjectByProjectName
} from "../controllers/projectController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/:projectName", getProjectByProjectName); // get /api/project/:projectName

// Define protected routes and attach controllers
router.get("/", authenticate, getAllProject); // get /api/project
router.post("/", authenticate, createProject); // post /api/project
router.put("/", authenticate, updateProject); // put /api/project

// Admin specialized route
router.get("/all", authenticate, getAllProject);
router.post("/admin-create", authenticate, createUserAndProject); // post /api/project/admin-create

export default router;
