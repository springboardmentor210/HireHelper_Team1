import { useState, useRef, useEffect } from "react";
import { Search, Bell } from "lucide-react";
import NotificationsDropdown from "./NotificationsDropdown";
import "../styles/Requests.css";

const SearchBar = ({
  value,
  onChange,
  notifications = [],
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      className="requests-search-wrapper"
      ref={dropdownRef}
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
          onChange={(e) =>
            onChange(e.target.value)
          }
        />
      </div>

      <button
        type="button"
        className="notification-button"
        onClick={() =>
          setShowNotifications((prev) => !prev)
        }
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
          notifications={notifications}
          onClose={() =>
            setShowNotifications(false)
          }
        />
      )}
    </div>
  );
};

export default SearchBar;