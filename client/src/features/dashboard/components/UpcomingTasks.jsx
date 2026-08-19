import React from "react";
import { Link } from "react-router-dom";
import { returningUserData } from "../data/dashboardData";
import "./UpcomingTasks.css";

export default function UpcomingTasks({ tasks = [] }) {
  const displayTasks = tasks.length > 0 ? tasks : returningUserData.upcomingTasks;

  const getEmoji = (type, category) => {
    const t = (type || category || "").toLowerCase();
    if (t.includes("clean")) return "🧹";
    if (t.includes("mov")) return "📦";
    if (t.includes("paint")) return "🎨";
    return "🔨";
  };

  return (
    <section className="dashboard-card upcoming-tasks-card">
      <div className="card-header">
        <h2 className="card-title">Upcoming Tasks</h2>
        <Link to="/mytasks" className="view-all-link">
          View all
        </Link>
      </div>

      <div className="upcoming-timeline">
        {displayTasks.map((task, index) => {
          const day = task.day || "Tomorrow";
          const date = task.date || (task.startDate ? new Date(task.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "May 8");
          const time = task.time || task.startTime || "9:00 AM";
          const helper = task.helper || (task.assignedTo ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}` : "Mita Das");

          return (
            <div className="timeline-row" key={task.id || task._id || index}>
              <div className="timeline-date-col">
                <span className="timeline-day">{day}</span>
                <span className="timeline-date">{date}</span>
              </div>

              <div className="timeline-track-col">
                <span className="timeline-dot" />
                {index < displayTasks.length - 1 && <span className="timeline-line" />}
              </div>

              <div className="timeline-icon-col">
                <span className="timeline-icon-box">
                  {getEmoji(task.type, task.category)}
                </span>
              </div>

              <div className="timeline-content-col">
                <h4 className="timeline-task-title">{task.title}</h4>
                <p className="timeline-helper-name">👤 {helper}</p>
              </div>

              <div className="timeline-time-col">
                <span>{time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}