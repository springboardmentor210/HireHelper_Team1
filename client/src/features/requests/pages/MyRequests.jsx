import React, { useEffect, useState, useMemo } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import MyRequestsHeader from "../components/MyRequestsHeader";
import RequestTabs from "../components/RequestTabs";
import RequestCard from "../components/RequestCard";
import CancelRequestModal from "../components/CancelRequestModal";
import EmptyState from "../components/EmptyState";
import * as requestService from "../../../services/requestService";
import "../styles/MyRequests.css";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [cancelModalRequest, setCancelModalRequest] = useState(null);

  // Load initial data
  useEffect(() => {
    async function fetchData() {
      try {
        const [reqs, notifs] = await Promise.all([
          requestService.getMyRequests(),
          requestService.getNotifications(),
        ]);
        setRequests(reqs || []);
        setNotifications(notifs || []);
      } catch (err) {
        console.error("Failed to load requests data:", err);
      }
    }
    fetchData();
  }, []);

  // Compute status counts for tabs
  const counts = useMemo(() => {
    return {
      all: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      accepted: requests.filter((r) => r.status === "Accepted").length,
      completed: requests.filter((r) => r.status === "Completed").length,
      cancelled: requests.filter((r) => r.status === "Cancelled").length,
    };
  }, [requests]);

  // Filter requests based on active tab and search query
  const filteredRequests = useMemo(() => {
    let result = [...requests];

    // Filter by tab status
    if (activeTab !== "all") {
      result = result.filter((r) => r.status === activeTab);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (r) =>
          r.taskTitle.toLowerCase().includes(q) ||
          r.ownerName.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          (r.message && r.message.toLowerCase().includes(q))
      );
    }

    return result;
  }, [requests, activeTab, search]);

  // Handlers
  const handleToggleExpand = (id) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, isExpanded: !req.isExpanded } : req
      )
    );
  };

  const handleOpenCancelModal = (request) => {
    setCancelModalRequest(request);
  };

  const handleConfirmCancel = async (id) => {
    try {
      await requestService.cancelRequest(id);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? { ...req, status: "Cancelled", isExpanded: false }
            : req
        )
      );
      setCancelModalRequest(null);
    } catch (err) {
      console.error("Failed to cancel request:", err);
    }
  };

  const handleResetFilters = () => {
    setActiveTab("all");
    setSearch("");
  };

  return (
    <div className="my-requests-layout">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="my-requests-main-content">
        {/* Header Bar with Search & Notifications */}
        <MyRequestsHeader
          search={search}
          onSearchChange={setSearch}
          notifications={notifications}
        />

        {/* Status Tabs Bar */}
        <RequestTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          onFilterClick={() => {}}
        />

        {/* Request Cards List or Empty State */}
        {filteredRequests.length === 0 ? (
          <EmptyState
            activeTab={activeTab}
            searchQuery={search}
            onReset={handleResetFilters}
          />
        ) : (
          <section className="requests-list-container">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onToggleExpand={handleToggleExpand}
                onCancelRequest={handleOpenCancelModal}
              />
            ))}
          </section>
        )}
      </main>

      {/* Confirmation Modal for Cancelling Request */}
      {cancelModalRequest && (
        <CancelRequestModal
          request={cancelModalRequest}
          onClose={() => setCancelModalRequest(null)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
