import Sidebar from "../../../components/layout/Sidebar";
import TopNavbar from "../components/TopNavbar";

import "../../../styles/Dashboard.css";

import StatCard from "../components/StatCard";
import QuickActions from "../components/QuickActions";
import UpcomingTasks from "../components/UpcomingTasks";
import RecentActivity from "../components/RecentActivity";
import RecommendedTasks from "../components/RecommendedTasks";
import { dashboardData } from "../data/dashboardData";

export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        background: "#f8fafc",
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "35px 40px",
        }}
      >
        {/* Top Navbar */}
        <TopNavbar />

        {/* Welcome */}
        <div style={{ marginTop: "20px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Welcome, {dashboardData.userName} 👋
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            Manage your tasks efficiently.
          </p>
        </div>

        {/* Statistics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginBottom: "40px",
          }}
        >
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

        {/* Quick Actions */}
        <QuickActions />

        {/* Upcoming Tasks & Recent Activity */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <UpcomingTasks />
          <RecentActivity />
        </div>

        {/* Recommended Tasks */}
        <div
          style={{
            marginTop: "30px",
          }}
        >
          <RecommendedTasks />
        </div>
      </main>
    </div>
  );
}