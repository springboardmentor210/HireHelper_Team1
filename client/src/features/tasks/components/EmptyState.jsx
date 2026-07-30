import React from "react";
import { ClipboardX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="empty-state-wrapper">
      <div className="empty-state-icon">
        <ClipboardX size={48} color="#9ca3af" />
      </div>
      <h3 className="empty-state-title">No Tasks Found</h3>
      <p className="empty-state-text">
        You haven't created any tasks matching your filters yet. Click below to add a new task!
      </p>
      <button
        type="button"
        className="btn-create-task-primary"
        onClick={() => navigate("/addtasks")}
      >
        + Add New Task
      </button>
    </div>
  );
}