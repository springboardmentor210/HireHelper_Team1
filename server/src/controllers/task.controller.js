import Task, { TASK_CATEGORIES, TASK_STATUSES } from "../models/Task.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Helper: turn uploaded files into stored paths (served from /uploads)
const filesToImagePaths = (files = []) =>
  files.map((file) => `/uploads/tasks/${file.filename}`);

// -------------------------------------------------------------------------
// POST /api/tasks  (protected)
// Create a new task. Matches "Add Task" form fields in the mockups.
// -------------------------------------------------------------------------
export const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    location,
    startDate,
    startTime,
    endDate,
    endTime,
    category,
    price,
  } = req.body;

  // Required fields
  if (!title || !description || !location || !startDate || !startTime || !category || !price) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Title, description, location, start date, start time, category and price are required"
        )
      );
  }

  if (!TASK_CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json(new ApiError(400, `Category must be one of: ${TASK_CATEGORIES.join(", ")}`));
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json(new ApiError(400, "Price must be a valid positive number"));
  }

  const images = filesToImagePaths(req.files);

  const task = await Task.create({
    title,
    description,
    location,
    startDate,
    startTime,
    endDate: endDate || null,
    endTime: endTime || null,
    category,
    price: numericPrice,
    images,
    postedBy: req.user._id,
  });

  return res.status(201).json(new ApiResponse(201, "Task created successfully", task));
});

// -------------------------------------------------------------------------
// GET /api/tasks/feed  (protected)
// "Find tasks that need help" — all other users' open tasks.
// Query params: category, search, sort (newest|price_low|price_high), page, limit
// -------------------------------------------------------------------------
export const getFeed = asyncHandler(async (req, res) => {
  const { category, search, sort = "newest", page = 1, limit = 12 } = req.query;

  const query = {
    status: "active",
    postedBy: { $ne: req.user._id },
  };

  if (category && category !== "all") {
    if (!TASK_CATEGORIES.includes(category)) {
      return res
        .status(400)
        .json(new ApiError(400, `Category must be one of: ${TASK_CATEGORIES.join(", ")}`));
    }
    query.category = category;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const sortMap = {
    newest: { createdAt: -1 },
    price_low: { price: 1 },
    price_high: { price: -1 },
  };

  const sortOption = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("postedBy", "firstName lastName profilePicture")
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum),
    Task.countDocuments(query),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Feed fetched successfully", {
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});

// -------------------------------------------------------------------------
// GET /api/tasks/my-tasks  (protected)
// "Manage every task you've created" — includes the stat cards.
// -------------------------------------------------------------------------
export const getMyTasks = asyncHandler(async (req, res) => {
  const { status, category, sort = "newest", page = 1, limit = 12 } = req.query;

  const query = { postedBy: req.user._id };

  if (status && status !== "all") {
    if (!TASK_STATUSES.includes(status)) {
      return res
        .status(400)
        .json(new ApiError(400, `Status must be one of: ${TASK_STATUSES.join(", ")}`));
    }
    query.status = status;
  }

  if (category && category !== "all") {
    query.category = category;
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [tasks, total, statusCounts] = await Promise.all([
    Task.find(query).sort(sortOption).skip(skip).limit(limitNum),
    Task.countDocuments(query),
    Task.aggregate([
      { $match: { postedBy: req.user._id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalApplicants: { $sum: "$applicantsCount" },
          totalValue: { $sum: "$price" },
        },
      },
    ]),
  ]);

  // Build the stat-card numbers shown at the top of "My Tasks"
  const stats = {
    active: 0,
    inProgress: 0,
    completed: 0,
    totalApplicants: 0,
    totalEarnings: 0, // sum of price for completed tasks
  };

  for (const row of statusCounts) {
    stats.totalApplicants += row.totalApplicants;

    if (row._id === "active") stats.active = row.count;
    if (row._id === "in_progress") stats.inProgress = row.count;
    if (row._id === "completed") {
      stats.completed = row.count;
      stats.totalEarnings = row.totalValue;
    }
  }

  return res.status(200).json(
    new ApiResponse(200, "Tasks fetched successfully", {
      tasks,
      stats,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});

// -------------------------------------------------------------------------
// GET /api/tasks/:id  (protected)
// -------------------------------------------------------------------------
export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id).populate(
    "postedBy",
    "firstName lastName profilePicture"
  );

  if (!task) {
    return res.status(404).json(new ApiError(404, "Task not found"));
  }

  return res.status(200).json(new ApiResponse(200, "Task fetched successfully", task));
});

// -------------------------------------------------------------------------
// PATCH /api/tasks/:id  (protected — owner only)
// Edit a task. Only allowed while it's still "active".
// -------------------------------------------------------------------------
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json(new ApiError(404, "Task not found"));
  }

  if (String(task.postedBy) !== String(req.user._id)) {
    return res.status(403).json(new ApiError(403, "You can only edit your own tasks"));
  }

  if (task.status !== "active") {
    return res
      .status(400)
      .json(new ApiError(400, "Only active tasks can be edited"));
  }

  const editableFields = [
    "title",
    "description",
    "location",
    "startDate",
    "startTime",
    "endDate",
    "endTime",
    "category",
    "price",
  ];

  for (const field of editableFields) {
    if (req.body[field] !== undefined) {
      task[field] = req.body[field];
    }
  }

  if (req.body.category && !TASK_CATEGORIES.includes(req.body.category)) {
    return res
      .status(400)
      .json(new ApiError(400, `Category must be one of: ${TASK_CATEGORIES.join(", ")}`));
  }

  if (req.files && req.files.length > 0) {
    task.images = [...task.images, ...filesToImagePaths(req.files)];
  }

  await task.save();

  return res.status(200).json(new ApiResponse(200, "Task updated successfully", task));
});

// -------------------------------------------------------------------------
// PATCH /api/tasks/:id/status  (protected — owner only)
// Manually move a task to completed / cancelled.
// (Moving a task to "in_progress" happens via the Requests module when a
// request is accepted, not here.)
// -------------------------------------------------------------------------
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !["completed", "cancelled"].includes(status)) {
    return res
      .status(400)
      .json(new ApiError(400, "Status must be 'completed' or 'cancelled'"));
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json(new ApiError(404, "Task not found"));
  }

  if (String(task.postedBy) !== String(req.user._id)) {
    return res.status(403).json(new ApiError(403, "You can only update your own tasks"));
  }

  if (task.status === "completed" || task.status === "cancelled") {
    return res
      .status(400)
      .json(new ApiError(400, `Task is already ${task.status}`));
  }

  task.status = status;

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, `Task marked as ${status}`, task));
});

// -------------------------------------------------------------------------
// DELETE /api/tasks/:id  (protected — owner only)
// -------------------------------------------------------------------------
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json(new ApiError(404, "Task not found"));
  }

  if (String(task.postedBy) !== String(req.user._id)) {
    return res.status(403).json(new ApiError(403, "You can only delete your own tasks"));
  }

  if (task.status === "in_progress") {
    return res
      .status(400)
      .json(new ApiError(400, "Cannot delete a task that is currently in progress"));
  }

  await Task.findByIdAndDelete(req.params.id);

  return res.status(200).json(new ApiResponse(200, "Task deleted successfully"));
});
