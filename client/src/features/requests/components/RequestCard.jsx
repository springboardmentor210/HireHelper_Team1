import React from "react";
import { Calendar, MapPin, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";

export default function RequestCard({
  request,
  onToggleExpand,
  onCancelRequest,
}) {
  const {
    id,
    taskTitle,
    ownerName,
    ownerInitials,
    avatarBg,
    avatarColor,
    category,
    status,
    message,
    createdAtFormatted,
    location,
    taskImage,
    isExpanded,
  } = request;

  const isPending = status === "Pending";
  const isAccepted = status === "Accepted";
  const isCompleted = status === "Completed";
  const isCancelled = status === "Cancelled";

  const getStatusBadgeClass = () => {
    switch (status) {
      case "Pending":
        return "status-badge-pending";
      case "Accepted":
        return "status-badge-accepted";
      case "Completed":
        return "status-badge-completed";
      case "Cancelled":
        return "status-badge-cancelled";
      default:
        return "status-badge-pending";
    }
  };

  const getCategoryClass = () => {
    const cat = (category || "").toLowerCase().replace(/\s+/g, "-");
    return `category-tag category-${cat}`;
  };

  return (
    <article
      className={`request-card-item ${isExpanded ? "expanded" : "collapsed"}`}
    >
      {/* Top Header Section */}
      <div
        className="card-main-header"
        onClick={() => onToggleExpand(id)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onToggleExpand(id);
          }
        }}
      >
        {/* Avatar */}
        <div
          className="owner-avatar-circle"
          style={{ backgroundColor: avatarBg || "#f1f5f9", color: avatarColor || "#334155" }}
        >
          <span>{ownerInitials || "SJ"}</span>
        </div>

        {/* Title, Owner and Category */}
        <div className="header-info">
          <div className="title-category-row">
            <h3 className="request-task-title">{taskTitle}</h3>
            <span className={getCategoryClass()}>{category}</span>
          </div>

          {!isExpanded && (
            <div className="collapsed-meta-row">
              <span className="meta-icon-item">
                <Calendar size={13} />
                {createdAtFormatted}
              </span>
              <span className="dot-separator">•</span>
              <span className="meta-icon-item">
                <MapPin size={13} />
                {location}
              </span>
            </div>
          )}

          {isExpanded && (
            <p className="task-owner-text">Task Owner: {ownerName}</p>
          )}
        </div>

        {/* Status Badge & Toggle Button */}
        <div className="header-right-actions">
          <span className={`status-badge-pill ${getStatusBadgeClass()}`}>
            {status}
          </span>

          {!isExpanded && (
            <button
              type="button"
              className="expand-chevron-btn"
              aria-label="Expand request details"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(id);
              }}
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content Section */}
      {isExpanded && (
        <div className="card-expanded-body">
          {/* User Submitted Message Box */}
          {message && (
            <div className="user-message-container">
              <span className="message-label">Your message:</span>
              <p className="message-content">{message}</p>
            </div>
          )}

          {/* Date and Location Metadata */}
          <div className="expanded-meta-row">
            <span className="meta-icon-item">
              <Calendar size={14} />
              {createdAtFormatted}
            </span>
            <span className="dot-separator">•</span>
            <span className="meta-icon-item">
              <MapPin size={14} />
              {location}
            </span>
          </div>

          {/* Task Image Preview */}
          {taskImage && (
            <div className="task-image-preview-wrapper">
              <img
                src={taskImage}
                alt={taskTitle}
                className="task-preview-img"
              />
            </div>
          )}

          {/* Action Row */}
          <div className="expanded-footer-actions">
            {isPending && (
              <button
                type="button"
                className="btn-cancel-request"
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelRequest(request);
                }}
              >
                Cancel Request
              </button>
            )}

            <button
              type="button"
              className="collapse-chevron-btn"
              aria-label="Collapse request details"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(id);
              }}
            >
              <ChevronUp size={18} />
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
