import React from "react";
import { Grid, Folder, ArrowUpDown } from "lucide-react";

export default function FilterBar({
  filters,
  onChange,
  categories = [],
}) {
  const handleStatusChange = (event) => {
    onChange({
      ...filters,
      status: event.target.value,
    });
  };

  const handleCategoryChange = (event) => {
    onChange({
      ...filters,
      category: event.target.value,
    });
  };

  const handleSortChange = (event) => {
    onChange({
      ...filters,
      sort: event.target.value,
    });
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-controls-left">

        <div className="select-wrapper">
          <Grid
            size={16}
            className="select-icon"
          />

          <select
            value={filters?.status || "all"}
            onChange={handleStatusChange}
            className="filter-select"
            aria-label="Filter by status"
          >
            <option value="all">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="In Progress">
              In Progress
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Completed">
              Completed
            </option>
          </select>
        </div>

        <div className="select-wrapper">
          <Folder
            size={16}
            className="select-icon"
          />

          <select
            value={filters?.category || "all"}
            onChange={handleCategoryChange}
            className="filter-select"
            aria-label="Filter by category"
          >
            <option value="all">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="select-wrapper">
          <ArrowUpDown
            size={16}
            className="select-icon"
          />

          <select
            value={filters?.sort || "newest"}
            onChange={handleSortChange}
            className="filter-select"
            aria-label="Sort tasks"
          >
            <option value="newest">
              Sort: Newest
            </option>

            <option value="oldest">
              Sort: Oldest
            </option>

            <option value="budget-high">
              Budget: High to Low
            </option>

            <option value="budget-low">
              Budget: Low to High
            </option>
          </select>
        </div>

      </div>
    </div>
  );
}
