
import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import { Routes, Route } from 'react-router-dom';
import Dashboard from "./features/dashboard/pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;