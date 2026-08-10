import SavedTask from "../models/SavedTask.js";
import Task from "../models/Task.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Save task.
export const saveTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json(new ApiError(404, "Task not found"));
  }

  const existing = await SavedTask.findOne({ user: req.user._id, task: taskId });

  if (existing) {
    return res.status(400).json(new ApiError(400, "Task is already saved"));
  }

  const saved = await SavedTask.create({ user: req.user._id, task: taskId });

  return res.status(201).json(new ApiResponse(201, "Task saved successfully", saved));
});

// Unsave task.
export const unsaveTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deleted = await SavedTask.findOneAndDelete({
    user: req.user._id,
    task: taskId,
  });

  if (!deleted) {
    return res.status(404).json(new ApiError(404, "Saved task not found"));
  }

  return res.status(200).json(new ApiResponse(200, "Task removed from saved", null));
});

// Fetch saved tasks.
export const getSavedTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12 } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [savedTasks, total] = await Promise.all([
    SavedTask.find({ user: req.user._id })
      .populate({
        path: "task",
        populate: {
          path: "postedBy",
          select: "firstName lastName profilePicture",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    SavedTask.countDocuments({ user: req.user._id }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Saved tasks fetched successfully", {
      savedTasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});