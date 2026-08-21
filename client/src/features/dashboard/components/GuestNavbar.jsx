import { useNavigate } from "react-router-dom";

import "../styles/GuestNavbar.css";

export default function GuestNavbar() {
  const navigate = useNavigate();


  return (
    <header className="guest-navbar">
      {/* Logo */}
      <button
        type="button"
        className="guest-logo"
        onClick={() => navigate("/dashboard")}
        aria-label="HireHelper home"
      >
        <img
          src="/logo.png"
          alt="HireHelper"
        />
      </button>

      {/* Authentication */}
      <div className="guest-nav-buttons">
        <button
          type="button"
          className="guest-login-btn"
          onClick={() => navigate("/login")}
        >
          Sign In
        </button>

        <button
          type="button"
          className="guest-signup-btn"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
}