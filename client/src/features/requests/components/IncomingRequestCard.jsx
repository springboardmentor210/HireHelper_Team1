import {
  Star,
  Briefcase,
} from "lucide-react";

import "../styles/Requests.css";

const IncomingRequestCard = ({
  request,
  onAccept,
  onDecline,
}) => {
  // =========================
  // Backend Request Data
  // =========================

  const {
    _id,
    requester = {},
    task = {},
    message = "",
  } = request || {};

  // =========================
  // Requester Name
  // =========================

  const requesterName =
    `${requester.firstName || ""} ${
      requester.lastName || ""
    }`.trim() || "Unknown User";

  // =========================
  // Profile Picture
  // =========================

  const profilePicture =
    requester.profilePicture || null;

  // =========================
  // Rating
  // =========================

  const rating = requester.rating;
  const reviews = requester.reviews;

  // =========================
  // Handlers
  // =========================

  const handleAccept = () => {
    if (!_id) {
      console.error("Request ID is missing:", request);
      return;
    }

    onAccept(_id);
  };

  const handleDecline = () => {
    if (!_id) {
      console.error("Request ID is missing:", request);
      return;
    }

    onDecline(_id);
  };

  return (
    <article className="request-card">

      {/* =========================
          Top Section
      ========================= */}

      <div className="request-card-top">

        <div className="request-user">

          {/* Profile Picture */}

          {profilePicture ? (
            <img
              src={profilePicture}
              alt={`${requesterName} profile`}
              className="request-avatar"
            />
          ) : (
            <div className="request-avatar request-avatar-fallback">
              {requesterName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Requester Information */}

          <div className="request-user-info">

            <div className="request-user-header">

              <h3>
                {requesterName}
              </h3>

              {/* Rating */}

              {rating !== undefined && rating !== null && (
                <div className="request-rating">

                  <Star
                    size={15}
                    fill="#F4B400"
                    stroke="#F4B400"
                  />

                  <span>
                    {rating}
                  </span>

                  {reviews !== undefined &&
                    reviews !== null && (
                      <small>
                        ({reviews} reviews)
                      </small>
                    )}

                </div>
              )}

            </div>

            {/* Request Message */}

            {message && (
              <p className="request-message">
                {message}
              </p>
            )}

          </div>
        </div>

        {/* Accept / Decline */}

        <div className="request-buttons">

          <button
            type="button"
            className="accept-btn"
            onClick={handleAccept}
          >
            Accept
          </button>

          <button
            type="button"
            className="decline-btn"
            onClick={handleDecline}
          >
            Decline
          </button>

        </div>

      </div>

      {/* =========================
          Task Section
      ========================= */}

      <div className="task-box">

        <div className="task-icon">
          <Briefcase size={28} />
        </div>

        <div className="task-details">

          <span className="requesting-for">
            Requesting for
          </span>

          <div className="task-title-row">

            <h4>
              {task.title || "Untitled Task"}
            </h4>

            {task.category && (
              <span className="task-category">
                {task.category}
              </span>
            )}

          </div>

        </div>

      </div>

    </article>
  );
};

export default IncomingRequestCard;