import React from "react";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks"
      />
    </div>
  );
}