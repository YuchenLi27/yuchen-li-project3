import { useEffect, useState } from "react";
import { getHighscores } from "../api/highscore";

export default function ScoresPage() {
  const [highscores, setHighscores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadHighscores = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getHighscores();
        setHighscores(data.highscores || []);
      } catch (error) {
        setErrorMessage(error.message || "Failed to load high scores.");
      } finally {
        setLoading(false);
      }
    };

    loadHighscores();
  }, []);

  const pageStyle = {
    maxWidth: "860px",
    margin: "0 auto",
    padding: "32px 24px",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
  };

  const errorStyle = {
    color: "#b00020",
    marginBottom: "16px",
  };

  const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#ffffff", 
  border: "1px solid #ccc",
};

const headerCellStyle = {
  textAlign: "left",
  padding: "14px 16px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#111",
  color: "#fff", 
  fontWeight: "700",
};

const cellStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #eee",
  color: "#222", 
};

  return (
    <section style={pageStyle}>
      <h1 style={titleStyle}>High Scores</h1>

      {errorMessage ? <p style={errorStyle}>{errorMessage}</p> : null}

      {loading ? (
        <p>Loading high scores...</p>
      ) : highscores.length === 0 ? (
        <p>No completed games yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerCellStyle}>Rank</th>
              <th style={headerCellStyle}>Username</th>
              <th style={headerCellStyle}>Wins</th>
            </tr>
          </thead>
          <tbody>
            {highscores.map((player, index) => (
              <tr
                key={player.username}
                style={{
                  backgroundColor: index % 2 === 0 ? "#fafafa" : "#ffffff",
            }}
          >
            <td style={cellStyle}>{index + 1}</td>
            <td style={cellStyle}>{player.username}</td>
            <td style={cellStyle}>{player.wins}</td>
          </tr>
          ))}
          </tbody>
        </table>
      )}
    </section>
  );
}