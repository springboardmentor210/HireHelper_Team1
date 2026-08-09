import React from "react";
import { X, Calendar, Clock, MapPin, Tag, IndianRupee } from "lucide-react";

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  const taskImage =
    (Array.isArray(task.images) && task.images.length > 0 ? task.images[0] : task.image) ||
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80";

  const taskPrice = task.price ?? task.budget ?? 0;
  const displayDate = task.startDate || task.date || "TBD";
  const displayTime = task.startTime || task.time || "TBD";

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card details">
        <div className="modal-header-row">
          <div>
            <h2 className="modal-title">{task.title}</h2>
            <span className="category-pill">{task.category || "General"}</span>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="task-details-body">
          <img
            src={taskImage}
            alt={task.title}
            className="details-cover-image"
          />

          <div className="details-info-grid">
            <div className="details-info-item">
              <IndianRupee size={18} className="info-icon" />
              <div>
                <span className="info-label">Price</span>
                <span className="info-val green">
                  ₹{typeof taskPrice === "number" ? taskPrice.toLocaleString() : taskPrice}
                </span>
              </div>
            </div>

            <div className="details-info-item">
              <Calendar size={18} className="info-icon" />
              <div>
                <span className="info-label">Date</span>
                <span className="info-val">{displayDate}</span>
              </div>
            </div>

            <div className="details-info-item">
              <Clock size={18} className="info-icon" />
              <div>
                <span className="info-label">Time</span>
                <span className="info-val">{displayTime}</span>
              </div>
            </div>

            <div className="details-info-item">
              <MapPin size={18} className="info-icon" />
              <div>
                <span className="info-label">Location</span>
                <span className="info-val">{task.location}</span>
              </div>
            </div>
          </div>

          <div className="details-description-box">
            <h4>Task Description</h4>
            <p>{task.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
