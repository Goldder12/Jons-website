import express from "express";
import { parseListening } from "../controllers/parseListeningController.js";
import { uploadListeningSource } from "../config/parseListeningUpload.js";

const router = express.Router();

router.post("/", uploadListeningSource, parseListening);

export default router;
