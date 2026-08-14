import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// =========================================================
// DATABASE
// =========================================================

await connectDB();

// =========================================================
// HTTP SERVER
// =========================================================

const httpServer = http.createServer(app);

// =========================================================
// SOCKET.IO
// =========================================================

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
    ],
    credentials: true,
  },
});

// IMPORTANT:
// Make Socket.IO available to Express controllers.
app.set("io", io);

// =========================================================
// SOCKET CONNECTION
// =========================================================

io.on("connection", (socket) => {
  console.log(
    `🔌 Socket connected: ${socket.id}`
  );

  // -------------------------------------------------------
  // Join conversation
  // -------------------------------------------------------

  socket.on(
    "joinConversation",
    (conversationId) => {
      if (!conversationId) {
        console.log(
          "⚠️ Missing conversation ID"
        );
        return;
      }

      const roomName =
        `conversation:${conversationId}`;

      socket.join(roomName);

      console.log(
        `💬 ${socket.id} joined ${roomName}`
      );
    }
  );

  // -------------------------------------------------------
  // Leave conversation
  // -------------------------------------------------------

  socket.on(
    "leaveConversation",
    (conversationId) => {
      if (!conversationId) {
        return;
      }

      const roomName =
        `conversation:${conversationId}`;

      socket.leave(roomName);

      console.log(
        `👋 ${socket.id} left ${roomName}`
      );
    }
  );

  // -------------------------------------------------------
  // Disconnect
  // -------------------------------------------------------

  socket.on("disconnect", (reason) => {
    console.log(
      `❌ Socket disconnected: ${socket.id}`
    );

    console.log(
      `Reason: ${reason}`
    );
  });
});

// =========================================================
// START SERVER
// =========================================================

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );

  console.log(
    "🔴 Socket.IO real-time chat enabled"
  );
});