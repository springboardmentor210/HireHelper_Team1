import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Trash2,
  Eye,
  CheckCircle,
} from "lucide-react";

export default function TaskMenu({
  task,
  onViewDetails,
  onDelete,
  onUpdateStatus,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const taskId = task?._id || task?.id;

  const rawStatus = String(
    task?.status || "active"
  ).toLowerCase();

  const canComplete =
    rawStatus === "active" ||
    rawStatus === "in_progress";

  const handleMarkCompleted = async () => {
    if (!taskId || !onUpdateStatus) {
      return;
    }

    setOpen(false);

    const confirmed = window.confirm(
      "Are you sure you want to mark this task as completed?"
    );

    if (!confirmed) {
      return;
    }

    await onUpdateStatus(
      taskId,
      "completed"
    );
  };

  return (
    <div
      className="task-menu-container"
      ref={menuRef}
    >
      <button
        type="button"
        className="menu-trigger-btn"
        onClick={() => setOpen(!open)}
        aria-label="Task Options"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="task-dropdown-menu">

          {/* View Details */}
          <button
            type="button"
            className="menu-item-btn"
            onClick={() => {
              setOpen(false);
              onViewDetails(task);
            }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>

          {/* Mark Completed */}
          {canComplete && (
            <>
              <div className="menu-divider" />

              <button
                type="button"
                className="menu-item-btn"
                onClick={handleMarkCompleted}
              >
                <CheckCircle size={16} />
                <span>Mark as Completed</span>
              </button>
            </>
          )}

          <div className="menu-divider" />

          {/* Delete */}
          <button
            type="button"
            className="menu-item-btn danger"
            onClick={() => {
              setOpen(false);
              onDelete(taskId);
            }}
          >
            <Trash2 size={16} />
            <span>Delete Task</span>
          </button>

        </div>
      )}
    </div>
  );
}