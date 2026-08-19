import React from "react";
import { returningUserData } from "../data/dashboardData";
import "./RecommendedTasks.css";

export default function RecommendedTasks({ tasks = [] }) {
  const displayTasks = tasks.length > 0 ? tasks : returningUserData.recommendedTasks;

  const getImage = (task) => {
    if (task.image && !task.image.startsWith("http")) {
      return task.image;
    }
    if (task.title?.toLowerCase().includes("furniture")) return "/furniture.jpg";
    if (task.title?.toLowerCase().includes("ac")) return "/ac.jpg";
    if (task.title?.toLowerCase().includes("kitchen")) return "/kitchen.jpg";
    return "/furniture.jpg";
  };

  const getSchedule = (task) => {
    if (task.schedule) return task.schedule;
    if (task.startDate) {
      const date = new Date(task.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      return `${date} ${task.startTime || ""}${task.endTime ? ` - ${task.endTime}` : ""}`;
    }
    return "Jul 5, 2026 2:00 PM - 6:00 PM";
  };

  return (
    <section className="recommended-tasks-wrapper">
      <h3 className="recommended-section-title">Recommended Tasks</h3>

      <div className="recommended-grid">
        {displayTasks.map((task, index) => (
          <div key={task.id || task._id || index} className="recommended-task-card">
            <img
              src={getImage(task)}
              alt={task.title}
              className="recommended-card-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/furniture.jpg";
              }}
            />

            <div className="recommended-card-info">
              <h4 className="recommended-card-title">{task.title}</h4>
              <p className="recommended-card-loc">{task.location || "Downtown Seattle, WA"}</p>
              <p className="recommended-card-date">{getSchedule(task)}</p>
              <span className="recommended-card-price">{task.price || "₹1,200"}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}