import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { forgotPassword } from "../services/auth.service";

import "./ForgotPassword.css";

import sideImage from '../../../../image/Group 2.png';
import lockIcon from '../../../../image1/Rectangle 101.png';

export default function ForgotPassword() {
  const navigate = useNavigate();

const [email, setEmail] = useState("");

const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await forgotPassword(email);

    alert(response.message);

    navigate("/login");

  } catch (error) {

    alert(
      error.response?.data?.message ||
      "Failed to send reset link"
    );

  } finally {

    setLoading(false);

  }
};
  return (
    <div className="forgot-password-container">
      <div className="fp-left-panel">
        <img src={sideImage} alt="Services grid" className="fp-side-image" />
      </div>
      <div className="fp-right-panel">
        <div className="fp-card">
          <div className="fp-icon-wrapper">
            <img src={lockIcon} alt="Lock" className="fp-lock-image" />
          </div>
          <h1 className="fp-title">Forgot Password</h1>
          <p className="fp-subtitle">
            Enter your registered email address<br />
            to receive a password reset link
          </p>
          
     <form className="fp-form" onSubmit={handleSubmit}>
            <div className="fp-input-group">
              <label htmlFor="email">Email Address</label>
             <input
               type="email"
               id="email"
               placeholder="Enter your email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               />
            </div>
            
            <button
             type="submit"
             className="fp-submit-btn"
              disabled={loading}
             >
             {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          
          <div className="fp-divider">
            <span>or</span>
          </div>
          
          <div className="fp-back-link">
            <Link to="/login">
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
