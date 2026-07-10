export default function QuickActions() {
  const actions = [
    "➕ Add Task",
    "📋 View Tasks",
    "📨 Requests",
    "⚙️ Settings",
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Quick Actions</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {actions.map((action) => (
          <button
            key={action}
            style={{
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background: "#2563eb",
              color: "white",
              fontWeight: "600",
            }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}