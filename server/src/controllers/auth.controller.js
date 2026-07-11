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

// Existing User Found
if (existingUser) {

  // User already verified
  if (existingUser.isVerified) {
    return res
      .status(409)
      .json(
        new ApiError(
          409,
          "User with this email or phone number already exists"
        )
      );
  }

  // User exists but NOT verified

  const otp = generateOTP();

  const otpExpiry = new Date(
    Date.now() + 10 * 60 * 1000
  );

  existingUser.otp = otp;
  existingUser.otpExpiry = otpExpiry;

  await existingUser.save();

  await sendOTPEmail(
    existingUser.email,
    otp
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Account already exists but is not verified. A new OTP has been sent."
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



export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json(new ApiError(400, "Email and OTP are required"));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "User not found"));
  }

  if (user.isVerified) {
    return res
      .status(400)
      .json(new ApiError(400, "User already verified"));
  }

  if (String(user.otp) !== String(otp)) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid OTP"));
  }

  if (user.otpExpiry < new Date()) {
    return res
      .status(400)
      .json(new ApiError(400, "OTP has expired"));
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Email verified successfully"
    )
  );
});

export const resendOTP = asyncHandler(async (req, res) => {

    const { email } = req.body;

    // Check Email
    if (!email) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "Email is required"
                )
            );
    }

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
        return res
            .status(404)
            .json(
                new ApiError(
                    404,
                    "User not found"
                )
            );
    }

    // Already Verified
    if (user.isVerified) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "User is already verified"
                )
            );
    }

    // Generate OTP
    const otp = generateOTP();

    // Expiry
    const otpExpiry = new Date(
        Date.now() + 10 * 60 * 1000
    );

    // Save OTP
    user.otp = otp;

    user.otpExpiry = otpExpiry;

    await user.save();

    // Send Email
    await sendOTPEmail(
        user.email,
        otp
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            "OTP resent successfully."

        )

    );

});