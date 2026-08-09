import express from "express";

import { saveTask, unsaveTask, getSavedTasks } from "../controllers/savedTask.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getSavedTasks);

router.post("/:taskId", protect, saveTask);

router.delete("/:taskId", protect, unsaveTask);

export default router;