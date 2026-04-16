import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGame, getAllGames } from "../api/sudoku";
import { useAuth } from "../context/AuthContext";

export default function GamesPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingDifficulty, setCreatingDifficulty] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadGames = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getAllGames();
      setGames(data.games || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load games.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleCreateGame = async (difficulty) => {
    if (!isLoggedIn) {
      return;
    }

    try {
      setCreatingDifficulty(difficulty);
      setErrorMessage("");

      const data = await createGame(difficulty);
      navigate(`/game/${data.gameId}`);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create game.");
    } finally {
      setCreatingDifficulty("");
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Unknown date";
    }
  };

  const outerStyle = {
    minHeight: "calc(100vh - 72px)",
    backgroundColor: "#071a52",
    padding: "32px 24px",
  };

  const pageStyle = {
    maxWidth: "960px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "12px",
    color: "#111111",
  };

  const descriptionStyle = {
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "12px",
    color: "#333333",
  };

  const noteStyle = {
    marginBottom: "24px",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: "#fff7e6",
    color: "#7a4b00",
    fontWeight: "600",
  };

  const actionsStyle = {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "32px",
  };

  const buttonStyle = (disabled) => ({
    padding: "14px 22px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: disabled ? "#9ca3af" : "#111111",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const sectionTitleStyle = {
    fontSize: "24px",
    fontWeight: "800",
    marginBottom: "16px",
    color: "#111111",
  };

  const listStyle = {
    display: "grid",
    gap: "16px",
  };

  const cardStyle = {
    border: "1px solid #dbe1ea",
    borderRadius: "16px",
    padding: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "transform 0.15s ease, box-shadow 0.15s ease",
  };

  const gameTitleStyle = {
    fontSize: "22px",
    fontWeight: "800",
    marginBottom: "12px",
    color: "#111111",
  };

  const metaStyle = {
    marginBottom: "8px",
    color: "#374151",
    fontSize: "15px",
  };

  const linkStyle = {
    display: "inline-block",
    marginTop: "14px",
    textDecoration: "none",
    color: "#0a58ca",
    fontWeight: "700",
  };

  const errorStyle = {
    color: "#b00020",
    marginBottom: "16px",
    fontWeight: "600",
  };

  return (
    <section style={outerStyle}>
      <div style={pageStyle}>
        <h1 style={titleStyle}>Games</h1>
        <p style={descriptionStyle}>
          Create a new Sudoku game or continue an existing one.
        </p>

        {!isLoggedIn ? (
          <div style={noteStyle}>
            You can view existing games while logged out, but creating or
            playing games requires login.
          </div>
        ) : null}

        {errorMessage ? <p style={errorStyle}>{errorMessage}</p> : null}

        <div style={actionsStyle}>
          <button
            type="button"
            style={buttonStyle(!isLoggedIn || creatingDifficulty !== "")}
            disabled={!isLoggedIn || creatingDifficulty !== ""}
            onClick={() => handleCreateGame("NORMAL")}
          >
            {creatingDifficulty === "NORMAL"
              ? "Creating..."
              : "Create Normal Game"}
          </button>

          <button
            type="button"
            style={buttonStyle(!isLoggedIn || creatingDifficulty !== "")}
            disabled={!isLoggedIn || creatingDifficulty !== ""}
            onClick={() => handleCreateGame("EASY")}
          >
            {creatingDifficulty === "EASY" ? "Creating..." : "Create Easy Game"}
          </button>
        </div>

        <h2 style={sectionTitleStyle}>Available Games</h2>

        {loading ? (
          <p style={{ color: "#374151" }}>Loading games...</p>
        ) : games.length === 0 ? (
          <p style={{ color: "#374151" }}>No games yet. Create your first one.</p>
        ) : (
          <div style={listStyle}>
            {games.map((game) => (
              <article
                key={game._id}
                style={cardStyle}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-2px)";
                  event.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(0,0,0,0.10)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.06)";
                }}
              >
                <h3 style={gameTitleStyle}>{game.name}</h3>

                <p style={metaStyle}>
                  <strong>Difficulty:</strong>{" "}
                  <span
                    style={{
                      color: game.difficulty === "EASY" ? "#2e7d32" : "#c62828",
                      fontWeight: "700",
                    }}
                  >
                    {game.difficulty}
                  </span>
                </p>

                <p style={metaStyle}>
                  <strong>Created By:</strong>{" "}
                  <span style={{ color: "#0a58ca", fontWeight: "700" }}>
                    {game.createdBy}
                  </span>
                </p>

                <p style={metaStyle}>
                  <strong>Created At:</strong> {formatDate(game.createdAt)}
                </p>

                <Link to={`/game/${game._id}`} style={linkStyle}>
                  View Game
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}