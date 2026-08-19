import React from "react";
import {
  Power,
  RefreshCw,
  CheckCircle2,
  Users,
  Banknote,
} from "lucide-react";

export default function StatsCards({ stats }) {
  const activeCount = stats?.active ?? 12;
  const inProgressCount = stats?.inProgress ?? 5;
  const completedCount = stats?.completed ?? 84;
  const totalApplicantsCount = stats?.totalApplicants ?? 23;
  const totalEarningsCount = stats?.totalEarnings ?? 2340;

  return (
    <div className="stats-cards-grid">
      {/* Active */}
      <div className="task-stat-card">
        <div className="task-stat-icon-wrapper active">
          <Power size={22} strokeWidth={2.5} className="task-stat-icon" />
        </div>

        <div className="task-stat-content">
          <span className="task-stat-label">Active</span>
          <h3 className="task-stat-value">{activeCount}</h3>
          <span className="task-stat-trend active">+2 this week</span>
        </div>
      </div>

      {/* In Progress */}
      <div className="task-stat-card">
        <div className="task-stat-icon-wrapper in-progress">
          <RefreshCw size={22} strokeWidth={2.5} className="task-stat-icon" />
        </div>

        <div className="task-stat-content">
          <span className="task-stat-label">In Progress</span>
          <h3 className="task-stat-value">{inProgressCount}</h3>
          <span className="task-stat-trend in-progress">+1 this week</span>
        </div>
      </div>

      {/* Completed */}
      <div className="task-stat-card">
        <div className="task-stat-icon-wrapper completed">
          <CheckCircle2 size={22} strokeWidth={2.5} className="task-stat-icon" />
        </div>

        <div className="task-stat-content">
          <span className="task-stat-label">Completed</span>
          <h3 className="task-stat-value">{completedCount}</h3>
          <span className="task-stat-trend completed">+8 this week</span>
        </div>
      </div>

      {/* Total Applicants */}
      <div className="task-stat-card">
        <div className="task-stat-icon-wrapper applicants">
          <Users size={22} strokeWidth={2.5} className="task-stat-icon" />
        </div>

        <div className="task-stat-content">
          <span className="task-stat-label">Total Applicants</span>
          <h3 className="task-stat-value">{totalApplicantsCount}</h3>
          <span className="task-stat-trend applicants">+15 this week</span>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="task-stat-card">
        <div className="task-stat-icon-wrapper earnings">
          <Banknote size={22} strokeWidth={2.5} className="task-stat-icon" />
        </div>

        <div className="task-stat-content">
          <span className="task-stat-label">Total Earnings</span>
          <h3 className="task-stat-value">
            ₹{Number(totalEarningsCount).toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
}