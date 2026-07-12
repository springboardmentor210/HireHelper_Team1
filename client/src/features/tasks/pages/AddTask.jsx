import { useState } from "react";
import "./AddTask.css";

export default function AddTasks() {
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const addTask = () => {
    if (
      form.title.trim() === "" ||
      form.description.trim() === ""
    )
      return;

    setTasks([
      {
        id: Date.now(),
        ...form,
        completed: false,
      },
      ...tasks,
    ]);

    setForm({
      title: "",
      description: "",
      budget: "",
      location: "",
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  return (
    <div className="hire-wrapper">


      <aside className="sidebar">

        <div className="logo">

          <div className="logo-circle">
            ❤
          </div>

          <div>

            <h2>Hire-a-Helper</h2>

          </div>

        </div>

        <nav>

          <a href="#">🏠 Feed</a>

          <a href="#">📋 My Tasks</a>

          <a href="#">📦 Requests</a>

          <a href="#">📂 My Requests</a>

          <a href="#" className="active">
            ➕ Add Task
          </a>

          <a href="#">⚙ Settings</a>

        </nav>

        <div className="profile">

          <div className="avatar"></div>

          <div>

            <h4>Jon Doe</h4>

            <p>test@gmail.com</p>

          </div>

        </div>

      </aside>


      <main className="main">


        <header className="navbar">

          <div>

            <h1>Add Tasks</h1>

            <span>Create a task and find someone to help you</span>

          </div>

          <div className="nav-right">

            <input
              type="text"
              placeholder="Search tasks..."
            />

            <button className="bell">
              🔔
            </button>

          </div>

        </header>


        <div className="task-form">

          <input
            name="title"
            placeholder="Task Title"
            value={form.title}
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />

          <div className="row">

            <input
              name="budget"
              placeholder="Budget"
              value={form.budget}
              onChange={handleChange}
            />

            <input
              name="location"
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
            />

          </div>

          <button
            className="add-btn"
            onClick={addTask}
          >
            Add Task
          </button>

        </div>

    
        <div className="task-list">

          {tasks.length === 0 ? (

            <div className="empty">

              No tasks created yet.

            </div>

          ) : (

            tasks.map((task) => (

              <div
                key={task.id}
                className={`task-card ${
                  task.completed ? "completed" : ""
                }`}
              >

                <div>

                  <h3>{task.title}</h3>

                  <p>{task.description}</p>

                  <small>
                    💰 {task.budget || "--"}
                  </small>

                  <br />

                  <small>
                    📍 {task.location || "--"}
                  </small>

                </div>

                <div className="actions">

                  <button
                    className="complete"
                    onClick={() =>
                      toggleComplete(task.id)
                    }
                  >
                    {task.completed
                      ? "Undo"
                      : "Complete"}
                  </button>

                  <button
                    className="delete"
                    onClick={() =>
                      deleteTask(task.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </main>

    </div>
  );
}