import React, { useEffect, useRef } from "react";
import { getProfileImageUrl } from "../../utils/profileImage";
import { useNavigate } from "react-router-dom";
import {
  User,
  Pencil,
  Lock,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react";
import defaultAvatar from "../../assets/settings-image/Group 47.png";
import "../../styles/ProfileMenu.css";

export default function ProfileMenu({ user, onClose }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "John Doe";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    onClose?.();
    navigate("/login");
  };

  return (
    <div
      className="profile-menu-popover"
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="profile-menu-header">
        <img
          src={
            user?.profilePicture && typeof user.profilePicture === "string" && user.profilePicture.trim() !== ""
              ? getProfileImageUrl(user.profilePicture)
              : defaultAvatar
          }
          alt={`${fullName || "User"} profile`}
          className="profile-menu-avatar"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />

        <div className="profile-menu-user">
          <h4>{fullName || "John Doe"}</h4>
          <p>{user?.email || "test@gmail.com"}</p>

          <div className="verified-badge">
            <Check size={11} strokeWidth={3} />
            <span>Verified</span>
          </div>
        </div>
      </div>

      <div className="profile-menu-divider" />

      {/* View Profile */}
      <button
        type="button"
        className="profile-menu-item"
        onClick={() => handleNavigate("/settings")}
      >
        <div className="menu-left">
          <User size={16} />
          <span>View Profile</span>
        </div>
        <ChevronRight size={15} className="item-chevron" />
      </button>

      {/* Edit Profile */}
      <button
        type="button"
        className="profile-menu-item"
        onClick={() => handleNavigate("/settings")}
      >
        <div className="menu-left">
          <Pencil size={16} />
          <span>Edit Profile</span>
        </div>
        <ChevronRight size={15} className="item-chevron" />
      </button>

      {/* Change Password */}
      <button
        type="button"
        className="profile-menu-item"
        onClick={() => handleNavigate("/settings")}
      >
        <div className="menu-left">
          <Lock size={16} />
          <span>Change Password</span>
        </div>
        <ChevronRight size={15} className="item-chevron" />
      </button>

      <div className="profile-menu-divider" />

      {/* Sign Out */}
      <button
        type="button"
        className="profile-menu-item logout"
        onClick={handleSignOut}
      >
        <div className="menu-left">
          <LogOut size={16} />
          <span>Sign Out</span>
        </div>
      </button>
    </div>
  );
}