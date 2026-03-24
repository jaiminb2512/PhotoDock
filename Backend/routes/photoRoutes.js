import { Router } from "express";
import { getPhotos, createPhoto } from "../controllers/photoController.js";

const router = Router();

router.get("/", getPhotos);
router.post("/", createPhoto);

export default router;
