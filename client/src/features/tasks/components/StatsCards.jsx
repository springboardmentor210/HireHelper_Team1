import React from "react";
import { Power, RefreshCw, ShieldCheck, Users, Banknote } from "lucide-react";

export default function StatsCards({ stats }) {
  const activeCount = stats?.active ?? 12;
  const inProgressCount = stats?.inProgress ?? 5;
  const completedCount = stats?.completed ?? 84;
  const totalApplicantsCount = stats?.totalApplicants ?? 23;
  const totalEarningsCount = stats?.totalEarnings ?? 2340;

  return (
    <div className="stats-cards-grid">
      {/* Active Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper active">
          <Power size={20} className="stat-icon" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Active</span>
          <h3 className="stat-value">{activeCount}</h3>
          <span className="stat-trend active">+2 this week</span>
        </div>
      </div>

      {/* In Progress Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper in-progress">
          <RefreshCw size={20} className="stat-icon" />
        </div>
        <div className="stat-content">
          <span className="stat-label">In Progress</span>
          <h3 className="stat-value">{inProgressCount}</h3>
          <span className="stat-trend in-progress">+1 this week</span>
        </div>
      </div>

      {/* Completed Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper completed">
          <ShieldCheck size={20} className="stat-icon" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed</span>
          <h3 className="stat-value">{completedCount}</h3>
          <span className="stat-trend completed">+8 this week</span>
        </div>
      </div>

      {/* Total Applicants Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper applicants">
          <Users size={20} className="stat-icon" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Applicants</span>
          <h3 className="stat-value">{totalApplicantsCount}</h3>
          <span className="stat-trend applicants">+15 this week</span>
        </div>
      </div>

      {/* Total Earnings Card */}
      <div className="stat-card">
        <div className="stat-icon-wrapper earnings">
          <Banknote size={20} className="stat-icon" />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Earnings</span>
          <h3 className="stat-value">₹{totalEarningsCount.toLocaleString()}</h3>
        </div>
      </div>
    </div>
  );
}