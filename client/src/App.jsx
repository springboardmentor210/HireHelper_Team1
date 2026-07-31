import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      {/* Root redirect to /mytasks */}
      <Route path="/" element={<Navigate to="/mytasks" replace />} />

      {/* Task Routes */}
      <Route path="/mytasks" element={<MyTasks />} />
      <Route path="/tasks" element={<MyTasks />} />
      <Route path="/tasks/:taskId" element={<MyTasks />} />
      <Route path="/tasks/:taskId/applicants" element={<MyTasks />} />
      
      {/* Add Task Routes */}
      <Route path="/addtasks" element={<AddTask />} />
      <Route path="/add-task" element={<AddTask />} />
      <Route path="/tasks/add" element={<AddTask />} />

      {/* Auth Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* Other Feature Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />

      {/* Feed & Navigation Routes */}
      <Route path="/feed" element={<Feed />} />
      <Route path="/requests" element={<MyTasks />} />
      <Route path="/myrequests" element={<MyTasks />} />
      <Route path="/saved" element={<MyTasks />} />
      <Route path="/notifications" element={<MyTasks />} />

      {/* 404 Catch-all */}
      <Route
        path="*"
        element={<Navigate to="/mytasks" replace />}
      />
    </Routes>
  );
}

export default App;