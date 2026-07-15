import { guestData } from "../data/dashboardData";
import "../styles/Dashboard.css";

export default function GuestDashboard() {
  return (
    <div className="guest-dashboard">

      {/* Hero Section */}
      <section className="guest-hero">
        <h1>{guestData.hero.title}</h1>

        <p>{guestData.hero.subtitle}</p>

        <div className="guest-buttons">
          <button className="primary-btn">
            Find Tasks
          </button>

          <button className="secondary-btn">
            Become a Helper
          </button>
        </div>
      </section>

      {/* Statistics */}
      <section className="guest-stats">

        <div className="guest-stat-card">
          <h2>{guestData.stats.customers}</h2>
          <p>Happy Customers</p>
        </div>

        <div className="guest-stat-card">
          <h2>{guestData.stats.completed}</h2>
          <p>Tasks Completed</p>
        </div>

        <div className="guest-stat-card">
          <h2>{guestData.stats.rating}</h2>
          <p>Average Rating</p>
        </div>

        <div className="guest-stat-card">
          <h2>{guestData.stats.helpers}</h2>
          <p>Trusted Helpers</p>
        </div>

      </section>

      {/* How It Works */}
      <section className="how-it-works">

        <h2>How It Works</h2>

        <div className="steps-grid">

          <div className="step-card">
            <div className="step-icon">📝</div>
            <h3>Post a Task</h3>
            <p>Create your task in a few simple steps.</p>
          </div>

          <div className="step-card">
            <div className="step-icon">🤝</div>
            <h3>Choose a Helper</h3>
            <p>Select from trusted helpers nearby.</p>
          </div>

          <div className="step-card">
            <div className="step-icon">✅</div>
            <h3>Get It Done</h3>
            <p>Track progress and complete payment securely.</p>
          </div>

        </div>

      </section>

    </div>
  );
}