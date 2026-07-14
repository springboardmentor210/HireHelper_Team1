export default function RecentActivity() {
  const activities = [
    "Task completed successfully",
    "New helper accepted your request",
    "Payment received",
    "Profile updated",
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      }}
    >
      <h3>Recent Activity</h3>

      {activities.map((activity, index) => (
        <p
          key={index}
          style={{
            marginTop: "16px",
            color: "#555",
          }}
        >
          • {activity}
        </p>
      ))}
    </div>
  );
}