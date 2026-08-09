export default function RecentTaskCard({ task }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "20px",
      }}
    >
      <h3>{task.title}</h3>

      <p>
        <strong>Category:</strong> {task.category}
      </p>

      <p>
        <strong>Budget:</strong> {task.budget}
      </p>

      <p>
        <strong>Location:</strong> {task.location}
      </p>

      <p>
        <strong>Status:</strong> {task.status}
      </p>

      <p>{task.date}</p>
    </div>
  );
}