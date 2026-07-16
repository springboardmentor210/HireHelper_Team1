import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import './ForgotPassword.css';
import sideImage from '../../../../image/Group 2.png';
import lockIcon from '../../../../image1/Rectangle 101.png';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSuccess("Password reset link sent to your email!");
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
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
            {error && <div style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
            {success && <div style={{ color: 'green', fontSize: '14px', textAlign: 'center', marginBottom: '10px' }}>{success}</div>}
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
            
            <button type="submit" className="fp-submit-btn" disabled={loading}>
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
