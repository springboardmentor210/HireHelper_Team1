import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import './ResetPassword.css';
import sideImage from '../../../../image/Group 2.png';
import lockIcon from '../../../../image1/Rectangle 101.png';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password,
        confirmPassword
      });
      setSuccess("Password reset successfully! Redirecting...");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

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
          
          <form className="rp-form" onSubmit={handleSubmit}>
            {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</div>}
            {success && <div style={{ color: 'green', fontSize: '14px', textAlign: 'center' }}>{success}</div>}
            <div className="rp-input-group">
              <label htmlFor="new-password">New Password</label>
              <div className="rp-password-input-wrapper">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  id="new-password" 
                  placeholder="Enter new password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="rp-eye-btn">
                  {showConfirmPassword ? <EyeOff size={18} color="#999" /> : <Eye size={18} color="#999" />}
                </button>
              </div>
            </div>
            
            <button type="submit" className="rp-submit-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
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
