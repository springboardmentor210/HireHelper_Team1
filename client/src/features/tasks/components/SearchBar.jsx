import React, { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import NotificationsDropdown from "../../notifications/components/NotificationsDropdown";
import "../../../components/layout/SearchBar.css";

export default function SearchBar({ value, onChange, onNotificationClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const { unreadCount } = useNotifications() || { unreadCount: 0 };

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = (e) => {
    e.stopPropagation();
    if (onNotificationClick && typeof onNotificationClick === "function" && onNotificationClick.toString().includes("navigate")) {
      // If parent passed explicit navigation override, still support dropdown toggle
      setIsOpen((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="search-notification-bar" ref={containerRef} style={{ position: "relative" }}>
      <div className="search-input-wrapper">
        <Search size={15} className="search-icon" />
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
        onClick={handleBellClick}
        aria-label="Notifications"
      >
        <Bell size={18} className="bell-icon" />
        {unreadCount > 0 && (
          <span className="notification-badge-dot">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <NotificationsDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}