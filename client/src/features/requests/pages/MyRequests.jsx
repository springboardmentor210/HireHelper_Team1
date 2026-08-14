import { useEffect, useState, useMemo } from "react";

import Sidebar from "../../../components/layout/Sidebar";

import MyRequestsHeader from "../components/MyRequestsHeader";
import RequestTabs from "../components/RequestTabs";
import RequestCard from "../components/RequestCard";
import CancelRequestModal from "../components/CancelRequestModal";
import EmptyState from "../components/EmptyState";

import * as requestService from "../../../services/requestService";

import { getConversations } from "../../chat/services/chat.service";

import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../../context/NotificationContext";

import "../styles/MyRequests.css";

// =========================================================
// CONVERT BACKEND STATUS TO UI STATUS
// =========================================================

const formatStatus = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "pending":
      return "Pending";

    case "accepted":
      return "Accepted";

    case "completed":
      return "Completed";

    case "cancelled":
      return "Cancelled";

    case "declined":
      return "Declined";

    default:
      return status || "Pending";
  }
};

// =========================================================
// MAP BACKEND REQUEST TO REQUEST CARD FORMAT
// =========================================================

const mapRequestData = (request) => {
  if (!request) {
    return null;
  }

  const task = request.task || {};
  const taskOwner = request.taskOwner || {};

  const id = request._id || request.id;

  const ownerName =
    `${taskOwner.firstName || ""} ${
      taskOwner.lastName || ""
    }`.trim() || "Task Owner";

  const ownerInitials =
    `${taskOwner.firstName?.charAt(0) || ""}${
      taskOwner.lastName?.charAt(0) || ""
    }`.toUpperCase() || "TO";

  const createdAtFormatted = request.createdAt
    ? new Date(request.createdAt).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )
    : "Date unavailable";

  const images = Array.isArray(task.images)
    ? task.images
    : task.image
      ? [task.image]
      : [];

  return {
    // =====================================================
    // REQUEST INFORMATION
    // =====================================================

    id,
    _id: id,

    message: request.message || "",

    status: formatStatus(request.status),

    createdAt: request.createdAt || null,

    createdAtFormatted,

    // =====================================================
    // TASK INFORMATION
    // =====================================================

    taskId: task._id || task.id,

    taskTitle:
      task.title || "Untitled Task",

    category:
      task.category || "General",

    location:
      task.location || "Location not specified",

    taskImage:
      images[0] || "",

    images,

    // =====================================================
    // OWNER INFORMATION
    // =====================================================

    ownerName,

    ownerInitials,

    avatarBg: "#f1f5f9",

    avatarColor: "#334155",

    // =====================================================
    // UI STATE
    // =====================================================

    isExpanded: false,
  };
};

// =========================================================
// PAGE
// =========================================================

