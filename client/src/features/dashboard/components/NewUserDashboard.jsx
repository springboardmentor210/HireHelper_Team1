import TopNavbar from "./TopNavbar";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";

import { newUserData } from "../data/dashboardData";

import "../styles/Dashboard.css";

export default function NewUserDashboard() {
  return (
    <div className="dashboard-container">
      <TopNavbar />

      {/* Welcome */}
      <div className="dashboard-header">
        <h1>Welcome, {newUserData.userName} 👋</h1>
        <p>Let's get started by posting your first task.</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        {newUserData.stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Empty State */}
      <div className="empty-state">
        <div className="empty-icon">📋</div>

        <h2>You don't have any tasks yet</h2>

        <p>
          Post your first task or explore available tasks to get started.
        </p>

        <div className="empty-actions">
          <button className="primary-btn">
            Post a Task
          </button>

          <button className="secondary-btn">
            Explore Feed
          </button>
        </div>
      </div>
    </div>
  );
}