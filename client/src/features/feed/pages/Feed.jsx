import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import { useTasks } from "../../../context/TaskContext";
import SearchBar from "../../tasks/components/SearchBar";
import { MapPin, Clock, ChevronDown } from "lucide-react";
import { getFeedTasks } from "../../../services/taskService";

import "../styles/Feed.css";

function Feed() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const [feedTasks, setFeedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
  });

  const navigate = useNavigate();

  let requestTaskHandler = null;

  try {
    const taskContext = useTasks();

    if (taskContext) {
      requestTaskHandler = taskContext.requestTask;
    }
  } catch {
    // Feed can still work even when TaskContext is not available.
  }

  const categories = [
    { label: "All", value: "all" },
    { label: "Moving", value: "moving" },
    { label: "Gardening", value: "gardening" },
    { label: "Cleaning", value: "cleaning" },
    { label: "Painting", value: "painting" },
    { label: "Assembly", value: "assembly" },
    { label: "Pet Care", value: "pet_care" },
  ];

  const moreCategories = [
    { label: "Tech", value: "tech_help" },
    { label: "Car Care", value: "car_care" },
    { label: "Other", value: "other" },
  ];

  // Ask for location only when the user chooses distance sorting.
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Location services are not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Distance sorting will simply fall back to normal sorting.
        setUserLocation({
          lat: null,
          lng: null,
        });
      }
    );
  };

  // Load the feed whenever search, category or sorting changes.
  useEffect(() => {
    const loadFeed = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
  search: search.trim(),
  sort,
  page: 1,
  limit: 12,
};

if (selectedCategory !== "All") {
  params.category = selectedCategory;
}

        // Send coordinates only when distance sorting is selected.
        if (
          sort === "distance" &&
          userLocation.lat !== null &&
          userLocation.lng !== null
        ) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        const tasks = await getFeedTasks(params);

        setFeedTasks(tasks);
      } catch (err) {
        console.error("Failed to load feed:", err);

        setError("Unable to load tasks. Please try again.");
        setFeedTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [
    selectedCategory,
    search,
    sort,
    userLocation.lat,
    userLocation.lng,
  ]);

  const handleSortChange = (event) => {
    const value = event.target.value;

    setSort(value);

    if (value === "distance") {
      getUserLocation();
    }
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setShowMoreCategories(false);
  };

  // Keep a small frontend filter as an extra safety check.
  const filteredTasks = feedTasks.filter((task) => {
    const searchValue = search.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      (task.title &&
        task.title.toLowerCase().includes(searchValue)) ||
      (task.description &&
        task.description.toLowerCase().includes(searchValue)) ||
      (task.category &&
        task.category.toLowerCase().includes(searchValue)) ||
      (task.location &&
        task.location.toLowerCase().includes(searchValue));

    const matchesCategory =
      selectedCategory === "all" ||
      (task.category &&
        task.category.toLowerCase().replace(/\s+/g, "_") ===
          selectedCategory);

    return matchesSearch && matchesCategory;
  });


