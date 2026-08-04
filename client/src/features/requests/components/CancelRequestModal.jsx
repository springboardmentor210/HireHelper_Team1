import React from "react";
import { X, AlertCircle } from "lucide-react";

export default function CancelRequestModal({ request, onClose, onConfirm }) {
  if (!request) return null;

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="modal-content-card cancel-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <div className="modal-title-with-icon">
            <div className="warning-icon-badge">
              <AlertCircle size={20} className="icon-warning" />
            </div>
            <div>
              <h3 className="modal-title">Cancel Request</h3>
              <p className="modal-subtitle">Confirm request cancellation</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-text">
          <p>
            Are you sure you want to cancel your request for{" "}
            <strong>"{request.taskTitle}"</strong>?
          </p>
          <p className="subtext-note">
            The task owner will be notified, and this request will move to your Cancelled tab.
          </p>
        </div>

        <div className="modal-footer-actions">
          <button
            type="button"
            className="btn-modal-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-modal-danger"
            onClick={() => onConfirm(request.id)}
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
