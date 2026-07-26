import { useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import api from "../../../config/api";
import "./AddTask.css";
import {
  FiSearch,
  FiBell,
  FiMapPin,
  FiX,
  FiUploadCloud,
} from "react-icons/fi";

const categories = [
  "Cleaning",
  "Moving",
  "Gardening",
  "Painting",
  "Pet Care",
  "Home Repair",
  "Delivery",
  "Other",
];

export default function AddTask() {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Required fields
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.startDate ||
      !formData.startTime ||
      !formData.category
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // End date validation
    if (
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be before the start date.");
      return;
    }

    // Same date → end time must be later
    if (
      formData.endDate === formData.startDate &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      setError("End time must be later than the start time.");
      return;
    }

    setError("");

    try {
      // FormData is required because we're sending an image
      const taskData = new FormData();

      taskData.append("title", formData.title.trim());
      taskData.append("description", formData.description.trim());
      taskData.append("location", formData.location.trim());
      taskData.append("startDate", formData.startDate);
      taskData.append("startTime", formData.startTime);
      taskData.append("category", formData.category);

      if (formData.endDate) {
        taskData.append("endDate", formData.endDate);
      }

      if (formData.endTime) {
        taskData.append("endTime", formData.endTime);
      }

      if (image) {
        taskData.append("image", image);
      }

      const response = await api.post("/tasks", taskData);

      console.log("Task created successfully:", response.data);

      alert("Task created successfully!");
    } catch (error) {
      console.error("Task creation failed:", error);

      setError(
        error.response?.data?.message ||
          "Failed to create task. Please try again."
      );
    }
  };

  return (
    <div className="add-task-page">
      <Sidebar />

      <main className="add-task-main">
        <header className="add-task-topbar">
          <div className="topbar-headings">
            <h1>Add Task</h1>
            <p>Create a task and find someone to help you</p>
          </div>

          <div className="add-task-top-actions">
            <div className="task-search">
              <FiSearch />
              <input
                id="task-search"
                name="taskSearch"
                type="search"
                placeholder="Search tasks..."
                aria-label="Search tasks"
                autoComplete="off"
              />
            </div>

            <button
              type="button"
              className="notification-button"
              aria-label="Notifications"
            >
              <FiBell />
              <span className="notification-dot">1</span>
            </button>
          </div>
        </header>

        <section className="add-task-content">
          <div className="add-task-card">
            <div className="form-heading">
              <h2>Add New Task</h2>
              <p>Create a task and find someone to help you</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g., Help moving furniture"
                  autoComplete="off"
                  required
                />
                <span className="character-count">
                  {formData.title.length}/100
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  maxLength={1000}
                  placeholder="Describe what help you need any requirements, and what you'll provide."
                  autoComplete="off"
                  required
                />
                <span className="character-count">
                  {formData.description.length}/1000
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <div className="input-with-icon">
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Downtown Seattle, WA or specific address"
                    autoComplete="street-address"
                    required
                  />
                  <FiMapPin className="input-icon" />
                </div>
              </div>

              <div className="date-time-grid">
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    min={today}
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">End Date (Optional)</label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={formData.startDate || today}
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">End Time (Optional)</label>
                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taskImage">Task Image (Optional)</label>
                <div className="image-upload-area">
                  {imagePreview ? (
                    <div className="image-preview-wrapper">
                      <img
                        src={imagePreview}
                        alt="Task preview"
                        className="task-image-preview"
                      />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={removeImage}
                        aria-label="Remove image"
                      >
                        <FiX />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder" htmlFor="taskImage">
                      <FiUploadCloud className="upload-icon" />
                      <div className="upload-text">
                        <span className="upload-link">Upload a file</span> or drag and drop
                      </div>
                      <span className="upload-hint">
                        PNG, JPG, GIF up to 10MB
                      </span>
                      <input
                        id="taskImage"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                    </label>
                  )}
                </div>
                {error && <p className="form-error">{error}</p>}
              </div>

              <div className="form-actions">
                <button type="submit" className="post-task-button">
                  Post Task
                </button>
                <button type="button" className="cancel-task-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}