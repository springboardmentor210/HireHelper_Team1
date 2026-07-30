import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
import movingImage from "../../../assets/images/moving.png";
import paintingImage from "../../../assets/images/painting.png";
import packingImage from "../../../assets/images/packing.png";
import plumbingImage from "../../../assets/images/plumbing.png";
import deliveryImage from "../../../assets/images/delivery.png";
import gardeningImage from "../../../assets/images/gardening.png";
import garageCleaningImage from "../../../assets/images/garagecleaning.png";
import gardenCleaningImage from "../../../assets/images/gardencleaning.png";


const tasks = [
  {
    id: 1,
    category: "Moving",
    title: "Help Moving Furniture",
    description:
      "Need help moving furniture from my apartment to a new house. Heavy lifting required.",
    location: "Downtown Seattle, WA",
    date: "Jul 5, 2026",
    time: "2:00 PM - 6:00 PM",
    user: "Robert Wilson",
    image: movingImage,
  },
  {
    id: 2,
    category: "Painting",
    title: "Room Painting Project",
    description:
      "Need help painting two bedrooms. Paint and supplies provided. Looking for someone with painting experience.",
    location: "Downtown Seattle, WA",
    date: "Jul 5, 2026",
    time: "2:00 PM - 6:00 PM",
    user: "Robert Wilson",
    image: paintingImage,
  },
  {
    id: 3,
    category: "Packaging",
    title: "Help Packing Household Items",
    description:
      "Looking for someone to help pack household items safely before moving to a new apartment.",
    location: "Seattle, WA",
    date: "Jul 5, 2026",
    time: "11:00 AM - 3:00 PM",
    user: "Robert Wilson",
    image: packingImage,
  },
  {
    id: 4,
    category: "Plumbing",
    title: "Kitchen Plumbing Assistance",
    description:
      "Need help checking a leaking kitchen sink and replacing a damaged pipe connection.",
    location: "Downtown Seattle, WA",
    date: "Jul 6, 2026",
    time: "2:00 PM - 5:00 PM",
    user: "David Miller",
    image: plumbingImage,
  },
  {
    id: 5,
    category: "Painting",
    title: "Living Room Painting",
    description:
      "Looking for someone with basic painting experience to help repaint my living room.",
    location: "Bellevue, WA",
    date: "Jul 6, 2026",
    time: "10:00 AM - 2:00 PM",
    user: "Sophia Brown",
    image: paintingImage,
  },
  {
    id: 6,
    category: "Cleaning",
    title: "Garden Cleanup",
    description:
      "Looking for someone to help clean up my backyard garden. Weeding, pruning and general cleanup.",
    location: "Bellevue, WA",
    date: "Jul 5, 2026",
    time: "9:00 AM - 1:00 PM",
    user: "Robert Wilson",
    image: gardenCleaningImage,
  },
  {
    id: 7,
    category: "Delivery",
    title: "Help With Grocery Delivery",
    description:
      "Need someone to pick up groceries from a nearby store and deliver them to my home.",
    location: "Seattle, WA",
    date: "Jul 6, 2026",
    time: "10:00 AM - 12:00 PM",
    user: "Emily Davis",
    image: deliveryImage,
  },
  {
    id: 8,
    category: "Gardening",
    title: "Backyard Gardening Help",
    description:
      "Looking for someone to help plant flowers and organize the backyard garden.",
    location: "Bellevue, WA",
    date: "Jul 7, 2026",
    time: "8:00 AM - 11:00 AM",
    user: "Michael Brown",
    image: gardeningImage,
  },
  {
    id: 9,
    category: "Cleaning",
    title: "Garage Cleaning Help",
    description:
      "Need help cleaning and organizing my garage. Basic cleaning tools will be provided.",
    location: "Redmond, WA",
    date: "Jul 8, 2026",
    time: "3:00 PM - 6:00 PM",
    user: "Sarah Miller",
    image: garageCleaningImage,
  },
];

function Feed() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

const categories = [
  "All",
  "Moving",
  "Gardening",
  "Cleaning",
  "Painting",
  "Assembly",
  "Pet Care",
];
  const navigate = useNavigate();

const filteredTasks = tasks.filter((task) => {
  const searchValue = search.toLowerCase();

  const matchesSearch =
    task.title.toLowerCase().includes(searchValue) ||
    task.category.toLowerCase().includes(searchValue) ||
    task.location.toLowerCase().includes(searchValue);

  const matchesCategory =
    selectedCategory === "All" ||
    task.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="feed-layout">
      <aside className="feed-sidebar">
          <div className="brand">
  <h2>Hire-a-Helper</h2>
</div>

          <<nav className="sidebar-nav">
  <button className="nav-item active" type="button">
    <Home size={20} />
    Feed
  </button>

  <button className="nav-item" type="button">
    <ClipboardList size={20} />
    My Tasks
  </button>

  <button className="nav-item" type="button">
    <Inbox size={20} />
    Requests
  </button>

  <button className="nav-item" type="button">
    <Inbox size={20} />
    My Requests
  </button>

  <button className="nav-item" type="button">
    <Plus size={20} />
    Add Task
  </button>

  <button
    className="nav-item"
    type="button"
    onClick={() => navigate("/settings")}
  >
    <Settings size={20} />
    Settings
  </button>
</nav>

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

        <div className="category-bar">
  {categories.map((category) => (
    <button
      key={category}
      className={
        selectedCategory === category
          ? "category-btn active-category"
          : "category-btn"
      }
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}

  <button className="category-btn">More ▼</button>
</div>

<div className="filter-bar">
  <select>
    <option>Sort</option>
  </select>

  <select>
    <option>Distance</option>
  </select>

  <select>
    <option>Price</option>
  </select>

  <button className="filter-btn">
    Filter
  </button>
</div>

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