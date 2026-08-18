import React from "react";
import TaskMenu from "./TaskMenu";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
];

const API_BASE_URL = "http://localhost:5000";

export default function TaskCard({
  task,
  onViewDetails,
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
      : typeof task.price === "string" && task.price.startsWith("₹")
      ? task.price
      : `₹${task.price ?? task.budget ?? 500}`;

  // Get the image from the backend response
  const rawTaskImage =
    Array.isArray(task.images) && task.images.length > 0
      ? task.images[0]
      : task.image;

  // Convert backend relative path into a complete URL
  const taskImage = rawTaskImage
    ? rawTaskImage.startsWith("http")
      ? rawTaskImage
      : `${API_BASE_URL}${
          rawTaskImage.startsWith("/") ? rawTaskImage : `/${rawTaskImage}`
        }`
    : "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80";

  const displayDate = task.startDate || task.date || "";
  const displayTime = task.startTime || task.time || "";

  const stackBadge =
    task.title === "Furniture Assembly"
      ? "+3"
      : task.title === "Garden Cleanup"
      ? "+7"
      : "+4";

  const applicantCountLabel = `+${
    task.applicants ?? task.applicantsCount ?? 0
  } Applicants`;

  return (
    <div className="task-card-item">
      {/* Image Header with Status Overlay */}
      <div className="card-image-header">
        <img
          src={taskImage}
          alt={task.title || "Task"}
          className="task-cover-img"
          onError={(event) => {
            event.currentTarget.src =
              "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80";
          }}
        />

        <span className={getStatusClass(task.status)}>
          {task.status || "Active"}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="card-body-content">
        {/* Title and Price */}
        <div className="card-title-price-row">
          <h3 className="task-card-title">
            {task.title || "Untitled Task"}
          </h3>

          <span className="task-card-price">
            {formattedPrice}
          </span>
        </div>

        {/* Category and Metadata */}
        <div className="card-meta-row">
          <div className="category-pill">
            {task.category || "General"}
          </div>

          <div className="meta-info-right">
            <span className="meta-item-text">
              {displayDate}
            </span>

            <span className="meta-item-text">
              {displayTime}
            </span>

            <span className="meta-item-text">
              {task.location || ""}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="task-card-description">
          {task.description || ""}
        </p>

        {/* Card Footer */}
        <div className="card-footer-row">
          <div className="applicants-group">
            <div className="avatar-stack">
              {defaultAvatars.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Applicant"
                  className="stack-avatar"
                />
              ))}

              <span className="stack-more">
                {stackBadge}
              </span>
            </div>

            <span className="applicants-count-label">
              {applicantCountLabel}
            </span>
          </div>

          <div className="card-actions-right">
            <button
              type="button"
              className="action-pill-btn"
              onClick={() => onViewDetails(task)}
            >
              View Details
            </button>

            <TaskMenu
              task={task}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}