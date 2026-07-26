import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No Tasks Found" }) {
  return (
    <div className="empty-state">
      <Inbox size={48} />
      <h3>{message}</h3>
      <p>Try adjusting your filters or create a new task.</p>
    </div>
  );
}