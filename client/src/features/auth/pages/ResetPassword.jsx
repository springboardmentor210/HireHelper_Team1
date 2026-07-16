import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './ResetPassword.css';
import sideImage from '../../../../image/Group 2.png';
import lockIcon from '../../../../image1/Rectangle 101.png';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="reset-password-container">
      <div className="rp-left-panel">
        <img src={sideImage} alt="Services grid" className="rp-side-image" />
      </div>
      <div className="rp-right-panel">
        <div className="rp-card">
          <div className="rp-icon-wrapper">
            <img src={lockIcon} alt="Lock" className="rp-lock-image" />
          </div>
          <h1 className="rp-title">Reset Password</h1>
          <p className="rp-subtitle">
            Enter your new password below
          </p>
          
          <form className="rp-form" onSubmit={(e) => e.preventDefault()}>
            <div className="rp-input-group">
              <label htmlFor="new-password">New Password</label>
              <div className="rp-password-input-wrapper">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  id="new-password" 
                  placeholder="Enter new password" 
                  required 
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="rp-eye-btn">
                  {showNewPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
              <small className="rp-help-text">
                Use at least 8 characters with a mix of letters,<br />
                numbers & symbols.
              </small>
            </div>

            <div className="rp-input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <div className="rp-password-input-wrapper">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirm-password" 
                  placeholder="Confirm new password" 
                  required 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="rp-eye-btn">
                  {showConfirmPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="rp-submit-btn">
              Reset Password
            </button>
          </form>
          
          <div className="rp-divider">
            <span>or</span>
          </div>
          
          <div className="rp-back-link">
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
