import "../styles/Navbar.css";

import {
  FiSearch,
  FiMessageCircle,
  FiBell,
  FiChevronDown,
} from "react-icons/fi";

export default function TopNavbar() {
  return (
    <header className="top-navbar">
      {/* Left */}
      <div className="logo">
  <img
  src="/logo.png"
  alt="HireHelper"
  className="logo-img"
/>
    

</div>

      {/* Right */}
      <div className="navbar-right">

        <div className="search-box">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search..."
          />
        </div>

        <button className="icon-btn">
          <FiMessageCircle />
        </button>

        <button className="icon-btn">
          <FiBell />
        </button>

        <div className="profile-menu">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Profile"
          />

          <FiChevronDown />
        </div>

      </div>
    </header>
  );
}