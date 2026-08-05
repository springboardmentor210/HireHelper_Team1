import { useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";

import SearchBar from "../../tasks/components/SearchBar";
import IncomingRequestTabs from "../components/IncomingRequestTabs";
import IncomingRequestCard from "../components/IncomingRequestCard";

import mockRequests from "../data/mockRequests";

import "../styles/Requests.css";

const Requests = () => {
  // Temporary data (Replace with API later)
  const [requests, setRequests] = useState(mockRequests);

  // Active Tab
  const [activeTab, setActiveTab] = useState("incoming");

  // Search Query
  const [searchQuery, setSearchQuery] = useState("");

  // Counts
  const counts = {
    incoming: requests.filter(
      (request) => request.status === "incoming"
    ).length,

    accepted: requests.filter(
      (request) => request.status === "accepted"
    ).length,

    declined: requests.filter(
      (request) => request.status === "declined"
    ).length,

    archived: requests.filter(
      (request) => request.status === "archived"
    ).length,
  };

  // Search + Status Filter
  const filteredRequests = requests.filter((request) => {
    const matchesTab =
      activeTab === "all" || request.status === activeTab;

    const keyword = searchQuery.toLowerCase();

    const fullName = `${request.applicant?.firstName || ""} ${
      request.applicant?.lastName || ""
    }`;

    const matchesSearch =
      fullName.toLowerCase().includes(keyword) ||
      (request.task?.title || "")
        .toLowerCase()
        .includes(keyword);

    return matchesTab && matchesSearch;
  });

  // Accept Request
  const handleAccept = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "accepted",
            }
          : request
      )
    );
  };

  // Decline Request
  const handleDecline = (id) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status: "declined",
            }
          : request
      )
    );
  };

  return (
    <div className="requests-layout">
      <Sidebar />

      <main className="requests-main">
        {/* Header */}
        <header className="requests-header">
          <div className="requests-header-left">
            <h1>Requests</h1>
            <p>People who want to help with your tasks</p>
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
          counts={counts}
        />

        {/* Section */}
        <section className="requests-section">
          <h2>Incoming Requests</h2>
          <p>People who want to help with your tasks</p>
        </section>

        {/* Request Cards */}
        <section className="requests-list">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <IncomingRequestCard
                key={request.id}
                request={request}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No Requests Found</h3>
              <p>There are no requests available.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Requests;