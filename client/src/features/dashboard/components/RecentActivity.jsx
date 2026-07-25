import "../styles/Dashboard.css";

import {
  FaCheckCircle,
  FaClipboardList,
} from "react-icons/fa";

export default function RecentActivity({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "task_created":
        return <FaClipboardList />;

      default:
        return <FaCheckCircle />;
    }
  };

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <section className="dashboard-card">
      <div className="card-header">
        <h2 className="section-title">Recent Activity</h2>
        <span>View all</span>
      </div>

      <div className="activity-list">
        {activities.length === 0 ? (
          <p className="empty-dashboard-message">
            No recent activity
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {getIcon(activity.type)}
              </div>

              <div className="activity-content">
                <p>{activity.message}</p>
                <small>{formatTime(activity.createdAt)}</small>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}