import { useNavigate } from "react-router-dom";

import {
  FiPlusCircle,
  FiSearch,
  FiUserCheck,
  FiClipboard,
} from "react-icons/fi";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
  {
    title: "Post a Task",
    icon: <FiPlusCircle />,
    path: "/addtasks",
  },
  {
    title: "Browse Feed",
    icon: <FiSearch />,
    path: null,
  },
  {
    title: "Become a Helper",
    icon: <FiUserCheck />,
    path: null,
  },
  {
    title: "My Tasks",
    icon: <FiClipboard />,
    path: null,
  },
];

  const handleAction = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section className="quick-actions">
      <h2 className="section-title">Quick Actions</h2>

      <div className="quick-actions-grid">
        {actions.map((action) => (
          <button
            key={action.title}
            type="button"
            className="quick-action-card"
            onClick={() => handleAction(action.path)}
          >
            <div className="quick-action-icon">
              {action.icon}
            </div>

            <span className="quick-action-title">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}