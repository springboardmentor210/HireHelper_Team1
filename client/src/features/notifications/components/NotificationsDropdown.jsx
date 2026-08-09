import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  FileText,
  BellOff,
  Settings,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import NotificationSettingsModal from "./NotificationSettingsModal";
import "../styles/Notifications.css";

export default function NotificationsDropdown({ onClose }) {
  const navigate = useNavigate();
  const {
    filteredNotifications,
    totalCount,
    taskCount,
    requestCount,
    activeFilter,
    setActiveFilter,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Group notifications by date group (Today, Yesterday, Earlier this week)
  const groupedNotifications = filteredNotifications.reduce((acc, notif) => {
    const group = notif.dateGroup || "Today";
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  // Preserved ordering for groups matching design
  const groupOrder = ["Today", "Yesterday", "Earlier this week"];

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    if (onClose) onClose();

    // Direct navigation to relevant task or request route
    if (item.targetRoute) {
      navigate(item.targetRoute);
    } else if (item.type === "task") {
      navigate("/mytasks");
    } else {
      navigate("/myrequests");
    }
  };

  const handleViewAll = () => {
    if (onClose) onClose();
    navigate("/notifications");
  };

  const renderIcon = (iconType) => {
    switch (iconType) {
      case "request_new":
        return <FileText size={20} />;
      case "task_completed":
        return <CheckCircle2 size={20} />;
      case "task_reminder":
        return <Clock size={20} />;
      case "new_applicant":
        return <User size={20} />;
      case "request_accepted":
        return <MessageSquare size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  return (
    <>
      <div
        className="notifications-dropdown-menu"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="notif-header-row">
          <h3 className="notif-header-title">Notifications</h3>
          <button
            type="button"
            className="notif-mark-read-btn"
            onClick={markAllAsRead}
          >
            <Check size={16} />
            <span>Mark all as read</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="notif-filters-row">
          <button
            type="button"
            className={`notif-filter-pill ${
              activeFilter === "All" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("All")}
          >
            All
            <span className="notif-pill-badge">{totalCount}</span>
          </button>

          <button
            type="button"
            className={`notif-filter-pill ${
              activeFilter === "Tasks" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Tasks")}
          >
            Tasks
            <span className="notif-pill-badge">{taskCount}</span>
          </button>

          <button
            type="button"
            className={`notif-filter-pill ${
              activeFilter === "Requests" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("Requests")}
          >
            Requests
            <span className="notif-pill-badge">{requestCount}</span>
          </button>
        </div>

        {/* Scrollable Notification List */}
        <div className="notif-scroll-area">
          {filteredNotifications.length === 0 ? (
            <div className="notif-empty-state">
              <BellOff size={32} />
              <p>No notifications yet</p>
            </div>
          ) : (
            groupOrder.map((groupKey) => {
              const groupItems = groupedNotifications[groupKey];
              if (!groupItems || groupItems.length === 0) return null;

              return (
                <div key={groupKey} className="notif-group-block">
                  <div className="notif-group-header">{groupKey}</div>
                  {groupItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`notif-item-row ${!item.read ? "unread" : ""}`}
                      onClick={() => handleNotificationClick(item)}
                    >
                      <div
                        className={`notif-icon-circle ${
                          item.iconType || "default"
                        }`}
                      >
                        {renderIcon(item.iconType)}
                      </div>

                      <div className="notif-content-box">
                        <h4 className="notif-item-title">{item.title}</h4>
                        <p className="notif-item-message">{item.message}</p>
                      </div>

                      <div className="notif-meta-box">
                        <span className="notif-time-text">{item.time}</span>
                        {!item.read && <span className="notif-blue-dot" />}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="notif-footer-divider">
          <button
            type="button"
            className="notif-footer-link"
            onClick={handleViewAll}
          >
            <div className="notif-footer-left">
              <MessageSquare size={18} />
              <span>View all notifications</span>
            </div>
            <ChevronRight size={18} className="chevron" />
          </button>

          <button
            type="button"
            className="notif-footer-link"
            onClick={() => setSettingsModalOpen(true)}
          >
            <div className="notif-footer-left">
              <Settings size={18} />
              <span>Notification settings</span>
            </div>
          </button>
        </div>
      </div>

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </>
  );
}
