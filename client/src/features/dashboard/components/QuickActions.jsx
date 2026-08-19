import React from "react";
import { useNavigate } from "react-router-dom";
import "./QuickActions.css";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Post a Task",
      icon: "📝",
      path: "/addtasks",
    },
    {
      title: "Browse Feed",
      icon: "🔍",
      path: "/feed",
    },
    {
      title: "Become a Helper",
      icon: "🧑‍🔧",
      path: "/feed",
    },
    {
      title: "My Tasks",
      icon: "📋",
      path: "/mytasks",
    },
  ];

  return (
    <section className="quick-actions">
      <h2 className="quick-actions-title">Quick Actions</h2>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="quick-action-card"
            onClick={() => navigate(action.path)}
          >
            <span className="quick-action-icon">{action.icon}</span>
            <span className="quick-action-title">{action.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}