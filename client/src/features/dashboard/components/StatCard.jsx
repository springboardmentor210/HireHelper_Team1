import React from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  Wallet,
} from "lucide-react";
import "./StatCard.css";

export default function StatCard({ title, value }) {
  const getIcon = () => {
    switch (title) {
      case "Active Tasks":
        return <ClipboardList size={26} className="stat-icon-svg active-tasks" />;

      case "Pending Requests":
        return <Clock size={26} className="stat-icon-svg pending-requests" />;

      case "Completed Tasks":
        return <CheckCircle2 size={26} className="stat-icon-svg completed-tasks" />;

      case "Money Saved":
        return <Wallet size={26} className="stat-icon-svg money-saved" />;

      default:
        return <ClipboardList size={26} className="stat-icon-svg" />;
    }
  };

  return (
    <div className="stat-card">
      <div className="stat-icon">{getIcon()}</div>

      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
}