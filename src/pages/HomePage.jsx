import { Link } from "react-router-dom";

export default function HomePage() {
  const containerStyle = {
    padding: "32px 24px",
    maxWidth: "900px",
    margin: "0 auto",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "40px",
    fontWeight: "700",
    marginBottom: "16px",
  };

  const textStyle = {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "24px",
  };

  const buttonRowStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "24px",
  };

  const buttonStyle = {
    display: "inline-block",
    padding: "12px 20px",
    borderRadius: "10px",
    textDecoration: "none",
    backgroundColor: "#222",
    color: "#fff",
    fontWeight: "600",
  };

  return (
    <section style={containerStyle}>
      <h1 style={titleStyle}>Sudoku</h1>
      <p style={textStyle}>
        Welcome to the fullstack Sudoku project. You can view the rules,
        explore game pages, and later log in to create and complete games.
      </p>

      <div style={buttonRowStyle}>
        <Link to="/games" style={buttonStyle}>
          Go to Games
        </Link>
        <Link to="/rules" style={buttonStyle}>
          View Rules
        </Link>
      </div>
    </section>
  );
}