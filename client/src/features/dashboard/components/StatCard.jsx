import {
  FiClipboard,
  FiClock,
  FiCheckSquare,
} from "react-icons/fi";

import { FaWallet } from "react-icons/fa";

export default function StatCard({ title, value }) {

  const getIcon = () => {
    switch (title) {

      case "Active Tasks":
        return <FiClipboard size={28} />;

      case "Pending Requests":
        return <FiClock size={28} />;

      case "Completed Tasks":
        return <FiCheckSquare size={28} />;

      case "Money Saved":
        return <FaWallet size={28} />;

      default:
        return <FiClipboard size={28} />;
    }
  };

  return (
    <div className="stat-card">

      <div className="stat-icon">
        {getIcon()}
      </div>

      <div className="stat-content">
        <h2>{value}</h2>
        <p>{title}</p>
      </div>

    </div>
  );
}