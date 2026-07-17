import TopNavbar from "./TopNavbar";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import UpcomingTasks from "./UpcomingTasks";
import RecentActivity from "./RecentActivity";
import RecommendedTasks from "./RecommendedTasks";

import { returningUserData } from "../data/dashboardData";
import "../styles/Dashboard.css";

export default function ReturningDashboard() {
  return (
    <div className="dashboard-container">
      <TopNavbar />

      <div className="dashboard-top">
        <div className="welcome-section">
          <h1>Welcome, {returningUserData.userName}! 👋</h1>
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

      <div className="stats-grid">
        {returningUserData.stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      <QuickActions />

      <div className="dashboard-two-column">
        <UpcomingTasks />
        <RecentActivity />
      </div>

      <RecommendedTasks />
    </div>
  );
}