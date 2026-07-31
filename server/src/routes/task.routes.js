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

// NOTE: specific paths ("/feed", "/my-tasks") must be registered before
// the "/:id" route, otherwise Express will try to match them as an id.

router.post("/", protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 5 }]), createTask);

router.get("/feed", protect, getFeed);

router.get("/my-tasks", protect, getMyTasks);

router.get("/:id", protect, getTaskById);

router.patch("/:id", protect, upload.fields([{ name: "image", maxCount: 1 }, { name: "images", maxCount: 5 }]), updateTask);

router.patch("/:id/status", protect, updateTaskStatus);

router.delete("/:id", protect, deleteTask);

export default router;

