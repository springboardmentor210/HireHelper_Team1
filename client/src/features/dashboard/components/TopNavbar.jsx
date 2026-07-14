export default function TopNavbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: "30px",
      }}
    >
      <input
        type="text"
        id="task-search"
        name="taskSearch"
        placeholder="Search tasks..."
        style={{
          width: "350px",
          padding: "12px",
          border: "1px solid #d1d5db",
          borderRadius: "10px",
          outline: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <span style={{ fontSize: "22px", cursor: "pointer" }}>🔔</span>

        <img
          src="https://i.pravatar.cc/100"
          alt="Profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}