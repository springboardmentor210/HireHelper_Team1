import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ClipboardList,
  UserCheck,
  RotateCcw,
  Bookmark,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";

import ProfileMenu from "./ProfileMenu";
import "../../styles/Sidebar.css";

export default function Sidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  const menuItems = [
    { label: "Feed", path: "/feed", Icon: Home },
    { label: "My Tasks", path: "/mytasks", Icon: ClipboardList },
    { label: "Requests", path: "/requests", Icon: UserCheck },
    { label: "My Requests", path: "/myrequests", Icon: RotateCcw },
    { label: "Saved", path: "/saved", Icon: Bookmark },
    { label: "Add Task", path: "/addtasks", Icon: Plus },
    { label: "Settings", path: "/settings", Icon: Settings },
  ];

  const isItemActive = (path) => {
    if (
      path === "/mytasks" &&
      (currentPath === "/mytasks" ||
        currentPath === "/tasks" ||
        currentPath.startsWith("/tasks/"))
    )
      return true;

    if (
      path === "/addtasks" &&
      (currentPath === "/addtasks" || currentPath === "/add-task")
    )
      return true;

    return currentPath === path;
  };

  return (
  <>
    <aside className="sidebar feed-sidebar">
      {/* Logo */}
      <button
        className="sidebar-logo-header"
        onClick={() => navigate("/dashboard")}
      >
        <h2 className="brand-title">Hire-a-Helper</h2>
      </button>

      {/* Navigation */}
      <nav className="menu sidebar-nav">
        {menuItems.map(({ label, path, Icon }) => (
          <button
            key={label}
            className={`menu-item nav-item ${
              isItemActive(path) ? "active" : ""
            }`}
            onClick={() => navigate(path)}
          >
            <span className="icon">
              <Icon size={18} />
            </span>

            <span className="nav-label">{label}</span>
          </button>
        ))}
      </nav>

      {/* Profile */}
      <div
        className="profile sidebar-profile"
        onClick={() => setShowProfileMenu((prev) => !prev)}
      >
        <div className="profile-left">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="profile"
              className="profile-avatar"
            />
          ) : (
            <div className="sidebar-profile-avatar-fallback">
              👶
            </div>
          )}

          <div className="profile-info">
            <h4 className="profile-name">
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`
                : "Jon Doe"}
            </h4>

            <p className="profile-email">
              {user?.email || "test@gmail.com"}
            </p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/login");
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>

    {showProfileMenu && (
      <ProfileMenu
        user={user}
        onClose={() => setShowProfileMenu(false)}
      />
    )}
  </>
);
    
}