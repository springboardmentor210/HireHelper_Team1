import { Search, Bell } from "lucide-react";
import "../styles/SearchBar.css";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="requests-search-wrapper">
      <div className="requests-search-box">
        <Search
          size={18}
          className="search-icon"
        />

        <input
          id="request-search"
          name="requestSearch"
          type="text"
          placeholder="Search tasks..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      <button
        type="button"
        className="notification-button"
        aria-label="Notifications"
      >
        <Bell size={20} />

        <span className="notification-dot"></span>
      </button>
    </div>
  );
};

export default SearchBar;