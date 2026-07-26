import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import SearchBar from "../components/SearchBar";
import StatsCards from "../components/StatsCards";
import FilterBar from "../components/FilterBar";
import TaskGrid from "../components/TaskGrid";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import * as taskService from "../../../services/taskService";
import "../styles/MyTasks.css";

export default function MyTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ active: 0, inProgress: 0, completed: 0, totalApplicants: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({ status: "all", category: "all", sort: "newest" });

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const load = async () => {
    try {
      setLoading(true); setError(null);
      const [t, s] = await Promise.all([taskService.getTasks(), taskService.getStatistics()]);
      setTasks(t); setStats(s);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (filters.status !== "all") list = list.filter((t) => t.status === filters.status);
    if (filters.category !== "all") list = list.filter((t) => t.category === filters.category);
    if (debouncedSearch) {
      list = list.filter((t) =>
        t.title.toLowerCase().includes(debouncedSearch) ||
        t.description.toLowerCase().includes(debouncedSearch) ||
        t.category.toLowerCase().includes(debouncedSearch)
        );
    }
    switch (filters.sort) {
      case "budget-high": list.sort((a, b) => b.budget - a.budget); break;
      case "budget-low": list.sort((a, b) => a.budget - b.budget); break;
      case "oldest": list.reverse(); break;
      default: break;
    }
    return list;
  }, [tasks, filters, debouncedSearch]);

  return (
    <div className="my-tasks-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Manage every task you've created.</p>
        </div>

        <div className="header-right">
          <SearchBar value={search} onChange={setSearch} />
          <button
            className="notif-btn"
            onClick={() => navigate("/notifications")}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="notif-dot" />
          </button>
           </div>
      </header>

      <StatsCards stats={stats} />

      <FilterBar filters={filters} onChange={setFilters} />

      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <TaskGrid tasks={filtered} onChange={load} />
      )}
    </div>
  );
}