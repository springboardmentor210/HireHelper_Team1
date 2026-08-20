import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../tasks/components/SearchBar";
import { MapPin, Clock, ChevronDown, Heart } from "lucide-react";
import { getFeedTasks } from "../../../services/taskService";
import {
  createRequest,
  getMyRequests,
} from "../../../services/requestService";
import {
  getSavedTasks,
  saveTask,
  unsaveTask,
} from "../../saved/services/saved.service";

import "../styles/Feed.css";

function Feed() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const [feedTasks, setFeedTasks] = useState([]);

  // Saved task IDs
  const [savedTaskIds, setSavedTaskIds] = useState(new Set());

  // Requested task IDs
  const [requestedTaskIds, setRequestedTaskIds] = useState(new Set());

  const [loading, setLoading] = useState(true);
  const [savingTaskId, setSavingTaskId] = useState(null);
  const [requestingTaskId, setRequestingTaskId] = useState(null);
  const [error, setError] = useState("");

  const [showMoreCategories, setShowMoreCategories] = useState(false);

  const [userLocation, setUserLocation] = useState({
    lat: null,
    lng: null,
  });

  const navigate = useNavigate();

  const categories = [
    { label: "All", value: "all" },
    { label: "Moving", value: "moving", icon: "📦" },
    { label: "Gardening", value: "gardening", icon: "🪴" },
    { label: "Cleaning", value: "cleaning", icon: "🧽" },
    { label: "Painting", value: "painting", icon: "🎨" },
    { label: "Assembly", value: "assembly", icon: "🔨" },
    { label: "Pet Care", value: "pet_care", icon: "🐾" },
  ];

  const moreCategories = [
    { label: "Tech", value: "tech_help", icon: "💻" },
    { label: "Car Care", value: "car_care", icon: "🚗" },
    { label: "Other", value: "other", icon: "📋" },
  ];

  // Get backend origin from environment configuration.
  const getBackendOrigin = () => {
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    try {
      return new URL(apiUrl).origin;
    } catch {
      return window.location.origin;
    }
  };

  // Ask for location only when Distance sorting is selected.
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
        // Location denial should not break the Feed.
        setUserLocation({
          lat: null,
          lng: null,
        });
      }
    );
  };

  // ---------------------------------------------------------
  // LOAD SAVED TASKS
  // ---------------------------------------------------------
  useEffect(() => {
    const loadSavedTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setSavedTaskIds(new Set());
        return;
      }

      try {
        const response = await getSavedTasks();

        const payload = response?.data || response || {};

        const savedTasks =
          payload.savedTasks ||
          payload.tasks ||
          (Array.isArray(payload) ? payload : []);

        const ids = savedTasks
          .map(
            (item) =>
              item?.task?._id ||
              item?.task?.id ||
              item?._id ||
              item?.id
          )
          .filter(Boolean);

        setSavedTaskIds(new Set(ids.map(String)));
      } catch (err) {
        console.error("Failed to load saved tasks:", err);
      }
    };

    loadSavedTasks();
  }, []);

  // ---------------------------------------------------------
  // LOAD EXISTING REQUESTS
  // ---------------------------------------------------------
  useEffect(() => {
    const loadRequestedTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setRequestedTaskIds(new Set());
        return;
      }

      try {
        const response = await getMyRequests();

        /*
         * getMyRequests() returns response.data from axios.
         * The actual requests are inside response.data.requests.
         */
        const requests = response?.data?.requests || [];

        /*
         * Keep the task marked as Requested when the request is:
         * - Pending
         * - Accepted
         * - Completed
         *
         * If it was Cancelled, allow the user to request again.
         */
        const requestedIds = requests
          .filter((request) => {
            const status = String(request?.status || "").toLowerCase();

            return (
              status === "pending" ||
              status === "accepted" ||
              status === "completed"
            );
          })
          .map(
            (request) =>
              request?.task?._id ||
              request?.task?.id ||
              request?.taskId?._id ||
              request?.taskId ||
              request?.task
          )
          .filter(Boolean)
          .map(String);

        setRequestedTaskIds(new Set(requestedIds));
      } catch (err) {
        console.error("Failed to load requested tasks:", err);
      }
    };

    loadRequestedTasks();
  }, []);

  // ---------------------------------------------------------
  // LOAD FEED TASKS
  // ---------------------------------------------------------
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

        if (selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (
          sort === "distance" &&
          userLocation.lat !== null &&
          userLocation.lng !== null
        ) {
          params.lat = userLocation.lat;
          params.lng = userLocation.lng;
        }

        const tasks = await getFeedTasks(params);

        setFeedTasks(Array.isArray(tasks) ? tasks : []);
      } catch (err) {
        console.error("Failed to load feed:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load tasks. Please try again."
        );

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

  // ---------------------------------------------------------
  // SORTING
  // ---------------------------------------------------------
  const handleSortChange = (event) => {
    const value = event.target.value;

    setSort(value);

    if (value === "distance") {
      getUserLocation();
    }
  };

  // ---------------------------------------------------------
  // CATEGORY
  // ---------------------------------------------------------
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setShowMoreCategories(false);
  };

  // ---------------------------------------------------------
  // REQUEST TASK
  // ---------------------------------------------------------
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

    // Login check
    if (!token) {
      alert("Please sign in first to request help on tasks.");
      navigate("/login");
      return;
    }

    // Email verification check
    if (user && user.isVerified === false) {
      alert(
        "Please verify your email address before sending task requests."
      );

      navigate("/verify-otp", {
        state: { email: user.email },
      });

      return;
    }

    const taskId = task.id || task._id;

    if (!taskId) {
      alert("Unable to identify this task.");
      return;
    }

    const id = String(taskId);

    // Prevent duplicate request
    if (requestedTaskIds.has(id)) {
      return;
    }

    try {
      setRequestingTaskId(id);

      await createRequest(
        taskId,
        `I would like to help with "${task.title}".`
      );

      // Immediately change Request → Requested
      setRequestedTaskIds((previous) => {
        const updated = new Set(previous);
        updated.add(id);
        return updated;
      });

      alert(`Request sent for: ${task.title}`);
    } catch (error) {
      console.error("Request failed:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to send request. Please try again."
      );
    } finally {
      setRequestingTaskId(null);
    }
  };

  // ---------------------------------------------------------
  // SAVE / UNSAVE TASK
  // ---------------------------------------------------------
  const handleSaveToggle = async (task) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please sign in first to save tasks.");
      navigate("/login");
      return;
    }

    const taskId = task.id || task._id;

    if (!taskId) {
      alert("Unable to identify this task.");
      return;
    }

    const id = String(taskId);
    const alreadySaved = savedTaskIds.has(id);

    try {
      setSavingTaskId(id);

      if (alreadySaved) {
        await unsaveTask(taskId);

        setSavedTaskIds((previous) => {
          const updated = new Set(previous);
          updated.delete(id);
          return updated;
        });
      } else {
        await saveTask(taskId);

        setSavedTaskIds((previous) => {
          const updated = new Set(previous);
          updated.add(id);
          return updated;
        });
      }
    } catch (error) {
      console.error("Failed to update saved task:", error);

      alert(
        error.response?.data?.message ||
          "Unable to update saved task. Please try again."
      );
    } finally {
      setSavingTaskId(null);
    }
  };

  // ---------------------------------------------------------
  // FRONTEND FILTER
  // ---------------------------------------------------------
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

    const taskCategory = (task.category || "")
      .toLowerCase()
      .replace(/\s+/g, "_");

    const categoryMap = {
      tech: "tech_help",
      pet_care: "pet_care",
      car_care: "car_care",
    };

    const normalizedCategory =
      categoryMap[taskCategory] || taskCategory;

    const matchesCategory =
      selectedCategory === "all" ||
      normalizedCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
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
            onNotificationClick={() =>
              navigate("/notifications")
            }
          />
        </header>

        {/* Categories */}
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
              {category.icon && (
                <span className="category-btn-icon">
                  {category.icon}
                </span>
              )}
              {category.label}
            </button>
          ))}

          {/* More dropdown */}
          <div className="more-category-wrapper">
            <button
              type="button"
              className="category-btn more-category-btn"
              onClick={() =>
                setShowMoreCategories(
                  (previous) => !previous
                )
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

        {/* Filters */}
        <div className="filter-bar">
          <select
            value={
              sort === "newest" || sort === "oldest"
                ? sort
                : "newest"
            }
            onChange={(event) =>
              setSort(event.target.value)
            }
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

            <option value="distance">
              Distance
            </option>
          </select>

          <select
            value={
              sort === "price_low" ||
              sort === "price_high"
                ? sort
                : "price_low"
            }
            onChange={(event) =>
              setSort(event.target.value)
            }
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

              setUserLocation({
                lat: null,
                lng: null,
              });
            }}
          >
            Reset
          </button>
        </div>

        <section className="feed-content">
          {/* Loading */}
          {loading && (
            <div className="empty-feed">
              <h3>Loading tasks...</h3>

              <p>
                Please wait while available tasks are loading.
              </p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="empty-feed">
              <h3>{error}</h3>

              <p>
                Please check the server connection and try again.
              </p>
            </div>
          )}

          {/* Feed */}
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
                        : `${getBackendOrigin()}${
                            imagePath.startsWith("/")
                              ? ""
                              : "/"
                          }${imagePath}`
                      : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80";

                    const taskId = String(
                      task.id || task._id
                    );

                    const isSaved =
                      savedTaskIds.has(taskId);

                    const isSaving =
                      savingTaskId === taskId;

                    const isRequesting =
                      requestingTaskId === taskId;

                    const isRequested =
                      requestedTaskIds.has(taskId);

                    return (
                      <article
                        className="task-card"
                        key={taskId}
                      >
                        {/* Image + Heart */}
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

                          <button
                            type="button"
                            className={`save-heart-btn ${
                              isSaved ? "saved" : ""
                            }`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleSaveToggle(task);
                            }}
                            disabled={isSaving}
                            aria-label={
                              isSaved
                                ? "Unsave task"
                                : "Save task"
                            }
                            title={
                              isSaved
                                ? "Unsave task"
                                : "Save task"
                            }
                          >
                            <Heart
                              size={21}
                              fill={
                                isSaved
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        </div>

                        <div className="task-body">
                          {/* Category and Date Header Row */}
                          <div className="task-category-row">
                            <span
                              className={`category-badge ${
                                task.category
                                  ? task.category
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )
                                  : ""
                              }`}
                            >
                              {task.category || "General"}
                            </span>

                            <span className="task-card-date">
                              {task.date ||
                                task.startDate ||
                                (task.createdAt
                                  ? new Date(
                                      task.createdAt
                                    ).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                      }
                                    )
                                  : "")}
                            </span>
                          </div>

                          <h3>
                            {task.title || "Untitled Task"}
                          </h3>

                          <p className="task-description">
                            {task.description ||
                              "No description available."}
                          </p>

                          {/* Location */}
                          <div className="task-detail">
                            <MapPin size={14} />

                            <span>
                              {task.location ||
                                "Location not specified"}
                            </span>
                          </div>

                          {/* Date + time */}
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

                          {/* Footer */}
                          <div className="task-footer">
                            <div className="task-user">
                              <div className="user-avatar">
                                {userName.charAt(0).toUpperCase()}
                              </div>

                              <span>{userName}</span>
                            </div>

                            <span className="task-card-price">
                              {typeof task.price === "number"
                                ? `₹${task.price}`
                                : typeof task.budget === "number"
                                ? `₹${task.budget}`
                                : typeof task.price === "string" &&
                                  task.price.startsWith("₹")
                                ? task.price
                                : `₹${task.price ?? task.budget ?? 500}`}
                            </span>

                            <button
                              type="button"
                              className={`request-button ${
                                isRequested
                                  ? "requested"
                                  : ""
                              }`}
                              disabled={
                                isRequesting ||
                                isRequested
                              }
                              onClick={() =>
                                handleRequest(task)
                              }
                            >
                              {isRequested
                                ? "Requested"
                                : isRequesting
                                ? "Sending..."
                                : "Request Help"}
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