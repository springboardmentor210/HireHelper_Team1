import React from "react";

export default function MessageThread({
  messages = [],
  currentUserId,
  loading = false,
}) {
  if (loading) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6B7280",
        }}
      >
        Loading messages...
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9CA3AF",
          fontSize: "14px",
        }}
      >
        No messages yet.
        <br />
        Start the conversation.
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: "#FAFAFA",
      }}
    >
      {messages.map((message) => {
        const senderId =
          message.sender?._id || message.sender;

        const isMine =
          String(senderId) === String(currentUserId);

        const senderName = message.sender
          ? `${message.sender.firstName || ""} ${
              message.sender.lastName || ""
            }`.trim()
          : "";

        return (
          <div
            key={message._id}
            style={{
              display: "flex",
              justifyContent: isMine
                ? "flex-end"
                : "flex-start",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "12px 16px",
                borderRadius: isMine
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px",
                background: isMine
                  ? "#4F46E5"
                  : "#FFFFFF",
                color: isMine
                  ? "#FFFFFF"
                  : "#111827",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              {!isMine && senderName && (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "5px",
                    color: "#4F46E5",
                  }}
                >
                  {senderName}
                </div>
              )}

              <div
                style={{
                  fontSize: "14px",
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {message.text}
              </div>

              <div
                style={{
                  fontSize: "10px",
                  marginTop: "5px",
                  opacity: 0.65,
                  textAlign: "right",
                }}
              >
                {message.createdAt
                  ? new Date(
                      message.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}