import express from "express";

import {
  createTask,
  getFeed,
  getMyTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();


router.post("/", protect, upload.single("image"), createTask);

router.get("/feed", protect, getFeed);

router.get("/my-tasks", protect, getMyTasks);

router.get("/:id", protect, getTaskById);

router.patch("/:id", protect, upload.single("image"), updateTask);

router.patch("/:id/status", protect, updateTaskStatus);

router.delete("/:id", protect, deleteTask);

export default router;