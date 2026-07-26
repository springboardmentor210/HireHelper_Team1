import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Tasks pages
import MyTasks from "./features/tasks/pages/MyTasks";
import AddTask from "./features/tasks/pages/AddTask";

function App() {
  return (
    <Routes>
      {/* Default route -> redirect to /tasks */}
      <Route path="/" element={<Navigate to="/tasks" replace />} />

      {/* Tasks routes */}
      <Route path="/tasks" element={<MyTasks />} />
      <Route path="/tasks/add" element={<AddTask />} />
      <Route path="/tasks/:taskId" element={<MyTasks />} />
      <Route path="/tasks/:taskId/applicants" element={<MyTasks />} />
      <Route path="/tasks/:taskId/edit" element={<AddTask />} />

      {/* Placeholder routes for other pages */}
      <Route
        path="/notifications"
        element={<div style={{ padding: 40, fontSize: 24 }}>Notifications Page</div>}
      />
      <Route
      path="/requests"
        element={<div style={{ padding: 40, fontSize: 24 }}>Requests Page</div>}
      />
      <Route
        path="/feed"
        element={<div style={{ padding: 40, fontSize: 24 }}>Feed Page</div>}
      />
      <Route
        path="/dashboard"
        element={<div style={{ padding: 40, fontSize: 24 }}>Dashboard Page</div>}
      />
      <Route
        path="/settings"
        element={<div style={{ padding: 40, fontSize: 24 }}>Settings Page</div>}
      />
      <Route
        path="/saved"
        element={<div style={{ padding: 40, fontSize: 24 }}>Saved Page</div>}
      />

      {/* 404 catch-all */}
      <Route
        path="*"
        element={<div style={{ padding: 40, fontSize: 24 }}>404 - Page Not Found</div>}
      />
    </Routes>
  );
}
export default App;