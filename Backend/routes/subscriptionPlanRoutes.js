import { Router } from "express";
import { 
    getSubscriptionPlans, 
    getSubscriptionPlanById, 
    createSubscriptionPlan, 
    updateSubscriptionPlan, 
    deleteSubscriptionPlan 
} from "../controllers/subscriptionPlanController.js";
import { authenticate, isAdmin } from "../middleware/auth.js";

const router = Router();

// Publicly available (optional, maybe for pricing page)
router.get("/", getSubscriptionPlans);
router.get("/:id", getSubscriptionPlanById);

// Admin only routes
router.post("/", authenticate, isAdmin, createSubscriptionPlan);
router.put("/:id", authenticate, isAdmin, updateSubscriptionPlan);
router.delete("/:id", authenticate, isAdmin, deleteSubscriptionPlan);

export default router;
