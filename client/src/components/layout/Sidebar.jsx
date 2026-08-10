import React, { useEffect, useState } from "react";
import { getProfileImageUrl } from "../../utils/profileImage";
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
import { getProfile } from "../../features/auth/services/auth.service";
import "../../styles/Sidebar.css";

export default function Sidebar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Get the latest profile directly from backend
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await getProfile();

        const profileData = response?.data;

        if (profileData) {
          setUser(profileData);

          // Keep localStorage synchronized as a cache only
          localStorage.setItem(
            "user",
            JSON.stringify(profileData)
          );
        }
      } catch (error) {
        console.error("Failed to load sidebar profile:", error);
      }
    };

    loadProfile();
  }, [location.pathname]);

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
      (
        currentPath === "/mytasks" ||
        currentPath === "/tasks" ||
        currentPath.startsWith("/tasks/")
      )
    ) {
      return true;
    }

    if (
      path === "/addtasks" &&
      (
        currentPath === "/addtasks" ||
        currentPath === "/add-task"
      )
    ) {
      return true;
    }

    return currentPath === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setShowProfileMenu(false);

    navigate("/login");
  };

  return (
    <>
      <aside className="sidebar feed-sidebar">

        {/* Logo */}
        <button
          type="button"
          className="sidebar-logo-header"
          onClick={() => navigate("/dashboard")}
        >
          <h2 className="brand-title">
            Hire-a-Helper
          </h2>
        </button>

        {/* Navigation */}
        <nav className="menu sidebar-nav">
          {menuItems.map(({ label, path, Icon }) => (
            <button
              type="button"
              key={label}
              className={`menu-item nav-item ${
                isItemActive(path) ? "active" : ""
              }`}
              onClick={() => navigate(path)}
            >
              <span className="icon">
                <Icon size={18} />
              </span>

              <span className="nav-label">
                {label}
              </span>
            </button>
          ))}
        </nav>

        {/* Profile */}
        <div
          className="profile sidebar-profile"
          onClick={() =>
            setShowProfileMenu((previous) => !previous)
          }
        >
          <div className="profile-left">

            {user?.profilePicture ? (
              <img
  src={getProfileImageUrl(user.profilePicture)}
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
                  ? `${user.firstName || ""} ${
                      user.lastName || ""
                    }`.trim() || "User"
                  : "User"}
              </h4>

              <p className="profile-email">
                {user?.email || ""}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            className="logout-btn"
            aria-label="Logout"
            title="Logout"
            onClick={(e) => {
              e.stopPropagation();
              handleLogout();
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Profile Popup */}
      {showProfileMenu && (
        <ProfileMenu
          user={user}
          onClose={() => setShowProfileMenu(false)}
        />
      )}
    </>
  );
}