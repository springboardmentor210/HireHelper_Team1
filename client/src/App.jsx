import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import ResetPassword from './features/auth/pages/ResetPassword';
import Settings from './features/settings/pages/Settings';
import Dashboard from './features/dashboard/pages/Dashboard';
import Feed from './features/feed/pages/Feed';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/feed" element={<Feed />} />
    </Routes>
  );
}

export default App;