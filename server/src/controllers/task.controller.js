import Task, { TASK_CATEGORIES, TASK_STATUSES } from "../models/Task.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const filesToImagePaths = (files = [], singleFile = null) => {
  // upload.fields() returns an object:
  // { image: [file], images: [file1, file2] }

  if (files && !Array.isArray(files) && typeof files === "object") {
    const allFiles = Object.values(files).flat();

    return allFiles.map(
      (file) => `/uploads/tasks/${file.filename}`
    );
  }

  // Handles upload.array()
  if (Array.isArray(files) && files.length > 0) {
    return files.map(
      (file) => `/uploads/tasks/${file.filename}`
    );
  }

  // Handles upload.single()
  if (singleFile) {
    return [`/uploads/tasks/${singleFile.filename}`];
  }

  return [];
};

// Create task.
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
    lat,
    lng,
  } = req.body;

  // Required fields.
  if (!title || !description || !location || !startDate || !startTime || !category) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          "Title, description, location, start date, start time and category are required"
        )
      );
  }

  if (!TASK_CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json(new ApiError(400, `Category must be one of: ${TASK_CATEGORIES.join(", ")}`));
  }

  let numericPrice = 0;

  if (price !== undefined && price !== null && price !== "") {
    numericPrice = Number(price);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return res
        .status(400)
        .json(new ApiError(400, "Price must be a valid positive number"));
    }
  }

  const images = filesToImagePaths(req.files, req.file);

  let coordinates;

  if (location && typeof location === "string" && location.trim() !== "") {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location.trim()
        )}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "HireHelper/1.0",
          },
        }
      );

      const data = await response.json();

      if (data && data.length > 0) {
        const latNum = Number(data[0].lat);
        const lngNum = Number(data[0].lon);

        if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
          coordinates = {
            type: "Point",
            coordinates: [lngNum, latNum],
          };
        }
      }
    } catch (err) {
      console.warn("Geocoding failed for location:", location, err.message);
      // We fail gracefully and just don't set coordinates
    }
  }

  const taskData = {
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
};

if (coordinates) {
  taskData.coordinates = coordinates;
}

const task = await Task.create(taskData);

  return res.status(201).json(new ApiResponse(201, "Task created successfully", task));
});

// Fetch task feed.
export const getFeed = asyncHandler(async (req, res) => {
  const { category, search, sort = "newest", page = 1, limit = 12, lat, lng } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  if (category && category !== "all" && !TASK_CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json(new ApiError(400, `Category must be one of: ${TASK_CATEGORIES.join(", ")}`));
  }

  if (sort === "distance" && lat !== undefined && lng !== undefined) {
    const latNum = Number(lat);
    const lngNum = Number(lng);

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return res.status(400).json(new ApiError(400, "lat and lng must be valid numbers"));
    }

    const matchStage = {
      status: "active",
      postedBy: { $ne: req.user._id },
    };

    if (category && category !== "all") {
      matchStage.category = category;
    }

    if (search) {
      matchStage.$text = { $search: search };
    }

    const pipeline = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lngNum, latNum] },
          distanceField: "distanceInMeters",
          query: matchStage,
          spherical: true,
        },
      },
      { $skip: skip },
      { $limit: limitNum },
    ];

    const [tasks, total] = await Promise.all([
      Task.aggregate(pipeline),
      Task.countDocuments(matchStage),
    ]);

    // Populate task owner details.
    await Task.populate(tasks, {
      path: "postedBy",
      select: "firstName lastName profilePicture",
    });

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
  }

  const query = {
    status: "active",
    postedBy: { $ne: req.user._id },
  };

  if (category && category !== "all") {
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

// Fetch user's tasks.
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

  // Calculate task statistics.
  const stats = {
    active: 0,
    inProgress: 0,
    completed: 0,
    totalApplicants: 0,
    totalEarnings: 0,
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

// Fetch task by ID.
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

// Update task.
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

  // Editable task fields.
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

  if ((req.files && req.files.length > 0) || req.file) {
    task.images = [...task.images, ...filesToImagePaths(req.files, req.file)];
  }

  await task.save();

  return res.status(200).json(new ApiResponse(200, "Task updated successfully", task));
});

// Update task status.
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

// Delete task.
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