import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Check,
  Clock,
  MessageCircle,
  UserRound,
  X,
} from "lucide-react";

import Sidebar from "../../../components/layout/Sidebar";

import {
  getIncomingRequests,
  acceptRequest,
  declineRequest,
} from "../../../services/requestService";

import {
  getConversations,
} from "../../chat/services/chat.service";

import "../Styles/MyTasks.css";


// ============================================================
// CONSTANTS
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getApplicantName(request) {
  const requester =
    request?.requester || {};

  const firstName =
    requester?.firstName || "";

  const lastName =
    requester?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return fullName || "Unknown Applicant";
}


function getApplicantInitials(request) {
  const requester =
    request?.requester || {};

  const firstName =
    requester?.firstName || "";

  const lastName =
    requester?.lastName || "";

  const firstInitial =
    firstName.charAt(0).toUpperCase();

  const lastInitial =
    lastName.charAt(0).toUpperCase();

  const initials =
    `${firstInitial}${lastInitial}`.trim();

  return initials || "A";
}


function getProfilePicture(request) {
  const profilePicture =
    request?.requester?.profilePicture;

  if (!profilePicture) {
    return "";
  }

  if (
    profilePicture.startsWith("http://") ||
    profilePicture.startsWith("https://")
  ) {
    return profilePicture;
  }

  return `${API_BASE_URL.replace(
    "/api",
    ""
  )}${
    profilePicture.startsWith("/")
      ? profilePicture
      : `/${profilePicture}`
  }`;
}


function formatRequestDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date =
    new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}


function getStatusLabel(status) {
  switch (
    String(status || "").toLowerCase()
  ) {
    case "accepted":
      return "Accepted";

    case "declined":
      return "Declined";

    case "cancelled":
      return "Cancelled";

    case "pending":
    default:
      return "Pending";
  }
}


// ============================================================
// APPLICANT CARD
// ============================================================

function ApplicantCard({
  request,
  processingId,
  onAccept,
  onDecline,
}) {
  const status =
    String(
      request?.status || "pending"
    ).toLowerCase();

  const applicantName =
    getApplicantName(request);

  const initials =
    getApplicantInitials(request);

  const profilePicture =
    getProfilePicture(request);

  const isProcessing =
    processingId === request?._id;

  const isPending =
    status === "pending";

  return (
    <div className="applicant-item-card">
      {/* ======================================================
          APPLICANT INFORMATION
      ====================================================== */}

      <div className="applicant-user-info">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={applicantName}
            className="applicant-avatar-img"
            onError={(event) => {
              event.currentTarget.style.display =
                "none";

              const fallback =
                event.currentTarget
                  .nextElementSibling;

              if (fallback) {
                fallback.style.display =
                  "flex";
              }
            }}
          />
        ) : null}

        <div
          className="applicant-avatar-fallback"
          style={{
            display: profilePicture
              ? "none"
              : "flex",
          }}
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="applicant-info-text">
          <p className="applicant-name-text">
            {applicantName}
          </p>

          <p className="applicant-request-date">
            Applied{" "}
            {formatRequestDate(
              request?.createdAt
            )}
          </p>
        </div>
      </div>

      {/* ======================================================
          REQUEST MESSAGE
      ====================================================== */}

      <div className="applicant-message">
        <MessageCircle
          size={16}
          strokeWidth={2}
        />

        <span>
          {request?.message ||
            "No message provided."}
        </span>
      </div>

      {/* ======================================================
          STATUS
      ====================================================== */}

      <div className="applicant-status-wrapper">
        <span
          className={`applicant-status-badge ${status}`}
        >
          {status === "pending" && (
            <Clock
              size={13}
              strokeWidth={2.5}
            />
          )}

          {status === "accepted" && (
            <Check
              size={13}
              strokeWidth={2.5}
            />
          )}

          {status === "declined" && (
            <X
              size={13}
              strokeWidth={2.5}
            />
          )}

          {getStatusLabel(status)}
        </span>
      </div>

      {/* ======================================================
          ACTIONS
      ====================================================== */}

      {isPending && (
        <div className="applicant-actions">
          <button
            type="button"
            className="applicant-decline-button"
            disabled={isProcessing}
            onClick={() =>
              onDecline(request?._id)
            }
          >
            <X
              size={16}
              strokeWidth={2.5}
            />

            {isProcessing
              ? "Processing..."
              : "Decline"}
          </button>

          <button
            type="button"
            className="applicant-accept-button"
            disabled={isProcessing}
            onClick={() =>
              onAccept(request?._id)
            }
          >
            <Check
              size={16}
              strokeWidth={2.5}
            />

            {isProcessing
              ? "Processing..."
              : "Accept"}
          </button>
        </div>
      )}
    </div>
  );
}


