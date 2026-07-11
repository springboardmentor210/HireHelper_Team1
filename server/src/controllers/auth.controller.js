import bcrypt from "bcrypt";

import User from "../models/User.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateOTP from "../utils/generateOTP.js";

import { sendOTPEmail } from "../services/email.service.js";

const SALT_ROUNDS = 10;

export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;

  // Validate required fields
  if (!firstName || !lastName || !email || !phone || !password) {
    return res
      .status(400)
      .json(new ApiError(400, "All fields are required"));
  }

  // Check existing user
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return res
      .status(409)
      .json(
        new ApiError(
          409,
          "User with this email or phone number already exists"
        )
      );
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Generate OTP
  const otp = generateOTP();

  // OTP expires in 10 minutes
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  // Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
    otp,
    otpExpiry,
  });

  // Send OTP Email
  try {
    await sendOTPEmail(user.email, otp);
  } catch (error) {
    // Rollback user creation if email fails
    await User.findByIdAndDelete(user._id);

    return res
      .status(500)
      .json(new ApiError(500, "Failed to send OTP email"));
  }

  // Success Response
  return res.status(201).json(
    new ApiResponse(
      201,
      "Registration successful. OTP sent to your email."
    )
  );
});