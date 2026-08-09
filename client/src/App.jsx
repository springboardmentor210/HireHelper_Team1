import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

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

function App() {
  return (
    <NotificationProvider>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Task Routes */}
        <Route path="/mytasks" element={<MyTasks />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/tasks/:taskId" element={<MyTasks />} />
        <Route path="/tasks/:taskId/applicants" element={<MyTasks />} />

        {/* Add Task Routes */}
        <Route path="/addtasks" element={<AddTask />} />
        <Route path="/add-task" element={<AddTask />} />
        <Route path="/tasks/add" element={<AddTask />} />

        {/* Authentication */}
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Dashboard & Settings */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />

        {/* Feed */}
        <Route path="/feed" element={<Feed />} />

        {/* Requests */}
        <Route path="/requests" element={<Requests />} />

        {/* My Requests */}
        <Route path="/myrequests" element={<MyRequests />} />
        <Route path="/my-requests" element={<MyRequests />} />

        {/* Other Routes */}
        <Route path="/saved" element={<MyTasks />} />
        <Route path="/notifications" element={<NotificationsPage />} />

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