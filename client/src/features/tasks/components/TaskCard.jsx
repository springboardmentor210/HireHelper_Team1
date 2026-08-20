import React from "react";
import { useNavigate } from "react-router-dom";
import TaskMenu from "./TaskMenu";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export default function TaskCard({
  task,
  applicants = [],
  onViewDetails,
  onDelete,
  onUpdateStatus,
}) {
  const navigate = useNavigate();

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

      case "Cancelled":
      case "cancelled":
        return "status-pill cancelled";

      default:
        return "status-pill active";
    }
  };

  const formattedPrice =
    typeof task.price === "number"
      ? `₹${task.price.toLocaleString("en-IN")}`
      : typeof task.budget === "number"
      ? `₹${task.budget.toLocaleString("en-IN")}`
      : typeof task.price === "string" &&
        task.price.startsWith("₹")
      ? task.price
      : `₹${task.price ?? task.budget ?? 0}`;

  const rawTaskImage =
    Array.isArray(task.images) &&
    task.images.length > 0
      ? task.images[0]
      : task.image;

  const taskImage = rawTaskImage
    ? rawTaskImage.startsWith("http")
      ? rawTaskImage
      : `${API_BASE_URL}${
          rawTaskImage.startsWith("/")
            ? rawTaskImage
            : `/${rawTaskImage}`
        }`
    : "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80";

  const displayDate =
    task.startDate ||
    task.date ||
    "";

  const displayTime =
    task.startTime ||
    task.time ||
    "";

  /*
   * Applicants are used only for displaying
   * the actual requester avatars.
   *
   * The authoritative applicant count comes
   * from the task returned by the backend.
   */
  const realApplicants = Array.isArray(applicants)
    ? applicants
    : [];

  const visibleApplicants =
    realApplicants.slice(0, 3);

  const applicantCount =
    Number.isFinite(Number(task?.applicantsCount))
      ? Number(task.applicantsCount)
      : 0;

  const applicantCountLabel =
    applicantCount === 1
      ? "1 Applicant"
      : `${applicantCount} Applicants`;

  /*
   * Convert a stored profile-picture path
   * into a usable browser URL.
   */
  const getProfileImageUrl = (profilePicture) => {
    if (!profilePicture) {
      return "";
    }

    if (
      profilePicture.startsWith("http://") ||
      profilePicture.startsWith("https://") ||
      profilePicture.startsWith("data:")
    ) {
      return profilePicture;
    }

    const cleanPath =
      profilePicture.startsWith("/")
        ? profilePicture
        : `/${profilePicture}`;

    return `${API_BASE_URL}${cleanPath}`;
  };

  /*
   * Build initials when the applicant does not
   * have a profile picture.
   */
  const getInitials = (firstName, lastName) => {
    const first =
      firstName?.trim()?.charAt(0) || "";

    const last =
      lastName?.trim()?.charAt(0) || "";

    const initials =
      `${first}${last}`.toUpperCase();

    return initials || "A";
  };

  return (
    <div className="task-card-item">

      {/* Image + Status */}
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

        <span
          className={getStatusClass(
            task.status
          )}
        >
          {task.status || "Active"}
        </span>
      </div>

      <div className="card-body-content">

        {/* Title + Price */}
        <div className="card-title-price-row">
          <h3 className="task-card-title">
            {task.title ||
              "Untitled Task"}
          </h3>

          <span className="task-card-price">
            {formattedPrice}
          </span>
        </div>

        {/* Category + Meta */}
        <div className="card-meta-row">
          <div className="category-pill">
            {task.category ||
              "General"}
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

        {/* Footer */}
        <div className="card-footer-row">

          {/* Applicants */}
          <div
            className="applicants-group"
            role="button"
            tabIndex={0}
            onClick={() => {
              const taskId =
                task?._id ||
                task?.id;

              if (!taskId) {
                return;
              }

              navigate(
                `/tasks/${taskId}/applicants`
              );
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();

                const taskId =
                  task?._id ||
                  task?.id;

                if (!taskId) {
                  return;
                }

                navigate(
                  `/tasks/${taskId}/applicants`
                );
              }
            }}
          >
            <div className="avatar-stack">
              {visibleApplicants.map(
                (request, index) => {
                  const requester =
                    request?.requester ||
                    {};

                  const firstName =
                    requester.firstName ||
                    "";

                  const lastName =
                    requester.lastName ||
                    "";

                  const fullName =
                    `${firstName} ${lastName}`
                      .trim() ||
                    "Applicant";

                  const profilePicture =
                    getProfileImageUrl(
                      requester.profilePicture
                    );

                  const initials =
                    getInitials(
                      firstName,
                      lastName
                    );

                  return profilePicture ? (
                    <img
                      key={
                        request?._id ||
                        index
                      }
                      src={profilePicture}
                      alt={fullName}
                      title={fullName}
                      className="stack-avatar"
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div
                      key={
                        request?._id ||
                        index
                      }
                      className="stack-avatar avatar-initials"
                      title={fullName}
                      aria-label={fullName}
                    >
                      {initials}
                    </div>
                  );
                }
              )}
            </div>

            <span className="applicants-count-label">
              {applicantCountLabel}
            </span>
          </div>

          {/* Actions */}
          <div className="card-actions-right">

            {/* View Details */}
            <button
              type="button"
              className="action-pill-btn"
              onClick={() =>
                onViewDetails(task)
              }
            >
              View Details
            </button>

            {/* Three-dot menu */}
            <TaskMenu
              task={task}
              onViewDetails={
                onViewDetails
              }
              onDelete={
                onDelete
              }
              onUpdateStatus={
                onUpdateStatus
              }
            />

          </div>
        </div>
      </div>
    </div>
  );
}