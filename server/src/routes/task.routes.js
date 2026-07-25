import express from "express";

import {
  createTask,
  getDashboardSummary,
  getPublicStats,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/*
 * Public routes
 * No JWT required
 */
router.get(
  "/public-stats",
  getPublicStats
);

/*
 * Protected routes
 */
router.post(
  "/",
  protect,
  upload.single("image"),
  createTask
);

router.get(
  "/dashboard-summary",
  protect,
  getDashboardSummary
);

export default router;