export default function MyRequests() {
  const navigate = useNavigate();

  const { notifications } =
    useNotifications();

  // =======================================================
  // STATE
  // =======================================================

  const [requests, setRequests] =
    useState([]);

  const [activeTab, setActiveTab] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [
    cancelModalRequest,
    setCancelModalRequest,
  ] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =======================================================
  // LOAD MY REQUESTS
  // =======================================================

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await requestService.getMyRequests();

          if (cancelled) {
            return;
          }

          const rawRequests =
            response?.data?.requests ||
            response?.requests ||
            [];

          const mappedRequests =
            rawRequests
              .map(mapRequestData)
              .filter(Boolean);

          setRequests(mappedRequests);
        } catch (err) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to load requests data:",
            err
          );

          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load your requests."
          );

          setRequests([]);
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

      fetchData();
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // =======================================================
  // STATUS COUNTS
  // =======================================================

  const counts = useMemo(() => {
    return {
      all: requests.length,

      pending: requests.filter(
        (request) =>
          request.status === "Pending"
      ).length,

      accepted: requests.filter(
        (request) =>
          request.status === "Accepted"
      ).length,

      completed: requests.filter(
        (request) =>
          request.status === "Completed"
      ).length,

      cancelled: requests.filter(
        (request) =>
          request.status === "Cancelled"
      ).length,
    };
  }, [requests]);

  // =======================================================
  // FILTER REQUESTS
  // =======================================================

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // -----------------------------------------------------
    // STATUS TAB
    // -----------------------------------------------------

    if (activeTab !== "all") {
      result = result.filter(
        (request) =>
          request.status === activeTab
      );
    }

    // -----------------------------------------------------
    // SEARCH
    // -----------------------------------------------------

    if (search.trim()) {
      const query =
        search.trim().toLowerCase();

      result = result.filter((request) => {
        return (
          String(
            request.taskTitle || ""
          )
            .toLowerCase()
            .includes(query) ||

          String(
            request.ownerName || ""
          )
            .toLowerCase()
            .includes(query) ||

          String(
            request.category || ""
          )
            .toLowerCase()
            .includes(query) ||

          String(
            request.location || ""
          )
            .toLowerCase()
            .includes(query) ||

          String(
            request.message || ""
          )
            .toLowerCase()
            .includes(query)
        );
      });
    }

    return result;
  }, [
    requests,
    activeTab,
    search,
  ]);

  // =======================================================
  // EXPAND / COLLAPSE REQUEST
  // =======================================================

  const handleToggleExpand = (id) => {
    setRequests((previous) =>
      previous.map((request) =>
        String(request.id) ===
        String(id)
          ? {
              ...request,
              isExpanded:
                !request.isExpanded,
            }
          : request
      )
    );
  };

  // =======================================================
  // OPEN CANCEL MODAL
  // =======================================================

  const handleOpenCancelModal = (
    request
  ) => {
    setCancelModalRequest(request);
  };

  // =======================================================
  // CANCEL REQUEST
  // =======================================================

  const handleConfirmCancel =
    async (id) => {
      try {
        setError("");

        await requestService.cancelRequest(
          id
        );

        setRequests((previous) =>
          previous.map((request) =>
            String(request.id) ===
            String(id)
              ? {
                  ...request,
                  status: "Cancelled",
                  isExpanded: false,
                }
              : request
          )
        );

        setCancelModalRequest(null);
      } catch (err) {
        console.error(
          "Failed to cancel request:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to cancel request."
        );
      }
    };

  // =======================================================
  // OPEN CHAT
  // =======================================================

  const handleOpenChat = async (
    request
  ) => {
    try {
      setError("");

      // Chat is available only after acceptance.
      if (
        request?.status !==
        "Accepted"
      ) {
        setError(
          "Chat is available only after the request has been accepted."
        );

        return;
      }

      // The mapped request contains taskId.
      if (!request?.taskId) {
        setError(
          "Task information is missing."
        );

        return;
      }

      // ---------------------------------------------------
      // Get user's conversations
      // ---------------------------------------------------

      const response =
        await getConversations();

      const data =
        response?.data || [];

      const conversations =
        Array.isArray(data)
          ? data
          : data?.conversations || [];

      // ---------------------------------------------------
      // Find conversation for this task
      // ---------------------------------------------------

      const conversation =
        conversations.find(
          (item) => {
            const conversationTaskId =
              item?.task?._id ||
              item?.task;

            return (
              String(
                conversationTaskId
              ) ===
              String(
                request.taskId
              )
            );
          }
        );

      // ---------------------------------------------------
      // Conversation doesn't exist yet
      // ---------------------------------------------------

      if (!conversation?._id) {
        setError(
          "Conversation is not available yet. Please try again."
        );

        return;
      }

      // ---------------------------------------------------
      // Open conversation
      // ---------------------------------------------------

      navigate(
        `/chat/${conversation._id}`
      );
    } catch (err) {
      console.error(
        "Failed to open chat:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to open chat."
      );
    }
  };

  // =======================================================
  // RESET FILTERS
  // =======================================================

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearch("");
    setError("");
  };

  // =======================================================
  // TAB CHANGE
  // =======================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setError("");
  };

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="my-requests-layout">
      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <Sidebar />

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="my-requests-main-content">
        {/* =================================================
            HEADER
        ================================================= */}

        <MyRequestsHeader
          search={search}
          onSearchChange={setSearch}
          notifications={notifications}
        />

        {/* =================================================
            TABS
        ================================================= */}

        <RequestTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
          onFilterClick={() => {}}
        />

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <div className="requests-loading">
            <p>
              Loading your requests...
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!loading && error && (
          <div className="requests-error">
            <p>{error}</p>
          </div>
        )}

        {/* =================================================
            REQUEST CONTENT
        ================================================= */}

        {!loading &&
          !error &&
          (filteredRequests.length ===
          0 ? (
            <EmptyState
              activeTab={activeTab}
              searchQuery={search}
              onReset={handleResetFilters}
            />
          ) : (
            <section className="requests-list-container">
              {filteredRequests.map(
                (request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onToggleExpand={
                      handleToggleExpand
                    }
                    onCancelRequest={
                      handleOpenCancelModal
                    }
                    onChat={
                      handleOpenChat
                    }
                  />
                )
              )}
            </section>
          ))}

        {/* =================================================
            CANCEL MODAL
        ================================================= */}

        {cancelModalRequest && (
          <CancelRequestModal
            request={
              cancelModalRequest
            }
            onClose={() =>
              setCancelModalRequest(
                null
              )
            }
            onConfirm={
              handleConfirmCancel
            }
          />
        )}
      </main>
    </div>
  );
}