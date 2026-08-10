import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute";

// Feature Pages
import MyTasks from "./features/tasks/pages/MyTasks";
import AddTask from "./features/tasks/pages/AddTask";
import Feed from "./features/feed/pages/Feed";
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import VerifyOTP from "./features/auth/pages/VerifyOTP";
import Register from "./features/auth/pages/Register";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import ResetPassword from "./features/auth/pages/ResetPassword";
import Settings from "./features/settings/pages/Settings";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Requests from "./features/requests/pages/Requests";
import MyRequests from "./features/requests/pages/MyRequests";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import Saved from "./features/saved/pages/Saved";

function App() {
  return (
    <NotificationProvider>
      <Routes>
        {/* Root redirect to Dashboard hub */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Protected Task Routes */}
        <Route
          path="/mytasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/:taskId/applicants"
          element={
            <ProtectedRoute>
              <MyTasks />
            </ProtectedRoute>
          }
        />

        {/* Protected Add Task Routes */}
        <Route
          path="/addtasks"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/add"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route path="/home" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Main Landing & Dashboard Hub (renders GuestDashboard, NewUserDashboard, or ReturningDashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected Settings */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        {/* Feed - Publicly accessible to browse */}
        <Route path="/feed" element={<Feed />} />

        {/* Requests */}
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />

        {/* My Requests */}
        <Route path="/myrequests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
        <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />

        {/* Other Protected Routes */}
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />


        {/* 404 */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </NotificationProvider>
  );
}

export default App;