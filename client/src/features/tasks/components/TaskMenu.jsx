import React, { useEffect, useRef, useState } from "react";
import { MoreVertical, Edit, Copy, Trash2, Share2, Archive } from "lucide-react";

export default function TaskMenu({ onEdit, onDuplicate, onDelete, onShare, onArchive }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const items = [
    { icon: <Edit size={14} />, label: "Edit Task", onClick: onEdit },
    { icon: <Copy size={14} />, label: "Duplicate Task", onClick: onDuplicate },
    { icon: <Trash2 size={14} />, label: "Delete Task", onClick: onDelete, danger: true },
    { icon: <Share2 size={14} />, label: "Share Task", onClick: onShare },
    { icon: <Archive size={14} />, label: "Archive Task", onClick: onArchive },
  ];

  return (
    <div className="task-menu" ref={ref}>
      <button className="task-menu-trigger" onClick={() => setOpen((v) => !v)} aria-label="Task options">
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="task-menu-dropdown">
          {items.map((it, i) => (
            <button key={i} className={`menu-item ${it.danger ? "danger" : ""}`} onClick={() => { setOpen(false); it.onClick?.(); }}>
              {it.icon} <span>{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}