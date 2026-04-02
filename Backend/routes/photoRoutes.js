import { Router } from "express";
import { getPhotos, savePhoto } from "../controllers/photoController.js";
import multer from "multer";

import { authenticate } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/", getPhotos);
router.post("/", authenticate, upload.array("photos"), savePhoto);


export default router;

