import { useNavigate } from "react-router-dom";

import {
  FaHome,
  FaTasks,
  FaClipboardList,
  FaPaperPlane,
  FaPlus,
  FaCog,
} from "react-icons/fa";

import "../../styles/Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();

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
    {
      icon: <FaHome />,
      label: "Feed",
      path: null,
    },
    {
      icon: <FaTasks />,
      label: "My Tasks",
      path: null,
    },
    {
      icon: <FaClipboardList />,
      label: "Requests",
      path: null,
    },
    {
      icon: <FaPaperPlane />,
      label: "My Requests",
      path: null,
    },
    {
      icon: <FaPlus />,
      label: "Add Task",
      path: "/addtasks",
    },
    {
      icon: <FaCog />,
      label: "Settings",
      path: "/settings",
    },
  ];

  const handleNavigation = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <button
        type="button"
        className="sidebar-logo"
        onClick={() => navigate("/dashboard")}
        aria-label="Go to dashboard"
      >
        <img
          src="/logo.png"
          alt="HireHelper"
        />
      </button>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item) => (
          <button
            type="button"
            className={`menu-item ${
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
              {item.icon}
            </span>

            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logged-in User */}
      <div className="profile">
        {user?.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={`${user.firstName || "User"} profile`}
          />
        ) : (
          <div className="sidebar-profile-initial">
            {user?.firstName
              ?.charAt(0)
              ?.toUpperCase() || "U"}
          </div>
        )}

        <div>
          <h4>
            {user
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "User"}
          </h4>

          <p>{user?.email || ""}</p>
        </div>
      </div>
    </aside>
  );
}