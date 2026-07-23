import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { loginUser } from "../services/auth.service";

import "./Login.css";


const Login = () => {
   const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await loginUser({
      email,
      password,
    });

    // Save JWT
    localStorage.setItem("token", response.data.token);

    // Save User
    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    alert(response.message);

    navigate("/");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Login failed"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="image-grid">
          <div className="grid-item img-1"></div>
          <div className="grid-item img-2"></div>
          <div className="grid-item img-3"></div>
          <div className="grid-item img-4"></div>
          <div className="grid-item img-5"></div>
          <div className="grid-item img-6"></div>
          <div className="grid-item img-7"></div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <div className="login-header">
            <div className="profile-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="22" y1="11" x2="16" y2="11"></line>
              </svg>
            </div>
            <h2>Welcome</h2>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            
            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <button 
                  type="button" 
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-actions">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            <Link to="/forgot-password" className="forgot-link"> Forgot Password?</Link>
            </div>

           <button type="submit" className="login-btn" disabled={loading}> {loading ? "Signing In..." : "Sign In"} </button>
          </form>
          
          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Login;