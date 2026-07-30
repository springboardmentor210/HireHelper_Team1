export default function ActivityCard({ activity }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "15px",
      }}
    >
      <h3
        style={{
          margin: "0 0 8px",
          color: "#1e293b",
        }}
      >
        {activity.action}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {activity.time}
      </p>
    </div>
  );
}