import {
  Star,
  Calendar,
  MapPin,
  Briefcase,
} from "lucide-react";

import "../styles/RequestCard.css";

const RequestCard = ({
  request,
  onAccept,
  onDecline,
}) => {
  const {
    applicant,
    task,
    message,
    id,
  } = request;

  return (
    <article className="request-card">

      {/* Top Section */}

      <div className="request-card-top">

        <div className="request-user">

          <img
            src={applicant.avatar}
            alt={applicant.name}
            className="request-avatar"
          />

          <div className="request-user-info">

            <div className="request-user-header">

              <h3>{applicant.name}</h3>

              <div className="request-rating">

                <Star
                  size={15}
                  fill="#F4B400"
                  stroke="#F4B400"
                />

                <span>{applicant.rating}</span>

                <small>
                  ({applicant.reviews} reviews)
                </small>

              </div>

            </div>

            <p className="request-message">
              {message}
            </p>

          </div>

        </div>

        <div className="request-buttons">

          <button
            className="accept-btn"
            onClick={() => onAccept(id)}
          >
            Accept
          </button>

          <button
            className="decline-btn"
            onClick={() => onDecline(id)}
          >
            Decline
          </button>

        </div>

      </div>

      {/* Task Section */}

      <div className="task-box">

        <div className="task-icon">

          <Briefcase size={28} />

        </div>

        <div className="task-details">

          <span className="requesting-for">
            Requesting for
          </span>

          <h4>{task.title}</h4>

          <span className="task-category">
            {task.category}
          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="request-footer">

        <div className="footer-item">

          <Calendar size={16} />

          <span>{task.date}</span>

        </div>

        <div className="footer-divider" />

        <div className="footer-item">

          <MapPin size={16} />

          <span>{task.location}</span>

        </div>

      </div>

    </article>
  );
};

export default RequestCard;