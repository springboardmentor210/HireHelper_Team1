import {
  FaHome,
  FaTasks,
  FaClipboardList,
  FaPaperPlane,
  FaPlus,
  FaCog,
} from "react-icons/fa";

import "../../styles/Sidebar.css";

const menuItems = [
  { icon: <FaHome />, label: "Feed" },
  { icon: <FaTasks />, label: "My Tasks" },
  { icon: <FaClipboardList />, label: "Requests" },
  { icon: <FaPaperPlane />, label: "My Requests" },
  { icon: <FaPlus />, label: "Add Task" },
  { icon: <FaCog />, label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>HireHelper</h2>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <div className="menu-item" key={item.label}>
            <span className="icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="profile">
        <img
          src="https://i.pravatar.cc/100"
          alt="Profile"
        />
        <div>
          <h4>Dudekula Shameen</h4>
          <p>shameen@gmail.com</p>
        </div>
      </div>
    </aside>
  );
}