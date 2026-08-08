import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../tasks/components/SearchBar";
import {
  Check,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  FileText,
  BellOff,
  Settings,
  AlertCircle,
} from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import NotificationSettingsModal from "../components/NotificationSettingsModal";
import "../styles/Notifications.css";

export default function NotificationsPage() {
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

  const [search, setSearch] = useState("");
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Apply search query filter if typed
  const displayedNotifications = filteredNotifications.filter((n) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.message.toLowerCase().includes(q)
    );
  });

  const groupedNotifications = displayedNotifications.reduce((acc, notif) => {
    const group = notif.dateGroup || "Today";
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const groupOrder = ["Today", "Yesterday", "Earlier this week"];

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    if (item.targetRoute) {
      navigate(item.targetRoute);
    } else if (item.type === "task") {
      navigate("/mytasks");
    } else {
      navigate("/myrequests");
    }
  };

  const renderIcon = (iconType) => {
    switch (iconType) {
      case "request_new":
        return <FileText size={22} />;
      case "task_completed":
        return <CheckCircle2 size={22} />;
      case "task_reminder":
        return <Clock size={22} />;
      case "new_applicant":
        return <User size={22} />;
      case "request_accepted":
        return <MessageSquare size={22} />;
      default:
        return <AlertCircle size={22} />;
    }
  };

  return (
    <div className="notifications-page-layout">
      <Sidebar />

      <main className="notifications-page-main">
        <header className="feed-header" style={{ marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Notifications
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0 0" }}>
              Stay updated on your task and request activity
            </p>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
          />
        </header>

        <div className="notifications-page-card">
          {/* Action Row */}
          <div className="notif-header-row" style={{ marginBottom: "20px" }}>
            {/* Filter Pills */}
            <div className="notif-filters-row" style={{ margin: 0 }}>
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

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="notif-mark-read-btn"
                onClick={markAllAsRead}
              >
                <Check size={16} />
                <span>Mark all as read</span>
              </button>

              <button
                type="button"
                className="notif-mark-read-btn"
                onClick={() => setSettingsModalOpen(true)}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
            </div>
          </div>

          {/* List Area */}
          <div>
            {displayedNotifications.length === 0 ? (
              <div className="notif-empty-state" style={{ padding: "60px 20px" }}>
                <BellOff size={40} />
                <p style={{ fontSize: "1.1rem", marginTop: "12px" }}>No notifications found</p>
              </div>
            ) : (
              groupOrder.map((groupKey) => {
                const groupItems = groupedNotifications[groupKey];
                if (!groupItems || groupItems.length === 0) return null;

                return (
                  <div key={groupKey} style={{ marginBottom: "20px" }}>
                    <div className="notif-group-header" style={{ fontSize: "0.9rem" }}>
                      {groupKey}
                    </div>
                    {groupItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`notif-item-row ${!item.read ? "unread" : ""}`}
                        style={{ padding: "14px 16px" }}
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
                          <h4 className="notif-item-title" style={{ fontSize: "1rem" }}>
                            {item.title}
                          </h4>
                          <p className="notif-item-message" style={{ fontSize: "0.88rem" }}>
                            {item.message}
                          </p>
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
        </div>
      </main>

      <NotificationSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
}
