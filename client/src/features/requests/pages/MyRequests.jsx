import React, {
  useEffect,
  useState,
  useMemo,
} from "react";

import Sidebar from "../../../components/layout/Sidebar";

import MyRequestsHeader from "../components/MyRequestsHeader";
import RequestTabs from "../components/RequestTabs";
import RequestCard from "../components/RequestCard";
import CancelRequestModal from "../components/CancelRequestModal";
import EmptyState from "../components/EmptyState";

import * as requestService from "../../../services/requestService";

import {
  getConversations,
} from "../../chat/services/chat.service";

import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../../context/NotificationContext";

import "../styles/MyRequests.css";

export default function MyRequests() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [requests, setRequests] =
    useState([]);

  const {
    notifications,
  } = useNotifications();

  const [activeTab, setActiveTab] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [
    cancelModalRequest,
    setCancelModalRequest,
  ] = useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // =========================================================
  // LOAD REQUESTS
  // =========================================================

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

          const data =
            response?.data || {};

          setRequests(
            data.requests || []
          );
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
              "Failed to load requests."
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

  // =========================================================
  // COUNTS
  // =========================================================

  const counts = useMemo(() => {
    return {
      all: requests.length,

      pending: requests.filter(
        (request) =>
          request.status === "pending"
      ).length,

      accepted: requests.filter(
        (request) =>
          request.status === "accepted"
      ).length,

      completed: requests.filter(
        (request) =>
          request.status === "completed"
      ).length,

      cancelled: requests.filter(
        (request) =>
          request.status === "cancelled"
      ).length,
    };
  }, [requests]);

  // =========================================================
  // FILTER REQUESTS
  // =========================================================

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // Status filter
    if (activeTab !== "all") {
      result = result.filter(
        (request) =>
          request.status === activeTab
      );
    }

    // Search
    if (search.trim()) {
      const q =
        search
          .trim()
          .toLowerCase();

      result = result.filter(
        (request) => {
          const task =
            request.task || {};

          const owner =
            request.taskOwner || {};

          const taskTitle =
            task.title || "";

          const category =
            task.category || "";

          const ownerName =
            `${owner.firstName || ""} ${
              owner.lastName || ""
            }`.trim();

          const message =
            request.message || "";

          return (
            taskTitle
              .toLowerCase()
              .includes(q) ||
            ownerName
              .toLowerCase()
              .includes(q) ||
            category
              .toLowerCase()
              .includes(q) ||
            message
              .toLowerCase()
              .includes(q)
          );
        }
      );
    }

    return result;
  }, [
    requests,
    activeTab,
    search,
  ]);

  // =========================================================
  // EXPAND REQUEST
  // =========================================================

  const handleToggleExpand = (id) => {
    setRequests((previous) =>
      previous.map(
        (request) =>
          String(request._id) ===
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

  // =========================================================
  // CANCEL MODAL
  // =========================================================

  const handleOpenCancelModal = (
    request
  ) => {
    setCancelModalRequest(request);
  };

  // =========================================================
  // CANCEL REQUEST
  // =========================================================

  const handleConfirmCancel =
    async (id) => {
      try {
        setError("");

        await requestService.cancelRequest(
          id
        );

        setRequests((previous) =>
          previous.map(
            (request) =>
              String(request._id) ===
              String(id)
                ? {
                    ...request,
                    status: "cancelled",
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

  // =========================================================
  // OPEN CHAT
  // =========================================================

  const handleOpenChat = async (
    request
  ) => {
    try {
      setError("");

      // Chat is available only after acceptance
      if (
        request?.status !==
        "accepted"
      ) {
        setError(
          "Chat is available only after the request has been accepted."
        );

        return;
      }

      // Make sure task exists
      if (!request?.task?._id) {
        setError(
          "Task information is missing."
        );

        return;
      }

      // Fetch conversations belonging
      // to the logged-in user
      const response =
        await getConversations();

      const data =
        response?.data || [];

      const conversations =
        Array.isArray(data)
          ? data
          : data?.conversations || [];

      // Find conversation belonging
      // to this accepted task
      const conversation =
        conversations.find(
          (item) =>
            String(
              item?.task?._id
            ) ===
            String(
              request.task._id
            )
        );

      if (!conversation?._id) {
        setError(
          "Conversation is not available yet. Please try again."
        );

        return;
      }

      // Open actual conversation
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

  // =========================================================
  // RESET FILTERS
  // =========================================================

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearch("");
    setError("");
  };

  // =========================================================
  // TAB CHANGE
  // =========================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setError("");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="my-requests-layout">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="my-requests-main-content">

        {/* Header */}
        <MyRequestsHeader
          search={search}
          onSearchChange={setSearch}
          notifications={notifications}
        />

        {/* Tabs */}
        <RequestTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
          onFilterClick={() => {}}
        />

        {/* Error */}
        {error && (
          <div className="empty-state">
            <h3>
              Something went wrong
            </h3>

            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="empty-state">
            <h3>
              Loading requests...
            </h3>

            <p>
              Fetching your requests
              from the server.
            </p>
          </div>
        )}

        {/* Requests */}
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
                    key={request._id}
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

        {/* Cancel Modal */}
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