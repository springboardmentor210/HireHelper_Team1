import FilterButton from "./FilterButton";
import "../styles/Requests.css";
const IncomingRequestTabs = ({
  activeTab,
  setActiveTab,
  counts,
}) => {
  const tabs = [
    {
      id: "incoming",
      label: "Incoming",
      count: counts.incoming,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: counts.accepted,
    },
    {
      id: "declined",
      label: "Declined",
      count: counts.declined,
    },
    {
      id: "archived",
      label: "Archived",
      count: counts.archived,
    },
  ];

  return (
  <div className="request-tabs-container">
    <div className="tabs-list">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${isActive ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-label">
              {tab.label}
            </span>

            <span
              className={`tab-count-badge ${
                isActive ? "active" : ""
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>

    <div className="filter-button-wrapper">
      <FilterButton
        onClick={() => {
          console.log("Filter clicked");
        }}
      />
    </div>
  </div>
);
};

export default IncomingRequestTabs;