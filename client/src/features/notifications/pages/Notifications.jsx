import React from "react";
import "./Notifications.css";

const notifications = [
  {
    id: 1,
    type: "request",
    title: "New request received",
    message: "Sarah Johnson sent you a request for Help Moving Furniture.",
    time: "2 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "accepted",
    title: "Request accepted",
    message: "Your request for Room Painting Project was accepted.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "message",
    title: "New message",
    message: "You have received a new message regarding your task.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "completed",
    title: "Task completed",
    message: "Garden Cleanup has been marked as completed.",
    time: "Yesterday",
    unread: false,
  },
];

const iconMap = {
  request: "!",
  accepted: "✓",
  message: "M",
  completed: "✓",
};

export default function Notifications() {
  return (
    <main className="notifications-page">
      <section className="notifications-content">
        <div className="notifications-heading">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your latest activity</p>
          </div>

          <button className="mark-all-btn">
            Mark all as read
          </button>
        </div>

        <div className="notifications-card">
          <div className="notifications-card-header">
            <h2>Recent Notifications</h2>

            <button className="notification-settings-btn">
              Notification Settings
            </button>
          </div>

          <div className="notification-list">
            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-item ${
                  notification.unread ? "unread" : ""
                }`}
              >
                <div
                  className={`notification-icon ${notification.type}`}
                >
                  {iconMap[notification.type]}
                </div>

                <div className="notification-body">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {notification.unread && (
                      <span className="unread-dot" />
                    )}
                  </div>

                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {notification.time}
                  </span>
                </div>

                <button
                  className="notification-more"
                  aria-label="Notification options"
                >
                  ⋮
                </button>
              </article>
            ))}
          </div>

          <div className="notifications-footer">
            <button>View all notifications</button>
          </div>
        </div>
      </section>
    </main>
  );
}