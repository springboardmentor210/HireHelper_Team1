import React from "react";
import { FiX, FiMapPin, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import "./TaskDetailsModal.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const categoryDisplayMap = {
  moving: "Moving",
  gardening: "Gardening",
  cleaning: "Cleaning",
  painting: "Painting",
  assembly: "Assembly",
  pet_care: "Pet Care",
  tech_help: "Tech Help",
  car_care: "Car Care",
  errands: "Errands",
  other: "Other",
};

function getCategoryLabel(category) {
  if (!category) return "Other";

  return (
    categoryDisplayMap[String(category).toLowerCase()] ||
    String(category)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  );
}

function getImageUrl(image) {
  if (!image) return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  const cleanPath = image.startsWith("/") ? image : `/${image}`;

  return `${API_BASE_URL}${cleanPath}`;
}

function formatDate(dateValue) {
  if (!dateValue) return "Not specified";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeValue) {
  if (!timeValue) return "Not specified";

  return timeValue;
}

function formatStatus(status) {
  if (!status) return "Active";

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) {
    return null;
  }

  const imageSource =
    task.image ||
    task.imageUrl ||
    task.photo ||
    task.photoUrl ||
    null;

  const imageUrl = getImageUrl(imageSource);

  const applicantsCount =
    task.applicants ??
    task.applicantsCount ??
    task.applicantCount ??
    0;

  const price =
    task.price ??
    task.budget ??
    0;

  const status = formatStatus(task.status);

  const category = getCategoryLabel(task.category);

  return (
    <div
      className="task-details-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="task-details-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
      >
        <button
          type="button"
          className="task-details-close"
          onClick={onClose}
          aria-label="Close task details"
        >
          <FiX />
        </button>

        {imageUrl && (
          <div className="task-details-image-wrapper">
            <img
              src={imageUrl}
              alt={task.title || "Task"}
              className="task-details-image"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="task-details-content">
          <div className="task-details-header">
            <div>
              <span className="task-details-category">
                {category}
              </span>

              <h2 id="task-details-title">
                {task.title || "Untitled Task"}
              </h2>
            </div>

            <span
              className={`task-details-status status-${String(
                task.status || "active"
              )
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {status}
            </span>
          </div>

          <div className="task-details-price">
            ₹{Number(price || 0).toLocaleString("en-IN")}
          </div>

          <div className="task-details-section">
            <h3>Description</h3>

            <p>
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="task-details-info-grid">
            <div className="task-details-info-item">
              <FiMapPin />

              <div>
                <span>Location</span>
                <strong>
                  {task.location || "Not specified"}
                </strong>
              </div>
            </div>

            <div className="task-details-info-item">
              <FiCalendar />

              <div>
                <span>Start Date</span>
                <strong>
                  {formatDate(
                    task.startDate ||
                      task.start_date ||
                      task.date
                  )}
                </strong>
              </div>
            </div>

            <div className="task-details-info-item">
              <FiClock />

              <div>
                <span>Start Time</span>
                <strong>
                  {formatTime(
                    task.startTime ||
                      task.start_time
                  )}
                </strong>
              </div>
            </div>

            <div className="task-details-info-item">
              <FiUsers />

              <div>
                <span>Applicants</span>
                <strong>
                  {applicantsCount}
                </strong>
              </div>
            </div>
          </div>

          {(task.endDate || task.endTime) && (
            <div className="task-details-section task-details-schedule">
              <h3>End Schedule</h3>

              <p>
                {task.endDate
                  ? formatDate(task.endDate)
                  : "No end date"}{" "}
                {task.endTime
                  ? `at ${formatTime(task.endTime)}`
                  : ""}
              </p>
            </div>
          )}

          <div className="task-details-footer">
            <button
              type="button"
              className="task-details-done-button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}