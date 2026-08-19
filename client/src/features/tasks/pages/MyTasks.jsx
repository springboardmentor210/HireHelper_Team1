import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    sort: "newest",
  });

  const [detailModalTask, setDetailModalTask] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await taskService.getMyTasks();

      const receivedTasks = Array.isArray(data?.tasks)
        ? data.tasks
        : [];

      setTasks(receivedTasks);

      if (data?.stats) {
        setStats((previousStats) => ({
          ...previousStats,
          ...data.stats,
        }));
      }
    } catch (err) {
      console.error("Failed to load My Tasks:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load tasks. Please try again."
      );

      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    const uniqueCategories = tasks
      .map((task) => task?.category)
      .filter(Boolean)
      .map((category) => String(category));

    return [...new Set(uniqueCategories)].sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filters.status !== "all") {
      result = result.filter((task) => {
        const taskStatus = String(
          task?.status || ""
        ).toLowerCase();

        return (
          taskStatus ===
          String(filters.status).toLowerCase()
        );
      });
    }

    if (filters.category !== "all") {
      result = result.filter((task) => {
        const taskCategory = String(
          task?.category || ""
        ).toLowerCase();

        return (
          taskCategory ===
          String(filters.category).toLowerCase()
        );
      });
    }

    if (debouncedSearch) {
      result = result.filter((task) => {
        const title = String(
          task?.title || ""
        ).toLowerCase();

        const description = String(
          task?.description || ""
        ).toLowerCase();

        const category = String(
          task?.category || ""
        ).toLowerCase();

        const location = String(
          task?.location || ""
        ).toLowerCase();

        return (
          title.includes(debouncedSearch) ||
          description.includes(debouncedSearch) ||
          category.includes(debouncedSearch) ||
          location.includes(debouncedSearch)
        );
      });
    }

    if (filters.sort === "newest") {
      result.sort((a, b) => {
        const dateA = new Date(
          a?.createdAt || a?.created_at || 0
        ).getTime();

        const dateB = new Date(
          b?.createdAt || b?.created_at || 0
        ).getTime();

        return dateB - dateA;
      });
    }

    if (filters.sort === "oldest") {
      result.sort((a, b) => {
        const dateA = new Date(
          a?.createdAt || a?.created_at || 0
        ).getTime();

        const dateB = new Date(
          b?.createdAt || b?.created_at || 0
        ).getTime();

        return dateA - dateB;
      });
    }

    if (filters.sort === "budget-high") {
      result.sort((a, b) => {
        const budgetA = Number(
          a?.budget || a?.price || 0
        );

        const budgetB = Number(
          b?.budget || b?.price || 0
        );

        return budgetB - budgetA;
      });
    }

    if (filters.sort === "budget-low") {
      result.sort((a, b) => {
        const budgetA = Number(
          a?.budget || a?.price || 0
        );

        const budgetB = Number(
          b?.budget || b?.price || 0
        );

        return budgetA - budgetB;
      });
    }

    return result;
  }, [
    tasks,
    filters,
    debouncedSearch,
  ]);

  const handleDelete = useCallback(
    async (taskId) => {
      if (!taskId) {
        console.error(
          "Cannot delete task: missing task ID."
        );
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete this task?"
      );

      if (!confirmed) {
        return;
      }

      try {
        setError("");

        await taskService.deleteTask(taskId);

        await loadData();
      } catch (err) {
        console.error(
          "Delete task failed:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to delete task. Please try again."
        );
      }
    },
    [loadData]
  );

  const handleViewDetails = useCallback(
    (task) => {
      setDetailModalTask(task);
    },
    []
  );

  const closeDetailsModal = useCallback(() => {
    setDetailModalTask(null);
  }, []);

  const handleNotificationClick = useCallback(() => {
    navigate("/notifications");
  }, [navigate]);

  return (
    <div className="my-tasks-layout">
      <Sidebar />

      <main className="my-tasks-main-content">
        <header className="my-tasks-header">
          <div className="header-titles">
            <h1 className="main-page-title">
              My Tasks
            </h1>

            <p className="main-page-subtitle">
              Manage every task you've created.
            </p>
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            onNotificationClick={
              handleNotificationClick
            }
          />
        </header>

        <StatsCards stats={stats} />

        <FilterBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
        />

        {error && (
          <div
            className="error-banner"
            role="alert"
          >
            <span>{error}</span>

            <button
              type="button"
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <TaskGrid
            tasks={filteredTasks}
            onViewDetails={handleViewDetails}
            onDelete={handleDelete}
          />
        )}
      </main>

      {detailModalTask && (
        <TaskDetailsModal
          task={detailModalTask}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
}