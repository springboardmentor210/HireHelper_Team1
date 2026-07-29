import "../styles/Dashboard.css";

import {
  FaBroom,
  FaTruckMoving,
  FaPaintRoller,
  FaTools,
} from "react-icons/fa";

export default function UpcomingTasks({ tasks = [] }) {
  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "cleaning":
        return <FaBroom />;

      case "moving":
        return <FaTruckMoving />;

      case "painting":
        return <FaPaintRoller />;

      default:
        return <FaTools />;
    }
  };

  const formatDate = (date) => {
    const taskDate = new Date(date);

    return {
      day: taskDate.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      date: taskDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  };

  return (
    <section className="dashboard-card">
      <div className="card-header">
        <h2>Upcoming Tasks</h2>
        <span>View all</span>
      </div>

      <div className="timeline">
        {tasks.length === 0 ? (
          <p className="empty-dashboard-message">
            No upcoming tasks
          </p>
        ) : (
          tasks.map((task) => {
            const formattedDate = formatDate(task.startDate);

            return (
              <div className="timeline-item" key={task._id}>
                <div className="timeline-date">
                  <div>{formattedDate.day}</div>
                  <div>{formattedDate.date}</div>
                </div>

                <div className="timeline-center">
                  <div className="timeline-dot"></div>
                </div>

                <div className="timeline-icon">
                  {getIcon(task.category)}
                </div>

                <div className="timeline-content">
                  <h4>{task.title}</h4>
                  <p>{task.location}</p>
                </div>

                <div className="timeline-time">
                  {task.startTime}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}