import express from "express";
import { uploadVideo, getRoomDetails } from "../controllers/video.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/upload/:roomId", upload.single("video"), uploadVideo);
router.get("/:roomId", getRoomDetails);

export default router;
