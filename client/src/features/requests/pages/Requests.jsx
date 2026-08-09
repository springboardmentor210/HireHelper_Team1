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
  // Load Incoming Requests
  // =========================

  useEffect(() => {
    let isMounted = true;

    const loadRequests = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getIncomingRequests();

        if (!isMounted) return;

        const data = response?.data || {};

        setRequests(data.requests || []);

        setCounts({
          pending: data.counts?.pending || 0,
          accepted: data.counts?.accepted || 0,
          declined: data.counts?.declined || 0,
          cancelled: data.counts?.cancelled || 0,
        });
      } catch (err) {
        if (!isMounted) return;

        console.error(
          "Failed to fetch incoming requests:",
          err
        );

        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load requests."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // Tab Counts
  // =========================

  const tabCounts = {
    incoming: counts.pending,
    accepted: counts.accepted,
    declined: counts.declined,

    // Backend does not have an "archived" status.
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

    const keyword = searchQuery
      .trim()
      .toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      requesterName
        .toLowerCase()
        .includes(keyword) ||
      (task.title || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // =========================
  // Accept
  // =========================

  const handleAccept = async (requestId) => {
    try {
      setError("");

      await acceptRequest(requestId);

      setRequests((previous) =>
        previous.filter(
          (request) => request._id !== requestId
        )
      );

      setCounts((previous) => ({
        ...previous,
        pending: Math.max(
          previous.pending - 1,
          0
        ),
        accepted: previous.accepted + 1,
      }));
    } catch (err) {
      console.error(
        "Failed to accept request:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to accept request."
      );
    }
  };

  // =========================
  // Decline
  // =========================

  const handleDecline = async (requestId) => {
    try {
      setError("");

      await declineRequest(requestId);

      setRequests((previous) =>
        previous.filter(
          (request) => request._id !== requestId
        )
      );

      setCounts((previous) => ({
        ...previous,
        pending: Math.max(
          previous.pending - 1,
          0
        ),
        declined: previous.declined + 1,
      }));
    } catch (err) {
      console.error(
        "Failed to decline request:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to decline request."
      );
    }
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
          setActiveTab={setActiveTab}
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
                <h3>No Requests Found</h3>
                <p>
                  There are no pending requests
                  available.
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