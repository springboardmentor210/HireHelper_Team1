import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  ClipboardList,
  Inbox,
  Bookmark,
  Plus,
  Settings,
  LogOut,
  FolderKanban,
} from "lucide-react";
import "../../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const isActive = (path) => {
    if (path === "/mytasks" && (currentPath === "/mytasks" || currentPath === "/tasks" || currentPath.startsWith("/tasks/"))) {
      return true;
    }
    if (path === "/addtasks" && (currentPath === "/addtasks" || currentPath === "/add-task")) {
      return true;
    }
    return currentPath === path;
  };

  const navItems = [
    { label: "Feed", path: "/feed", icon: Home },
    { label: "My Tasks", path: "/mytasks", icon: ClipboardList },
    { label: "Requests", path: "/requests", icon: Inbox },
    { label: "My Requests", path: "/myrequests", icon: FolderKanban },
    { label: "Saved", path: "/saved", icon: Bookmark },
    { label: "Add Task", path: "/addtasks", icon: Plus },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="feed-sidebar">
      <div className="sidebar-top">
        <div className="brand" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          <h2 className="brand-title">Hire-a-Helper</h2>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? "active" : ""}`}
              >
                <Icon className="nav-icon" size={20} />
                <span className="nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-profile">
        <div className="profile-left">
          <div className="profile-avatar">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.firstName || "User"}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100"
                alt="Jon Doe"
              />
            )}
          </div>

          <div className="profile-info">
            <h4 className="profile-name">
              {user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() : "Jon Doe"}
            </h4>
            <p className="profile-email">{user?.email || "test@gmail.com"}</p>
          </div>
        </div>

        <button
          type="button"
          className="logout-btn"
          title="Logout"
          onClick={() => navigate("/login")}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
