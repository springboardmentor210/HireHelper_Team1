import React, { useState, useRef } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import Sidebar from "../../../components/layout/Sidebar";
import './Settings.css';
import avatarImg from '../../../assets/settings-image/Ellipse 77.png';
import searchImg from '../../../assets/settings-image/search-interface-symbol (2) 1.png';

export default function Settings() {
  const [profile, setProfile] = useState({
    firstName: 'Jon',
    lastName: 'Doe',
    email: 'test@gmail.com',
    phone: '',
    bio: '',
    profilePicture: null
  });

  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfile(prev => ({ ...prev, profilePicture: null }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="hire-wrapper">
      <Sidebar />

      <main className="main-content">
        <header className="topbar">
          <div className="page-header">
            <h1>Settings</h1>
            <p>Manage your account and profile preferences</p>
          </div>
          <div className="topbar-right">
            <div className="search-bar">
              <img src={searchImg} alt="Search" className="search-icon" />
              <input type="text" placeholder="Search tasks..." />
            </div>
            <div className="notification-bell">
              <Bell fill="#fbbf24" stroke="none" size={24} />
              <span className="notification-dot">1</span>
            </div>
          </div>
        </header>

        <div className="settings-content">
          <div className="card profile-photo-card">
            <div className="avatar-preview">
              <img src={profile.profilePicture || avatarImg} alt="Profile" />
            </div>
            <div className="photo-actions">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <div className="photo-buttons">
                <button type="button" className="btn btn-dark" onClick={() => fileInputRef.current?.click()}>
                  Change Photo
                </button>
                <button type="button" className="btn btn-outline" onClick={handleRemoveImage}>
                  Remove
                </button>
              </div>
              <span className="photo-hint">JPG, PNG upto 5MB</span>
            </div>
          </div>

          <form id="settings-form" onSubmit={handleSaveChanges}>
            <div className="card form-card">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="input-group">
                  <label>First Name</label>
                  <input type="text" name="firstName" value={profile.firstName} onChange={handleInputChange} placeholder="John" />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input type="text" name="lastName" value={profile.lastName} onChange={handleInputChange} placeholder="Smith" />
                </div>
              </div>

              <div className="input-group full-width">
                <label>Email Address</label>
                <input type="email" name="email" value={profile.email} disabled />
              </div>

              <div className="input-group full-width">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} placeholder="+1 (555) 123-4567" />
              </div>

              <div className="input-group full-width">
                <label>Bio (Optional)</label>
                <textarea 
                  name="bio" 
                  value={profile.bio} 
                  onChange={handleInputChange}
                  placeholder="Experienced handyman and problem solver. Available for various tasks including furniture assembly, basic electrical work, and home organization. Professional, reliable, and detail-oriented."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-dark save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

          <div className="card security-card">
            <div className="security-info">
              <h3>Account Security</h3>
              <div className="password-details">
                <span className="label">Password</span>
                <span className="hint">Last updated 3 months ago</span>
              </div>
            </div>
            <button type="button" className="btn btn-outline">Change Password</button>
          </div>
        </div>
      </main>
    </div>
  );
}