// ============================================================
// MAIN PAGE
// ============================================================

export default function TaskApplicants() {
  const {
    taskId,
  } = useParams();

  const navigate =
    useNavigate();

  // ==========================================================
  // STATE
  // ==========================================================

  const [
    requests,
    setRequests,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    processingId,
    setProcessingId,
  ] = useState(null);


  // ==========================================================
  // LOAD APPLICANTS
  // ==========================================================

  const loadApplicants =
    useCallback(
      async () => {
        if (!taskId) {
          setError(
            "Task ID is missing."
          );

          setLoading(false);

          return;
        }

        try {
          setLoading(true);
          setError("");

          /*
           * The backend already provides incoming
           * requests with populated:
           *
           * requester
           * task
           *
           * We request all statuses so this page
           * can display the complete applicant
           * history for this task.
           */
          const response =
            await getIncomingRequests({
              status: "all",
              limit: 50,
            });

          const data =
            response?.data || {};

          const incomingRequests =
            Array.isArray(
              data?.requests
            )
              ? data.requests
              : [];

          /*
           * Only keep requests belonging
           * to this task.
           */
          const taskRequests =
            incomingRequests.filter(
              (request) => {
                const requestTaskId =
                  request?.task?._id ||
                  request?.task?.id ||
                  request?.task;

                return (
                  String(requestTaskId) ===
                  String(taskId)
                );
              }
            );

          setRequests(
            taskRequests
          );
        } catch (err) {
          console.error(
            "Failed to load applicants:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Failed to load applicants. Please try again."
          );

          setRequests([]);
        } finally {
          setLoading(false);
        }
      },
      [taskId]
    );


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);


  // ==========================================================
  // TASK INFORMATION
  // ==========================================================

  const task =
    requests[0]?.task || null;

  const taskTitle =
    task?.title ||
    "Task Applicants";

  const taskCategory =
    task?.category || "";


  // ==========================================================
  // APPLICANT COUNTS
  // ==========================================================

  const applicantCounts =
    useMemo(() => {
      const pending =
        requests.filter(
          (request) =>
            request?.status ===
            "pending"
        ).length;

      const accepted =
        requests.filter(
          (request) =>
            request?.status ===
            "accepted"
        ).length;

      const declined =
        requests.filter(
          (request) =>
            request?.status ===
            "declined"
        ).length;

      return {
        total: requests.length,
        pending,
        accepted,
        declined,
      };
    }, [requests]);


  // ==========================================================
  // ACCEPT REQUEST
  // ==========================================================

  const handleAccept =
    useCallback(
      async (requestId) => {
        if (!requestId) {
          return;
        }

        try {
          setError("");
          setProcessingId(
            requestId
          );

          const response =
            await acceptRequest(
              requestId
            );

          /*
           * The backend creates a conversation
           * when a request is accepted.
           */
          const conversation =
            response?.data
              ?.conversation;

          /*
           * Refresh the applicants list first
           * so the UI is consistent.
           */
          await loadApplicants();

          if (
            conversation?._id
          ) {
            navigate(
              `/chat/${conversation._id}`
            );

            return;
          }

          /*
           * If the backend accepted the
           * request but did not return a
           * conversation, try finding it.
           */
          try {
            const conversationResponse =
              await getConversations();

            const conversationData =
              conversationResponse?.data;

            const conversationList =
              Array.isArray(
                conversationData
              )
                ? conversationData
                : conversationData
                    ?.conversations ||
                  [];

            const matchingConversation =
              conversationList.find(
                (item) =>
                  String(
                    item?.task?._id
                  ) ===
                  String(taskId)
              );

            if (
              matchingConversation?._id
            ) {
              navigate(
                `/chat/${matchingConversation._id}`
              );
            }
          } catch (conversationError) {
            console.error(
              "Failed to find conversation:",
              conversationError
            );
          }
        } catch (err) {
          console.error(
            "Failed to accept applicant:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Failed to accept applicant. Please try again."
          );
        } finally {
          setProcessingId(null);
        }
      },
      [
        loadApplicants,
        navigate,
        taskId,
      ]
    );


  // ==========================================================
  // DECLINE REQUEST
  // ==========================================================

  const handleDecline =
    useCallback(
      async (requestId) => {
        if (!requestId) {
          return;
        }

        try {
          setError("");
          setProcessingId(
            requestId
          );

          await declineRequest(
            requestId
          );

          await loadApplicants();
        } catch (err) {
          console.error(
            "Failed to decline applicant:",
            err
          );

          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Failed to decline applicant. Please try again."
          );
        } finally {
          setProcessingId(null);
        }
      },
      [loadApplicants]
    );


  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack =
    useCallback(() => {
      navigate("/tasks");
    }, [navigate]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="my-tasks-layout">
      <Sidebar />

      <main className="my-tasks-main-content">
        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="my-tasks-header">
          <div className="header-titles">
            <button
              type="button"
              className="applicants-back-button"
              onClick={handleBack}
            >
              <ArrowLeft
                size={18}
                strokeWidth={2.5}
              />

              Back to My Tasks
            </button>

            <h1 className="main-page-title">
              {taskTitle}
            </h1>

            <p className="main-page-subtitle">
              Review applicants for
              this task.
            </p>
          </div>
        </header>


        {/* ====================================================
            TASK SUMMARY
        ==================================================== */}

        <section className="applicants-page-summary">
          <div className="applicants-summary-icon">
            <UserRound
              size={24}
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="applicants-summary-label">
              Applicants
            </p>

            <h2 className="applicants-summary-title">
              {applicantCounts.total}
            </h2>
          </div>

          {taskCategory && (
            <span className="applicants-task-category">
              {taskCategory}
            </span>
          )}

          <div className="applicants-summary-stats">
            <span>
              <strong>
                {applicantCounts.pending}
              </strong>

              Pending
            </span>

            <span>
              <strong>
                {applicantCounts.accepted}
              </strong>

              Accepted
            </span>

            <span>
              <strong>
                {applicantCounts.declined}
              </strong>

              Declined
            </span>
          </div>
        </section>


        {/* ====================================================
            ERROR
        ==================================================== */}

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
              onClick={
                loadApplicants
              }
            >
              Retry
            </button>
          </div>
        )}


        {/* ====================================================
            APPLICANTS
        ==================================================== */}

        <section className="applicants-page-section">
          <div className="applicants-section-header">
            <div>
              <h2>
                Applicants
              </h2>

              <p>
                People who have
                requested to work
                on this task.
              </p>
            </div>

            <span className="applicants-total-badge">
              {applicantCounts.total}{" "}
              {applicantCounts.total ===
              1
                ? "Applicant"
                : "Applicants"}
            </span>
          </div>


          {loading ? (
            <div className="applicants-loading-state">
              <div className="applicants-spinner" />

              <p>
                Loading applicants...
              </p>
            </div>
          ) : requests.length ===
            0 ? (
            <div className="applicants-empty-state">
              <div className="applicants-empty-icon">
                <UserRound
                  size={30}
                  strokeWidth={1.8}
                />
              </div>

              <h3>
                No applicants yet
              </h3>

              <p>
                No one has applied
                for this task yet.
              </p>

              <button
                type="button"
                onClick={
                  handleBack
                }
              >
                Back to My Tasks
              </button>
            </div>
          ) : (
            <div className="applicants-list-body">
              {requests.map(
                (request) => (
                  <ApplicantCard
                    key={
                      request?._id
                    }
                    request={
                      request
                    }
                    processingId={
                      processingId
                    }
                    onAccept={
                      handleAccept
                    }
                    onDecline={
                      handleDecline
                    }
                  />
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}