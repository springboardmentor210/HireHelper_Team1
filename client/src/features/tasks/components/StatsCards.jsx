import React from "react";
import { CheckCircle2, Clock, TrendingUp, Users, IndianRupee } from "lucide-react";

export default function StatsCards({ stats }) {
  const cards = [
    { key: "active", label: "Active", value: stats.active, sub: "+2 this week", icon: <CheckCircle2 size={22} color="#16a34a" />, tone: "green" },
    { key: "inProgress", label: "In Progress", value: stats.inProgress, sub: "Tasks active", icon: <Clock size={22} color="#f59e0b" />, tone: "amber" },
    { key: "completed", label: "Completed", value: stats.completed, sub: "+8 this month", icon: <TrendingUp size={22} color="#3b82f6" />, tone: "blue" },
    { key: "applicants", label: "Total Applicants", value: stats.totalApplicants, sub: "+5 this week", icon: <Users size={22} color="#a855f7" />, tone: "purple" },
    { key: "earnings", label: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString()}`, sub: "+₹450 this month", icon: <IndianRupee size={22} color="#059669" />, tone: "emerald" },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div key={c.key} className={`stat-card tone-${c.tone}`}>
          <div className="stat-icon">{c.icon}</div>
          <div className="stat-body">
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}