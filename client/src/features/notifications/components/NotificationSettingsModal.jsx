import React, { useState } from "react";
import { X } from "lucide-react";
import { useNotifications } from "../../../context/NotificationContext";
import "../styles/Notifications.css";

export default function NotificationSettingsModal({ isOpen, onClose }) {
  const { settings, updateSettings } = useNotifications();
  const [localSettings, setLocalSettings] = useState({ ...settings });

  if (!isOpen) return null;

  const handleToggle = (key) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  return (
    <div className="notif-modal-overlay" onClick={onClose}>
      <div
        className="notif-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-settings-title"
      >
        <div className="notif-modal-header">
          <h3 id="notif-settings-title">Notification Settings</h3>
          <button
            type="button"
            className="notif-modal-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="notif-settings-list">
          <div className="notif-setting-row">
            <div className="notif-setting-info">
              <h4>Email Notifications</h4>
              <p>Receive task and request summary alerts via email</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.emailNotifications ?? true}
                onChange={() => handleToggle("emailNotifications")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notif-setting-row">
            <div className="notif-setting-info">
              <h4>Push Notifications</h4>
              <p>Get instant browser notifications for active items</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.pushNotifications ?? true}
                onChange={() => handleToggle("pushNotifications")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notif-setting-row">
            <div className="notif-setting-info">
              <h4>Task Updates & Reminders</h4>
              <p>Alerts for new applicants, task status and reminders</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.taskReminders ?? true}
                onChange={() => handleToggle("taskReminders")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notif-setting-row">
            <div className="notif-setting-info">
              <h4>Request Updates</h4>
              <p>Alerts when a request is created, accepted or rejected</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.requestUpdates ?? true}
                onChange={() => handleToggle("requestUpdates")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notif-setting-row">
            <div className="notif-setting-info">
              <h4>Deadline Approaching Alerts</h4>
              <p>Notify when tasks or requests are approaching deadline</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.deadlineAlerts ?? true}
                onChange={() => handleToggle("deadlineAlerts")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="notif-setting-row">
            <div className="notif-setting-info">
              <h4>Notification Sound</h4>
              <p>Play a subtle sound when a new notification arrives</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={localSettings.soundEnabled ?? false}
                onChange={() => handleToggle("soundEnabled")}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="notif-modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
