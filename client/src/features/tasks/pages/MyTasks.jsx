import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/layout/Sidebar";
import SearchBar from "../components/SearchBar";
import StatsCards from "../components/StatsCards";
import FilterBar from "../components/FilterBar";
import TaskGrid from "../components/TaskGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import TaskDetailsModal from "../components/TaskDetailsModal";
import * as taskService from "../../../services/taskService";
import "../Styles/MyTasks.css";

export default function MyTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    active: 12,
    inProgress: 5,
    completed: 84,
    totalApplicants: 23,
    totalEarnings: 2340,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    sort: "newest",
  });

  const [detailModalTask, setDetailModalTask] = useState(null);

  // Search Debounce Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Load Tasks and Statistics
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getMyTasks();
      setTasks(data.tasks || []);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load tasks data:", err);
      setError(err?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and Sort Logic
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Status Filter
    if (filters.status !== "all") {
      result = result.filter((t) => t.status === filters.status);
    }

    // Category Filter
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }

    // Search Query Filter
    if (debouncedSearch) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(debouncedSearch) ||
          t.description.toLowerCase().includes(debouncedSearch) ||
          t.category.toLowerCase().includes(debouncedSearch) ||
          t.location.toLowerCase().includes(debouncedSearch)
      );
    }

    // Sorting
    switch (filters.sort) {
      case "budget-high":
      case "price-high":
        result.sort((a, b) => ((b.price ?? b.budget) || 0) - ((a.price ?? a.budget) || 0));
        break;
      case "budget-low":
      case "price-low":
        result.sort((a, b) => ((a.price ?? a.budget) || 0) - ((b.price ?? b.budget) || 0));
        break;
      case "oldest":
        result.reverse();
        break;
      default: // newest
        break;
    }

    return result;
  }, [tasks, filters, debouncedSearch]);

  // Action Handlers


  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.deleteTask(taskId);
        loadData();
      } catch (err) {
        console.error("Delete action failed:", err);
      }
    }
  };

  return (
    <div className="my-tasks-layout">
      {/* Recreated exact Sidebar matching Figma */}
      <Sidebar />

      {/* Main Page Area */}
      <main className="my-tasks-main-content">
        {/* Page Top Header Bar */}
        <header className="my-tasks-header">
          <div className="header-titles">
            <h1 className="main-page-title">My Tasks</h1>
            <p className="main-page-subtitle">Manage every task you've created.</p>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            onNotificationClick={() => navigate("/notifications")}
          />
        </header>

        {/* 5 Metrics Stats Bar */}
        <StatsCards stats={stats} />

        {/* Filter Dropdowns and Filter Button */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          categories={Array.from(new Set(tasks.map((t) => t.category)))}
        />

        {/* Task Cards Grid / States */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="error-banner">{error}</div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskGrid
            tasks={filteredTasks}
            onViewDetails={(task) => setDetailModalTask(task)}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Task Details Modal Overlay */}
      {detailModalTask && (
        <TaskDetailsModal
          task={detailModalTask}
          onClose={() => setDetailModalTask(null)}
        />
      )}
    </div>
  );
}