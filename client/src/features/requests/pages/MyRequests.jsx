import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import MyRequestsHeader from "../components/MyRequestsHeader";
import RequestTabs from "../components/RequestTabs";
import RequestCard from "../components/RequestCard";
import CancelRequestModal from "../components/CancelRequestModal";
import EmptyState from "../components/EmptyState";
import * as requestService from "../../../services/requestService";
import { useNotifications } from "../../../context/NotificationContext";
import "../styles/MyRequests.css";


// Convert backend status to the format currently used by the UI.
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


// Convert a backend request into the object expected by RequestCard.
const mapRequestData = (request) => {
  if (!request) return null;

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
    // Request information
    id,
    _id: id,

    message: request.message || "",

    status: formatStatus(request.status),

    createdAt: request.createdAt || null,

    createdAtFormatted,

    // Task information
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

    // Owner information
    ownerName,

    ownerInitials,

    avatarBg: "#f1f5f9",

    avatarColor: "#334155",

    // UI state
    isExpanded: false,
  };
};


export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  const { notifications } =
    useNotifications();

  const [activeTab, setActiveTab] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [cancelModalRequest, setCancelModalRequest] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ============================
  // LOAD MY REQUESTS
  // ============================

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        const response =
          await requestService.getMyRequests();

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
        console.error(
          "Failed to load requests data:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load your requests."
        );

        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  // ============================
  // STATUS COUNTS
  // ============================

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


  // ============================
  // FILTER REQUESTS
  // ============================

  const filteredRequests = useMemo(() => {
    let result = [...requests];


    // Status tab
    if (activeTab !== "all") {
      result = result.filter(
        (request) =>
          request.status === activeTab
      );
    }


    // Search
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


  // ============================
  // EXPAND / COLLAPSE
  // ============================

  const handleToggleExpand = (id) => {
    setRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? {
              ...request,
              isExpanded:
                !request.isExpanded,
            }
          : request
      )
    );
  };


  // ============================
  // OPEN CANCEL MODAL
  // ============================

  const handleOpenCancelModal = (
    request
  ) => {
    setCancelModalRequest(request);
  };


  // ============================
  // CONFIRM CANCEL
  // ============================

  const handleConfirmCancel = async (
    id
  ) => {
    try {
      await requestService.cancelRequest(
        id
      );

      setRequests((previous) =>
        previous.map((request) =>
          request.id === id
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

      alert(
        err.response?.data?.message ||
          "Failed to cancel request. Please try again."
      );
    }
  };


  // ============================
  // RESET FILTERS
  // ============================

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearch("");
  };


  return (
    <div className="my-requests-layout">

      <Sidebar />


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
          onTabChange={setActiveTab}
          counts={counts}
          onFilterClick={() => {}}
        />


        {/* Loading */}
        {loading && (
          <div className="requests-loading">
            <p>Loading your requests...</p>
          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="requests-error">
            <p>{error}</p>
          </div>
        )}


        {/* Content */}
        {!loading &&
          !error &&
          (filteredRequests.length === 0 ? (
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
                  />
                )
              )}

            </section>
          ))}


      </main>


      {/* Cancel Modal */}
      {cancelModalRequest && (
        <CancelRequestModal
          request={cancelModalRequest}

          onClose={() =>
            setCancelModalRequest(null)
          }

          onConfirm={
            handleConfirmCancel
          }
        />
      )}

    </div>
  );
}