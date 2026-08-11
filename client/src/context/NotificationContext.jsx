import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

// ─────────────────────────────────────────────
// Helpers to map real API data → UI shape
// ─────────────────────────────────────────────
const computeDateGroup = (createdAt) => {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Earlier this week";
};

const computeTime = (createdAt) => {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
};

const computeIconType = (category) => {
  switch (category) {
    case "new_request":    return "request_new";
    case "new_applicant": return "new_applicant";
    case "request_accepted": return "request_accepted";
    case "request_declined": return "request_declined";
    case "task_completed": return "task_completed";
    case "task_reminder":  return "task_reminder";
    default:              return "default";
  }
};

// Normalize a raw API notification into the shape the UI expects
const normalizeNotification = (n) => ({
  ...n,
  id: n._id,                                  // UI uses item.id
  dateGroup: computeDateGroup(n.createdAt),   // UI uses item.dateGroup
  time: computeTime(n.createdAt),             // UI uses item.time
  iconType: computeIconType(n.category),      // UI uses item.iconType
});

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  requestUpdates: true,
  deadlineAlerts: true,
  soundEnabled: false,
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("hire_helper_notification_settings");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to load notification settings:", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeFilter, setActiveFilter] = useState("All"); // "All" | "Tasks" | "Requests"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ─────────────────────────────────────────────
  // Fetch notifications from backend
  // ─────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Guest — skip

    try {
      setLoading(true);
      const response = await api.get("/notifications", {
        params: { limit: 50 },
      });

      const data = response.data?.data || {};
      setNotifications((data.notifications || []).map(normalizeNotification));
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and whenever the user logs in
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─────────────────────────────────────────────
  // Persist settings to localStorage
  // ─────────────────────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem(
        "hire_helper_notification_settings",
        JSON.stringify(settings)
      );
    } catch (e) {
      console.error("Failed to save notification settings:", e);
    }
  }, [settings]);

  // ─────────────────────────────────────────────
  // Mark a single notification as read
  // ─────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err?.response?.data?.message || err.message);
      // Revert optimistic update on failure
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // ─────────────────────────────────────────────
  // Mark ALL notifications as read
  // ─────────────────────────────────────────────
  const markAllAsRead = useCallback(async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);

    try {
      await api.patch("/notifications/read-all");
    } catch (err) {
      console.error("Failed to mark all as read:", err?.response?.data?.message || err.message);
      fetchNotifications();
    }
  }, [fetchNotifications]);

  // ─────────────────────────────────────────────
  // Add a notification locally (for optimistic UI
  // when the current user triggers an action)
  // ─────────────────────────────────────────────
  const addNotification = useCallback((newNotif) => {
    setNotifications((prev) => [
      {
        _id: `local_${Date.now()}`,
        dateGroup: "Today",
        time: "Just now",
        createdAt: new Date().toISOString(),
        read: false,
        ...newNotif,
      },
      ...prev,
    ]);
    setUnreadCount((prev) => prev + 1);
  }, []);

  // ─────────────────────────────────────────────
  // Filtered list for the dropdown tabs
  // ─────────────────────────────────────────────
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "Tasks") return item.type === "task";
    if (activeFilter === "Requests") return item.type === "request";
    return true; // "All"
  });

  // Dynamic counts
  const taskCount = notifications.filter((n) => n.type === "task").length;
  const requestCount = notifications.filter((n) => n.type === "request").length;
  const totalCount = notifications.length;

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        filteredNotifications,
        unreadCount,
        totalCount,
        taskCount,
        requestCount,
        loading,
        activeFilter,
        setActiveFilter,
        markAsRead,
        markAllAsRead,
        addNotification,
        fetchNotifications,
        settings,
        updateSettings,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
