import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  UserCheck,
  RotateCcw,
  Bookmark,
  Plus,
  Settings,
  LogOut
} from "lucide-react";
import "../../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  const user = getStoredUser();

  const isItemActive = (path) => {
    if (path === "/mytasks" && (currentPath === "/mytasks" || currentPath === "/tasks" || currentPath.startsWith("/tasks/"))) {
      return true;
    }
    if (path === "/addtasks" && (currentPath === "/addtasks" || currentPath === "/add-task")) {
      return true;
    }
    return currentPath === path;
  };

  const menuItems = [
    { label: "Feed", path: "/feed", Icon: Home },
    { label: "My Tasks", path: "/mytasks", Icon: ClipboardList },
    { label: "Requests", path: "/requests", Icon: UserCheck },
    { label: "My Requests", path: "/myrequests", Icon: RotateCcw },
    { label: "Saved", path: "/saved", Icon: Bookmark },
    { label: "Add Task", path: "/addtasks", Icon: Plus },
    { label: "Settings", path: "/settings", Icon: Settings },
  ];

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <aside className="sidebar feed-sidebar">
      {/* Brand Header */}
      <button
        type="button"
        className="sidebar-logo-header"
        onClick={() => navigate("/dashboard")}
        aria-label="Go to dashboard"
      >
        <h2 className="brand-title">Hire-a-Helper</h2>
      </button>

      {/* Navigation Menu */}
      <nav className="menu sidebar-nav">
        {menuItems.map(({ label, path, Icon }) => {
          const active = isItemActive(path);

          return (
            <button
              type="button"
              className={`menu-item nav-item ${active ? "active" : ""}`}
              key={label}
              onClick={() => handleNavigation(path)}
            >
              <span className="icon">
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className="nav-label">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logged-in User Profile */}
      <div className="profile sidebar-profile">
        <div className="profile-left">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.firstName || "User"} profile`}
              className="profile-avatar"
            />
          ) : (
            <div className="sidebar-profile-avatar-fallback">
              <span role="img" aria-label="user avatar">👶</span>
            </div>
          )}

          <div className="profile-info">
            <h4 className="profile-name">
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Jon Doe"
                : "Jon Doe"}
            </h4>
            <p className="profile-email">{user?.email || "test@gmail.com"}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          type="button"
          className="logout-btn"
          aria-label="Logout"
          title="Logout"
          onClick={() => navigate("/login")}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}

