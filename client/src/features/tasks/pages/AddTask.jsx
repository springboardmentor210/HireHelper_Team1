import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
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

    setError("");
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

    // Revoke the previous preview URL before creating a new one.
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
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

    // Start date validation
    if (
      formData.startDate &&
      formData.startDate < today
    ) {
      setError(
        "Start date cannot be earlier than today."
      );
      return;
    }

    // End date validation
    if (
      formData.endDate &&
      formData.startDate &&
      formData.endDate < formData.startDate
    ) {
      setError(
        "End date cannot be before the start date."
      );
      return;
    }

    // Same date -> end time must be later
    if (
      formData.endDate &&
      formData.startDate &&
      formData.endDate === formData.startDate &&
      formData.endTime &&
      formData.startTime &&
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
      /*
       * createTask is the single task-creation path.
       *
       * No undefined lat/lng variables are sent here.
       * The task service is responsible for constructing
       * the request expected by the backend.
       */
      await createTask({
        ...formData,

        // Send the actual File object, NOT imagePreview.
        image,
      });

      alert("Task created successfully!");

      navigate("/mytasks");
    } catch (err) {
      console.error(
        "Task creation failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to create task. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="add-task-page">

          <div className="add-task-header">
            <div>
              <h1>Add Task</h1>

              <p>
                Create a task and find someone
                to help you.
              </p>
            </div>
          </div>

          {error && (
            <div className="add-task-error">
              {error}
            </div>
          )}

          <form
            className="add-task-form"
            onSubmit={handleSubmit}
          >

            {/* =========================
                BASIC INFORMATION
            ========================= */}

            <div className="card">
              <h2>Task Details</h2>

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
                  placeholder="What do you need help with?"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what needs to be done..."
                  rows={5}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="">
                    Select a category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.value}
                        value={category.value}
                      >
                        {category.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">
                  <FiMapPin />
                  Location
                </label>

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where should the task be done?"
                  disabled={loading}
                />
              </div>
            </div>

            {/* =========================
                BUDGET
            ========================= */}

            <div className="card">
              <h2>Budget</h2>

              <div className="form-group">
                <label htmlFor="budget">
                  Budget
                </label>

                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget"
                  disabled={loading}
                />
              </div>
            </div>

            {/* =========================
                SCHEDULE
            ========================= */}

            <div className="card">
              <h2>Schedule</h2>

              <div className="form-row">

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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

              </div>

              <div className="form-row">

                <div className="form-group">
                  <label htmlFor="endDate">
                    End Date
                  </label>

                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    min={
                      formData.startDate ||
                      today
                    }
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endTime">
                    End Time
                  </label>

                  <input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

              </div>
            </div>

            {/* =========================
                IMAGE
            ========================= */}

            <div className="card">
              <h2>Task Image</h2>

              <div className="image-upload-area">

                {!imagePreview ? (
                  <label
                    htmlFor="task-image"
                    className="image-upload-label"
                  >
                    <FiUploadCloud size={32} />

                    <span>
                      Upload an image
                    </span>

                    <small>
                      JPG, PNG or other image
                      formats
                    </small>

                    <input
                      id="task-image"
                      type="file"
                      accept="image/*"
                      onChange={
                        handleImageChange
                      }
                      disabled={loading}
                    />
                  </label>
                ) : (
                  <div className="image-preview-wrapper">

                    <img
                      src={imagePreview}
                      alt="Task preview"
                      className="image-preview"
                    />

                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={removeImage}
                      disabled={loading}
                      aria-label="Remove image"
                    >
                      <FiX />
                    </button>

                  </div>
                )}

              </div>
            </div>

            {/* =========================
                ACTIONS
            ========================= */}

            <div className="add-task-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  navigate("/mytasks")
                }
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-task-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Task"}
              </button>

            </div>

          </form>
        </div>
      </main>
    </div>
  );
}