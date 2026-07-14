export default function RecommendedTasks() {
  const tasks = [
    {
      title: "Garden Cleaning",
      budget: "₹700",
      location: "Hyderabad",
    },
    {
      title: "Laptop Setup",
      budget: "₹500",
      location: "Bengaluru",
    },
    {
      title: "Painting Work",
      budget: "₹1500",
      location: "Chennai",
    },
    {
      title: "Electrician Needed",
      budget: "₹900",
      location: "Pune",
    },
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
      <h3 style={{ marginBottom: "20px" }}>Recommended Tasks</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "15px",
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.title}
            style={{
              background: "#f8fafc",
              padding: "15px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0" }}>{task.title}</h4>

            <p style={{ margin: "4px 0", color: "#6b7280" }}>
              📍 {task.location}
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontWeight: "600",
                color: "#2563eb",
              }}
            >
              {task.budget}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}