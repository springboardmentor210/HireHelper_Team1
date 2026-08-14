import { useState, useEffect } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../tasks/components/SearchBar";
import { getSavedTasks, unsaveTask } from "../services/saved.service";
import { FiHeart } from "react-icons/fi";
import "../styles/Saved.css";


// Build the correct image URL regardless of how the backend returns it.
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // Already a complete URL
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }

  const baseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

  // Remove trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

  // Backend image paths normally look like /uploads/...
  if (imagePath.startsWith("/uploads/")) {
    // Remove /api from the API base URL
    const serverUrl = cleanBaseUrl.replace(/\/api\/?$/, "");

    return `${serverUrl}${imagePath}`;
  }

  // Handle paths beginning with /api/
  if (imagePath.startsWith("/api/")) {
    const serverUrl = cleanBaseUrl.replace(/\/api\/?$/, "");

    return `${serverUrl}${imagePath}`;
  }

  // Handle normal relative paths
  return `${cleanBaseUrl}/${imagePath.replace(/^\/+/, "")}`;
};


export default function Saved() {
  const [savedTasks, setSavedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);


  const loadSavedTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSavedTasks();

      console.log("Saved tasks response:", response);

      const tasks =
        response?.data?.savedTasks ||
        response?.savedTasks ||
        [];

      setSavedTasks(Array.isArray(tasks) ? tasks : []);
    } catch (err) {
      console.error("Failed to load saved tasks:", err);
      setError("Failed to load saved tasks. Please try again.");
      setSavedTasks([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadSavedTasks();
  }, []);


  const handleUnsave = async (taskId) => {
    if (!taskId || removingId) return;

    setRemovingId(taskId);

    try {
      await unsaveTask(taskId);

      setSavedTasks((prev) =>
        prev.filter((saved) => {
          const savedTaskId =
            saved?.task?._id ||
            saved?.task?.id;

          return savedTaskId !== taskId;
        })
      );
    } catch (err) {
      console.error("Failed to unsave task:", err);
      setError("Failed to remove the task from saved.");
    } finally {
      setRemovingId(null);
    }
  };


  const filteredTasks = savedTasks.filter((saved) => {
    const task = saved?.task;

    if (!task) return false;

    const keyword = search.trim().toLowerCase();

    if (!keyword) return true;

    const title = String(task.title || "").toLowerCase();
    const category = String(task.category || "").toLowerCase();
    const location = String(task.location || "").toLowerCase();
    const description = String(task.description || "").toLowerCase();

    return (
      title.includes(keyword) ||
      category.includes(keyword) ||
      location.includes(keyword) ||
      description.includes(keyword)
    );
  });


  return (
    <div className="saved-layout">

      <Sidebar />

      <main className="saved-main">

        {/* HEADER */}
        <header className="saved-header">

          <div className="saved-header-left">
            <h1>Saved</h1>
            <p>Tasks and listings you've bookmarked.</p>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
          />

        </header>


        {/* ERROR */}
        {error && (
          <div className="saved-error">
            {error}
          </div>
        )}


        {/* LOADING */}
        {loading ? (

          <div className="saved-loading">
            <p>Loading saved tasks...</p>
          </div>

        ) : filteredTasks.length === 0 ? (

          /* EMPTY STATE */
          <div className="saved-empty-state">

            <div className="saved-empty-icon">
              <FiHeart />
            </div>

            <h3>
              {search
                ? "No saved tasks found"
                : "No saved items yet"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Click the heart icon on any task or listing to save it here."}
            </p>

          </div>

        ) : (

          /* SAVED TASKS */
          <div className="saved-grid">

            {filteredTasks.map((saved) => {

              const task = saved?.task;

              if (!task) return null;

              const taskId =
                task._id ||
                task.id;

              const imagePath =
                Array.isArray(task.images) &&
                task.images.length > 0
                  ? task.images[0]
                  : task.image || "";

              const imageUrl =
                getImageUrl(imagePath);

              const ownerName =
                task.postedBy
                  ? `${task.postedBy.firstName || ""} ${
                      task.postedBy.lastName || ""
                    }`.trim()
                  : "User";

              return (

                <div
                  key={saved._id || taskId}
                  className="saved-card"
                >

                  {/* IMAGE */}
                  <div className="saved-card-image-wrapper">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={task.title || "Saved task"}
                        className="saved-card-image"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";

                          const placeholder =
                            event.currentTarget
                              .nextElementSibling;

                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />

                    ) : null}


                    <div
                      className="saved-card-image-placeholder"
                      style={{
                        display: imageUrl
                          ? "none"
                          : "flex",
                      }}
                    >
                      No image
                    </div>

                  </div>


                  {/* HEART */}
                  <button
                    type="button"
                    className="saved-card-unsave"
                    onClick={() => handleUnsave(taskId)}
                    disabled={removingId === taskId}
                    aria-label="Remove from saved"
                    title="Remove from saved"
                  >
                    <FiHeart className="filled" />
                  </button>


                  {/* CARD BODY */}
                  <div className="saved-card-body">

                    <span className="saved-card-category">
                      {task.category || "General"}
                    </span>


                    <h4>
                      {task.title || "Untitled task"}
                    </h4>


                    {task.location && (
                      <p className="saved-card-location">
                        {task.location}
                      </p>
                    )}


                    {task.description && (
                      <p className="saved-card-description">
                        {task.description}
                      </p>
                    )}


                    <p className="saved-card-owner">
                      {ownerName}
                    </p>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </main>

    </div>
  );
}