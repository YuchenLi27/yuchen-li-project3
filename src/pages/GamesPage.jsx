import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGame, getAllGames } from "../api/sudoku";
import { useAuth } from "../context/AuthContext";

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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

      if (!data?.success) {
        setErrorMessage(data?.message || "Failed to load games.");
        setGames([]);
        return;
      }

      setGames(Array.isArray(data.games) ? data.games : []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load games.");
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleCreateGame = async (difficulty) => {
    if (!isLoggedIn) {
      setErrorMessage("You must be logged in to create a game.");
      return;
    }

    try {
      setErrorMessage("");
      setCreatingDifficulty(difficulty);

      const data = await createGame(difficulty);

      if (!data?.success || !data?.gameId) {
        setErrorMessage(data?.message || "Failed to create game.");
        return;
      }

      navigate(`/game/${data.gameId}`);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create game.");
    } finally {
      setCreatingDifficulty("");
    }
  };

  const outerStyle = {
    minHeight: "calc(100vh - 72px)",
    backgroundColor: "#071a52",
    padding: "32px 24px",
  };

  const pageStyle = {
    maxWidth: "1100px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "8px",
    color: "#111111",
  };

  const subtitleStyle = {
    color: "#4b5563",
    marginBottom: "24px",
    fontSize: "16px",
  };

  const controlsStyle = {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "24px",
  };

  const buttonStyle = (disabled = false) => ({
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: disabled ? "#9ca3af" : "#111111",
    color: "#ffffff",
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  const warningStyle = {
    marginBottom: "18px",
    padding: "14px 16px",
    borderRadius: "10px",
    backgroundColor: "#fff7e6",
    color: "#7a4b00",
    fontWeight: "600",
  };

  const errorStyle = {
    marginBottom: "18px",
    padding: "14px 16px",
    borderRadius: "10px",
    backgroundColor: "#fdecea",
    color: "#b00020",
    fontWeight: "600",
  };

  const tableWrapperStyle = {
    overflowX: "auto",
    marginTop: "8px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "15px",
  };

  const thStyle = {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "2px solid #d1d5db",
    color: "#111827",
    backgroundColor: "#f9fafb",
  };

  const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
  };

  const linkButtonStyle = {
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    color: "#0a58ca",
    fontWeight: "700",
    cursor: "pointer",
  };

  return (
    <section style={outerStyle}>
      <div style={pageStyle}>
        <h1 style={titleStyle}>Game Selection</h1>
        <p style={subtitleStyle}>
          Create a new Sudoku game or continue an existing one.
        </p>

        {!isLoggedIn ? (
          <div style={warningStyle}>
            You can view existing games while logged out, but you must log in to create a new game.
          </div>
        ) : null}

        {errorMessage ? <div style={errorStyle}>{errorMessage}</div> : null}

        <div style={controlsStyle}>
          <button
            type="button"
            onClick={() => handleCreateGame("NORMAL")}
            style={buttonStyle(creatingDifficulty !== "" && creatingDifficulty !== "NORMAL")}
            disabled={creatingDifficulty !== ""}
          >
            {creatingDifficulty === "NORMAL"
              ? "Creating..."
              : "Create Normal Game"}
          </button>

          <button
            type="button"
            onClick={() => handleCreateGame("EASY")}
            style={buttonStyle(creatingDifficulty !== "" && creatingDifficulty !== "EASY")}
            disabled={creatingDifficulty !== ""}
          >
            {creatingDifficulty === "EASY"
              ? "Creating..."
              : "Create Easy Game"}
          </button>
        </div>

        {loading ? (
          <p style={{ color: "#374151" }}>Loading games...</p>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Game Name</th>
                  <th style={thStyle}>Difficulty</th>
                  <th style={thStyle}>Created By</th>
                  <th style={thStyle}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {games.length === 0 ? (
                  <tr>
                    <td style={tdStyle} colSpan="4">
                      No games found.
                    </td>
                  </tr>
                ) : (
                  games.map((game) => (
                    <tr key={game._id}>
                      <td style={tdStyle}>
                        <button
                          type="button"
                          style={linkButtonStyle}
                          onClick={() => navigate(`/game/${game._id}`)}
                        >
                          {game.name}
                        </button>
                      </td>
                      <td style={tdStyle}>{game.difficulty}</td>
                      <td style={tdStyle}>{game.createdBy}</td>
                      <td style={tdStyle}>{formatDate(game.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}