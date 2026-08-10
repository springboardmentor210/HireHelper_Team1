import mongoose from "mongoose";

const savedTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saved tasks.
savedTaskSchema.index({ user: 1, task: 1 }, { unique: true });

const SavedTask = mongoose.model("SavedTask", savedTaskSchema);

export default SavedTask;