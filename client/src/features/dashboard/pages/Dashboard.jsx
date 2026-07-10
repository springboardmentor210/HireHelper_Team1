import "./Dashboard.css";
import StatCard from "../components/StatCard";
import { dashboardData } from "../data/dashboardData";
import RecentTaskCard from "../components/RecentTaskCard";
import NotificationCard from "../components/NotificationCard";
import QuickActions from "../components/QuickActions";
import ActivityCard from "../components/ActivityCard";

export default function Dashboard() {
  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {dashboardData.userName} 👋</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <StatCard
          title="Tasks Posted"
          value={dashboardData.stats.tasksPosted}
        />

        <StatCard
          title="Active Requests"
          value={dashboardData.stats.activeRequests}
        />

        <StatCard
          title="Completed Tasks"
          value={dashboardData.stats.completedTasks}
        />

        <StatCard
          title="Pending Requests"
          value={dashboardData.stats.pendingRequests}
        />
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div>
          <div className="section">
            <h2>Recent Tasks</h2>

            {dashboardData.recentTasks.map((task) => (
              <RecentTaskCard key={task.id} task={task} />
            ))}
          </div>

          <div className="section" style={{ marginTop: "25px" }}>
            <h2>Recent Activity</h2>

            {dashboardData.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
              />
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="section">
            <h2>Notifications</h2>

            {dashboardData.notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
              />
            ))}
          </div>

          <div className="section" style={{ marginTop: "25px" }}>
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}