import "../styles/Dashboard.css";

export default function RecommendedTasks({ tasks = [] }) {
  const formatSchedule = (task) => {
    if (!task.startDate) return "";

    const date = new Date(task.startDate).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );

    if (task.endTime) {
      return `${date} • ${task.startTime} - ${task.endTime}`;
    }

    return `${date} • ${task.startTime}`;
  };

  return (
    <section className="recommended-section">
      <div className="card-header">
        <h2>Recommended Tasks</h2>
      </div>

      {tasks.length === 0 ? (
        <div className="dashboard-card">
          <p className="empty-dashboard-message">
            No recommended tasks available right now
          </p>
        </div>
      ) : (
        <div className="recommended-grid">
          {tasks.map((task) => (
            <div key={task._id} className="recommended-card">
              <img
                src={`http://localhost:5000${task.image}`}
                alt={task.title}
                className="recommended-image"
              />

              <div className="recommended-body">
                <h3>{task.title}</h3>

                <p className="recommended-location">
                  📍 {task.location}
                </p>

                <p className="recommended-date">
                  {formatSchedule(task)}
                </p>

                <div className="recommended-footer">
                  <span>{task.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}