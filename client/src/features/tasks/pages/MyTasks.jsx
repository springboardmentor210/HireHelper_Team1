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
import {
  getIncomingRequests,
} from "../../../services/requestService";

import "../Styles/MyTasks.css";

export default function MyTasks() {
  const navigate = useNavigate();

  // ============================================================
  // TASK STATE
  // ============================================================

  const [tasks, setTasks] = useState([]);

  // ============================================================
  // APPLICANT STATE
  // ============================================================

  /*
   * applicantsByTask stores applicants grouped by
   * their task ID.
   *
   * Example:
   *
   * {
   *   "task123": [
   *     {
   *       _id: "request1",
   *       requester: {
   *         firstName: "John",
   *         lastName: "Doe",
   *         profilePicture: "..."
   *       }
   *     }
   *   ],
   *
   *   "task456": [
   *     ...
   *   ]
   * }
   */
  const [
    applicantsByTask,
    setApplicantsByTask,
  ] = useState({});

  // ============================================================
  // STATISTICS
  // ============================================================

  const [stats, setStats] = useState({
    active: 0,
    inProgress: 0,
    completed: 0,
    totalApplicants: 0,
    totalEarnings: 0,
  });

  // ============================================================
  // UI STATE
  // ============================================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [
    debouncedSearch,
    setDebouncedSearch,
  ] = useState("");

  const [filters, setFilters] =
    useState({
      status: "all",
      category: "all",
      sort: "newest",
    });

  const [
    detailModalTask,
    setDetailModalTask,
  ] = useState(null);

  // ============================================================
  // SEARCH DEBOUNCE
  // ============================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(
        search.trim().toLowerCase()
      );
    }, 300);

    return () =>
      clearTimeout(timer);
  }, [search]);

  // ============================================================
  // LOAD TASKS + APPLICANTS
  // ============================================================

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // Load user's tasks
        // ------------------------------------------------------

        const taskData =
          await taskService.getMyTasks();

        const receivedTasks =
          Array.isArray(
            taskData?.tasks
          )
            ? taskData.tasks
            : [];

        setTasks(receivedTasks);

        if (taskData?.stats) {
          setStats(
            (previousStats) => ({
              ...previousStats,
              ...taskData.stats,
            })
          );
        }

        // ------------------------------------------------------
        // Load incoming requests
        // ------------------------------------------------------

        /*
         * We intentionally request "all" statuses here.
         *
         * This allows the task card to represent every
         * applicant/request associated with the task rather
         * than only pending requests.
         */
        const requestResponse =
          await getIncomingRequests({
            status: "all",
            limit: 50,
          });

        const requestData =
          requestResponse?.data ||
          {};

        const incomingRequests =
          Array.isArray(
            requestData?.requests
          )
            ? requestData.requests
            : [];

        // ------------------------------------------------------
        // Group applicants by task ID
        // ------------------------------------------------------

        const groupedApplicants =
          {};

        incomingRequests.forEach(
          (request) => {
            const taskId =
              request?.task?._id ||
              request?.task?.id ||
              request?.task;

            if (!taskId) {
              return;
            }

            const taskKey =
              String(taskId);

            if (
              !groupedApplicants[
                taskKey
              ]
            ) {
              groupedApplicants[
                taskKey
              ] = [];
            }

            /*
             * Only keep requests that have
             * an actual requester.
             */
            if (
              request?.requester
            ) {
              groupedApplicants[
                taskKey
              ].push(request);
            }
          }
        );

        setApplicantsByTask(
          groupedApplicants
        );
      } catch (err) {
        console.error(
          "Failed to load My Tasks:",
          err
        );

        setError(
          err?.response?.data
            ?.message ||
            err?.message ||
            "Failed to load tasks. Please try again."
        );

        setTasks([]);

        setApplicantsByTask({});

        setStats({
          active: 0,
          inProgress: 0,
          completed: 0,
          totalApplicants: 0,
          totalEarnings: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = useMemo(() => {
    const uniqueCategories =
      tasks
        .map(
          (task) =>
            task?.category
        )
        .filter(Boolean)
        .map((category) =>
          String(category)
        );

    return [
      ...new Set(
        uniqueCategories
      ),
    ].sort();
  }, [tasks]);

  // ============================================================
  // FILTER + SORT TASKS
  // ============================================================

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // --------------------------------------------------------
    // STATUS FILTER
    // --------------------------------------------------------

    if (
      filters.status !== "all"
    ) {
      result =
        result.filter(
          (task) => {
            const taskStatus =
              String(
                task?.status || ""
              ).toLowerCase();

            return (
              taskStatus ===
              String(
                filters.status
              ).toLowerCase()
            );
          }
        );
    }

    // --------------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------------

    if (
      filters.category !== "all"
    ) {
      result =
        result.filter(
          (task) => {
            const taskCategory =
              String(
                task?.category || ""
              ).toLowerCase();

            return (
              taskCategory ===
              String(
                filters.category
              ).toLowerCase()
            );
          }
        );
    }

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    if (debouncedSearch) {
      result =
        result.filter(
          (task) => {
            const title =
              String(
                task?.title || ""
              ).toLowerCase();

            const description =
              String(
                task?.description ||
                  ""
              ).toLowerCase();

            const category =
              String(
                task?.category || ""
              ).toLowerCase();

            const location =
              String(
                task?.location || ""
              ).toLowerCase();

            return (
              title.includes(
                debouncedSearch
              ) ||
              description.includes(
                debouncedSearch
              ) ||
              category.includes(
                debouncedSearch
              ) ||
              location.includes(
                debouncedSearch
              )
            );
          }
        );
    }

    // --------------------------------------------------------
    // NEWEST
    // --------------------------------------------------------

    if (
      filters.sort === "newest"
    ) {
      result.sort((a, b) => {
        const dateA =
          new Date(
            a?.createdAt ||
              a?.created_at ||
              0
          ).getTime();

        const dateB =
          new Date(
            b?.createdAt ||
              b?.created_at ||
              0
          ).getTime();

        return dateB - dateA;
      });
    }

    // --------------------------------------------------------
    // OLDEST
    // --------------------------------------------------------

    if (
      filters.sort === "oldest"
    ) {
      result.sort((a, b) => {
        const dateA =
          new Date(
            a?.createdAt ||
              a?.created_at ||
              0
          ).getTime();

        const dateB =
          new Date(
            b?.createdAt ||
              b?.created_at ||
              0
          ).getTime();

        return dateA - dateB;
      });
    }

    // --------------------------------------------------------
    // BUDGET HIGH
    // --------------------------------------------------------

    if (
      filters.sort ===
      "budget-high"
    ) {
      result.sort((a, b) => {
        const budgetA =
          Number(
            a?.budget ||
              a?.price ||
              0
          );

        const budgetB =
          Number(
            b?.budget ||
              b?.price ||
              0
          );

        return (
          budgetB - budgetA
        );
      });
    }

    // --------------------------------------------------------
    // BUDGET LOW
    // --------------------------------------------------------

    if (
      filters.sort ===
      "budget-low"
    ) {
      result.sort((a, b) => {
        const budgetA =
          Number(
            a?.budget ||
              a?.price ||
              0
          );

        const budgetB =
          Number(
            b?.budget ||
              b?.price ||
              0
          );

        return (
          budgetA - budgetB
        );
      });
    }

    return result;
  }, [
    tasks,
    filters,
    debouncedSearch,
  ]);

  // ============================================================
  // DELETE TASK
  // ============================================================

  const handleDelete =
    useCallback(
      async (taskId) => {
        if (!taskId) {
          console.error(
            "Cannot delete task: missing task ID."
          );

          return;
        }

        const confirmed =
          window.confirm(
            "Are you sure you want to delete this task?"
          );

        if (!confirmed) {
          return;
        }

        try {
          setError("");

          await taskService.deleteTask(
            taskId
          );

          await loadData();
        } catch (err) {
          console.error(
            "Delete task failed:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Failed to delete task. Please try again."
          );
        }
      },
      [loadData]
    );

  // ============================================================
  // UPDATE TASK STATUS
  // ============================================================

  const handleUpdateStatus =
    useCallback(
      async (taskId, status) => {
        if (!taskId) {
          console.error(
            "Cannot update task status: missing task ID."
          );

          return;
        }

        if (!status) {
          console.error(
            "Cannot update task status: missing status."
          );

          return;
        }

        try {
          setError("");

          await taskService.updateTaskStatus(
            taskId,
            status
          );

          // Reload tasks, statistics, and applicants
          // so the UI reflects the latest database state.
          await loadData();
        } catch (err) {
          console.error(
            "Update task status failed:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Failed to update task status. Please try again."
          );
        }
      },
      [loadData]
    );

  // ============================================================
  // VIEW TASK DETAILS
  // ============================================================

  const handleViewDetails =
    useCallback(
      (task) => {
        setDetailModalTask(task);
      },
      []
    );

  // ============================================================
  // CLOSE DETAILS MODAL
  // ============================================================

  const closeDetailsModal =
    useCallback(() => {
      setDetailModalTask(null);
    }, []);

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const handleNotificationClick =
    useCallback(() => {
      navigate(
        "/notifications"
      );
    }, [navigate]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="my-tasks-layout">
      <Sidebar />

      <main className="my-tasks-main-content">
        {/* ==================================================
            HEADER
        ================================================== */}

        <header className="my-tasks-header">
          <div className="header-titles">
            <h1 className="main-page-title">
              My Tasks
            </h1>

            <p className="main-page-subtitle">
              Manage every task
              you've created.
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

        {/* ==================================================
            STATISTICS
        ================================================== */}

        <StatsCards
          stats={stats}
        />

        {/* ==================================================
            FILTERS
        ================================================== */}

        <FilterBar
          filters={filters}
          onChange={setFilters}
          categories={categories}
        />

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="error-banner"
            role="alert"
          >
            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadData}
            >
              Retry
            </button>
          </div>
        )}

        {/* ==================================================
            TASK CONTENT
        ================================================== */}

        {loading ? (
          <LoadingSkeleton />
        ) : filteredTasks.length ===
          0 ? (
          <EmptyState />
        ) : (
          <TaskGrid
            tasks={filteredTasks}
            applicantsByTask={
              applicantsByTask
            }
            onViewDetails={
              handleViewDetails
            }
            onDelete={
              handleDelete
            }
            onUpdateStatus={
              handleUpdateStatus
            }
          />
        )}
      </main>

      {/* ====================================================
          DETAILS MODAL
      ==================================================== */}

      {detailModalTask && (
        <TaskDetailsModal
          task={detailModalTask}
          onClose={
            closeDetailsModal
          }
        />
      )}
    </div>
  );
}