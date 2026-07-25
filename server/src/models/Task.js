import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Task title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },

    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },

    endDate: {
      type: Date,
      default: null,
    },

    endTime: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Cleaning",
        "Moving",
        "Gardening",
        "Painting",
        "Pet Care",
        "Home Repair",
        "Delivery",
        "Other",
      ],
    },

    image: {
      type: String,
      required: [true, "At least one task image is required"],
    },

    status: {
      type: String,
      enum: ["active", "in-progress", "completed", "cancelled"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;