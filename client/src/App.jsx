import React from 'react';
import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import Register from './features/auth/pages/Register';
import Settings from './features/settings/pages/Settings';
import ResetPassword from './features/auth/pages/ResetPassword';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;