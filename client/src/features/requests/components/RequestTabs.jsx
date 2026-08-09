import React from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function RequestTabs({
  activeTab,
  onTabChange,
  counts,
  onFilterClick,
}) {
  const tabs = [
    { id: "all", label: "All Requests", count: counts.all ?? 0 },
    { id: "Pending", label: "Pending", count: counts.pending ?? 0 },
    { id: "Accepted", label: "Accepted", count: counts.accepted ?? 0 },
    { id: "Completed", label: "Completed", count: counts.completed ?? 0 },
    { id: "Cancelled", label: "Cancelled", count: counts.cancelled ?? 0 },
  ];

  return (
    <div className="request-tabs-container">
      <div className="tabs-list">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>

              <span
                className={`tab-count-badge ${
                  isActive ? "active" : ""
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="filter-button-wrapper">
        <button
          type="button"
          className="filter-btn"
          onClick={onFilterClick}
          aria-label="Filter"
        >
          <Filter size={14} className="filter-icon" />
          <span>Filter</span>
          <ChevronDown size={14} className="chevron-icon" />
        </button>
      </div>
    </div>
  );
}