import React from "react";
import { Filter, Grid, Folder, ArrowUpDown } from "lucide-react";

export default function FilterBar({ filters, onChange, categories = [] }) {
  const handleStatusChange = (e) => {
    onChange({ ...filters, status: e.target.value });
  };

  const handleCategoryChange = (e) => {
    onChange({ ...filters, category: e.target.value });
  };

  const handleSortChange = (e) => {
    onChange({ ...filters, sort: e.target.value });
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-controls-left">
        {/* Status Dropdown */}
        <div className="select-wrapper">
          <Grid size={16} className="select-icon" />
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="select-wrapper">
          <Folder size={16} className="select-icon" />
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Tech">Tech</option>
            <option value="Car Care">Car Care</option>
            <option value="Gardening">Gardening</option>
            <option value="Assembly">Assembly</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Moving">Moving</option>
            <option value="Painting">Painting</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="select-wrapper">
          <ArrowUpDown size={16} className="select-icon" />
          <select
            value={filters.sort}
            onChange={handleSortChange}
            className="filter-select"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="budget-high">Budget: High to Low</option>
            <option value="budget-low">Budget: Low to High</option>
          </select>
        </div>
      </div>

      {/* Filter Button */}
      <button className="filter-btn">
        <Filter size={16} />
        <span>Filter</span>
      </button>
    </div>
  );
}