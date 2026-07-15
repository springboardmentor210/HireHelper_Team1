import "../styles/Dashboard.css";
import { returningUserData } from "../data/dashboardData";

import {
  FaCheckCircle,
  FaWallet,
  FaLeaf,
  FaBell,
} from "react-icons/fa";

export default function RecentActivity() {

  const getIcon = (type) => {
    switch (type) {
      case "accepted":
        return <FaCheckCircle />;

      case "payment":
        return <FaWallet />;

      case "completed":
        return <FaLeaf />;

      case "request":
        return <FaBell />;

      default:
        return <FaCheckCircle />;
    }
  };

  return (
    <section className="dashboard-card">

      <div className="card-header">
        <h2 className="section-title">Recent Activity</h2>
        <span>View all</span>
      </div>

      <div className="activity-list">

        {returningUserData.recentActivity.map((activity) => (

          <div key={activity.id} className="activity-item">

            <div className="activity-icon">
              {getIcon(activity.type)}
            </div>

            <div className="activity-content">
              <p>{activity.text}</p>
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}