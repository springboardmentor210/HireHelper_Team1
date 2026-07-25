import Task from "../models/Task.js";
import User from "../models/User.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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
  } = req.body;

  // Validate required fields
  if (
    !title ||
    !description ||
    !location ||
    !startDate ||
    !startTime ||
    !category
  ) {
    return res
      .status(400)
      .json(new ApiError(400, "Please fill in all required fields"));
  }

  // At least one image is compulsory
  if (!req.file) {
    return res
      .status(400)
      .json(new ApiError(400, "At least one task image is required"));
  }

  // Validate dates
  const start = new Date(startDate);

  if (Number.isNaN(start.getTime())) {
    return res
      .status(400)
      .json(new ApiError(400, "Invalid start date"));
  }

  let end = null;

  if (endDate) {
    end = new Date(endDate);

    if (Number.isNaN(end.getTime())) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid end date"));
    }

    if (end < start) {
      return res
        .status(400)
        .json(
          new ApiError(
            400,
            "End date cannot be before the start date"
          )
        );
    }
  }

  // Create task
  const task = await Task.create({
    title: title.trim(),
    description: description.trim(),
    location: location.trim(),

    startDate: start,
    startTime,

    endDate: end,
    endTime: endTime || "",

    category,

    image: `/uploads/tasks/${req.file.filename}`,

    // User comes from protect middleware
    createdBy: req.user._id,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "Task created successfully",
      task
    )
  );
});

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const [
    totalTasks,
    activeTasks,
    inProgressTasks,
    completedTasks,
    cancelledTasks,
    upcomingTasks,
    recentTasks,
    recommendedTasks,
  ] = await Promise.all([
    Task.countDocuments({ createdBy: userId }),

    Task.countDocuments({
      createdBy: userId,
      status: "active",
    }),

    Task.countDocuments({
      createdBy: userId,
      status: "in-progress",
    }),

    Task.countDocuments({
      createdBy: userId,
      status: "completed",
    }),

    Task.countDocuments({
      createdBy: userId,
      status: "cancelled",
    }),

    // Logged-in user's upcoming tasks
    Task.find({
      createdBy: userId,
      status: { $in: ["active", "in-progress"] },
      startDate: { $gte: now },
    })
      .sort({ startDate: 1, startTime: 1 })
      .limit(3)
      .lean(),

    // Used for recent activity
    Task.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),

    // Tasks from other users
    Task.find({
      createdBy: { $ne: userId },
      status: "active",
      startDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("createdBy", "firstName lastName")
      .lean(),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Dashboard data fetched successfully",
      {
        isNewUser: totalTasks === 0,

        stats: {
          totalTasks,
          activeTasks,
          inProgressTasks,
          completedTasks,
          cancelledTasks,
        },

        upcomingTasks,

        recentActivity: recentTasks.map((task) => ({
          id: task._id,
          type: "task_created",
          message: `You posted "${task.title}"`,
          createdAt: task.createdAt,
        })),

        recommendedTasks,
      }
    )
  );
});
export const getPublicStats = asyncHandler(async (req, res) => {
  const [
    registeredUsers,
    totalTasks,
    activeTasks,
    completedTasks,
  ] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: "active" }),
    Task.countDocuments({ status: "completed" }),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Public statistics fetched successfully",
      {
        registeredUsers,
        totalTasks,
        activeTasks,
        completedTasks,
      }
    )
  );
});