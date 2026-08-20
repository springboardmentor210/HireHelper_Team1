import React from "react";
import TaskCard from "./TaskCard";

export default function TaskGrid({
  tasks = [],
  applicantsByTask = {},
  onViewDetails,
  onDelete,
  onUpdateStatus,
}) {
  return (
    <div className="tasks-grid">
      {tasks.map((task) => {
        const taskId = task?._id || task?.id;

        return (
          <TaskCard
            key={taskId}
            task={task}
            applicants={
              applicantsByTask[String(taskId)] || []
            }
            onViewDetails={onViewDetails}
            onDelete={onDelete}
            onUpdateStatus={onUpdateStatus}
          />
        );
      })}
    </div>
  );
}