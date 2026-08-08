import React, { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

// Initial Seed Notifications matching design reference screenshot and prompt specifications
const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_1",
    type: "request", // "task" | "request"
    category: "new_request",
    title: "New request for Computer Setup",
    message: 'Sarah Johnson wants help with "Computer Setup". Review and respond.',
    time: "5m ago",
    dateGroup: "Today", // "Today" | "Yesterday" | "Earlier this week"
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
    targetRoute: "/requests",
    targetId: "req_1",
    iconType: "request_new", // blue clipboard
  },
  {
    id: "notif_2",
    type: "task",
    category: "task_completed",
    title: "Task completed",
    message: "Garden Cleanup has been marked as completed.",
    time: "1h ago",
    dateGroup: "Today",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: false,
    targetRoute: "/mytasks",
    targetId: "t3",
    iconType: "task_completed", // green checkmark
  },
  {
    id: "notif_3",
    type: "task",
    category: "task_reminder",
    title: "Task reminder",
    message: "Car Wash & Detail is scheduled for tomorrow at 10:00 AM.",
    time: "2h ago",
    dateGroup: "Today",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    targetRoute: "/mytasks",
    targetId: "t2",
    iconType: "task_reminder", // orange clock
  },
  {
    id: "notif_4",
    type: "task",
    category: "new_applicant",
    title: "New applicant for your task",
    message: 'Emily Chen applied for your task "Room Painting Project".',
    time: "Yesterday",
    dateGroup: "Yesterday",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    targetRoute: "/mytasks",
    targetId: "t1",
    iconType: "new_applicant", // purple user
  },
  {
    id: "notif_5",
    type: "request",
    category: "request_accepted",
    title: "Your request has been accepted",
    message: "Robert Wilson accepted your request for Help Moving Furniture.",
    time: "2d ago",
    dateGroup: "Earlier this week",
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    read: false,
    targetRoute: "/myrequests",
    targetId: "req_2",
    iconType: "request_accepted", // pink chat bubble
  },
];

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  pushNotifications: true,
  taskReminders: true,
  requestUpdates: true,
  deadlineAlerts: true,
  soundEnabled: false,
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem("hire_helper_notifications_list");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load stored notifications:", e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem("hire_helper_notification_settings");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load notification settings:", e);
    }
    return DEFAULT_SETTINGS;
  });

  const [activeFilter, setActiveFilter] = useState("All"); // "All" | "Tasks" | "Requests"
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "hire_helper_notifications_list",
        JSON.stringify(notifications)
      );
    } catch (e) {
      console.error("Failed to save notifications:", e);
    }
  }, [notifications]);

  // Save settings to localStorage
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

  // Dynamic calculation for approaching task deadlines from existing task data
  useEffect(() => {
    try {
      const rawTasks = localStorage.getItem("hire_helper_tasks");
      if (!rawTasks) return;
      const tasks = JSON.parse(rawTasks);
      if (!Array.isArray(tasks)) return;

      const now = new Date();
      tasks.forEach((task) => {
        if (!task.date) return;
        const taskDate = new Date(task.date);
        if (isNaN(taskDate.getTime())) return;

        const diffTime = taskDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 3) {
          const notifId = `deadline_${task.id}`;
          setNotifications((prev) => {
            if (prev.some((n) => n.id === notifId)) return prev;

            const timeDesc =
              diffDays === 0
                ? "due today"
                : diffDays === 1
                ? "due tomorrow"
                : `due in ${diffDays} days`;

            return [
              {
                id: notifId,
                type: "task",
                category: "task_deadline",
                title: "Task deadline approaching",
                message: `"${task.title}" is ${timeDesc} (${task.date}).`,
                time: "Just now",
                dateGroup: "Today",
                timestamp: new Date().toISOString(),
                read: false,
                targetRoute: "/mytasks",
                targetId: task.id,
                iconType: "task_reminder",
              },
              ...prev,
            ];
          });
        }
      });
    } catch (err) {
      console.error("Error evaluating task deadline notifications:", err);
    }
  }, []);

  // Filtered list
  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === "Tasks") return item.type === "task";
    if (activeFilter === "Requests") return item.type === "request";
    return true; // "All"
  });

  // Dynamic counts
  const unreadCount = notifications.filter((n) => !n.read).length;
  const taskCount = notifications.filter((n) => n.type === "task").length;
  const requestCount = notifications.filter((n) => n.type === "request").length;
  const totalCount = notifications.length;

  // Actions
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (newNotif) => {
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        dateGroup: "Today",
        time: "Just now",
        timestamp: new Date().toISOString(),
        read: false,
        ...newNotif,
      },
      ...prev,
    ]);
  };

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
        activeFilter,
        setActiveFilter,
        markAsRead,
        markAllAsRead,
        addNotification,
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
