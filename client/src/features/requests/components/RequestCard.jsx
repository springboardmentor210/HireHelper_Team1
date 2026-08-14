import React from "react";

import {
  Calendar,
  MapPin,
  ChevronUp,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

export default function RequestCard({
  request,
  onToggleExpand,
  onCancelRequest,
  onChat,
}) {
  // =========================================================
  // BACKEND DATA
  // =========================================================

  const {
    _id,
    task = {},
    taskOwner = {},
    status,
    message,
    createdAt,
    isExpanded,
  } = request || {};

  // =========================================================
  // TASK
  // =========================================================

  const taskTitle =
    task.title ||
    "Untitled Task";

  const category =
    task.category ||
    "";

  // =========================================================
  // OWNER
  // =========================================================

  const ownerName =
    `${taskOwner.firstName || ""} ${
      taskOwner.lastName || ""
    }`.trim() ||
    "Unknown User";

  const ownerInitials =
    `${taskOwner.firstName?.charAt(0) || ""}${
      taskOwner.lastName?.charAt(0) || ""
    }`.toUpperCase() ||
    "U";

  // =========================================================
  // DATE
  // =========================================================

  const createdAtFormatted =
    createdAt
      ? new Date(
          createdAt
        ).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        )
      : "Date unavailable";

  // =========================================================
  // LOCATION
  // =========================================================

  const location =
    task.location?.address ||
    task.location?.city ||
    task.location ||
    "Location unavailable";

  // =========================================================
  // IMAGE
  // =========================================================

  const taskImage =
    Array.isArray(task.images) &&
    task.images.length > 0
      ? task.images[0]
      : null;

  // =========================================================
  // STATUS
  // =========================================================

  const normalizedStatus =
    (
      status || ""
    ).toLowerCase();

  const isPending =
    normalizedStatus ===
    "pending";

  const isAccepted =
    normalizedStatus ===
    "accepted";

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadgeClass =
    () => {
      switch (
        normalizedStatus
      ) {
        case "pending":
          return "status-badge-pending";

        case "accepted":
          return "status-badge-accepted";

        case "completed":
          return "status-badge-completed";

        case "cancelled":
          return "status-badge-cancelled";

        case "declined":
          return "status-badge-cancelled";

        default:
          return "status-badge-pending";
      }
    };

  // =========================================================
  // CATEGORY
  // =========================================================

  const getCategoryClass =
    () => {
      const cat =
        (
          category || ""
        )
          .toLowerCase()
          .replace(
            /\s+/g,
            "-"
          );

      return `category-tag category-${cat}`;
    };

  // =========================================================
  // TOGGLE
  // =========================================================

  const handleToggle =
    () => {
      if (
        typeof onToggleExpand ===
          "function" &&
        _id
      ) {
        onToggleExpand(_id);
      }
    };

  // =========================================================
  // CHAT
  // =========================================================

  const handleChat = (
    event
  ) => {
    event.stopPropagation();

    if (!isAccepted) {
      return;
    }

    if (
      typeof onChat ===
      "function"
    ) {
      onChat(request);
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <article
      className={`request-card-item ${
        isExpanded
          ? "expanded"
          : "collapsed"
      }`}
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        className="card-main-header"
        onClick={
          handleToggle
        }
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (
            e.key ===
              "Enter" ||
            e.key === " "
          ) {
            e.preventDefault();
            handleToggle();
          }
        }}
      >

        {/* Owner Avatar */}

        <div
          className="owner-avatar-circle"
        >
          <span>
            {ownerInitials}
          </span>
        </div>

        {/* Header Info */}

        <div className="header-info">

          <div className="title-category-row">

            <h3 className="request-task-title">
              {taskTitle}
            </h3>

            {category && (
              <span
                className={getCategoryClass()}
              >
                {category}
              </span>
            )}

          </div>

          {/* Collapsed Metadata */}

          {!isExpanded && (
            <div className="collapsed-meta-row">

              <span className="meta-icon-item">
                <Calendar
                  size={13}
                />

                {createdAtFormatted}
              </span>

              <span className="dot-separator">
                •
              </span>

              <span className="meta-icon-item">
                <MapPin
                  size={13}
                />

                {location}
              </span>

            </div>
          )}

          {/* Expanded Owner */}

          {isExpanded && (
            <p className="task-owner-text">
              Task Owner:{" "}
              {ownerName}
            </p>
          )}

        </div>

        {/* Header Right */}

        <div className="header-right-actions">

          <span
            className={`status-badge-pill ${getStatusBadgeClass()}`}
          >
            {status
              ? status
                  .charAt(0)
                  .toUpperCase() +
                status.slice(1)
              : "Unknown"}
          </span>

          {!isExpanded && (
            <button
              type="button"
              className="expand-chevron-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              <ChevronRight
                size={18}
              />
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          EXPANDED BODY
      ===================================================== */}

      {isExpanded && (
        <div className="card-expanded-body">

          {/* Message */}

          {message && (
            <div className="user-message-container">

              <span className="message-label">
                Your message:
              </span>

              <p className="message-content">
                {message}
              </p>

            </div>
          )}

          {/* Metadata */}

          <div className="expanded-meta-row">

            <span className="meta-icon-item">
              <Calendar
                size={14}
              />

              {createdAtFormatted}
            </span>

            <span className="dot-separator">
              •
            </span>

            <span className="meta-icon-item">
              <MapPin
                size={14}
              />

              {location}
            </span>

          </div>

          {/* Task Image */}

          {taskImage && (
            <div className="task-image-preview-wrapper">

              <img
                src={taskImage}
                alt={taskTitle}
                className="task-preview-img"
              />

            </div>
          )}

          {/* =================================================
              FOOTER ACTIONS
          ================================================= */}

          <div className="expanded-footer-actions">

            {/* Cancel */}

            {isPending && (
              <button
                type="button"
                className="btn-cancel-request"
                onClick={(e) => {
                  e.stopPropagation();

                  if (
                    typeof onCancelRequest ===
                      "function"
                  ) {
                    onCancelRequest(
                      request
                    );
                  }
                }}
              >
                Cancel Request
              </button>
            )}

            {/* Chat */}

            {isAccepted && (
              <button
                type="button"
                className="btn-chat-request"
                onClick={
                  handleChat
                }
              >
                <MessageCircle
                  size={17}
                />

                Chat
              </button>
            )}

            {/* Collapse */}

            <button
              type="button"
              className="collapse-chevron-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              <ChevronUp
                size={18}
              />
            </button>

          </div>

        </div>
      )}
    </article>
  );
}