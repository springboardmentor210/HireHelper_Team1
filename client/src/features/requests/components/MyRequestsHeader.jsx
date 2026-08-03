import React, { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";

export default function MyRequestsHeader({
  search,
  onSearchChange,
  notifications = [],
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="my-requests-header">
      <div className="header-titles">
        <h1 className="my-requests-title">My Requests</h1>
        <p className="main-page-subtitle">Track the help requests you have sent</p>
      </div>

      <div className="search-notification-bar" ref={dropdownRef}>
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="header-search-input"
          />
        </div>

        <button
          type="button"
          className="notification-bell-btn"
          onClick={() => setShowNotifications((prev) => !prev)}
          aria-label="Notifications"
        >
          <Bell size={28} className="bell-icon" />
          {unreadCount > 0 && (
            <span className="notification-badge-dot">{unreadCount}</span>
          )}
        </button>

        {showNotifications && (
          <NotificationsDropdown
            notifications={notifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    </header>
  );
}
