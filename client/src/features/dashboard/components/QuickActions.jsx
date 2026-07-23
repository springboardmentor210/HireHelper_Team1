import {
  FiPlusCircle,
  FiSearch,
  FiUserCheck,
  FiClipboard,
} from "react-icons/fi";

export default function QuickActions() {
  const actions = [
    {
      title: "Post a Task",
      icon: <FiPlusCircle />,
    },
    {
      title: "Browse Feed",
      icon: <FiSearch />,
    },
    {
      title: "Become a Helper",
      icon: <FiUserCheck />,
    },
    {
      title: "My Tasks",
      icon: <FiClipboard />,
    },
  ];

  return (
    <section className="quick-actions">
      <h2 className="section-title">Quick Actions</h2>

      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="quick-action-card"
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