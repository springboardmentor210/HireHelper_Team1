import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import { createTask } from "../../../services/taskService";
import "./AddTask.css";
import {
  Search,
  Bell,
  MapPin,
  X,
  UploadCloud,
} from "lucide-react";

const categories = [
  "Tech",
  "Car Care",
  "Gardening",
  "Assembly",
  "Cleaning",
  "Moving",
  "Painting",
  "Pet Care",
  "Home Repair",
  "Delivery",
  "Other",
];

export default function AddTask() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    budget: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.location.trim() ||
      !formData.category
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await createTask({
        ...formData,
        image: imagePreview || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
      });

      alert("Task created successfully!");
      navigate("/mytasks");
    } catch (err) {
      console.error("Task creation failed:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-page" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Sidebar />

      <main className="add-task-main" style={{ flex: 1, padding: "24px 32px" }}>
        <header className="add-task-topbar">
          <div className="topbar-headings">
            <h1>Add Task</h1>
            <p>Create a task and find someone to help you</p>
          </div>

          <div className="add-task-top-actions">
            <div className="task-search">
              <Search size={18} />
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
              <Bell size={20} />
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
                  placeholder="e.g., Computer Setup, Garden Cleanup"
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
                  placeholder="Describe what help you need, any requirements, and what you'll provide."
                  autoComplete="off"
                  required
                />
                <span className="character-count">
                  {formData.description.length}/1000
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget (₹)</label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="e.g. 1200"
                  required
                />
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
                    placeholder="e.g., Downtown Seattle, WA or Bellevue, WA"
                    autoComplete="street-address"
                    required
                  />
                  <MapPin className="input-icon" size={18} />
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
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder" htmlFor="taskImage">
                      <UploadCloud className="upload-icon" size={32} />
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
                <button type="submit" className="post-task-button" disabled={loading}>
                  {loading ? "Posting..." : "Post Task"}
                </button>
                <button
                  type="button"
                  className="cancel-task-button"
                  onClick={() => navigate("/mytasks")}
                >
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