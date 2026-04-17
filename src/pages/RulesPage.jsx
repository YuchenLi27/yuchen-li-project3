export default function RulesPage() {
  const containerStyle = {
    padding: "32px 24px",
    maxWidth: "900px",
    margin: "0 auto",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#c31515",
  };

  const listStyle = {
    lineHeight: "1.8",
    fontSize: "18px",
    paddingLeft: "20px",
    marginBottom: "28px",
    color: "rgb(182, 19, 141)",
  };

  const creditsStyle = {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "12px",
    backgroundColor: "#fff",
  };

  const sectionTitleStyle = {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#111",
  };

  const textStyle = {
    marginBottom: "10px",
    color: "#333",
    lineHeight: "1.6",
  };

  const linkListStyle = {
    display: "grid",
    gap: "10px",
    marginTop: "12px",
  };

  const linkStyle = {
    color: "#0a58ca",
    fontWeight: "600",
    textDecoration: "none",
  };

  return (
    <section style={containerStyle}>
      <h1 style={titleStyle}>Rules</h1>

      <ol style={listStyle}>
        <li>Each row must contain every number exactly once.</li>
        <li>Each column must contain every number exactly once.</li>
        <li>
          Each sub-grid must contain every number exactly once, with no repeats.
        </li>
        <li>Use logic to fill in the missing cells and complete the board.</li>
        <li>
          Easy mode uses a 6x6 board. Normal mode uses a 9x9 board.
        </li>
      </ol>

      <div style={creditsStyle}>
        <h2 style={sectionTitleStyle}>Made By / Credits</h2>
        <p style={textStyle}>
          This Sudoku app was created as a full stack course project.
        </p>

        <div style={linkListStyle}>
          <a href="mailto:yuchen@gmail.com" style={linkStyle}>
            Email: mailto:yuchen@gmail.com
          </a>
          <a
            href="https://github.com/YuchenLi27"
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            GitHub: github.com/YuchenLi27
          </a>
          <a
            href="https://www.linkedin.com/in/yuchen-li-ycl/"
            target="_blank"
            rel="noreferrer"
            style={linkStyle}
          >
            LinkedIn: https://www.linkedin.com/in/yuchen-li-ycl/
          </a>
        </div>
      </div>
    </section>
  );
}