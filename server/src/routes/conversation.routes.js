import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  getConversations,
} from "../controllers/conversation.controller.js";

import {
  getMessages,
  sendMessage,
  markConversationAsRead,
} from "../controllers/message.controller.js";

const router = express.Router();

// Get conversations for logged-in user
router.get(
  "/",
  protect,
  getConversations
);

// Get messages for a conversation
router.get(
  "/:conversationId/messages",
  protect,
  getMessages
);

// Send a message
router.post(
  "/:conversationId/messages",
  protect,
  sendMessage
);

// Mark conversation as read
router.patch(
  "/:conversationId/read",
  protect,
  markConversationAsRead
);

export default router;