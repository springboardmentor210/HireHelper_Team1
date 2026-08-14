import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// =========================================================
// AUTHORIZATION
// =========================================================

const getAuthorizedConversation = async (
  conversationId,
  userId
) => {
  return Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });
};

// =========================================================
// GET MESSAGES
// =========================================================

export const getMessages = asyncHandler(
  async (req, res) => {
    const { conversationId } = req.params;

    const conversation =
      await getAuthorizedConversation(
        conversationId,
        req.user._id
      );

    if (!conversation) {
      return res.status(403).json(
        new ApiError(
          403,
          "You do not have access to this conversation"
        )
      );
    }

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate(
        "sender",
        "firstName lastName profilePicture email"
      )
      .sort({
        createdAt: 1,
      });

    return res.status(200).json(
      new ApiResponse(
        200,
        "Messages fetched successfully",
        messages
      )
    );
  }
);

// =========================================================
// SEND MESSAGE
// =========================================================

export const sendMessage = asyncHandler(
  async (req, res) => {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json(
        new ApiError(
          400,
          "Message text is required"
        )
      );
    }

    if (text.trim().length > 2000) {
      return res.status(400).json(
        new ApiError(
          400,
          "Message cannot exceed 2000 characters"
        )
      );
    }

    // -------------------------------------------------------
    // Verify conversation access
    // -------------------------------------------------------

    const conversation =
      await getAuthorizedConversation(
        conversationId,
        req.user._id
      );

    if (!conversation) {
      return res.status(403).json(
        new ApiError(
          403,
          "You do not have access to this conversation"
        )
      );
    }

    // -------------------------------------------------------
    // Save message
    // -------------------------------------------------------

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
      readBy: [req.user._id],
    });

    // -------------------------------------------------------
    // Update conversation
    // -------------------------------------------------------

    conversation.lastMessage =
      message._id;

    await conversation.save();

    // -------------------------------------------------------
    // Populate sender
    // -------------------------------------------------------

    const populatedMessage =
      await Message.findById(
        message._id
      ).populate(
        "sender",
        "firstName lastName profilePicture email"
      );

    // -------------------------------------------------------
    // SOCKET.IO BROADCAST
    // -------------------------------------------------------

    const io = req.app.get("io");

    if (!io) {
      console.error(
        "❌ Socket.IO instance is not available on Express app"
      );
    } else {
      const roomName =
        `conversation:${conversationId}`;

      console.log(
        `📨 Broadcasting message to ${roomName}`
      );

      io.to(roomName).emit(
        "newMessage",
        populatedMessage
      );

      console.log(
        `✅ Message broadcast completed`
      );
    }

    // -------------------------------------------------------
    // REST RESPONSE
    // -------------------------------------------------------

    return res.status(201).json(
      new ApiResponse(
        201,
        "Message sent successfully",
        populatedMessage
      )
    );
  }
);

// =========================================================
// MARK AS READ
// =========================================================

export const markConversationAsRead =
  asyncHandler(async (req, res) => {
    const { conversationId } = req.params;

    const conversation =
      await getAuthorizedConversation(
        conversationId,
        req.user._id
      );

    if (!conversation) {
      return res.status(403).json(
        new ApiError(
          403,
          "You do not have access to this conversation"
        )
      );
    }

    await Message.updateMany(
      {
        conversation: conversationId,
        readBy: {
          $ne: req.user._id,
        },
      },
      {
        $addToSet: {
          readBy: req.user._id,
        },
      }
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Conversation marked as read",
        null
      )
    );
  });