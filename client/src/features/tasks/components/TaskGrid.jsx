import React from "react";
import TaskCard from "./TaskCard";

export default function TaskGrid({
  tasks,
  onViewApplicants,
  onViewDetails,
  onBookmark,
  onDelete,
}) {
  return (
    <div className="task-grid-container">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onViewApplicants={onViewApplicants}
          onViewDetails={onViewDetails}
          onBookmark={onBookmark}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}