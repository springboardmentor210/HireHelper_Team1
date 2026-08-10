import { useState, useEffect } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../../tasks/components/SearchBar";
import { getSavedTasks, unsaveTask } from "../services/saved.service";
import { FiHeart } from "react-icons/fi";
import "../styles/Saved.css";

export default function Saved() {
  const [savedTasks, setSavedTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSavedTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getSavedTasks();
      setSavedTasks(response.data.savedTasks);
    } catch (err) {
      console.error("Failed to load saved tasks:", err);
      setError("Failed to load saved tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedTasks();
  }, []);

  const handleUnsave = async (taskId) => {
    try {
      await unsaveTask(taskId);
      setSavedTasks((prev) => prev.filter((saved) => saved.task._id !== taskId));
    } catch (err) {
      console.error("Failed to unsave task:", err);
    }
  };

  const filteredTasks = savedTasks.filter((saved) => {
    const keyword = search.toLowerCase();
    return (
      saved.task.title.toLowerCase().includes(keyword) ||
      saved.task.category.toLowerCase().includes(keyword) ||
      saved.task.location.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="saved-layout">
      <Sidebar />

      <main className="saved-main">
        <header className="saved-header">
          <div className="saved-header-left">
            <h1>Saved</h1>
            <p>Tasks and listings you've bookmarked.</p>
          </div>

          <SearchBar value={search} onChange={setSearch} />
        </header>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Loading saved tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="saved-empty-state">
            <div className="saved-empty-icon">
              <FiHeart />
            </div>
            <h3>No saved items yet</h3>
            <p>Click the heart icon on any task or listing to save it here.</p>
          </div>
        ) : (
          <div className="saved-grid">
            {filteredTasks.map((saved) => (
              <div key={saved._id} className="saved-card">
                {saved.task.images && saved.task.images.length > 0 && (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${saved.task.images[0]}`}
                    alt={saved.task.title}
                    className="saved-card-image"
                  />
                )}

                <button
                  type="button"
                  className="saved-card-unsave"
                  onClick={() => handleUnsave(saved.task._id)}
                  aria-label="Remove from saved"
                >
                  <FiHeart className="filled" />
                </button>

                <div className="saved-card-body">
                  <span className="saved-card-category">{saved.task.category}</span>
                  <h4>{saved.task.title}</h4>
                  <p className="saved-card-location">{saved.task.location}</p>
                  {saved.task.postedBy && (
                    <p className="saved-card-owner">
                      {saved.task.postedBy.firstName} {saved.task.postedBy.lastName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}