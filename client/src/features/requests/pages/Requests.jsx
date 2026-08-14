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

  const [activeTab, setActiveTab] =
    useState("incoming");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // TAB -> BACKEND STATUS
  // =========================================================

  const getStatusForTab = useCallback(
    (tab) => {
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
    },
    []
  );

  // =========================================================
  // LOAD REQUESTS
  // =========================================================

  const loadRequests = useCallback(
    async (tab) => {
      try {
        setLoading(true);
        setError("");

        const status =
          getStatusForTab(tab);

        const response =
          await getIncomingRequests({
            status,
          });

        const data =
          response?.data || {};

        setRequests(
          data.requests || []
        );

        setCounts({
          pending:
            data.counts?.pending || 0,

          accepted:
            data.counts?.accepted || 0,

          declined:
            data.counts?.declined || 0,

          cancelled:
            data.counts?.cancelled || 0,
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
  // LOAD INITIAL REQUESTS
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequests("incoming");
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [loadRequests]);

  // =========================================================
  // RELOAD WHEN TAB CHANGES
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRequests(activeTab);
    }, 0);

    return () => {
      clearTimeout(timer);
    };
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

  const filteredRequests =
    requests.filter((request) => {
      const requester =
        request.requester || {};

      const task =
        request.task || {};

      const requesterName =
        `${requester.firstName || ""} ${
          requester.lastName || ""
        }`.trim();

      const keyword =
        searchQuery
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
  // FIND CONVERSATION FOR TASK
  // =========================================================

  const openConversationForRequest =
    useCallback(
      async (request) => {
        try {
          setError("");

          if (!request?.task?._id) {
            setError(
              "Task information is missing for this conversation."
            );

            return;
          }

          const response =
            await getConversations();

          const data =
            response?.data;

          const conversationList =
            Array.isArray(data)
              ? data
              : data?.conversations ||
                [];

          const conversation =
            conversationList.find(
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

          navigate(
            `/chat/${conversation._id}`
          );
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

    const response =
      await acceptRequest(requestId);

    const conversation =
      response?.data?.conversation;

    if (!conversation?._id) {
      console.error(
        "Accept response:",
        response
      );

      setError(
        "Request was accepted, but the conversation could not be created."
      );

      await loadRequests("accepted");
      setActiveTab("accepted");

      return;
    }

    // Reload accepted requests
    await loadRequests("accepted");

    // Open chat immediately
    navigate(
      `/chat/${conversation._id}`
    );
  } catch (err) {
    console.error(
      "Failed to accept request:",
      err
    );

    setError(
      err?.message ||
        "Failed to accept request."
    );
  }
};

  // =========================================================
  // DECLINE REQUEST
  // =========================================================

  const handleDecline = async (
    requestId
  ) => {
    try {
      setError("");

      await declineRequest(
        requestId
      );

      await loadRequests(
        "declined"
      );

      setActiveTab(
        "declined"
      );
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

  const handleTabChange = (
    tab
  ) => {
    setSearchQuery("");
    setError("");
    setActiveTab(tab);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="requests-page">
      <Sidebar />

      <main className="requests-main">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="requests-header">
          <div className="requests-header-left">
            <h1>Requests</h1>

            <p>
              People who want to help
              with your tasks
            </p>
          </div>

          <div className="requests-header-right">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </header>

        {/* ===================================================
            TABS
        =================================================== */}

        <IncomingRequestTabs
          activeTab={activeTab}
          setActiveTab={
            handleTabChange
          }
          counts={tabCounts}
        />

        {/* ===================================================
            SECTION
        =================================================== */}

        <section className="requests-section">
          <h2>
            {activeTab ===
            "incoming"
              ? "Incoming Requests"
              : activeTab ===
                "accepted"
              ? "Accepted Requests"
              : activeTab ===
                "declined"
              ? "Declined Requests"
              : "Archived Requests"}
          </h2>

          <p>
            {activeTab ===
            "incoming"
              ? "People who want to help with your tasks"
              : activeTab ===
                "accepted"
              ? "People you accepted to help with your tasks"
              : activeTab ===
                "declined"
              ? "Requests you declined"
              : "Manage your task requests"}
          </p>
        </section>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="empty-state">
            <h3>
              Unable to Load Requests
            </h3>

            <p>{error}</p>
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading &&
          !error && (
            <div className="empty-state">
              <h3>
                Loading Requests...
              </h3>

              <p>
                Fetching requests from
                the server.
              </p>
            </div>
          )}

        {/* ===================================================
            REQUEST CARDS
        =================================================== */}

        {!loading &&
          !error && (
            <section className="requests-list">
              {filteredRequests.length >
              0 ? (
                filteredRequests.map(
                  (request) => (
                    <IncomingRequestCard
                      key={
                        request._id
                      }
                      request={
                        request
                      }
                      onAccept={
                        handleAccept
                      }
                      onDecline={
                        handleDecline
                      }
                      onChat={
                        openConversationForRequest
                      }
                    />
                  )
                )
              ) : (
                <div className="empty-state">
                  <h3>
                    {activeTab ===
                    "accepted"
                      ? "No Accepted Requests"
                      : activeTab ===
                        "declined"
                      ? "No Declined Requests"
                      : "No Requests Found"}
                  </h3>

                  <p>
                    {activeTab ===
                    "accepted"
                      ? "No requests have been accepted yet."
                      : activeTab ===
                        "declined"
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