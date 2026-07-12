import React from 'react';
import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import AddTasks from './features/tasks/pages/AddTask';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/add-task" element={<AddTasks />} />
    </Routes>
  );
}

export default App;