import { returningUserData } from "../data/dashboardData";
import "../styles/Dashboard.css";

import {
  FaBroom,
  FaTruckMoving,
  FaPaintRoller
} from "react-icons/fa";

export default function UpcomingTasks() {

  const getIcon = (type) => {
    switch (type) {
      case "cleaning":
        return <FaBroom />;

      case "moving":
        return <FaTruckMoving />;

      case "painting":
        return <FaPaintRoller />;

      default:
        return <FaBroom />;
    }
  };

  return (
    <section className="dashboard-card">

      <div className="card-header">
        <h2>Upcoming Tasks</h2>
        <span>View all</span>
      </div>

      <div className="timeline">

        {returningUserData.upcomingTasks.map((task) => (

          <div className="timeline-item" key={task.id}>

            <div className="timeline-date">
              <div>{task.day}</div>
              <div>{task.date}</div>
            </div>

            <div className="timeline-center">
              <div className="timeline-dot"></div>
            </div>

            <div className="timeline-icon">
              {getIcon(task.type)}
            </div>

            <div className="timeline-content">
              <h4>{task.title}</h4>
              <p>{task.helper}</p>
            </div>

            <div className="timeline-time">
              {task.time}
            </div>

          </div>

        ))}

      </div>

    </section>
  );
}