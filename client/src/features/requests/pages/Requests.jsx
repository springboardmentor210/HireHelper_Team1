import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../../components/layout/Sidebar";

import SearchBar from "../../tasks/components/SearchBar";
import IncomingRequestTabs from "../components/IncomingRequestTabs";
import IncomingRequestCard from "../components/IncomingRequestCard";

import {
  getIncomingRequests,
  acceptRequest,
  declineRequest,
} from "../../../services/requestService";

import {
  getConversations,
} from "../../chat/services/chat.service";

import "../styles/Requests.css";

const Requests = () => {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

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

  // =========================================================
  // TAB -> BACKEND STATUS
  // =========================================================

  const getStatusForTab = useCallback((tab) => {
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
  }, []);

  // =========================================================
  // LOAD REQUESTS
  // =========================================================

  const loadRequests = useCallback(
    async (tab) => {
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
        console.error(
          "Failed to fetch requests:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load requests."
        );

        setRequests([]);
      } finally {
        setLoading(false);
      }
    },
    [getStatusForTab]
  );

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadRequests(activeTab);
  }, [activeTab, loadRequests]);

  // =========================================================
  // TAB COUNTS
  // =========================================================

  const tabCounts = {
    incoming: counts.pending,
    accepted: counts.accepted,
    declined: counts.declined,
    archived: counts.declined,
  };

  // =========================================================
  // SEARCH
  // =========================================================

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
        .includes(keyword) ||
      (task.category || "")
        .toLowerCase()
        .includes(keyword)
    );
  });

  // =========================================================
  // OPEN CONVERSATION
  // =========================================================

  const openConversationForRequest = useCallback(
    async (request) => {
      try {
        setError("");

        if (!request?.task?._id) {
          setError(
            "Task information is missing for this conversation."
          );

          return;
        }

        const response = await getConversations();

        const data = response?.data;

        const conversationList = Array.isArray(data)
          ? data
          : data?.conversations || [];

        const conversation = conversationList.find(
          (item) =>
            String(item?.task?._id) ===
            String(request.task._id)
        );

        if (!conversation?._id) {
          setError(
            "Conversation is not available yet. Please try again."
          );

          return;
        }

        navigate(`/chat/${conversation._id}`);
      } catch (err) {
        console.error(
          "Failed to open conversation:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to open chat."
        );
      }
    },
    [navigate]
  );

  // =========================================================
  // ACCEPT REQUEST
  // =========================================================

  const handleAccept = async (requestId) => {
    try {
      setError("");

      const response = await acceptRequest(requestId);

      const conversation =
        response?.data?.conversation;

      if (!conversation?._id) {
        setError(
          "Request was accepted, but the conversation could not be created."
        );

        await loadRequests("accepted");
        setActiveTab("accepted");

        return;
      }

      await loadRequests("accepted");

      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      console.error(
        "Failed to accept request:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to accept request."
      );
    }
  };

  // =========================================================
  // DECLINE REQUEST
  // =========================================================

  const handleDecline = async (requestId) => {
    try {
      setError("");

      await declineRequest(requestId);

      await loadRequests("declined");

      setActiveTab("declined");
    } catch (err) {
      console.error(
        "Failed to decline request:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to decline request."
      );
    }
  };

  // =========================================================
  // TAB CHANGE
  // =========================================================

  const handleTabChange = (tab) => {
    setSearchQuery("");
    setError("");
    setActiveTab(tab);
  };

  // =========================================================
  // SECTION TITLE
  // =========================================================

  const getSectionTitle = () => {
    switch (activeTab) {
      case "accepted":
        return "Accepted Requests";

      case "declined":
        return "Declined Requests";

      case "archived":
        return "Archived Requests";

      case "incoming":
      default:
        return "Incoming Requests";
    }
  };

  // =========================================================
  // EMPTY STATE
  // =========================================================

  const getEmptyTitle = () => {
    switch (activeTab) {
      case "accepted":
        return "No Accepted Requests";

      case "declined":
        return "No Declined Requests";

      case "archived":
        return "No Archived Requests";

      case "incoming":
      default:
        return "No Requests Found";
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "accepted":
        return "No requests have been accepted yet.";

      case "declined":
        return "No requests have been declined.";

      case "archived":
        return "There are no archived requests.";

      case "incoming":
      default:
        return "There are no requests available.";
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="requests-page">
      <Sidebar />

      <main className="requests-main">
        {/* ===================================================
            PAGE HEADER
            Matches Feed / My Tasks layout
        =================================================== */}

        <header className="requests-header">
          <div className="requests-header-content">
            <h1>Requests</h1>

            <p>
              People who want to help with your task
            </p>
          </div>

          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </header>

        {/* ===================================================
            REQUEST TABS
        =================================================== */}

        <IncomingRequestTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          counts={tabCounts}
        />

        {/* ===================================================
            SECTION HEADING
        =================================================== */}

        <section className="requests-section">
          <h2>{getSectionTitle()}</h2>
        </section>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="empty-state"
            role="alert"
          >
            <h3>Unable to Load Requests</h3>

            <p>{error}</p>
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && !error && (
          <div className="empty-state">
            <h3>Loading Requests...</h3>

            <p>
              Fetching requests from the server.
            </p>
          </div>
        )}

        {/* ===================================================
            REQUEST CARDS
        =================================================== */}

        {!loading && !error && (
          <section className="requests-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <IncomingRequestCard
                  key={request._id}
                  request={request}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onChat={openConversationForRequest}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>{getEmptyTitle()}</h3>

                <p>{getEmptyMessage()}</p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default Requests;