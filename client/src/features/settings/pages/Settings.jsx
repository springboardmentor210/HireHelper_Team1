import React, { useState, useRef } from 'react';
<<<<<<< HEAD
import { Bell, ChevronDown } from 'lucide-react';
=======
import Sidebar from "../../../components/layout/Sidebar"; 
>>>>>>> origin/develop
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
<<<<<<< HEAD
      <aside className="sidebar">
        <div className="logo">
          <h2>Hire-a-Helper</h2>
        </div>
        <nav>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            Feed
          </a>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            My Tasks
          </a>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Requests
          </a>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            My Requests
          </a>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path></svg>
            Saved
          </a>
          <a href="#">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Task
          </a>
          <a href="#" className="active">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Settings
          </a>
        </nav>
        
        <div className="sidebar-profile">
          <img src={profile.profilePicture || avatarImg} alt="Avatar" className="sidebar-avatar" />
          <div className="sidebar-profile-info">
            <span className="sidebar-name">Jon Doe</span>
            <span className="sidebar-email">test@gmail.com</span>
          </div>
          <ChevronDown size={16} color="#666" className="sidebar-chevron" />
        </div>
      </aside>
=======
      <Sidebar />
>>>>>>> origin/develop

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

<<<<<<< HEAD
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
=======
            {/* Submit Button */}
            <div className="form-submit" style={{ marginTop: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
              <button form="settings-form" type="submit" className="btn btn-dark" disabled={saving}>
                {saving ? 'Saving changes...' : 'Save Changes'}
>>>>>>> origin/develop
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