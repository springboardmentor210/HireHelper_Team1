import React, { useState } from "react";

export default function MessageComposer({
  onSend,
  sending = false,
}) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || sending) {
      return;
    }

    await onSend(trimmedText);

    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "10px",
        padding: "16px",
        borderTop: "1px solid #ECECEC",
        background: "#FFFFFF",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        maxLength={2000}
        disabled={sending}
        style={{
          flex: 1,
          border: "1px solid #D1D5DB",
          borderRadius: "12px",
          padding: "12px 14px",
          outline: "none",
          fontSize: "14px",
        }}
      />

      <button
        type="submit"
        disabled={!text.trim() || sending}
        style={{
          border: "none",
          borderRadius: "12px",
          padding: "0 22px",
          background:
            !text.trim() || sending
              ? "#D1D5DB"
              : "#4F46E5",
          color: "#FFFFFF",
          fontWeight: 600,
          cursor:
            !text.trim() || sending
              ? "not-allowed"
              : "pointer",
        }}
      >
        {sending ? "Sending..." : "Send"}
      </button>
    </form>
  );
}