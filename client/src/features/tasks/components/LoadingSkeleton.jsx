import React from "react";

export default function LoadingSkeleton({ count = 4 }) {
  return (
    <div className="task-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="task-card skeleton">
          <div className="skeleton-img" />
          <div className="skeleton-line w-60" />
          <div className="skeleton-line w-40" />
          <div className="skeleton-line w-80" />
        </div>
      ))}
    </div>
  );
}