const handleRequest = async (task) => {
  const token = localStorage.getItem("token");
  let user = null;

  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error("Failed to parse user:", err);
  }

  if (!token) {
    alert("Please sign in first to request help on tasks.");
    navigate("/login");
    return;
  }

  if (user && user.isVerified === false) {
    alert(
      "Please verify your email address before sending task requests."
    );

    navigate("/verify-otp", {
      state: { email: user.email },
    });

    return;
  }

  if (!requestTaskHandler) {
    alert("Request service is unavailable. Please try again.");
    return;
  }

  try {
    await requestTaskHandler(task);

    alert(`Request sent for: ${task.title}`);
  } catch (error) {
    console.error("Request failed:", error);

    alert(
      error.response?.data?.message ||
        error.message ||
        "Failed to send request. Please try again."
    );
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

          <SearchBar
            value={search}
            onChange={setSearch}
            onNotificationClick={() => navigate("/notifications")}
          />
        </header>

        {/* Main categories and the extra category menu. */}
        <div className="category-bar">
          {categories.map((category) => (
            <button
              key={category.value}
              type="button"
              className={
                selectedCategory === category.value
                  ? "category-btn active-category"
                  : "category-btn"
              }
              onClick={() =>
                handleCategoryChange(category.value)
              }
            >
              {category.label}
            </button>
          ))}

          <div className="more-category-wrapper">
            <button
              type="button"
              className="category-btn more-category-btn"
              onClick={() =>
                setShowMoreCategories((previous) => !previous)
              }
              aria-expanded={showMoreCategories}
            >
              More
              <ChevronDown
                size={15}
                className={
                  showMoreCategories
                    ? "more-chevron open"
                    : "more-chevron"
                }
              />
            </button>

            {showMoreCategories && (
              <div className="more-category-menu">
                {moreCategories.map((category) => (
                  <button
                    key={category.value}
                    type="button"
                    className={
                      selectedCategory === category.value
                        ? "more-category-item selected"
                        : "more-category-item"
                    }
                    onClick={() =>
                      handleCategoryChange(category.value)
                    }
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sorting controls. */}
        <div className="filter-bar">
          <select
            value={
              sort === "newest" || sort === "oldest"
                ? sort
                : "newest"
            }
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort tasks by date"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            value={sort === "distance" ? "distance" : ""}
            onChange={handleSortChange}
            aria-label="Sort tasks by distance"
          >
            <option value="" disabled>
              Distance
            </option>
            <option value="distance">Distance</option>
          </select>

          <select
            value={
              sort === "price_low" || sort === "price_high"
                ? sort
                : "price_low"
            }
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort tasks by price"
          >
            <option value="price_low">
              Price: Low to High
            </option>

            <option value="price_high">
              Price: High to Low
            </option>
          </select>

          <button
            type="button"
            className="filter-btn"
            onClick={() => {
              setSelectedCategory("all");
              setSearch("");
              setSort("newest");
              setShowMoreCategories(false);
            }}
          >
            Reset
          </button>
        </div>

        <section className="feed-content">
          {loading && (
            <div className="empty-feed">
              <h3>Loading tasks...</h3>
              <p>
                Please wait while available tasks are loading.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="empty-feed">
              <h3>{error}</h3>
              <p>
                Please check the server connection and try again.
              </p>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredTasks.length > 0 ? (
                <div className="task-grid">
                  {filteredTasks.map((task) => {
                    const postedBy = task.postedBy;

                    const userName =
                      task.user ||
                      (postedBy
                        ? `${postedBy.firstName || ""} ${
                            postedBy.lastName || ""
                          }`.trim()
                        : "User");

                    const imagePath =
                      task.image || task.images?.[0];

                    const taskImage = imagePath
                      ? imagePath.startsWith("http")
                        ? imagePath
                        : `http://localhost:5000${imagePath}`
                      : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80";

                    return (
                      <article
                        className="task-card"
                        key={task.id || task._id}
                      >
                        <div className="task-image-container">
                          <img
                            className="task-image"
                            src={taskImage}
                            alt={task.title || "Task"}
                            onError={(event) => {
                              event.currentTarget.src =
                                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80";
                            }}
                          />
                        </div>

                        <div className="task-body">
                          <span
                            className={`category-badge ${
                              task.category
                                ? task.category
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")
                                : ""
                            }`}
                          >
                            {task.category || "General"}
                          </span>

                          <h3>
                            {task.title || "Untitled Task"}
                          </h3>

                          <p className="task-description">
                            {task.description ||
                              "No description available."}
                          </p>

                          <div className="task-detail">
                            <MapPin size={14} />

                            <span>
                              {task.location ||
                                "Location not specified"}
                            </span>
                          </div>

                          <div className="task-detail">
                            <Clock size={14} />

                            <span>
                              {task.date ||
                                task.startDate ||
                                ""}

                              {(task.date ||
                                task.startDate) &&
                              (task.time ||
                                task.startTime)
                                ? " • "
                                : ""}

                              {task.time ||
                                task.startTime ||
                                ""}
                            </span>
                          </div>

                          <div className="task-footer">
                            <div className="task-user">
                              <div className="user-avatar"></div>

                              <span>{userName}</span>
                            </div>

                            <button
                              type="button"
                              className="request-button"
                              onClick={() =>
                                handleRequest(task)
                              }
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-feed">
                  <h3>No tasks found</h3>

                  <p>
                    Try searching with another task name or
                    category.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default Feed;
