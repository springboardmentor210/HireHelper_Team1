import React from "react";
import { CheckCircle2, MessageSquare, Clock, BellOff } from "lucide-react";

export default function NotificationsDropdown({ notifications, onClose }) {
  return (
    <div className="notifications-dropdown-menu">
      <div className="notifications-dropdown-header">
        <h4>Notifications</h4>
        <span className="notifications-count">
          {notifications.filter((n) => !n.read).length} Unread
        </span>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <BellOff size={24} />
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item ${!n.read ? "unread" : ""}`}
            >
              <div className="notification-icon">
                {n.type === "success" ? (
                  <CheckCircle2 size={18} className="icon-success" />
                ) : (
                  <MessageSquare size={18} className="icon-info" />
                )}
              </div>
              <div className="notification-content">
                <p className="notification-title">{n.title}</p>
                <p className="notification-message">{n.message}</p>
                <span className="notification-time">
                  <Clock size={11} /> {n.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
