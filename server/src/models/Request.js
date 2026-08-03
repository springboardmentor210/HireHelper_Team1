import mongoose from "mongoose";

const STATUSES = ["pending", "accepted", "declined", "cancelled"];

const requestSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    taskOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: [true, "A message is required when sending a request"],
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: STATUSES,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

requestSchema.index(
  { task: 1, requester: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ["pending", "accepted"] } } }
);
requestSchema.index({ taskOwner: 1, status: 1 });
requestSchema.index({ requester: 1, status: 1 });

export const REQUEST_STATUSES = STATUSES;

const Request = mongoose.model("Request", requestSchema);

export default Request;