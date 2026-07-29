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
    <aside className="sidebar">
      {/* Logo */}
      <button
        type="button"
        className="sidebar-logo"
        onClick={() => navigate("/dashboard")}
        aria-label="Go to dashboard"
      >
        <img src="/logo.png" alt="Hire-a-Helper" />
      </button>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              type="button"
              className={`menu-item ${isActive ? "active" : ""} ${
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
      <div className="profile">
        <div className="profile-left">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.firstName || "User"} profile`}
              className="profile-avatar"
            />
          ) : (
            <div className="sidebar-profile-initial">
              {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
            </div>
          )}

          <div className="profile-info">
            <h4>
              {user
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : "Jon Doe"}
            </h4>
            <p>{user?.email || "test@gmail.com"}</p>
          </div>
        </div>

        {/* Logout Button */}
        <button className="logout-btn" aria-label="Logout">
          <img src={logoutIcon} alt="Logout" />
        </button>
      </div>
    </aside>
  );
}