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
      count: counts.incoming ?? 0,
      showCount: true,
    },
    {
      id: "accepted",
      label: "Accepted",
      count: counts.accepted ?? 0,
      showCount: true,
    },
    {
      id: "declined",
      label: "Declined",
      count: counts.declined ?? 0,
      showCount: true,
    },
    {
      id: "archived",
      label: "Archived",
      count: counts.archived ?? 0,
      showCount: false,
    },
  ];

  return (
    <div className="incoming-request-tabs-container">
      <div className="incoming-tabs-list">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`incoming-tab-btn ${
                isActive ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="incoming-tab-label">
                {tab.label}
              </span>

              {tab.showCount && (
                <span
                  className={`incoming-tab-count ${
                    isActive ? "active" : ""
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default IncomingRequestTabs;