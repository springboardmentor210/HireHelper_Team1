import React, { useMemo, useState } from "react";
import SearchBar from "../../shared/components/SearchBar";
import "./MyRequests.css";

const requests = [
  {
    id: 1,
    title: "Help Moving Furniture",
    category: "moving",
    owner: "Sarah Johnson",
    initials: "SJ",
    message:
      "I’d be happy to help with your move! I have experience with heavy lifting and can bring some moving equipment. Available Saturday afternoon as requested.",
    sent: "Sent Jul 4, 10:00 AM",
    location: "Downtown Seattle, WA",
    status: "Pending",
    action: "Cancel Request",
  },
  {
    id: 2,
    title: "Room Painting Project",
    category: "painting",
    owner: "Emma Carter",
    initials: "EC",
    message: "",
    sent: "Sent Jul 2, 8:00 AM",
    location: "Redmond, WA",
    status: "Accepted",
  },
  {
    id: 3,
    title: "Garden Cleanup",
    category: "gardening",
    owner: "Ryan Wilson",
    initials: "RW",
    message: "",
    sent: "Sent Jul 1, 9:30 AM",
    location: "Bellevue, WA",
    status: "Accepted",
  },
  {
    id: 4,
    title: "TV Mounting",
    category: "assembly",
    owner: "Tom Brown",
    initials: "TB",
    message: "",
    sent: "Sent Jun 30, 2:15 AM",
    location: "Kirkland, WA",
    status: "Accepted",
  },
  {
    id: 5,
    title: "Car Wash & Detail",
    category: "car care",
    owner: "Alex Carter",
    initials: "AC",
    message: "",
    sent: "Sent Jun 29, 11:00 AM",
    location: "Seattle, WA",
    status: "Accepted",
  },
];

const tabs = [
  { id: "all", label: "All Requests" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const MyRequests = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: requests.length,
      pending: requests.filter(
        (request) => request.status === "Pending"
      ).length,
      accepted: requests.filter(
        (request) => request.status === "Accepted"
      ).length,
      completed: 0,
      cancelled: 0,
    }),
    []
  );

  const filteredRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesTab =
        activeTab === "all" ||
        request.status.toLowerCase() === activeTab;

      const matchesSearch =
        !query ||
        request.title.toLowerCase().includes(query) ||
        request.category.toLowerCase().includes(query) ||
        request.owner.toLowerCase().includes(query) ||
        request.location.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const handleCancel = (id) => {
    console.log("Cancel request:", id);
  };

  return (
    <div className="my-requests-page">
      <main className="my-requests-main">
        {/* Page Header */}
        <header className="my-requests-header">
          <div className="my-requests-heading">
            <h1>My Requests</h1>

            <p>
              Track the help requests you have sent
            </p>
          </div>

          <div className="my-requests-header-actions">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
        </header>

        {/* Tabs */}
        <div className="my-requests-tabs-container">
          <div className="my-requests-tabs">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`my-request-tab ${
                    active ? "active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.label}</span>

                  {tab.id !== "completed" &&
                    tab.id !== "cancelled" && (
                      <span
                        className={`my-request-count ${
                          active ? "active" : ""
                        }`}
                      >
                        {counts[tab.id]}
                      </span>
                    )}

                  {tab.id === "completed" && (
                    <span
                      className={`my-request-count ${
                        active ? "active" : ""
                      }`}
                    >
                      {counts.completed}
                    </span>
                  )}

                  {tab.id === "cancelled" && (
                    <span
                      className={`my-request-count ${
                        active ? "active" : ""
                      }`}
                    >
                      {counts.cancelled}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section */}
        <section className="my-requests-section">
          <div className="my-requests-section-header">
            <h2>
              {activeTab === "all"
                ? "All Requests"
                : tabs.find(
                    (tab) => tab.id === activeTab
                  )?.label}
            </h2>

            <span className="request-result-count">
              {filteredRequests.length} request
              {filteredRequests.length !== 1
                ? "s"
                : ""}
            </span>
          </div>

          {/* Request List */}
          <div className="my-requests-list">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <article
                  className="my-request-card"
                  key={request.id}
                >
                  <div className="my-request-card-main">
                    {/* User */}
                    <div className="my-request-user">
                      <div className="my-request-avatar">
                        {request.initials}
                      </div>

                      <div className="my-request-user-info">
                        <div className="my-request-title-row">
                          <h3>{request.title}</h3>

                          <span className="my-request-category">
                            {request.category}
                          </span>
                        </div>

                        <p className="my-request-owner">
                          Task Owner:{" "}
                          <strong>
                            {request.owner}
                          </strong>
                        </p>

                        {request.message && (
                          <div className="my-request-message">
                            <span>
                              Your message:
                            </span>

                            <p>
                              {request.message}
                            </p>
                          </div>
                        )}

                        <div className="my-request-meta">
                          <span>
                            {request.sent}
                          </span>

                          <span className="meta-divider" />

                          <span>
                            {request.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status + Action */}
                    <div className="my-request-side">
                      <span
                        className={`request-status ${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>

                      {request.action && (
                        <button
                          type="button"
                          className="cancel-request-btn"
                          onClick={() =>
                            handleCancel(request.id)
                          }
                        >
                          {request.action}
                        </button>
                      )}

                      <button
                        type="button"
                        className="request-arrow-btn"
                        aria-label={`View ${request.title}`}
                      >
                        →
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="my-requests-empty">
                <h3>No requests found</h3>

                <p>
                  Try changing the selected tab or
                  search for another task.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MyRequests;