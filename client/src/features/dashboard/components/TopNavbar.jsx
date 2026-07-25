import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/Navbar.css";

import {
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiChevronDown,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

export default function TopNavbar({ user }) {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/dashboard");
  window.location.reload();
};

  return (
    <header className="top-navbar">
      {/* Left - Logo */}
      <div className="logo">
        <img
          src="/logo.png"
          alt="HireHelper"
          className="logo-img"
        />
      </div>

      {/* Right - Search and Actions */}
      <div className="navbar-right">
        <div className="search-box">
          <FiSearch className="search-icon" />

          <input
            id="dashboard-search"
            name="dashboardSearch"
            type="text"
            placeholder="Search..."
            aria-label="Search"
          />
        </div>

        {/* Messages */}
        <button
          type="button"
          className="icon-btn"
          aria-label="Messages"
        >
          <FiMessageCircle />
        </button>

        {/* Notifications */}
        <button
          type="button"
          className="icon-btn"
          aria-label="Notifications"
        >
          <FiBell />
        </button>

        {/* Profile */}
        <div className="profile-wrapper">
          <button
            type="button"
            className="profile-menu"
            onClick={() =>
              setProfileOpen((previous) => !previous)
            }
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName || "User"} profile`}
              />
            ) : (
              <div className="profile-initial">
                {user?.firstName
                  ?.charAt(0)
                  ?.toUpperCase() || "U"}
              </div>
            )}

            <FiChevronDown />
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <strong>
                  {user?.firstName || "User"}{" "}
                  {user?.lastName || ""}
                </strong>

                <span>{user?.email || ""}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/settings");
                }}
              >
                <FiSettings />
                <span>Settings</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}