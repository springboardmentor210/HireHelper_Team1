import React from "react";
import TaskCard from "./TaskCard";

export default function TaskGrid({
  tasks,
  onViewApplicants,
  onViewDetails,
  onDuplicate,
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
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}