import React from "react";

export default function LoadingSkeleton() {
  return (
    <div className="task-grid-container">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="task-card-skeleton">
          <div className="skeleton-img-box" />
          <div className="skeleton-content-box">
            <div className="skeleton-title-line" />
            <div className="skeleton-meta-line" />
            <div className="skeleton-desc-line" />
          </div>
        </div>
      ))}
    </div>
  );
}