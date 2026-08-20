import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import api from "../../../config/api";
import { createTask } from "../../../services/taskService";
import "./AddTask.css";
import {
  FiMapPin,
  FiX,
  FiUploadCloud,
} from "react-icons/fi";

const categories = [
  { label: "Moving", value: "moving" },
  { label: "Gardening", value: "gardening" },
  { label: "Cleaning", value: "cleaning" },
  { label: "Painting", value: "painting" },
  { label: "Assembly", value: "assembly" },
  { label: "Pet Care", value: "pet_care" },
  { label: "Tech Help", value: "tech_help" },
  { label: "Car Care", value: "car_care" },
  { label: "Other", value: "other" },
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

  // Actual image file
  const [image, setImage] = useState(null);

  // Only used for displaying preview
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

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image.");
      return;
    }

    // Store the REAL File object.
    // This is what will be uploaded to the backend.
    setImage(file);

    // Create preview only for the UI.
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

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
      setError(
        "End date cannot be before the start date."
      );
      return;
    }

    // Same date -> end time must be later
    if (
      formData.endDate === formData.startDate &&
      formData.endTime &&
      formData.endTime <= formData.startTime
    ) {
      setError(
        "End time must be later than the start time."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError(
        "Access Denied: You are not logged in. Please sign in to create a task."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (typeof createTask === "function") {
        await createTask({
          ...formData,

          // IMPORTANT:
          // Send the actual File object, NOT imagePreview.
          image: image,
        });
      } else {
        // Fallback API request
        const taskData = new FormData();

        taskData.append(
          "title",
          formData.title.trim()
        );

        taskData.append(
          "description",
          formData.description.trim()
        );

        taskData.append(
          "location",
          formData.location.trim()
        );

        if (formData.budget) {
          taskData.append(
            "price",
            formData.budget
          );
        }

        if (formData.startDate) {
          taskData.append(
            "startDate",
            formData.startDate
          );
        }

        if (formData.startTime) {
          taskData.append(
            "startTime",
            formData.startTime
          );
        }

        taskData.append(
          "category",
          formData.category
        );

        if (formData.endDate) {
          taskData.append(
            "endDate",
            formData.endDate
          );
        }

        if (formData.endTime) {
          taskData.append(
            "endTime",
            formData.endTime
          );
        }

        // Send coordinates
        taskData.append("lat", lat);
        taskData.append("lng", lng);

        // Send actual image file
        if (image instanceof File) {
          taskData.append("image", image);
        }

        await api.post("/tasks", taskData);
      }

      alert("Task created successfully!");

      navigate("/mytasks");
    } catch (err) {
      console.error(
        "Task creation failed:",
        err
      );

      // Location permission denied
      if (err?.code === 1) {
        setError(
          "Location permission was denied. Please allow location access to create a task."
        );
      }

      // Location unavailable
      else if (err?.code === 2) {
        setError(
          "Unable to determine your location. Please try again."
        );
      }

      // Location timeout
      else if (err?.code === 3) {
        setError(
          "Location request timed out. Please try again."
        );
      }

      // Browser does not support location
      else if (
        err?.code === "NOT_SUPPORTED"
      ) {
        setError(
          "Location services are not supported by this browser."
        );
      }

      // Authentication error
      else if (
        err?.response?.status === 401
      ) {
        setError(
          "Access Denied: Please log in to create a task."
        );
      }

      // Backend error
      else {
        setError(
          err?.response?.data?.message ||
            "Failed to create task. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-task-page">
      <Sidebar />

      <main className="add-task-main">
        <header className="add-task-topbar">
          <div className="topbar-headings">
            <h1>Add Task</h1>

            <p>
              Create a task and find someone to help you
            </p>
          </div>


        </header>

        <section className="add-task-content">
          <div className="add-task-card">
            <div className="form-heading">
              <h2>Add New Task</h2>

              <p>
                Create a task and find someone to help you
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Task Title */}
              <div className="form-group">
                <label htmlFor="title">
                  Task Title
                </label>

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

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">
                  Description
                </label>

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

              {/* Budget */}
              <div className="form-group">
                <label htmlFor="budget">
                  Budget (₹)
                </label>

                <div className="input-with-prefix">
                  <span className="input-prefix">₹</span>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    placeholder="e.g., 1200"
                    min="0"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location">
                  Location
                </label>

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

                  <FiMapPin className="input-icon" />
                </div>
              </div>

              {/* Date and Time */}
              <div className="date-time-grid">
                <div className="form-group">
                  <label htmlFor="startDate">
                    Start Date
                  </label>

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
                  <label htmlFor="startTime">
                    Start Time
                  </label>

                  <input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">
                    End Date (Optional)
                  </label>

                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={
                      formData.startDate || today
                    }
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">
                    End Time (Optional)
                  </label>

                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.value}
                      value={category.value}
                    >
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div className="form-group">
                <label htmlFor="taskImage">
                  Task Image (Optional)
                </label>

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
                    <label
                      className="upload-placeholder"
                      htmlFor="taskImage"
                    >
                      <FiUploadCloud className="upload-icon" />

                      <div className="upload-text">
                        <span className="upload-link">
                          Upload a file
                        </span>{" "}
                        or drag and drop
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

                {error && (
                  <p className="form-error">
                    {error}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="form-actions">
                <button
                  type="submit"
                  className="post-task-button"
                  disabled={loading}
                >
                  {loading
                    ? "Posting..."
                    : "Post Task"}
                </button>

                <button
                  type="button"
                  className="cancel-task-button"
                  onClick={() =>
                    navigate("/mytasks")
                  }
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