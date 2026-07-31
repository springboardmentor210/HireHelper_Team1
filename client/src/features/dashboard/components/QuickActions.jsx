import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Search,
  UserCheck,
  Clipboard,
} from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Post a Task",
      icon: <PlusCircle size={20} />,
      path: "/addtasks",
    },
    {
      title: "Browse Feed",
      icon: <Search size={20} />,
      path: "/feed",
    },
    {
      title: "Become a Helper",
      icon: <UserCheck size={20} />,
      path: null,
    },
    {
      title: "My Tasks",
      icon: <Clipboard size={20} />,
      path: "/mytasks",
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
