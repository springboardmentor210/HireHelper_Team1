import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Eye } from "lucide-react";

export default function TaskMenu({ task, onViewDetails, onDelete }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            onClick={() => {
              setOpen(false);
              onViewDetails(task);
            }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </button>

          <div className="menu-divider" />

          <button
            type="button"
            className="menu-item-btn danger"
            onClick={() => {
              setOpen(false);
              onDelete(task.id);
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