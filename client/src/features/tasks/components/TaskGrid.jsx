import React from "react";
import TaskCard from "./TaskCard";

export default function TaskGrid({ tasks, onChange }) {
  return (
    <div className="task-grid">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onChange={onChange} />
      ))}
    </div>
  );
}