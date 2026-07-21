import React from 'react';
import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import AddTasks from './features/tasks/pages/AddTask';
import Feed from './features/feed/pages/Feed';
import MyRequests from './features/requests/pages/MyRequests';
import MyTasks from './features/tasks/pages/MyTasks';
import { Routes, Route } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/add-task" element={<AddTasks />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/my-tasks" element={<MyTasks />} />
      </Routes>
    </TaskProvider>
  );
}

export default App;