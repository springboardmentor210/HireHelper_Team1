import { returningUserData } from "../data/dashboardData";
import "../styles/Dashboard.css";

export default function RecommendedTasks() {
  return (
    <section className="recommended-section">

      <div className="card-header">
        <h2>Recommended Tasks</h2>
      </div>

      <div className="recommended-grid">

        {returningUserData.recommendedTasks.map((task) => (

          <div key={task.id} className="recommended-card">

            <img
              src={task.image}
              alt={task.title}
              className="recommended-image"
            />

            <div className="recommended-body">

              <h3>{task.title}</h3>

              <p className="recommended-location">
                📍 {task.location}
              </p>

              <p className="recommended-date">
                {task.schedule}
              </p>

              <div className="recommended-footer">
                <span>{task.price}</span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}