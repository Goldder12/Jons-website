import express from "express";
import { createVideo, deleteVideo, getVideos } from "../controllers/videoController.js";
import { uploadVideoFile } from "../config/videoUpload.js";

const router = express.Router();

router.get("/", getVideos);
router.post("/", uploadVideoFile, createVideo);
router.delete("/:id", deleteVideo);

export default router;
