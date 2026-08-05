import FilterButton from "./FilterButton";
import "../styles/RequestTabs.css";

const RequestTabs = ({
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

      <div className="tabs-left">

        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`request-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-label">
              {tab.label}
            </span>

            {tab.count > 0 && (
              <span className="tab-count">
                {tab.count}
              </span>
            )}
          </button>
        ))}

      </div>

      <div className="tabs-right">
  <FilterButton
    onClick={() => {
      console.log("Filter clicked");
    }}
  />
</div>

    </div>
  );
};

export default RequestTabs;