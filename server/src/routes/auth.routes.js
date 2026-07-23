import express from "express";

import {
  register,
  verifyOTP,
  resendOTP,
  login,
  getProfile,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/verify-otp", verifyOTP);

router.post("/resend-otp", resendOTP);

router.post("/login", login);

router.get("/profile", protect, getProfile);

router.post("/logout", protect, logout);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

export default router;