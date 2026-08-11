import Notification from "../models/Notification.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────
// Internal helper: create a notification record
// Called from other controllers (request, task)
// ─────────────────────────────────────────────
export const createNotification = async ({
  recipient,
  sender = null,
  type,
  category,
  title,
  message,
  relatedId = null,
}) => {
  try {
    await Notification.create({
      recipient,
      sender,
      type,
      category,
      title,
      message,
      relatedId,
    });
  } catch (err) {
    // Notification creation should never crash the parent operation
    console.error("Failed to create notification:", err.message);
  }
};

// ─────────────────────────────────────────────
// GET /api/notifications
// Fetch all notifications for the logged-in user
// Supports ?page=1&limit=20&unreadOnly=true
// ─────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const skip = (pageNum - 1) * limitNum;

  const query = { recipient: req.user._id };

  if (unreadOnly === "true") {
    query.read = false;
  }

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .populate("sender", "firstName lastName profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Notification.countDocuments(query),
    Notification.countDocuments({ recipient: req.user._id, read: false }),
  ]);

  return res.status(200).json(
    new ApiResponse(200, "Notifications fetched successfully", {
      notifications,
      unreadCount,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  );
});

// ─────────────────────────────────────────────
// PATCH /api/notifications/:id/read
// Mark a single notification as read
// ─────────────────────────────────────────────
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    return res
      .status(404)
      .json(new ApiError(404, "Notification not found"));
  }

  notification.read = true;
  await notification.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification marked as read", notification));
});

// ─────────────────────────────────────────────
// PATCH /api/notifications/read-all
// Mark ALL notifications for the logged-in user as read
// ─────────────────────────────────────────────
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { $set: { read: true } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "All notifications marked as read", null));
});

// ─────────────────────────────────────────────
// DELETE /api/notifications/:id
// Delete a single notification
// ─────────────────────────────────────────────
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    return res
      .status(404)
      .json(new ApiError(404, "Notification not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Notification deleted", null));
});

// ─────────────────────────────────────────────
// GET /api/notifications/unread-count
// Return just the unread count (for the bell badge)
// ─────────────────────────────────────────────
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    read: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Unread count fetched", { unreadCount: count }));
});
