import React from "react";
import { getProfileImageUrl } from "../../utils/profileImage";
import { useNavigate } from "react-router-dom";
import {
  User,
  Pencil,
  Lock,
  LogOut,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

export default function ProfileMenu({ user, onClose }) {
  const navigate = useNavigate();

  const fullName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
    : "John Doe";

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
      style={{
        position: "fixed",
        left: "70px",
        bottom: "70px",
        width: "320px",
        height: "350px",
        background: "#fffdfd",
        borderRadius: "20px",
        boxShadow: "0 15px 40px rgba(0,0,0,.12)",
        border: "1px solid #fffdfd",
        overflow: "hidden",
        zIndex: 999999,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          padding: "22px",
          alignItems: "center",
        }}
      >
        {user?.profilePicture ? (
          <img
            src={getProfileImageUrl(user.profilePicture)}
            alt={`${fullName || "User"} profile`}
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <img
            src="https://api.dicebear.com/7.x/adventurer/svg?seed=John"
            alt="Profile"
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
            }}
          />
        )}

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 21,
              color: "#111827",
            }}
          >
            {fullName || "John Doe"}
          </div>

          <div
            style={{
              color: "#6B7280",
              fontSize: 14,
              marginTop: 4,
            }}
          >
            {user?.email || "test@gmail.com"}
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 8,
              color: "#4F46E5",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <BadgeCheck size={15} />
            Verified
          </div>
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: "#ECECEC",
        }}
      />

      {/* View Profile */}
      <button
        type="button"
        style={menuStyle}
        onClick={() => handleNavigate("/settings#profile")}
      >
        <div style={leftStyle}>
          <User size={19} />
          <span>View Profile</span>
        </div>

        <ChevronRight size={18} />
      </button>

      {/* Edit Profile */}
      <button
        type="button"
        style={menuStyle}
        onClick={() => handleNavigate("/settings#personal-info")}
      >
        <div style={leftStyle}>
          <Pencil size={19} />
          <span>Edit Profile</span>
        </div>

        <ChevronRight size={18} />
      </button>

      {/* Change Password */}
      <button
        type="button"
        style={menuStyle}
        onClick={() => handleNavigate("/settings#security")}
      >
        <div style={leftStyle}>
          <Lock size={19} />
          <span>Change Password</span>
        </div>

        <ChevronRight size={18} />
      </button>

      <div
        style={{
          height: 1,
          background: "#ECECEC",
        }}
      />

      {/* Sign Out */}
      <button
        type="button"
        style={{
          ...menuStyle,
          color: "#EF4444",
        }}
        onClick={handleSignOut}
      >
        <div
          style={{
            ...leftStyle,
            color: "#EF4444",
          }}
        >
          <LogOut size={19} />
          <span>Sign Out</span>
        </div>
      </button>
    </div>
  );
}

const menuStyle = {
  width: "100%",
  border: "none",
  background: "#fff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 24px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: 500,
};

const leftStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};