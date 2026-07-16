import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './ForgotPassword.css';
import sideImage from '../../../../image/Group 2.png';
import lockIcon from '../../../../image1/Rectangle 101.png';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
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
          
          <form className="fp-form" onSubmit={(e) => e.preventDefault()}>
            <div className="fp-input-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                required 
              />
            </div>
            
            <button type="submit" className="fp-submit-btn">
              Send Reset Link
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
