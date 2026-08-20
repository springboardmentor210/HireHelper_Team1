import React from "react";
import TaskCard from "./TaskCard";

export default function TaskGrid({
  tasks,
  applicantsByTask = {},
  onViewDetails,
  onDelete,
}) {
  return (
    <div className="task-grid-container">
      {tasks.map((task) => {
        const taskId =
          task?._id ||
          task?.id;

        const applicants =
          applicantsByTask[
            String(taskId)
          ] || [];

        return (
          <TaskCard
            key={taskId}
            task={task}
            applicants={applicants}
            onViewDetails={
              onViewDetails
            }
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}