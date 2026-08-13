import { useEffect, useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";

import SearchBar from "../../tasks/components/SearchBar";
import IncomingRequestTabs from "../components/IncomingRequestTabs";
import IncomingRequestCard from "../components/IncomingRequestCard";

import {
  getIncomingRequests,
  acceptRequest,
  declineRequest,
} from "../../../services/requestService";

import "../styles/Requests.css";

const Requests = () => {
  const [requests, setRequests] = useState([]);

  const [counts, setCounts] = useState({
    pending: 0,
    accepted: 0,
    declined: 0,
    cancelled: 0,
  });

  const [activeTab, setActiveTab] = useState("incoming");
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Convert frontend tab to backend status
  // =========================

  const getStatusForTab = (tab) => {
    switch (tab) {
      case "incoming":
        return "pending";

      case "accepted":
        return "accepted";

      case "declined":
        return "declined";

      case "archived":
        return "declined";

      default:
        return "pending";
    }
  };

  // =========================
  // Load Requests
  // =========================

  const loadRequests = async (tab = activeTab) => {
    try {
      setLoading(true);
      setError("");

      const status = getStatusForTab(tab);

      const response = await getIncomingRequests({
        status,
      });

      const data = response?.data || {};

      setRequests(data.requests || []);

      setCounts({
        pending: data.counts?.pending || 0,
        accepted: data.counts?.accepted || 0,
        declined: data.counts?.declined || 0,
        cancelled: data.counts?.cancelled || 0,
      });
    } catch (err) {
      console.error("Failed to fetch requests:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load requests."
      );

      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Initial Load
  // =========================

  useEffect(() => {
    loadRequests("incoming");
  }, []);

  // =========================
  // Reload when tab changes
  // =========================

  useEffect(() => {
    if (activeTab === "incoming") {
      loadRequests("incoming");
    } else if (activeTab === "accepted") {
      loadRequests("accepted");
    } else if (activeTab === "declined") {
      loadRequests("declined");
    } else if (activeTab === "archived") {
      loadRequests("archived");
    }
  }, [activeTab]);

  // =========================
  // Tab Counts
  // =========================

  const tabCounts = {
    incoming: counts.pending,
    accepted: counts.accepted,
    declined: counts.declined,
    archived: counts.declined,
  };

  // =========================
  // Search
  // =========================

  const filteredRequests = requests.filter((request) => {
    const requester = request.requester || {};
    const task = request.task || {};

    const requesterName =
      `${requester.firstName || ""} ${
        requester.lastName || ""
      }`.trim();

    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      requesterName.toLowerCase().includes(keyword) ||
      (task.title || "").toLowerCase().includes(keyword) ||
      (task.category || "").toLowerCase().includes(keyword)
    );
  });

  // =========================
  // Accept Request
  // =========================

  const handleAccept = async (requestId) => {
    try {
      setError("");

      // Call backend.
      await acceptRequest(requestId);

      /*
       * Do NOT manually increase accepted count here.
       *
       * The backend is now the source of truth.
       * Reloading gets the actual accepted count and
       * accepted request list from MongoDB.
       */

      await loadRequests("incoming");

      // Move user automatically to Accepted tab.
      setActiveTab("accepted");
    } catch (err) {
      console.error("Failed to accept request:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to accept request."
      );
    }
  };

  // =========================
  // Decline Request
  // =========================

  const handleDecline = async (requestId) => {
    try {
      setError("");

      await declineRequest(requestId);

      /*
       * Reload from backend instead of manually
       * changing the counters.
       */

      await loadRequests("incoming");

      // Move to declined tab.
      setActiveTab("declined");
    } catch (err) {
      console.error("Failed to decline request:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to decline request."
      );
    }
  };

  // =========================
  // Tab Change
  // =========================

  const handleTabChange = (tab) => {
    setSearchQuery("");
    setError("");
    setActiveTab(tab);
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="requests-page">
      <Sidebar />

      <main className="requests-main">
        {/* Header */}
        <header className="requests-header">
          <div className="requests-header-left">
            <h1>Requests</h1>

            <p>
              People who want to help with your tasks
            </p>
          </div>

          <div className="requests-header-right">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </header>

        {/* Tabs */}
        <IncomingRequestTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          counts={tabCounts}
        />

        {/* Section */}
        <section className="requests-section">
          <h2>
            {activeTab === "incoming"
              ? "Incoming Requests"
              : activeTab === "accepted"
              ? "Accepted Requests"
              : activeTab === "declined"
              ? "Declined Requests"
              : "Archived Requests"}
          </h2>

          <p>
            {activeTab === "incoming"
              ? "People who want to help with your tasks"
              : activeTab === "accepted"
              ? "People you accepted to help with your tasks"
              : activeTab === "declined"
              ? "Requests you declined"
              : "Manage your task requests"}
          </p>
        </section>

        {/* Error */}
        {error && (
          <div className="empty-state">
            <h3>Unable to Load Requests</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="empty-state">
            <h3>Loading Requests...</h3>

            <p>
              Fetching requests from the server.
            </p>
          </div>
        )}

        {/* Request Cards */}
        {!loading && !error && (
          <section className="requests-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <IncomingRequestCard
                  key={request._id}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>
                  {activeTab === "accepted"
                    ? "No Accepted Requests"
                    : activeTab === "declined"
                    ? "No Declined Requests"
                    : "No Requests Found"}
                </h3>

                <p>
                  {activeTab === "accepted"
                    ? "No requests have been accepted yet."
                    : activeTab === "declined"
                    ? "No requests have been declined."
                    : "There are no requests available."}
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Requests;