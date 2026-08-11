import React from "react";
import { Navigate } from "react-router-dom";

export default function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Failed to parse stored user in PublicOnlyRoute:", err);
  }

  // Already logged in & verified -> redirect to dashboard
  if (token && (!user || user.isVerified !== false)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
