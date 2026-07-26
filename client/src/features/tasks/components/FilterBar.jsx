import React from "react";
import { SlidersHorizontal, LayoutGrid, Folder, ArrowUpDown } from "lucide-react";

export default function FilterBar({ filters, onChange }) {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div className="filter-select">
          <LayoutGrid size={14} />
          <select value={filters.status} onChange={(e) => update("status", e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-select">
          <Folder size={14} />
          <select value={filters.category} onChange={(e) => update("category", e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Car Care">Car Care</option>
             <option value="Gardening">Gardening</option>
            <option value="Assembly">Assembly</option>
          </select>
        </div>

        <div className="filter-select">
          <ArrowUpDown size={14} />
          <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="budget-high">Budget: High → Low</option>
            <option value="budget-low">Budget: Low → High</option>
          </select>
        </div>
      </div>

      <button className="filter-btn" type="button">
        <SlidersHorizontal size={14} /> Filter
      </button>
    </div>
  );
}