import { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import NotificationsDropdown from "../../notifications/components/NotificationsDropdown";
import "../styles/Requests.css";

const SearchBar = ({
  value,
  onChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);
  const { unreadCount } = useNotifications() || { unreadCount: 0 };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="requests-search-wrapper"
      ref={dropdownRef}
      style={{ position: "relative" }}
    >
      <div className="requests-search-box">
        <Search
          size={18}
          className="search-icon"
        />

        <input
          type="text"
          placeholder="Search tasks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="notification-button"
        onClick={() => setShowNotifications((prev) => !prev)}
        aria-label="Notifications"
      >
        <Bell
          size={20}
          className="bell-icon"
        />

        {unreadCount > 0 && (
          <span className="notification-badge-dot">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <NotificationsDropdown
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;