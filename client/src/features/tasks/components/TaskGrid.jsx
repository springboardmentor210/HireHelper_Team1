import React from "react";
import TaskCard from "./TaskCard";

export default function TaskGrid({
  tasks,
  onViewDetails,
  onDelete,
}) {
  return (
    <div className="task-grid-container">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}