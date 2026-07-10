import React from 'react';
import Home from './features/auth/pages/Home';

import VerifyOTP from './features/auth/pages/VerifyOTP';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
    </Routes>
  );
}

export default App;