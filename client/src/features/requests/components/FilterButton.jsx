import { Filter } from "lucide-react";
import "../styles/FilterButton.css";

const FilterButton = ({ onClick }) => {
  return (
    <button
      type="button"
      className="filter-button"
      onClick={onClick}
    >
      <Filter size={15} strokeWidth={1.8} />
      <span>Filter</span>
    </button>
  );
};

export default FilterButton;