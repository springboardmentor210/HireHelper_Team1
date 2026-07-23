import "../styles/GuestNavbar.css";

export default function GuestNavbar() {
  return (
    <header className="guest-navbar">

      <div className="guest-logo">
        <img src="/logo.png" alt="HireHelper" />
      </div>

      <nav className="guest-nav-links">
        <a href="#">How It Works</a>
        <a href="#">Browse Tasks</a>
        <a href="#">Become a Helper</a>
        <a href="#">Help</a>
      </nav>

      <div className="guest-nav-buttons">
        <button className="login-btn">Sign In</button>
        <button className="signup-btn">Sign Up</button>
      </div>

    </header>
  );
}