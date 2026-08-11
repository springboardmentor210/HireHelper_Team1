import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Failed to parse stored user in ProtectedRoute:", err);
  }

  // Guest (no token) -> Redirect to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Registered but email unverified -> Redirect to Verify OTP
  if (user && user.isVerified === false) {
    return <Navigate to="/verify-otp" state={{ email: user.email }} replace />;
  }

  return children;
}
