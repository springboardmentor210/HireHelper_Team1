import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useTasks } from "../../../context/TaskContext";

import {
  Bell,
  Search,
  Home,
  ClipboardList,
  Inbox,
  Plus,
  Settings,
  LogOut,
  MapPin,
  Clock,
} from "lucide-react";

import "../styles/Feed.css";

function Feed() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { feedTasks, requestTask } = useTasks();

  const filteredTasks = feedTasks.filter((task) => {
    const searchValue = search.toLowerCase();

    return (
      task.title.toLowerCase().includes(searchValue) ||
      task.category.toLowerCase().includes(searchValue) ||
      task.location.toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="feed-layout">
      <aside className="feed-sidebar">
        <div>
          <div className="brand">
            <div className="brand-logo" style={{ width: 32, height: 32, backgroundColor: '#0056b3', borderRadius: '50%' }}></div>
            <h2>Hire-a-Helper</h2>
          </div>

          <nav className="sidebar-nav">
            <Link to="/feed" className="nav-item active">
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

            <Link to="/my-requests" className="nav-item">
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
            <h1>Feed</h1>
            <p>Find tasks that need help</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="notification">
              <Bell size={21} />
              <span></span>
            </div>
          </div>
        </header>

        <section className="feed-content">
          <div className="task-grid">
            {filteredTasks.map((task) => (
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
                      onClick={() => requestTask(task)}
                    >
                      Request
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="empty-feed">
              <h3>No tasks found</h3>
              <p>Try searching with another task name.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Feed;
