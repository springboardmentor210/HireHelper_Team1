import Request, { REQUEST_STATUSES } from "../models/Request.js";
import Task from "../models/Task.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Send request
export const createRequest = asyncHandler(async (req, res) => {
  const { taskId, message } = req.body;

  if (!taskId || !message) {
    return res.status(400).json(new ApiError(400, "taskId and message are required"));
  }

  const task = await Task.findById(taskId);

  if (!task) {
    return res.status(404).json(new ApiError(404, "Task not found"));
  }

  if (String(task.postedBy) === String(req.user._id)) {
    return res.status(400).json(new ApiError(400, "You cannot request to help with your own task"));
  }

  if (task.status !== "active") {
    return res.status(400).json(new ApiError(400, "This task is not open for requests"));
  }

  const existing = await Request.findOne({
    task: taskId,
    requester: req.user._id,
    status: { $in: ["pending", "accepted"] },
  });

  if (existing) {
    return res
      .status(400)
      .json(new ApiError(400, "You already have an active request for this task"));
  }

  const request = await Request.create({
    task: taskId,
    requester: req.user._id,
    taskOwner: task.postedBy,
    message: message.trim(),
  });

  task.applicantsCount = (task.applicantsCount || 0) + 1;
  await task.save();

  return res.status(201).json(new ApiResponse(201, "Request sent successfully", request));
});

// Incoming requests
export const getIncomingRequests = asyncHandler(async (req, res) => {
  const { status = "pending", page = 1, limit = 12 } = req.query;

  const query = { taskOwner: req.user._id };

  if (status !== "all") {
    if (!REQUEST_STATUSES.includes(status)) {
      return res
        .status(400)
        .json(new ApiError(400, `Status must be one of: ${REQUEST_STATUSES.join(", ")}`));
    }
    query.status = status;
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [requests, total, statusCounts] = await Promise.all([
    Request.find(query)
      .populate("requester", "firstName lastName profilePicture")
      .populate("task", "title category startDate startTime location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Request.countDocuments(query),
    Request.aggregate([
      { $match: { taskOwner: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  // Tab counts
  const counts = { pending: 0, accepted: 0, declined: 0, cancelled: 0 };
  for (const row of statusCounts) {
    counts[row._id] = row.count;
  }

  return res.status(200).json(
    new ApiResponse(200, "Incoming requests fetched successfully", {
      requests,
      counts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});

// My requests
export const getMyRequests = asyncHandler(async (req, res) => {
  const { status = "all", page = 1, limit = 12 } = req.query;

  const query = { requester: req.user._id };

  if (status !== "all") {
    if (!REQUEST_STATUSES.includes(status)) {
      return res
        .status(400)
        .json(new ApiError(400, `Status must be one of: ${REQUEST_STATUSES.join(", ")}`));
    }
    query.status = status;
  }

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const [requests, total, statusCounts] = await Promise.all([
    Request.find(query)
      .populate("task", "title category images status")
      .populate("taskOwner", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Request.countDocuments(query),
    Request.aggregate([
      { $match: { requester: req.user._id } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  // Tab counts
  const counts = { pending: 0, accepted: 0, declined: 0, cancelled: 0 };
  for (const row of statusCounts) {
    counts[row._id] = row.count;
  }

  return res.status(200).json(
    new ApiResponse(200, "My requests fetched successfully", {
      requests,
      counts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});

// Accept request
export const acceptRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json(new ApiError(404, "Request not found"));
  }

  if (String(request.taskOwner) !== String(req.user._id)) {
    return res.status(403).json(new ApiError(403, "You can only accept requests on your own tasks"));
  }

  if (request.status !== "pending") {
    return res.status(400).json(new ApiError(400, `Request is already ${request.status}`));
  }

  const task = await Task.findById(request.task);

  if (!task) {
    return res.status(404).json(new ApiError(404, "Associated task not found"));
  }

  request.status = "accepted";
  await request.save();

  // Auto-decline rest
  await Request.updateMany(
    { task: task._id, _id: { $ne: request._id }, status: "pending" },
    { $set: { status: "declined" } }
  );

  task.status = "in_progress";
  task.assignedTo = request.requester;
  await task.save();

  return res.status(200).json(new ApiResponse(200, "Request accepted successfully", request));
});

// Decline request
export const declineRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json(new ApiError(404, "Request not found"));
  }

  if (String(request.taskOwner) !== String(req.user._id)) {
    return res.status(403).json(new ApiError(403, "You can only decline requests on your own tasks"));
  }

  if (request.status !== "pending") {
    return res.status(400).json(new ApiError(400, `Request is already ${request.status}`));
  }

  request.status = "declined";
  await request.save();

  return res.status(200).json(new ApiResponse(200, "Request declined", request));
});

// Cancel request
export const cancelRequest = asyncHandler(async (req, res) => {
  const request = await Request.findById(req.params.id);

  if (!request) {
    return res.status(404).json(new ApiError(404, "Request not found"));
  }

  if (String(request.requester) !== String(req.user._id)) {
    return res.status(403).json(new ApiError(403, "You can only cancel your own requests"));
  }

  if (request.status !== "pending") {
    return res.status(400).json(new ApiError(400, "Only pending requests can be cancelled"));
  }

  request.status = "cancelled";
  await request.save();

  // Decrement count
  const task = await Task.findById(request.task);
  if (task && task.applicantsCount > 0) {
    task.applicantsCount -= 1;
    await task.save();
  }

  return res.status(200).json(new ApiResponse(200, "Request cancelled", request));
});