import React from "react";
import { X, Star, CheckCircle, MessageSquare } from "lucide-react";

export default function ApplicantsModal({ task, onClose }) {
  if (!task) return null;

  const applicants = task.applicantList && task.applicantList.length > 0
    ? task.applicantList
    : [
        { id: "a1", name: "Sarah Jenkins", rating: 4.9, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", offer: "₹1,200" },
        { id: "a2", name: "David Chen", rating: 4.8, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", offer: "₹1,150" },
        { id: "a3", name: "Alex Rivera", rating: 4.7, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80", offer: "₹1,200" },
      ];

  return (
    <div className="modal-backdrop-overlay">
      <div className="modal-content-card">
        <div className="modal-header-row">
          <div>
            <h2 className="modal-title">Applicants for {task.title}</h2>
            <p className="modal-subtitle">Review applicants who offered to help with this task.</p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="applicants-list-body">
          {applicants.map((applicant) => (
            <div key={applicant.id} className="applicant-item-card">
              <div className="applicant-user-info">
                <img src={applicant.avatar} alt={applicant.name} className="applicant-avatar-img" />
                <div>
                  <h4 className="applicant-name-text">{applicant.name}</h4>
                  <div className="rating-badge">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{applicant.rating}</span>
                  </div>
                </div>
              </div>

              <div className="applicant-offer-actions">
                <span className="offer-amount">{applicant.offer}</span>
                <button type="button" className="btn-secondary-sm">
                  <MessageSquare size={14} /> Message
                </button>
                <button type="button" className="btn-primary-sm" onClick={() => alert(`Selected ${applicant.name} for this task!`)}>
                  <CheckCircle size={14} /> Hire
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
