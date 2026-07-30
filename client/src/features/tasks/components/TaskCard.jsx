import React from "react";
import { Heart } from "lucide-react";
import TaskMenu from "./TaskMenu";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
];

export default function TaskCard({
  task,
  onViewApplicants,
  onViewDetails,
  onDuplicate,
  onBookmark,
  onDelete,
}) {
  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "status-pill active";
      case "In Progress":
        return "status-pill in-progress";
      case "Scheduled":
        return "status-pill scheduled";
      case "Completed":
        return "status-pill completed";
      default:
        return "status-pill active";
    }
  };

  const formattedBudget = typeof task.budget === "number"
    ? `₹${task.budget.toLocaleString()}`
    : task.budget?.startsWith("₹") ? task.budget : `₹${task.budget || 500}`;

  return (
    <div className="task-card-item">
      {/* Image Header with Status Overlay & Heart Icon */}
      <div className="card-image-header">
        <img
          src={task.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80"}
          alt={task.title}
          className="task-cover-img"
        />
        <span className={getStatusClass(task.status)}>{task.status}</span>
        <button
          type="button"
          className={`card-heart-btn ${task.isBookmarked ? "bookmarked" : ""}`}
          onClick={() => onBookmark(task.id)}
          aria-label="Bookmark"
        >
          <Heart size={16} fill={task.isBookmarked ? "#ef4444" : "none"} color={task.isBookmarked ? "#ef4444" : "#6b7280"} />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="card-body-content">
        {/* Title and Price */}
        <div className="card-title-price-row">
          <h3 className="task-card-title">{task.title}</h3>
          <span className="task-card-price">{formattedBudget}</span>
        </div>

        {/* Category Pill and Metadata Row */}
        <div className="card-meta-row">
          <div className="category-pill">{task.category || "General"}</div>
          <div className="meta-info-right">
            <span className="meta-item-text">{task.date}</span>
            <span className="meta-item-text">{task.time}</span>
            <span className="meta-item-text">{task.location}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="task-card-description">{task.description}</p>

        {/* Card Footer: Applicants & Actions */}
        <div className="card-footer-row">
          <div className="applicants-group">
            <div className="avatar-stack">
              {defaultAvatars.slice(0, 3).map((img, i) => (
                <img key={i} src={img} alt="Applicant" className="stack-avatar" />
              ))}
              <span className="stack-more">+{task.applicants || 4}</span>
            </div>
            <span className="applicants-count-label">+{task.applicants || 5} Applicants</span>
          </div>

          <div className="card-actions-right">
            {task.status === "Completed" ? (
              <button
                type="button"
                className="action-pill-btn"
                onClick={() => onViewDetails(task)}
              >
                View Details
              </button>
            ) : (
              <button
                type="button"
                className="action-pill-btn"
                onClick={() => onViewApplicants(task)}
              >
                View Applicants
              </button>
            )}

            <TaskMenu
              task={task}
              onViewApplicants={onViewApplicants}
              onViewDetails={onViewDetails}
              onDuplicate={onDuplicate}
              onBookmark={onBookmark}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}