import Conversation from "../models/Conversation.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Get all conversations for the logged-in user
export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
  })
    .populate(
      "participants",
      "firstName lastName profilePicture email"
    )
    .populate("task", "title status")
    .populate(
      "lastMessage",
      "sender text createdAt"
    )
    .sort({
      lastMessageAt: -1,
      updatedAt: -1,
    });

  return res.status(200).json(
    new ApiResponse(
      200,
      "Conversations fetched successfully",
      conversations
    )
  );
});