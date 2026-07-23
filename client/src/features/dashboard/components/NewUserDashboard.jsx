import TopNavbar from "./TopNavbar";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";

import { newUserData } from "../data/dashboardData";

import "../styles/Dashboard.css";

export default function NewUserDashboard() {
  return (
    <div className="dashboard-container">

      <TopNavbar />

      {/* Welcome + Feed Card */}
      <div className="dashboard-top">

        <div className="welcome-section">
          <h1>Welcome, {newUserData.userName}! 👋</h1>
          <p>Glad to have you here.</p>
        </div>

        <div className="feed-card">
          <div>
            <h3>Find tasks or post one</h3>
            <p>Dashboard announcement</p>
          </div>

          <button className="feed-btn">
            Go To Feed
          </button>
        </div>

      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {newUserData.stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Empty State */}
      <div className="empty-state">

        <img
          src="/empty-task.png"
          alt="No Tasks"
          className="empty-image"
        />

        <h2>You don't have any tasks yet</h2>

        <p>
          Post a task or browse the feed to get started.
        </p>

        <button className="feed-btn empty-btn">
          Explore Feed
        </button>

        <div className="empty-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button className="text-btn">
          Post a Task Instead
        </button>

      </div>

    </div>
  );
}