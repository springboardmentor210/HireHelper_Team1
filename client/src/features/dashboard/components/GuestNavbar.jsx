import { useNavigate } from "react-router-dom";

import "../styles/GuestNavbar.css";

export default function GuestNavbar() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

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

      {/* Navigation */}
      <nav className="guest-nav-links">
        <button
          type="button"
          onClick={scrollToHowItWorks}
        >
          How It Works
        </button>

        <button
          type="button"
          disabled
          title="Browse Tasks coming soon"
        >
          Browse Tasks
        </button>

        <button
          type="button"
          disabled
          title="Become a Helper coming soon"
        >
          Become a Helper
        </button>

        <button
          type="button"
          disabled
          title="Help page coming soon"
        >
          Help
        </button>
      </nav>

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