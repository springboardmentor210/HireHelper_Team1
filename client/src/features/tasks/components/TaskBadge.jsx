import React from "react";

const styles = {
  Active: { bg: "#16a34a", color: "#fff" },
  "In Progress": { bg: "#f59e0b", color: "#fff" },
  Scheduled: { bg: "#6366f1", color: "#fff" },
  Completed: { bg: "#3b82f6", color: "#fff" },
};

export default function TaskBadge({ status }) {
  const s = styles[status] || { bg: "#6b7280", color: "#fff" };
  return (
    <span
      className="task-badge"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {status}
    </span>
  );
}