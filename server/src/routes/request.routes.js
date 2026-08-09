import express from "express";

import {
  createRequest,
  getIncomingRequests,
  getMyRequests,
  acceptRequest,
  declineRequest,
  cancelRequest,
} from "../controllers/request.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createRequest);

router.get("/incoming", protect, getIncomingRequests);

router.get("/mine", protect, getMyRequests);

router.patch("/:id/accept", protect, acceptRequest);

router.patch("/:id/decline", protect, declineRequest);

router.patch("/:id/cancel", protect, cancelRequest);

export default router;
