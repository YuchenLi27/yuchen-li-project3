function formatTime(totalSeconds = 0) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);

  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

export default function Timer({ elapsedSeconds = 0 }) {
  return (
    <div
      style={{
        display: "inline-block",
        marginTop: "12px",
        marginBottom: "16px",
        padding: "10px 16px",
        borderRadius: "12px",
        backgroundColor: "#eef4ff",
        color: "#214b9a",
        fontWeight: "700",
        fontSize: "16px"
      }}
    >
      Time: {formatTime(elapsedSeconds)}
    </div>
  );
}