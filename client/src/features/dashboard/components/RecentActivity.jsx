import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Wallet,
  UserPlus,
} from "lucide-react";
import { returningUserData } from "../data/dashboardData";
import "./RecentActivity.css";

export default function RecentActivity({ activities = [] }) {
  const displayActivities = activities.length > 0 ? activities : returningUserData.recentActivity;

  const renderIcon = (type) => {
    switch (type) {
      case "payment":
        return <Wallet size={20} className="activity-icon-svg payment" />;
      case "request":
        return <UserPlus size={20} className="activity-icon-svg request" />;
      case "accepted":
      case "completed":
      default:
        return <CheckCircle2 size={20} className="activity-icon-svg success" />;
    }
  };

  const getTimeText = (activity) => {
    if (activity.time) return activity.time;
    if (activity.text?.includes("Mita")) return "20 minutes ago";
    if (activity.text?.includes("Payment")) return "2 hours ago";
    if (activity.text?.includes("Garden")) return "Yesterday";
    if (activity.text?.includes("painting")) return "Yesterday";
    return "2 hours ago";
  };

  return (
    <section className="dashboard-card recent-activity-card">
      <div className="card-header">
        <h2 className="card-title">Recent Activity</h2>
        <Link to="/notifications" className="view-all-link">
          View all
        </Link>
      </div>

      <div className="recent-activity-list">
        {displayActivities.map((activity, index) => (
          <div key={activity.id || index} className="recent-activity-item">
            <div className="recent-activity-icon-box">
              {renderIcon(activity.type)}
            </div>

            <div className="recent-activity-content">
              <p className="recent-activity-text">
                {activity.text || activity.message}
              </p>
              <span className="recent-activity-time">
                {getTimeText(activity)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}