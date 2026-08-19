import { useNavigate } from "react-router-dom";

import TopNavbar from "./TopNavbar";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";

import "../styles/Dashboard.css";

export default function NewUserDashboard({ user, stats }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <TopNavbar user={user} />

      {/* Welcome + Feed Card */}
      <div className="dashboard-top">
        <div className="welcome-section">
          <h1>Welcome, {user?.firstName || "User"}! 👋</h1>
          <p>Glad to have you here.</p>
        </div>

        <div className="feed-card">
          <div>
            <h3>Find tasks or post one</h3>
            <p>Dashboard announcement</p>
          </div>

          <button
            className="feed-btn"
            onClick={() => navigate("/feed")}
          >
            Go To Feed
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Active Tasks"
          value={stats?.activeTasks ?? 0}
        />

        <StatCard
          title="Pending Requests"
          value={stats?.pendingRequests ?? 0}
        />

        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks ?? 0}
        />

        <StatCard
          title="Money Saved"
          value={stats?.moneySaved ? `₹${stats.moneySaved.toLocaleString()}` : "₹0"}
        />
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

        <button
          className="feed-btn empty-btn"
          onClick={() => navigate("/feed")}
        >
          Explore Feed
        </button>

        <div className="empty-divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <button
          className="text-btn"
          onClick={() => navigate("/add-task")}
        >
          Post a Task Instead
        </button>
      </div>
    </div>
  );
}