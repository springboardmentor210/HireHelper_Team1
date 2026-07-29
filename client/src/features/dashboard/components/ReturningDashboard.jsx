import TopNavbar from "./TopNavbar";
import StatCard from "./StatCard";
import QuickActions from "./QuickActions";
import UpcomingTasks from "./UpcomingTasks";
import RecentActivity from "./RecentActivity";
import RecommendedTasks from "./RecommendedTasks";

import "../styles/Dashboard.css";

export default function ReturningDashboard({
  user,
  stats,
  upcomingTasks,
  recentActivity,
  recommendedTasks,
}) {
  return (
    <div className="dashboard-container">
      <TopNavbar user={user} />

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

          <button className="feed-btn">
            Go To Feed
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Tasks Posted"
          value={stats?.totalTasks ?? 0}
        />

        <StatCard
          title="Active Tasks"
          value={stats?.activeTasks ?? 0}
        />

        <StatCard
          title="In Progress"
          value={stats?.inProgressTasks ?? 0}
        />

        <StatCard
          title="Completed Tasks"
          value={stats?.completedTasks ?? 0}
        />
      </div>

      <QuickActions />

      <div className="dashboard-two-column">
        <UpcomingTasks tasks={upcomingTasks || []} />

        <RecentActivity activities={recentActivity || []} />
      </div>

      <RecommendedTasks tasks={recommendedTasks || []} />
    </div>
  );
}