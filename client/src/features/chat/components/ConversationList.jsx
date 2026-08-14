import React from "react";

export default function ConversationList({
  conversations = [],
  selectedConversation,
  onSelectConversation,
  loading = false,
}) {
  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        Loading conversations...
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div
        style={{
          padding: "30px 20px",
          textAlign: "center",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        No conversations yet.
        <br />
        Conversations will appear after a request is accepted.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        overflowY: "auto",
      }}
    >
      {conversations.map((conversation) => {
        const otherParticipant =
          conversation.participants?.find(
            (participant) =>
              String(participant?._id) !==
              String(localStorage.getItem("userId"))
          ) || conversation.participants?.[0];

        const participantName = otherParticipant
          ? `${otherParticipant.firstName || ""} ${
              otherParticipant.lastName || ""
            }`.trim()
          : "User";

        const taskTitle =
          conversation.task?.title || "Task conversation";

        const isSelected =
          selectedConversation?._id === conversation._id;

        return (
          <button
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            style={{
              width: "100%",
              border: "none",
              borderBottom: "1px solid #ECECEC",
              background: isSelected ? "#F5F3FF" : "#FFFFFF",
              padding: "16px",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <img
              src={
                otherParticipant?.profilePicture ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${participantName}`
              }
              alt={participantName}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {taskTitle}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#6B7280",
                  marginTop: "4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {participantName}
              </div>

              {conversation.lastMessage?.text && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#9CA3AF",
                    marginTop: "4px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conversation.lastMessage.text}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}