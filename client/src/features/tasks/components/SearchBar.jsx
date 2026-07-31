import React from "react";
import { Search, Bell } from "lucide-react";

export default function SearchBar({ value, onChange, onNotificationClick }) {
  return (
    <div className="search-notification-bar">
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="header-search-input"
        />
      </div>

      <button
        type="button"
        className="notification-bell-btn"
        onClick={onNotificationClick}
        aria-label="Notifications"
      >
        <Bell size={20} className="bell-icon" />
        <span className="notification-badge-dot">1</span>
      </button>
    </div>
  );
}