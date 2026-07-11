import bcrypt from "bcrypt";

import User from "../models/User.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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

  // Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password: hashedPassword,
  });

  // Fetch created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -otp -otpExpiry"
  );

  if (!createdUser) {
    return res
      .status(500)
      .json(new ApiError(500, "Failed to create user"));
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      "User registered successfully",
      createdUser
    )
  );
});