import Task from "../models/Task.js";
import User from "../models/User.js";

import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Fetch dashboard summary
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const now = new Date();

  const [
    totalTasks,
    activeTasks,
    inProgressTasks,
    completedTasks,
    upcomingTasksRaw,
    recentTasksRaw,
    recommendedTasksRaw,
  ] = await Promise.all([
    Task.countDocuments({ postedBy: userId }),

    Task.countDocuments({ postedBy: userId, status: "active" }),

    Task.countDocuments({ postedBy: userId, status: "in_progress" }),

    Task.countDocuments({ postedBy: userId, status: "completed" }),

    // Fetch upcoming tasks
    Task.find({
      postedBy: userId,
      status: { $in: ["active", "in_progress"] },
      startDate: { $gte: now },
    })
      .sort({ startDate: 1, startTime: 1 })
      .limit(3)
      .lean(),

    // Fetch recent tasks
    Task.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),

    // Fetch recommended tasks
    Task.find({
      postedBy: { $ne: userId },
      status: "active",
      startDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
  ]);

  const upcomingTasks = upcomingTasksRaw;

  const recentActivity = recentTasksRaw.map((task) => ({
    id: task._id,
    type: "task_created",
    message: `You posted "${task.title}"`,
    createdAt: task.createdAt,
  }));

  // Map the first image from the images array
  const recommendedTasks = recommendedTasksRaw.map((task) => ({
    ...task,
    image: task.images && task.images.length > 0 ? task.images[0] : null,
  }));

  return res.status(200).json(
    new ApiResponse(200, "Dashboard data fetched successfully", {
      isNewUser: totalTasks === 0,
      stats: {
        totalTasks,
        activeTasks,
        inProgressTasks,
        completedTasks,
      },
      upcomingTasks,
      recentActivity,
      recommendedTasks,
    })
  );
});

// Fetch public statistics
export const getPublicStats = asyncHandler(async (req, res) => {
  const [registeredUsers, totalTasks, activeTasks, completedTasks] = await Promise.all([
    User.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ status: "active" }),
    Task.countDocuments({ status: "completed" }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Public statistics fetched successfully", {
      registeredUsers,
      totalTasks,
      activeTasks,
      completedTasks,
    })
  );
});