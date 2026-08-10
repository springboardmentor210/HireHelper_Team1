import { useState, useRef, useEffect } from "react";
import { getProfileImageUrl } from "../../../utils/profileImage";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../../context/NotificationContext";
import NotificationsDropdown from "../../notifications/components/NotificationsDropdown";

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
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const { unreadCount } = useNotifications() || { unreadCount: 0 };

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            type="button"
            className="icon-btn notification-bell-btn"
            aria-label="Notifications"
            onClick={() => setNotifOpen((prev) => !prev)}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge-dot">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <NotificationsDropdown onClose={() => setNotifOpen(false)} />
          )}
        </div>

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
                src={getProfileImageUrl(user.profilePicture)}
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