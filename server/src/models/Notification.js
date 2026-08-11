import mongoose from "mongoose";

const NOTIFICATION_TYPES = ["request", "task"];

const NOTIFICATION_CATEGORIES = [
  "new_request",       // Helper sent a request → notify task owner
  "request_accepted",  // Task owner accepted → notify requester
  "request_declined",  // Task owner declined → notify requester
  "request_cancelled", // Helper cancelled their request → notify task owner
  "task_completed",    // Task marked completed → notify assigned helper
  "new_applicant",     // Alias for new_request (used in UI display)
];

const notificationSchema = new mongoose.Schema(
  {
    // The user who RECEIVES the notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // The user who TRIGGERED the notification (optional — system events may not have one)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },

    category: {
      type: String,
      enum: NOTIFICATION_CATEGORIES,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    // Which document this notification relates to (Request or Task)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // Whether the user has seen/read this notification
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast per-user queries and cleanup
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, read: 1 });

export const NOTIFICATION_TYPES_LIST = NOTIFICATION_TYPES;
export const NOTIFICATION_CATEGORIES_LIST = NOTIFICATION_CATEGORIES;

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
