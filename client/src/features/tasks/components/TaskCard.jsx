import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, Calendar, Clock, MapPin } from "lucide-react";
import TaskBadge from "./TaskBadge";
import ApplicantAvatars from "./ApplicantAvatars";
import TaskMenu from "./TaskMenu";
import * as taskService from "../../../services/taskService";

export default function TaskCard({ task, onChange }) {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(task.isBookmarked);

  const openTask = () => navigate(`/tasks/${task.id}`);
  const openApplicants = (e) => {
    e.stopPropagation();
    navigate(`/tasks/${task.id}/applicants`);
  };

  const toggleBookmark = async (e) => {
    e.stopPropagation();
    const next = !bookmarked;
    setBookmarked(next);
    try { await taskService.bookmarkTask(task.id, next); } catch { setBookmarked(!next); }
  };
  const handleEdit = () => navigate(`/tasks/${task.id}/edit`);
  const handleDuplicate = async () => { await taskService.duplicateTask(task.id); onChange?.(); };
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    await taskService.deleteTask(task.id); onChange?.();
  };
  const handleShare = () => {
    const url = `${window.location.origin}/tasks/${task.id}`;
    if (navigator.share) navigator.share({ title: task.title, url });
    else navigator.clipboard.writeText(url);
  };
  const handleArchive = async () => { await taskService.archiveTask(task.id); onChange?.(); };

  const isCompleted = task.status === "Completed";

  return (
    <div className="task-card" onClick={openTask} role="button" tabIndex={0}>
      <div className="task-image-wrap">
        <img src={task.image} alt={task.title} className="task-image" loading="lazy" />
        <div className="task-badge-wrap"><TaskBadge status={task.status} /></div>
        <button className={`bookmark-btn ${bookmarked ? "active" : ""}`} onClick={toggleBookmark} aria-label="Bookmark">
          <Bookmark size={16} fill={bookmarked ? "#111" : "none"} />
        </button>
        <div className="task-price">₹{task.budget}</div>
      </div>
 <div className="task-body">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-category">{task.category}</span>
        <p className="task-desc">{task.description}</p>

        <div className="task-meta">
          <div className="meta-row"><Calendar size={13} /> {task.date}</div>
          <div className="meta-row"><Clock size={13} /> {task.time}</div>
          <div className="meta-row"><MapPin size={13} /> {task.location}</div>
        </div>

        <div className="task-footer">
          <ApplicantAvatars count={task.applicants} />
          <div className="task-actions">
            <button className="primary-btn" onClick={openApplicants}>
              {isCompleted ? "View Details" : "View Applicants"}
            </button>
            <div onClick={(e) => e.stopPropagation()}>
              <TaskMenu
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onShare={handleShare}
                onArchive={handleArchive}
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}