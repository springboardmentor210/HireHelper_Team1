import React from 'react';
import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import Feed from './features/feed/pages/Feed';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
}

export default App;