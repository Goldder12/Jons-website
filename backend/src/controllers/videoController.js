import fs from "fs";
import path from "path";
import { videos } from "../data/db.js";

function removeUploadedVideo(filePath) {
  if (!filePath || !filePath.startsWith("uploads/videos/")) {
    return;
  }

  const absolutePath = path.resolve(filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

export function getVideos(req, res) {
  return res.status(200).json({
    message: "Videos fetched successfully!",
    data: videos,
  });
}

export function createVideo(req, res) {
  const title = req.body.title?.trim();
  const author = req.body.author?.trim();
  const description = req.body.description?.trim();
  const type = req.body.type?.trim();
  const linkUrl = req.body.url?.trim();
  const taskIdValue = req.body.taskId?.trim();
  const videoFile = req.file;
  const taskId = taskIdValue ? Number(taskIdValue) : null;

  const isValidType = type === "upload" || type === "link";
  const hasValidTaskId = taskIdValue ? !Number.isNaN(taskId) : true;
  const hasValidSource = type === "upload" ? Boolean(videoFile) : Boolean(linkUrl);

  if (!title || !author || !description || !isValidType || !hasValidTaskId || !hasValidSource) {
    if (videoFile) {
      removeUploadedVideo(`uploads/videos/${videoFile.filename}`);
    }

    return res.status(400).json({
      message: "Title, author, description, type, and a valid video source are required!",
    });
  }

  const newVideo = {
    id: videos.length ? Math.max(...videos.map((video) => Number(video.id) || 0)) + 1 : 1,
    title,
    author,
    description,
    type,
    url: type === "upload" ? `uploads/videos/${videoFile.filename}` : linkUrl,
    taskId,
  };

  videos.push(newVideo);

  return res.status(201).json({
    message: "Video created successfully!",
    data: newVideo,
  });
}

export function deleteVideo(req, res) {
  const id = Number(req.params.id);
  const videoIndex = videos.findIndex((video) => Number(video.id) === id);

  if (videoIndex === -1) {
    return res.status(404).json({ message: "Video not found!" });
  }

  const [video] = videos.splice(videoIndex, 1);
  if (video.type === "upload") {
    removeUploadedVideo(video.url);
  }

  return res.status(200).json({ message: "Video deleted successfully!" });
}
