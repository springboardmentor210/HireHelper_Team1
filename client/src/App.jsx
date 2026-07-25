
import Home from './features/auth/pages/Home';
import Login from './features/auth/pages/Login';
import VerifyOTP from './features/auth/pages/VerifyOTP';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import Settings from './features/settings/pages/Settings';
import ResetPassword from './features/auth/pages/ResetPassword';
import { Routes, Route } from 'react-router-dom';
import Dashboard from "./features/dashboard/pages/Dashboard";
import AddTask from "./features/tasks/pages/AddTask";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/addtasks" element={<AddTask />} />
      <Route path="/reset-password/:token" element={<ResetPassword />}
/>
    </Routes>
  );
}

export default App;