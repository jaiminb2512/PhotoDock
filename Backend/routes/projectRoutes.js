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
router.get("/", authenticate, getAllProject);
router.post("/", authenticate, createProject);
router.put("/", authenticate, updateProject);

// Admin specialized route
router.post("/admin-create", authenticate, createUserAndProject);

export default router;
