import mongoose from "mongoose";

const CATEGORIES = [
  "moving",
  "gardening",
  "cleaning",
  "painting",
  "assembly",
  "pet_care",
  "tech_help",
  "car_care",
  "other",
];

const STATUSES = ["active", "in_progress", "completed", "cancelled"];

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

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: "{VALUE} is not a supported category",
      },
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
      default: null,
    },

    price: {
      type: Number,
      required: false,
      default: 0,
      min: [0, "Price cannot be negative"],
    },

    images: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: STATUSES,
      default: "active",
    },

    // Assigned user for the task.
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Number of task applicants.
    applicantsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for search and filtering.
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ status: 1, category: 1 });
taskSchema.index({ postedBy: 1 });

export const TASK_CATEGORIES = CATEGORIES;
export const TASK_STATUSES = STATUSES;

const Task = mongoose.model("Task", taskSchema);

export default Task;