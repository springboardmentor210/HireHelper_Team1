import { useEffect, useState } from "react";

import { getProfile } from "../../auth/services/auth.service";
import { getDashboardSummary } from "../services/dashboard.service";

import GuestDashboard from "../components/GuestDashboard";
import NewUserDashboard from "../components/NewUserDashboard";
import ReturningDashboard from "../components/ReturningDashboard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // Get logged-in user
        const profileResponse = await getProfile();

        setUser(profileResponse.data);

        // Get real dashboard statistics
        const summaryResponse = await getDashboardSummary();

        setDashboardData(summaryResponse.data);

        setAuthenticated(true);
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (!authenticated) {
    return <GuestDashboard />;
  }

  if (dashboardData?.isNewUser) {
    return (
      <NewUserDashboard
        user={user}
        stats={dashboardData.stats}
      />
    );
  }

  return (
    <ReturningDashboard
  user={user}
  stats={dashboardData?.stats}
  upcomingTasks={dashboardData?.upcomingTasks || []}
  recentActivity={dashboardData?.recentActivity || []}
  recommendedTasks={dashboardData?.recommendedTasks || []}
/>
  );
}