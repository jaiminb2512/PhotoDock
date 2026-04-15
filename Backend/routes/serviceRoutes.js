import { Router } from "express";
import { getServices, createService, updateService, deleteService } from "../controllers/serviceController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/:projectName", getServices);
router.post("/:projectName", authenticate, createService);
router.put("/:id", authenticate, updateService);
router.delete("/:id", authenticate, deleteService);

export default router;
