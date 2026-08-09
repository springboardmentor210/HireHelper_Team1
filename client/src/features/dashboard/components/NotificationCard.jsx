export default function NotificationCard({ notification }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "18px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginBottom: "15px",
      }}
    >
      <p style={{ margin: 0 }}>{notification.message}</p>

      <small
        style={{
          color: "#64748b",
        }}
      >
        {notification.time}
      </small>
    </div>
  );
}