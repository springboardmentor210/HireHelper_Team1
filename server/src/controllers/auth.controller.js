import bcrypt from "bcrypt";

import User from "../models/User.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateOTP from "../utils/generateOTP.js";
import generateToken from "../utils/generateToken.js";

import generateResetToken from "../utils/generateResetToken.js";

import {
  sendOTPEmail,
  sendResetPasswordEmail,
} from "../services/email.service.js";

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
  passwordUpdatedAt: new Date(),
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

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Current password, new password, and confirm password are required"
        )
      );
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiError(400, "New passwords do not match"));
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json(new ApiError(400, "New password must be at least 6 characters"));
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "User not found"));
  }

  const isCurrentPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiError(400, "Current password is incorrect"));
  }

  const isSamePassword = await bcrypt.compare(
    newPassword,
    user.password
  );

  if (isSamePassword) {
    return res
      .status(400)
      .json(new ApiError(400, "New password must be different from current password"));
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    SALT_ROUNDS
  );

  user.password = hashedPassword;
  user.passwordUpdatedAt = new Date();

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password changed successfully"
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

export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    // Validate Input
    if (!email || !password) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "Email and password are required"
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
                    "Invalid email or password"
                )
            );
    }

    // Check Email Verification
    if (!user.isVerified) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    "Please verify your email first"
                )
            );
    }

    // Compare Password
    const isPasswordCorrect =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isPasswordCorrect) {
        return res
            .status(401)
            .json(
                new ApiError(
                    401,
                    "Invalid email or password"
                )
            );
    }

    // Generate JWT
    const token = generateToken(user._id);

    // Remove Sensitive Data
    const loggedInUser =
        await User.findById(user._id)
            .select("-password -otp -otpExpiry");

    return res.status(200).json(

        new ApiResponse(

            200,

            "Login successful",

            {
                token,
                user: loggedInUser,
            }

        )

    );

});

export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user.toObject();

  delete user.password;
  delete user.otp;
  delete user.otpExpiry;
  delete user.resetPasswordToken;
  delete user.resetPasswordTokenExpiry;

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile fetched successfully",
      user
    )
  );
});
export const updateProfile = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    bio,
  } = req.body;

  if (!firstName || !firstName.trim()) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "First name is required"
        )
      );
  }

  if (!lastName || !lastName.trim()) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Last name is required"
        )
      );
  }

  if (!email || !email.trim()) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Email is required"
        )
      );
  }

  const normalizedEmail =
    email.trim().toLowerCase();

  const normalizedPhone =
    phone?.trim() || "";

  // Check whether another user already owns this email.
  const existingEmailUser =
    await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

  if (existingEmailUser) {
    return res
      .status(409)
      .json(
        new ApiError(
          409,
          "Email address is already in use"
        )
      );
  }

  // Check phone only when one was supplied.
  if (normalizedPhone) {
    const existingPhoneUser =
      await User.findOne({
        phone: normalizedPhone,
        _id: { $ne: req.user._id },
      });

    if (existingPhoneUser) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "Phone number is already in use"
          )
        );
    }
  }

  const user = await User.findById(
    req.user._id
  );

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

  user.firstName = firstName.trim();
  user.lastName = lastName.trim();
  user.email = normalizedEmail;
  user.phone = normalizedPhone;
  user.bio = bio?.trim() || "";

  if (req.file) {
    user.profilePicture =
      `/uploads/profiles/${req.file.filename}`;
  } else if (
    req.body.removeProfilePicture === "true"
  ) {
    user.profilePicture = "";
  }

  await user.save();

  // Never send sensitive authentication fields
  // back to the frontend.
  const updatedUser = user.toObject();

  delete updatedUser.password;
  delete updatedUser.otp;
  delete updatedUser.otpExpiry;
  delete updatedUser.resetPasswordToken;
  delete updatedUser.resetPasswordTokenExpiry;

  return res.status(200).json(
    new ApiResponse(
      200,
      "Profile updated successfully",
      updatedUser
    )
  );
});
export const logout = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      "Logged out successfully"
    )
  );
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate Email
  if (!email) {
    return res
      .status(400)
      .json(new ApiError(400, "Email is required"));
  }

  // Find User
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json(new ApiError(404, "User not found"));
  }

  // Check if account is verified
  if (!user.isVerified) {
    return res
      .status(400)
      .json(new ApiError(400, "Please verify your email first"));
  }

  // Generate Reset Token
  const resetToken = generateResetToken();

  // Token expires in 15 minutes
  const resetPasswordTokenExpiry = new Date(
    Date.now() + 15 * 60 * 1000
  );

  // Save token
  user.resetPasswordToken = resetToken;
  user.resetPasswordTokenExpiry = resetPasswordTokenExpiry;

  await user.save();

  // Reset Link
  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  // Send Email
  await sendResetPasswordEmail(user.email, resetLink);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Password reset link sent successfully."
    )
  );
});

export const resetPassword = asyncHandler(async (req, res) => {

    const { token } = req.params;

    const { password, confirmPassword } = req.body;

    // Validate Passwords
    if (!password || !confirmPassword) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "Password and Confirm Password are required"
                )
            );
    }

    if (password !== confirmPassword) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "Passwords do not match"
                )
            );
    }

    // Find User
    const user = await User.findOne({
        resetPasswordToken: token,
    });

    if (!user) {
        return res
            .status(404)
            .json(
                new ApiError(
                    404,
                    "Invalid reset link"
                )
            );
    }

    // Check Expiry
    if (user.resetPasswordTokenExpiry < new Date()) {

        user.resetPasswordToken = null;
        user.resetPasswordTokenExpiry = null;

        await user.save();

        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "Reset link has expired"
                )
            );
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(
        password,
        SALT_ROUNDS
    );

    user.password = hashedPassword;

    // Clear Reset Token
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpiry = null;

    await user.save();

    return res.status(200).json(

        new ApiResponse(

            200,

            "Password reset successfully"

        )

    );

});