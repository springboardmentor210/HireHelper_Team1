import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import ConversationList from "../components/ConversationList";
import MessageThread from "../components/MessageThread";
import MessageComposer from "../components/MessageComposer";

import {
  getConversations,
  getMessages,
  sendMessage,
  markConversationAsRead,
} from "../services/chat.service";

// =========================================================
// SOCKET.IO SERVER URL
// =========================================================

const SOCKET_URL =
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace(
        /\/api\/?$/,
        ""
      )
    : "http://localhost:5000";

export default function Chat() {
  const navigate = useNavigate();
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] =
    useState(null);
  const [messages, setMessages] = useState([]);

  const [loadingConversations, setLoadingConversations] =
    useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const [error, setError] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  // =========================================================
  // CURRENT USER
  // =========================================================

  const getCurrentUserId = useCallback(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      return userId;
    }

    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  }, []);

  const currentUserId = getCurrentUserId();

  // =========================================================
  // API RESPONSE HELPER
  // =========================================================

  const extractData = useCallback((response) => {
    if (!response) {
      return null;
    }

    if (response.data !== undefined) {
      return response.data;
    }

    return response;
  }, []);

  // =========================================================
  // FIND CONVERSATION
  // =========================================================

  const findConversationById = useCallback(
    (conversationList, id) => {
      if (!id) {
        return null;
      }

      return (
        conversationList.find(
          (conversation) =>
            String(conversation?._id) === String(id)
        ) || null
      );
    },
    []
  );

  // =========================================================
  // LOAD CONVERSATIONS
  // =========================================================

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const response = await getConversations();

      const data = extractData(response);

      const conversationList = Array.isArray(data)
        ? data
        : data?.conversations || [];

      setConversations(conversationList);

      if (conversationId) {
        const requestedConversation =
          findConversationById(
            conversationList,
            conversationId
          );

        if (requestedConversation) {
          setSelectedConversation(
            requestedConversation
          );
        } else {
          setSelectedConversation(null);

          setError(
            "This conversation was not found or you do not have access to it."
          );
        }

        return;
      }

      setSelectedConversation(null);
    } catch (err) {
      console.error(
        "Failed to load conversations:",
        err
      );

      setError(
        err.message ||
          "Failed to load conversations."
      );
    } finally {
      setLoadingConversations(false);
    }
  }, [
    conversationId,
    extractData,
    findConversationById,
  ]);

  // =========================================================
  // INITIAL CONVERSATION LOAD
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadConversations();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadConversations]);

  // =========================================================
  // SELECT CONVERSATION
  // =========================================================

  const handleSelectConversation = (conversation) => {
    if (!conversation?._id) {
      return;
    }

    setSelectedConversation(conversation);
    setMessages([]);

    navigate(`/chat/${conversation._id}`);
  };

  // =========================================================
  // LOAD MESSAGE HISTORY
  // =========================================================

  const loadMessages = useCallback(
    async (conversation) => {
      if (!conversation?._id) {
        return;
      }

      try {
        setLoadingMessages(true);
        setError("");

        const response = await getMessages(
          conversation._id
        );

        const data = extractData(response);

        const messageList = Array.isArray(data)
          ? data
          : data?.messages || [];

        setMessages(messageList);

        await markConversationAsRead(
          conversation._id
        );
      } catch (err) {
        console.error(
          "Failed to load messages:",
          err
        );

        setError(
          err.message ||
            "Failed to load messages."
        );

        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    },
    [extractData]
  );

  // =========================================================
  // LOAD MESSAGES WHEN CONVERSATION CHANGES
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedConversation) {
        loadMessages(selectedConversation);
      } else {
        setMessages([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [
    selectedConversation,
    loadMessages,
  ]);

  // =========================================================
  // SINGLE SOCKET.IO CONNECTION
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
      upgrade: true,
      auth: {
        token,
      },
    });

    // -------------------------------------------------------
    // CONNECT
    // -------------------------------------------------------

    socket.on("connect", () => {
      console.log(
        "🔌 Connected to Socket.IO:",
        socket.id
      );

      setSocketConnected(true);

      // Join the currently selected conversation
      if (conversationId) {
        socket.emit(
          "joinConversation",
          conversationId
        );

        console.log(
          `💬 Joined conversation: ${conversationId}`
        );
      }
    });

    // -------------------------------------------------------
    // CONNECTION ERROR
    // -------------------------------------------------------

    socket.on("connect_error", (err) => {
      console.error(
        "❌ Socket.IO connection error:",
        err.message
      );

      setSocketConnected(false);
    });

    // -------------------------------------------------------
    // DISCONNECT
    // -------------------------------------------------------

    socket.on("disconnect", (reason) => {
      console.log(
        "🔌 Socket disconnected:",
        reason
      );

      setSocketConnected(false);
    });

    // -------------------------------------------------------
    // RECEIVE NEW MESSAGE
    // -------------------------------------------------------

    socket.on("newMessage", (newMessage) => {
      console.log(
        "📨 REAL-TIME MESSAGE RECEIVED:",
        newMessage
      );

      if (!newMessage?._id) {
        return;
      }

      const messageConversationId =
        newMessage.conversation?._id ||
        newMessage.conversation;

      // Ignore messages from another conversation
      if (
        String(messageConversationId) !==
        String(conversationId)
      ) {
        return;
      }

      setMessages((previousMessages) => {
        // Prevent duplicates
        const alreadyExists =
          previousMessages.some(
            (message) =>
              String(message._id) ===
              String(newMessage._id)
          );

        if (alreadyExists) {
          return previousMessages;
        }

        return [
          ...previousMessages,
          newMessage,
        ];
      });

      // If the message came from the other participant,
      // mark it as read.
      const senderId =
        newMessage.sender?._id ||
        newMessage.sender;

      if (
        senderId &&
        String(senderId) !==
          String(currentUserId)
      ) {
        markConversationAsRead(
          conversationId
        ).catch((err) => {
          console.error(
            "Failed to mark message as read:",
            err
          );
        });
      }
    });

    // -------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------

    return () => {
      if (conversationId) {
        socket.emit(
          "leaveConversation",
          conversationId
        );
      }

      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("newMessage");

      socket.disconnect();
    };
  }, [conversationId, currentUserId]);

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSendMessage = async (text) => {
    if (
      !selectedConversation?._id ||
      !text?.trim()
    ) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await sendMessage(
        selectedConversation._id,
        text.trim()
      );

      const data = extractData(response);

      const newMessage =
        data?.message || data;

      if (newMessage?._id) {
        // Add message for sender immediately.
        // The Socket.IO event is also received,
        // but duplicate protection prevents adding
        // it twice.
        setMessages((previousMessages) => {
          const alreadyExists =
            previousMessages.some(
              (message) =>
                String(message._id) ===
                String(newMessage._id)
            );

          if (alreadyExists) {
            return previousMessages;
          }

          return [
            ...previousMessages,
            newMessage,
          ];
        });

        // Update conversation preview
        setConversations((previous) =>
          previous.map((conversation) => {
            if (
              String(conversation._id) !==
              String(
                selectedConversation._id
              )
            ) {
              return conversation;
            }

            return {
              ...conversation,
              lastMessage: newMessage,
              updatedAt:
                newMessage.createdAt ||
                new Date().toISOString(),
            };
          })
        );
      }
    } catch (err) {
      console.error(
        "Failed to send message:",
        err
      );

      setError(
        err.message ||
          "Failed to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // =========================================================
  // OTHER PARTICIPANT
  // =========================================================

  const getOtherParticipant = () => {
    if (
      !selectedConversation?.participants
        ?.length
    ) {
      return null;
    }

    return (
      selectedConversation.participants.find(
        (participant) =>
          String(participant?._id) !==
          String(currentUserId)
      ) ||
      selectedConversation.participants[0]
    );
  };

  const otherParticipant =
    getOtherParticipant();

  const participantName = otherParticipant
    ? `${otherParticipant.firstName || ""} ${
        otherParticipant.lastName || ""
      }`.trim() || "User"
    : "User";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
            color: "#111827",
          }}
        >
          Messages
        </h1>

        <p
          style={{
            marginTop: "6px",
            color: "#6B7280",
          }}
        >
          Chat with people involved in
          your accepted tasks.
        </p>

        <div
          style={{
            marginTop: "8px",
            fontSize: "12px",
            color: socketConnected
              ? "#16A34A"
              : "#9CA3AF",
          }}
        >
          {socketConnected
            ? "● Real-time connected"
            : "○ Connecting to real-time chat..."}
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "12px 16px",
            borderRadius: "10px",
            background: "#FEF2F2",
            color: "#B91C1C",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* =====================================================
          CHAT CONTAINER
      ===================================================== */}

      <div
        style={{
          height: "calc(100vh - 150px)",
          minHeight: "500px",
          display: "flex",
          background: "#FFFFFF",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* =================================================
            CONVERSATION LIST
        ================================================= */}

        <div
          style={{
            width: "320px",
            minWidth: "320px",
            borderRight:
              "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "18px",
              borderBottom:
                "1px solid #E5E7EB",
              fontWeight: 700,
              fontSize: "17px",
              color: "#111827",
            }}
          >
            Conversations
          </div>

          <ConversationList
            conversations={conversations}
            selectedConversation={
              selectedConversation
            }
            onSelectConversation={
              handleSelectConversation
            }
            loading={
              loadingConversations
            }
          />
        </div>

        {/* =================================================
            MESSAGE AREA
        ================================================= */}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {!selectedConversation ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9CA3AF",
                textAlign: "center",
                padding: "30px",
              }}
            >
              {loadingConversations
                ? "Loading conversations..."
                : conversations.length === 0
                ? "No conversations yet. Conversations will appear after a request is accepted."
                : "Select a conversation to start chatting."}
            </div>
          ) : (
            <>
              {/* =============================================
                  CHAT HEADER
              ============================================= */}

              <div
                style={{
                  padding:
                    "16px 20px",
                  borderBottom:
                    "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <img
                  src={
                    otherParticipant?.profilePicture ||
                    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                      participantName
                    )}`
                  }
                  alt={participantName}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />

                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#111827",
                    }}
                  >
                    {selectedConversation
                      .task?.title ||
                      "Task Conversation"}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#6B7280",
                      marginTop: "3px",
                    }}
                  >
                    {participantName}
                  </div>
                </div>
              </div>

              {/* =============================================
                  MESSAGES
              ============================================= */}

              <MessageThread
                messages={messages}
                currentUserId={currentUserId}
                loading={loadingMessages}
              />

              {/* =============================================
                  COMPOSER
              ============================================= */}

              <MessageComposer
                onSend={handleSendMessage}
                sending={sending}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}