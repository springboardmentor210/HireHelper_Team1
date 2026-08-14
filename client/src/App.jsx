import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { NotificationProvider } from "./context/NotificationContext";
import { TaskProvider } from "./context/TaskContext";

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
import Chat from "./features/chat/pages/Chat";

function App() {
  return (
    <NotificationProvider>
      <TaskProvider>
        <Routes>

          {/* =====================================================
              ROOT
          ===================================================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          {/* =====================================================
              AUTHENTICATION ROUTES
          ===================================================== */}

          <Route
            path="/home"
            element={<Home />}
          />

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

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOTP />}
          />

          {/* =====================================================
              DASHBOARD
          ===================================================== */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              TASK ROUTES
          ===================================================== */}

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

          {/* =====================================================
              ADD TASK
          ===================================================== */}

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

          {/* =====================================================
              FEED
          ===================================================== */}

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              REQUESTS
          ===================================================== */}

          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <Requests />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              MY REQUESTS
          ===================================================== */}

          <Route
            path="/myrequests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SAVED
          ===================================================== */}

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              NOTIFICATIONS
          ===================================================== */}

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              CHAT
          ===================================================== */}

          <Route
  path="/chat/:conversationId"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

          {/* /messages is an alias for /chat */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              SETTINGS
          ===================================================== */}

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* =====================================================
              404
          ===================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

        </Routes>
      </TaskProvider>
    </NotificationProvider>
  );
}

export default App;