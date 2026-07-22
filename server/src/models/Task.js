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
      required: [true, "Price is required"],
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

    // Set once a request is accepted (owned/updated by the Requests module).
    // Included here so the Tasks API can already read/report it.
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Incremented/decremented by the Requests module whenever someone
    // requests to help / withdraws. Tasks module only reads this.
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

// Feed search (title/description) + common filters
taskSchema.index({ title: "text", description: "text" });
taskSchema.index({ status: 1, category: 1 });
taskSchema.index({ postedBy: 1 });

export const TASK_CATEGORIES = CATEGORIES;
export const TASK_STATUSES = STATUSES;

const Task = mongoose.model("Task", taskSchema);

export default Task;
