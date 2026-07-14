export default function UpcomingTasks() {
  const tasks = [
    {
      title: "House Cleaning",
      date: "Today • 10:00 AM",
      status: "Pending",
    },
    {
      title: "AC Repair",
      date: "Tomorrow • 2:00 PM",
      status: "Confirmed",
    },
    {
      title: "Furniture Assembly",
      date: "16 Jul • 11:30 AM",
      status: "Pending",
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
      <h3>Upcoming Tasks</h3>

      {tasks.map((task, index) => (
        <div
          key={index}
          style={{
            marginTop: "18px",
            paddingBottom: "12px",
            borderBottom: "1px solid #eee",
          }}
        >
          <h4>{task.title}</h4>

          <p>{task.date}</p>

          <span
            style={{
              color:
                task.status === "Confirmed"
                  ? "green"
                  : "orange",
              fontWeight: "600",
            }}
          >
            {task.status}
          </span>
        </div>
      ))}
    </div>
  );
}