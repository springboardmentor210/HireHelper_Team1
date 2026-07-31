import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/Sidebar.css";
import feedIcon from "../../styles/sidebar-icons/feed.png";
import myTaskIcon from "../../styles/sidebar-icons/mytask.png";
import requestIcon from "../../styles/sidebar-icons/request.png";
import myRequestIcon from "../../styles/sidebar-icons/myrequest.png";
import savedIcon from "../../styles/sidebar-icons/saved.png";
import addTaskIcon from "../../styles/sidebar-icons/addtask.png"; 
import settingsIcon from "../../styles/sidebar-icons/settings.png";
import logoutIcon from "../../styles/sidebar-icons/logout.png"; 

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
    {
      label: "Feed",
      path: "/feed", 
      iconSrc: feedIcon, 
    },
    {
      label: "My Tasks",
      path: "/mytasks",
      iconSrc: myTaskIcon, 
    },
    {
      label: "Requests",
      path: "/requests",
      iconSrc: requestIcon, 
    },
    {
      label: "My Requests",
      path: "/myrequests",
      iconSrc: myRequestIcon, 
    },
    {
      label: "Saved",
      path: "/saved",
      iconSrc: savedIcon, 
    },
    {
      label: "Add Task",
      path: "/addtasks",
      iconSrc: addTaskIcon, 
    },
    {
      label: "Settings",
      path: "/settings",
      iconSrc: settingsIcon, 
    },
  ];

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <aside className="sidebar feed-sidebar">
      {/* Logo */}
      <button
        type="button"
        className="sidebar-logo"
        onClick={() => navigate("/dashboard")}
        aria-label="Go to dashboard"
        style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
      >
        <img src="/logo.png" alt="Hire-a-Helper" onError={(e) => { e.target.style.display = 'none'; }} />
        <h2 className="brand-title" style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#111827" }}>Hire-a-Helper</h2>
      </button>

      {/* Menu */}
      <nav className="menu sidebar-nav">
        {menuItems.map((item) => {
          const active = isItemActive(item.path);

          return (
            <button
              type="button"
              className={`menu-item nav-item ${active ? "active" : ""} ${
                !item.path ? "menu-item-disabled" : ""
              }`}
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              disabled={!item.path}
              title={
                !item.path
                  ? `${item.label} is not available yet`
                  : item.label
              }
            >
              <span className="icon">
                <img src={item.iconSrc} alt={`${item.label} icon`} />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logged-in User */}
      <div className="profile sidebar-profile">
        <div className="profile-left">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.firstName || "User"} profile`}
              className="profile-avatar"
            />
          ) : (
            <div className="sidebar-profile-initial profile-avatar">
              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="profile-info">
            <h4 className="profile-name">
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
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
          <img src={logoutIcon} alt="Logout" />
        </button>
      </div>
    </aside>
  );
}

