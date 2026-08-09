import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Bookmark, Trash2, Eye, Users } from "lucide-react";

export default function TaskMenu({ task, onViewApplicants, onViewDetails, onBookmark, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="task-menu-container" ref={menuRef}>
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
          <button
            type="button"
            className="menu-item-btn"
            onClick={() => { setOpen(false); onViewApplicants(task); }}
          >
            <Users size={16} />
            <span>View Applicants ({task.applicants || 0})</span>
          </button>

          <button
            type="button"
            className="menu-item-btn"
            onClick={() => { setOpen(false); onViewDetails(task); }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>

          <button
            type="button"
            className="menu-item-btn"
            onClick={() => { setOpen(false); onBookmark(task.id); }}
          >
            <Bookmark size={16} />
            <span>{task.isBookmarked ? "Remove Bookmark" : "Bookmark Task"}</span>
          </button>

          <div className="menu-divider" />

          <button
            type="button"
            className="menu-item-btn danger"
            onClick={() => { setOpen(false); onDelete(task.id); }}
          >
            <Trash2 size={16} />
            <span>Delete Task</span>
          </button>
        </div>
      )}
    </div>
  );
}