import Request, {
  REQUEST_STATUSES,
} from "../models/Request.js";
import Task from "../models/Task.js";
import Conversation from "../models/Conversation.js";
import { createNotification } from "./notification.controller.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// ============================================================
// HAVERSINE DISTANCE
// ============================================================

const getDistanceInMiles = (
  lat1,
  lng1,
  lat2,
  lng2
) => {
  const toRad = (deg) =>
    (deg * Math.PI) / 180;

  const R = 3958.8;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

// ============================================================
// CREATE REQUEST
// ============================================================

export const createRequest = asyncHandler(
  async (req, res) => {
    const { taskId, message } = req.body;

    if (
      !taskId ||
      !message ||
      !message.trim()
    ) {
      return res.status(400).json(
        new ApiError(
          400,
          "taskId and message are required"
        )
      );
    }

    const task =
      await Task.findById(taskId);

    if (!task) {
      return res.status(404).json(
        new ApiError(
          404,
          "Task not found"
        )
      );
    }

    // User cannot request their own task
    if (
      String(task.postedBy) ===
      String(req.user._id)
    ) {
      return res.status(400).json(
        new ApiError(
          400,
          "You cannot request to help with your own task"
        )
      );
    }

    // Task must be active
    if (task.status !== "active") {
      return res.status(400).json(
        new ApiError(
          400,
          "This task is not open for requests"
        )
      );
    }

    // Prevent duplicate active requests
    const existing =
      await Request.findOne({
        task: taskId,
        requester: req.user._id,
        status: {
          $in: [
            "pending",
            "accepted",
          ],
        },
      });

    if (existing) {
      return res.status(400).json(
        new ApiError(
          400,
          "You already have an active request for this task"
        )
      );
    }

    const request =
      await Request.create({
        task: taskId,
        requester: req.user._id,
        taskOwner: task.postedBy,
        message: message.trim(),
      });

    // Increase applicants count
    task.applicantsCount =
      (task.applicantsCount || 0) + 1;

    await task.save();

    // Notify task owner
    await createNotification({
      recipient: task.postedBy,
      sender: req.user._id,
      type: "request",
      category: "new_request",
      title: `New request for ${task.title}`,
      message: `${req.user.firstName} ${req.user.lastName} wants help with "${task.title}". Review and respond.`,
      relatedId: request._id,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        "Request sent successfully",
        request
      )
    );
  }
);

// ============================================================
// GET INCOMING REQUESTS
// ============================================================

export const getIncomingRequests =
  asyncHandler(async (req, res) => {
    const {
      status = "pending",
      page = 1,
      limit = 12,
      lat,
      lng,
    } = req.query;

    const query = {
      taskOwner: req.user._id,
    };

    if (status !== "all") {
      if (
        !REQUEST_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json(
          new ApiError(
            400,
            `Status must be one of: ${REQUEST_STATUSES.join(
              ", "
            )}`
          )
        );
      }

      query.status = status;
    }

    const pageNum = Math.max(
      Number(page) || 1,
      1
    );

    const limitNum = Math.min(
      Math.max(
        Number(limit) || 12,
        1
      ),
      50
    );

    const skip =
      (pageNum - 1) * limitNum;

    const [
      requestDocs,
      total,
      statusCounts,
    ] = await Promise.all([
      Request.find(query)
        .populate(
          "requester",
          "firstName lastName profilePicture"
        )
        .populate(
          "task",
          "title category startDate startTime location coordinates"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNum),

      Request.countDocuments(query),

      Request.aggregate([
        {
          $match: {
            taskOwner: req.user._id,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const counts = {
      pending: 0,
      accepted: 0,
      declined: 0,
      cancelled: 0,
    };

    for (const row of statusCounts) {
      counts[row._id] =
        row.count;
    }

    // Calculate distance when lat/lng are provided
    const latNum =
      lat !== undefined
        ? Number(lat)
        : undefined;

    const lngNum =
      lng !== undefined
        ? Number(lng)
        : undefined;

    const hasValidLocation =
      latNum !== undefined &&
      lngNum !== undefined &&
      !Number.isNaN(latNum) &&
      !Number.isNaN(lngNum);

    const requests =
      requestDocs.map(
        (request) => {
          const requestObj =
            request.toObject();

          if (
            hasValidLocation &&
            request.task?.coordinates
              ?.coordinates
          ) {
            const [
              taskLng,
              taskLat,
            ] =
              request.task.coordinates
                .coordinates;

            requestObj.distanceInMiles =
              getDistanceInMiles(
                latNum,
                lngNum,
                taskLat,
                taskLng
              );
          }

          return requestObj;
        }
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Incoming requests fetched successfully",
        {
          requests,
          counts,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(
              total / limitNum
            ),
          },
        }
      )
    );
  });

// ============================================================
// GET MY REQUESTS
// ============================================================

export const getMyRequests =
  asyncHandler(async (req, res) => {
    const {
      status = "all",
      page = 1,
      limit = 12,
    } = req.query;

    const query = {
      requester: req.user._id,
    };

    if (status !== "all") {
      if (
        !REQUEST_STATUSES.includes(
          status
        )
      ) {
        return res.status(400).json(
          new ApiError(
            400,
            `Status must be one of: ${REQUEST_STATUSES.join(
              ", "
            )}`
          )
        );
      }

      query.status = status;
    }

    const pageNum = Math.max(
      Number(page) || 1,
      1
    );

    const limitNum = Math.min(
      Math.max(
        Number(limit) || 12,
        1
      ),
      50
    );

    const skip =
      (pageNum - 1) * limitNum;

    const [
      requests,
      total,
      statusCounts,
    ] = await Promise.all([
      Request.find(query)
        .populate(
          "task",
          "title category images status location startDate startTime"
        )
        .populate(
          "taskOwner",
          "firstName lastName profilePicture"
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNum),

      Request.countDocuments(query),

      Request.aggregate([
        {
          $match: {
            requester:
              req.user._id,
          },
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const counts = {
      pending: 0,
      accepted: 0,
      declined: 0,
      cancelled: 0,
    };

    for (const row of statusCounts) {
      counts[row._id] =
        row.count;
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        "My requests fetched successfully",
        {
          requests,
          counts,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(
              total / limitNum
            ),
          },
        }
      )
    );
  });

// ============================================================
// ACCEPT REQUEST
// ============================================================

export const acceptRequest =
  asyncHandler(async (req, res) => {
    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json(
        new ApiError(
          404,
          "Request not found"
        )
      );
    }

    // Only task owner can accept
    if (
      String(request.taskOwner) !==
      String(req.user._id)
    ) {
      return res.status(403).json(
        new ApiError(
          403,
          "You can only accept requests on your own tasks"
        )
      );
    }

    // Request must still be pending
    if (
      request.status !== "pending"
    ) {
      return res.status(400).json(
        new ApiError(
          400,
          `Request is already ${request.status}`
        )
      );
    }

    // Find associated task
    const task =
      await Task.findById(
        request.task
      );

    if (!task) {
      return res.status(404).json(
        new ApiError(
          404,
          "Associated task not found"
        )
      );
    }

    // ========================================================
    // ACCEPT REQUEST
    // ========================================================

    request.status = "accepted";

    await request.save();

    // ========================================================
    // DECLINE OTHER PENDING REQUESTS
    // ========================================================

    await Request.updateMany(
      {
        task: task._id,
        _id: {
          $ne: request._id,
        },
        status: "pending",
      },
      {
        $set: {
          status: "declined",
        },
      }
    );

    // ========================================================
    // UPDATE TASK
    // ========================================================

    task.status = "in_progress";
    task.assignedTo =
      request.requester;

    await task.save();

    // ========================================================
    // CREATE / REUSE CONVERSATION
    // ========================================================

    let conversation =
      await Conversation.findOne({
        task: task._id,
      });

    if (!conversation) {
      conversation =
        await Conversation.create({
          task: task._id,
          participants: [
            request.taskOwner,
            request.requester,
          ],
        });
    } else {
      const participantIds =
        conversation.participants.map(
          (id) => String(id)
        );

      const ownerId =
        String(request.taskOwner);

      const requesterId =
        String(request.requester);

      const participants = [
        ...conversation.participants,
      ];

      if (
        !participantIds.includes(
          ownerId
        )
      ) {
        participants.push(
          request.taskOwner
        );
      }

      if (
        !participantIds.includes(
          requesterId
        )
      ) {
        participants.push(
          request.requester
        );
      }

      conversation.participants =
        participants;

      await conversation.save();
    }

    // ========================================================
    // POPULATE CONVERSATION
    // ========================================================

    const populatedConversation =
      await Conversation.findById(
        conversation._id
      )
        .populate(
          "participants",
          "firstName lastName profilePicture"
        )
        .populate(
          "task",
          "title status"
        );

    // ========================================================
    // NOTIFY REQUESTER
    // ========================================================

    await createNotification({
      recipient:
        request.requester,
      sender: req.user._id,
      type: "request",
      category:
        "request_accepted",
      title:
        "Your request has been accepted",
      message: `${req.user.firstName} ${req.user.lastName} accepted your request for ${task.title}.`,
      relatedId: request._id,
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Request accepted successfully",
        {
          request,
          conversation:
            populatedConversation,
        }
      )
    );
  });

// ============================================================
// DECLINE REQUEST
// ============================================================

export const declineRequest =
  asyncHandler(async (req, res) => {
    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json(
        new ApiError(
          404,
          "Request not found"
        )
      );
    }

    // Only task owner can decline
    if (
      String(request.taskOwner) !==
      String(req.user._id)
    ) {
      return res.status(403).json(
        new ApiError(
          403,
          "You can only decline requests on your own tasks"
        )
      );
    }

    if (
      request.status !== "pending"
    ) {
      return res.status(400).json(
        new ApiError(
          400,
          `Request is already ${request.status}`
        )
      );
    }

    request.status = "declined";

    await request.save();

    // Notify requester
    await createNotification({
      recipient:
        request.requester,
      sender: req.user._id,
      type: "request",
      category:
        "request_declined",
      title:
        "Your request was declined",
      message: `${req.user.firstName} ${req.user.lastName} declined your request.`,
      relatedId: request._id,
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Request declined",
        request
      )
    );
  });

// ============================================================
// CANCEL REQUEST
// ============================================================

export const cancelRequest =
  asyncHandler(async (req, res) => {
    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json(
        new ApiError(
          404,
          "Request not found"
        )
      );
    }

    // Only requester can cancel
    if (
      String(request.requester) !==
      String(req.user._id)
    ) {
      return res.status(403).json(
        new ApiError(
          403,
          "You can only cancel your own requests"
        )
      );
    }

    if (
      request.status !== "pending"
    ) {
      return res.status(400).json(
        new ApiError(
          400,
          "Only pending requests can be cancelled"
        )
      );
    }

    request.status = "cancelled";

    await request.save();

    // Decrement applicants count
    const task =
      await Task.findById(
        request.task
      );

    if (
      task &&
      task.applicantsCount > 0
    ) {
      task.applicantsCount -= 1;

      await task.save();
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        "Request cancelled",
        request
      )
    );
  });