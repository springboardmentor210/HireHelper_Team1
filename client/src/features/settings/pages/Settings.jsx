import React, { useState, useRef } from 'react';
import './Settings.css';

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: 'Jon',
    lastName: 'Doe',
    email: 'test@gmail.com',
    phone: '9837483829',
    profilePicture: null
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size must be under 5MB.');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
        setSuccessMsg('Profile photo updated in preview!');
        setTimeout(() => setSuccessMsg(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfile(prev => ({
      ...prev,
      profilePicture: null
    }));
    setSuccessMsg('Profile photo removed.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Changes saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 1200);
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setPasswordSuccess('Password updated successfully!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordSuccess('');
    }, 1500);
  };

  return (
    <div className="hire-wrapper">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-circle">❤</div>
          <div>
            <h2>Hire-a-Helper</h2>
          </div>
        </div>

        <nav>
          <a href="#">🏠 Feed</a>
          <a href="#">📋 My Tasks</a>
          <a href="#">📦 Requests</a>
          <a href="#">📂 My Requests</a>
          <a href="#">➕ Add Task</a>
          <a href="#" className="active">⚙ Settings</a>
        </nav>
      </aside>

      <main className="main">
        <header className="navbar">
          <div>
            <h1>Settings</h1>
            <span>Manage your account and profile preferences</span>
          </div>
        </header>

        <div className="settings-container">
          {errorMsg && <div className="alert alert-error"><span>{errorMsg}</span></div>}
          {successMsg && <div className="alert alert-success"><span>{successMsg}</span></div>}

          <div className="settings-card">
            {/* Section 1: Profile Picture */}
            <div className="settings-section">
              <h3>Profile Picture</h3>
              <div className="profile-upload-container">
                <div className="avatar-preview-large">
                  {profile.profilePicture ? (
                    <img src={profile.profilePicture} alt="Avatar Preview" />
                  ) : (
                    profile.firstName.charAt(0)
                  )}
                </div>
                <div className="upload-controls">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </button>
                  {profile.profilePicture && (
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  )}
                  <p className="file-hint">JPG, PNG up to 5MB</p>
                </div>
              </div>
            </div>

            <form id="settings-form" onSubmit={handleSaveChanges}>
              {/* Section 2: Personal Information */}
              <div className="settings-section">
                <h3>Personal Information</h3>
                <div className="form-grid">
                  <div className="input-field">
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-wrapper">
                      <input 
                        id="firstName"
                        type="text" 
                        name="firstName" 
                        value={profile.firstName} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-field">
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-wrapper">
                      <input 
                        id="lastName"
                        type="text" 
                        name="lastName" 
                        value={profile.lastName} 
                        onChange={handleInputChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="input-field">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper disabled">
                      <input 
                        id="email"
                        type="email" 
                        value={profile.email} 
                        disabled 
                      />
                    </div>
                  </div>

                  <div className="input-field">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-wrapper">
                      <input 
                        id="phone"
                        type="tel" 
                        name="phone" 
                        value={profile.phone} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Section 3: Account Security */}
            <div className="settings-section border-none">
              <h3>Account Security</h3>
              <div className="security-row">
                <div className="security-info">
                  <div className="security-text">
                    <span className="security-title">Password</span>
                    <span className="security-desc">Last updated 3 months ago</span>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Submit Button Moved Here */}
            <div className="form-submit" style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <button form="settings-form" type="submit" className="btn btn-dark" disabled={saving}>
                {saving ? 'Saving changes...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                ✕
              </button>
            </div>
            
            {passwordError && (
              <div className="alert alert-error">
                <span>{passwordError}</span>
              </div>
            )}
            {passwordSuccess && (
              <div className="alert alert-success">
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="modal-form">
              <div className="input-field">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="input-field">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password (min. 6 chars)"
                  required
                />
              </div>
              <div className="input-field">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
