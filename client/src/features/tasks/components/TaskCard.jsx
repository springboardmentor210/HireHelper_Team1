import React from "react";
import { Heart } from "lucide-react";
import TaskMenu from "./TaskMenu";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
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
      case "active":
        return "status-pill active";
      case "In Progress":
      case "in_progress":
        return "status-pill in-progress";
      case "Scheduled":
      case "scheduled":
        return "status-pill scheduled";
      case "Completed":
      case "completed":
        return "status-pill completed";
      default:
        return "status-pill active";
    }
  };

  const formattedPrice =
    typeof task.price === "number"
      ? `₹${task.price.toLocaleString()}`
      : typeof task.budget === "number"
      ? `₹${task.budget.toLocaleString()}`
      : task.price?.startsWith?.("₹")
      ? task.price
      : `₹${task.price ?? task.budget ?? 500}`;

  const taskImage =
    (Array.isArray(task.images) && task.images.length > 0 ? task.images[0] : task.image) ||
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80";

  const displayDate = task.startDate || task.date;
  const displayTime = task.startTime || task.time;

  const stackBadge =
    task.title === "Furniture Assembly"
      ? "+3"
      : task.title === "Garden Cleanup"
      ? "+7"
      : "+4";

  const applicantCountLabel = `+${task.applicants || 5} Applicants`;

  return (
    <div className="task-card-item">
      {/* Image Header with Status Overlay & Heart Icon */}
      <div className="card-image-header">
        <img
          src={taskImage}
          alt={task.title}
          className="task-cover-img"
        />
        <span className={getStatusClass(task.status)}>{task.status}</span>
        <button
          type="button"
          className={`card-heart-btn ${task.isBookmarked ? "bookmarked" : ""}`}
          onClick={() => onBookmark(task.id || task._id)}
          aria-label="Bookmark"
        >
          <Heart
            size={16}
            fill={task.isBookmarked ? "#ef4444" : "none"}
            color={task.isBookmarked ? "#ef4444" : "#64748b"}
          />
        </button>
      </div>

      {/* Card Content Body */}
      <div className="card-body-content">
        {/* Title and Price */}
        <div className="card-title-price-row">
          <h3 className="task-card-title">{task.title}</h3>
          <span className="task-card-price">{formattedPrice}</span>
        </div>

        {/* Category Pill and Metadata Row */}
        <div className="card-meta-row">
          <div className="category-pill">{task.category || "General"}</div>
          <div className="meta-info-right">
            <span className="meta-item-text">{displayDate}</span>
            <span className="meta-item-text">{displayTime}</span>
            <span className="meta-item-text">{task.location}</span>
          </div>
        </div>

        {/* Description Snippet */}
        <p className="task-card-description">{task.description}</p>

        {/* Card Footer: Applicants & Actions */}
        <div className="card-footer-row">
          <div className="applicants-group">
            <div className="avatar-stack">
              {defaultAvatars.map((img, i) => (
                <img key={i} src={img} alt="Applicant" className="stack-avatar" />
              ))}
              <span className="stack-more">{stackBadge}</span>
            </div>
            <span className="applicants-count-label">{applicantCountLabel}</span>
          </div>

          <div className="card-actions-right">
            {task.status === "Completed" || task.status === "completed" ? (
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