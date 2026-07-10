export default function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h2>{value}</h2>
      <p>{title}</p>
    </div>
  );
}