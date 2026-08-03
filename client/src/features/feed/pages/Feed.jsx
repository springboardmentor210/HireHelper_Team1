import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import { useTasks } from "../../../context/TaskContext";

import {
  Bell,
  Search,
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

const defaultTasks = [
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
  const navigate = useNavigate();

  let contextTasks = null;
  let requestTaskHandler = null;

  try {
    const taskContext = useTasks();
    if (taskContext) {
      contextTasks = taskContext.feedTasks;
      requestTaskHandler = taskContext.requestTask;
    }
  } catch {
    // TaskContext unavailable in some route contexts
  }

  const taskList = contextTasks && contextTasks.length > 0 ? contextTasks : defaultTasks;

  const categories = [
    "All",
    "Moving",
    "Gardening",
    "Cleaning",
    "Painting",
    "Assembly",
    "Pet Care",
  ];

  const filteredTasks = taskList.filter((task) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      (task.title && task.title.toLowerCase().includes(searchValue)) ||
      (task.category && task.category.toLowerCase().includes(searchValue)) ||
      (task.location && task.location.toLowerCase().includes(searchValue));

    const matchesCategory =
      selectedCategory === "All" ||
      (task.category && task.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleRequest = (task) => {
    if (requestTaskHandler) {
      requestTaskHandler(task);
    } else {
      alert(`Request sent for: ${task.title}`);
    }
  };

  return (
    <div className="feed-layout">
      <Sidebar />

      <main className="feed-main">
        <header className="feed-header">
          <div>
            <h1>Feed</h1>
            <p>Find tasks that need help</p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={29} style={{ width: '29px', height: '29px', minWidth: '29px', minHeight: '29px' }} />
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
              <article className="task-card" key={task.id || task._id}>
                <div className="task-image-container">
                  <img
                    className="task-image"
                    src={task.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"}
                    alt={task.title}
                  />
                </div>

                <div className="task-body">
                  <span
                    className={`category-badge ${task.category ? task.category.toLowerCase() : ""}`}
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
                      {task.date || task.startDate} • {task.time || task.startTime}
                    </span>
                  </div>

                  <div className="task-footer">
                    <div className="task-user">
                      <div className="user-avatar"></div>
                      <span>{task.user || (task.postedBy ? `${task.postedBy.firstName || ''} ${task.postedBy.lastName || ''}` : "User")}</span>
                    </div>

                    <button
                      type="button"
                      className="request-button"
                      onClick={() => handleRequest(task)}
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

