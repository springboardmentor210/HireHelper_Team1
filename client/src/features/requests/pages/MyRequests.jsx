import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTasks } from "../../../context/TaskContext";

import {
  Home,
  ClipboardList,
  Inbox,
  Plus,
  Settings,
  LogOut,
  MapPin,
  Clock,
} from "lucide-react";

import "../../feed/styles/Feed.css";

function MyRequests() {
  const navigate = useNavigate();
  const { myRequests, acceptTask } = useTasks();

  return (
    <div className="feed-layout">
      <aside className="feed-sidebar">
        <div>
          <div className="brand">
            <div className="brand-logo" style={{ width: 32, height: 32, backgroundColor: '#0056b3', borderRadius: '50%' }}></div>
            <h2>Hire-a-Helper</h2>
          </div>

          <nav className="sidebar-nav">
            <Link to="/feed" className="nav-item">
              <Home size={20} />
              Feed
            </Link>

            <Link to="/my-tasks" className="nav-item">
              <ClipboardList size={20} />
              My Tasks
            </Link>

            <Link to="/requests" className="nav-item">
              <Inbox size={20} />
              Requests
            </Link>

            <Link to="/my-requests" className="nav-item active">
              <Inbox size={20} />
              My Requests
            </Link>

            <Link to="/add-task" className="nav-item">
              <Plus size={22} />
              Add Task
            </Link>

            <a className="nav-item">
              <Settings size={20} />
              Settings
            </a>
          </nav>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar"></div>

          <div className="profile-info">
            <span>Jon Doe</span>
            <small>test@gmail.com</small>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={() => navigate("/")}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="feed-main">
        <header className="feed-header">
          <div>
            <h1>My Requests</h1>
            <p>Tasks you have requested to do</p>
          </div>
        </header>

        <section className="feed-content">
          <div className="task-grid">
            {myRequests.map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-image-container">
                  <img
                    className="task-image"
                    src={task.image}
                    alt={task.title}
                  />
                </div>

                <div className="task-body">
                  <span
                    className={`category-badge ${task.category.toLowerCase()}`}
                  >
                    {task.category}
                  </span>

                  <h3>{task.title}</h3>

                  <p className="task-description">
                    {task.description}
                  </p>

                  <div className="task-detail">
                    <MapPin size={14} />
                    <span>{task.location}</span>
                  </div>

                  <div className="task-detail">
                    <Clock size={14} />

                    <span>
                      {task.date} • {task.time}
                    </span>
                  </div>

                  <div className="task-footer">
                    <div className="task-user">
                      <div className="user-avatar"></div>
                      <span>{task.user}</span>
                    </div>

                    <button
                      type="button"
                      className="request-button"
                      style={{ backgroundColor: '#28a745' }}
                      onClick={() => acceptTask(task.id)}
                    >
                      Mock Provider Accept
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {myRequests.length === 0 && (
            <div className="empty-feed">
              <h3>No requests found</h3>
              <p>Go to the Feed to request tasks.</p>
              <Link to="/feed" style={{ marginTop: '1rem', display: 'inline-block', color: 'blue' }}>Go to Feed</Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyRequests;
