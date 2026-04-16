import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteGame, getGameById, updateGame } from "../api/sudoku";
import { updateHighscore } from "../api/highscore";
import { useAuth } from "../context/AuthContext";

const cloneBoard = (board) => board.map((row) => [...row]);

const boardsAreEqual = (boardA, boardB) => {
  if (!Array.isArray(boardA) || !Array.isArray(boardB)) {
    return false;
  }

  if (boardA.length !== boardB.length) {
    return false;
  }

  for (let row = 0; row < boardA.length; row += 1) {
    if (!Array.isArray(boardA[row]) || !Array.isArray(boardB[row])) {
      return false;
    }

    if (boardA[row].length !== boardB[row].length) {
      return false;
    }

    for (let col = 0; col < boardA[row].length; col += 1) {
      if (Number(boardA[row][col]) !== Number(boardB[row][col])) {
        return false;
      }
    }
  }

  return true;
};

const getSubgridConfig = (boardSize) => {
  if (boardSize === 6) {
    return { subgridRows: 2, subgridCols: 3 };
  }

  return { subgridRows: 3, subgridCols: 3 };
};

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, setUser } = useAuth();

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [hasRecordedWin, setHasRecordedWin] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const hasLoadedInitialData = useRef(false);
  const isRecordingWinRef = useRef(false);

  useEffect(() => {
    const loadGame = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setSaveMessage("");

        const data = await getGameById(gameId);
        const loadedGame = data.game;

        setGame(loadedGame);
        setBoard(cloneBoard(loadedGame.board));

        const currentUsername = user?.username;
        const alreadyCompleted =
          currentUsername && loadedGame.completedBy?.includes(currentUsername);

        setHasRecordedWin(Boolean(alreadyCompleted));
        hasLoadedInitialData.current = true;
      } catch (error) {
        setErrorMessage(error.message || "Failed to load game.");
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [gameId, user]);

  const boardSize = game?.board?.length ?? 0;
  const { subgridRows, subgridCols } = getSubgridConfig(boardSize);

  const isCompleted = useMemo(() => {
    if (!game || !board.length || !game.solution) {
      return false;
    }

    return boardsAreEqual(board, game.solution);
  }, [board, game]);

  const canDeleteGame = isLoggedIn && user?.username && game?.createdBy === user.username;

  useEffect(() => {
    if (!game || !isLoggedIn || !hasLoadedInitialData.current) {
      return;
    }

    if (boardsAreEqual(board, game.board)) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const data = await updateGame(gameId, { board });
        setGame(data.game);
        setSaveMessage("Progress auto-saved.");
      } catch (error) {
        setErrorMessage(error.message || "Failed to auto-save progress.");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [board, game, gameId, isLoggedIn]);

  useEffect(() => {
    const recordCompletion = async () => {
      if (!game || !isCompleted) {
        return;
      }

      if (!isLoggedIn) {
        setSaveMessage("Game completed successfully. Log in to record your win.");
        return;
      }

      if (hasRecordedWin || isRecordingWinRef.current) {
        return;
      }

      try {
        isRecordingWinRef.current = true;
        const highscoreData = await updateHighscore({ gameId });

        setUser((prev) => {
          if (!prev) {
            return prev;
          }

          return {
            ...prev,
            wins: highscoreData.wins ?? prev.wins,
          };
        });

        const refreshedGameData = await getGameById(gameId);
        setGame(refreshedGameData.game);
        setBoard(cloneBoard(refreshedGameData.game.board));
        setHasRecordedWin(true);
        setSaveMessage("Game completed successfully. Your win has been recorded.");
      } catch (error) {
        setErrorMessage(error.message || "Failed to record completed game.");
      } finally {
        isRecordingWinRef.current = false;
      }
    };

    recordCompletion();
  }, [game, gameId, hasRecordedWin, isCompleted, isLoggedIn, setUser]);

  const handleCellChange = (rowIndex, colIndex, value) => {
    if (!game || !isLoggedIn) {
      return;
    }

    if (game.initialBoard[rowIndex][colIndex] !== 0) {
      return;
    }

    if (value === "") {
      const nextBoard = cloneBoard(board);
      nextBoard[rowIndex][colIndex] = 0;
      setBoard(nextBoard);
      setSaveMessage("");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > boardSize) {
      return;
    }

    const nextBoard = cloneBoard(board);
    nextBoard[rowIndex][colIndex] = numericValue;
    setBoard(nextBoard);
    setSaveMessage("");
  };

  const handleReset = () => {
    if (!game || !isLoggedIn) {
      return;
    }

    setBoard(cloneBoard(game.initialBoard));
    setSaveMessage("");
    setErrorMessage("");

    const currentUsername = user?.username;
    const alreadyCompleted =
      currentUsername && game.completedBy?.includes(currentUsername);

    setHasRecordedWin(Boolean(alreadyCompleted));
  };

  const handleDeleteGame = async () => {
    if (!game || !canDeleteGame) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this game? This will also update recorded wins for users who completed it."
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage("");
      setSaveMessage("");

      await deleteGame(gameId);
      navigate("/games");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete game.");
    } finally {
      setIsDeleting(false);
    }
  };

  const outerStyle = {
    minHeight: "calc(100vh - 72px)",
    backgroundColor: "#071a52",
    padding: "32px 24px",
  };

  const pageStyle = {
    maxWidth: "980px",
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

  const metaStyle = {
    marginBottom: "10px",
    color: "#374151",
    fontSize: "16px",
  };

  const topControlsStyle = {
    marginTop: "18px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  };

  const bottomControlsStyle = {
    marginTop: "24px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  };

  const successStyle = {
    marginTop: "18px",
    marginBottom: "18px",
    padding: "14px 16px",
    borderRadius: "10px",
    backgroundColor: "#eaf7ea",
    color: "#1f6b2a",
    fontWeight: "700",
  };

  const infoStyle = {
    marginTop: "18px",
    marginBottom: "18px",
    padding: "14px 16px",
    borderRadius: "10px",
    backgroundColor: "#eef4ff",
    color: "#214b9a",
    fontWeight: "600",
  };

  const warningStyle = {
    marginTop: "18px",
    marginBottom: "18px",
    padding: "14px 16px",
    borderRadius: "10px",
    backgroundColor: "#fff7e6",
    color: "#7a4b00",
    fontWeight: "600",
  };

  const errorStyle = {
    color: "#b00020",
    fontWeight: "600",
  };

  const boardWrapperStyle = {
    display: "inline-block",
    border: "3px solid #222",
    marginTop: "24px",
    backgroundColor: "#ffffff",
  };

  const rowStyle = {
    display: "flex",
  };

  const getCellStyle = (rowIndex, colIndex, isFixed) => {
    const thickRight = (colIndex + 1) % subgridCols === 0 && colIndex !== boardSize - 1;
    const thickBottom = (rowIndex + 1) % subgridRows === 0 && rowIndex !== boardSize - 1;

    return {
      width: boardSize === 6 ? "54px" : "46px",
      height: boardSize === 6 ? "54px" : "46px",
      borderTop: "1px solid #999",
      borderLeft: "1px solid #999",
      borderRight: thickRight ? "3px solid #222" : "1px solid #999",
      borderBottom: thickBottom ? "3px solid #222" : "1px solid #999",
      textAlign: "center",
      fontSize: boardSize === 6 ? "22px" : "20px",
      fontWeight: isFixed ? "700" : "500",
      backgroundColor: isFixed ? "#f3f4f6" : isLoggedIn ? "#ffffff" : "#fafafa",
      color: "#111111",
      outline: "none",
      cursor: isFixed || !isLoggedIn ? "default" : "text",
    };
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

  const deleteButtonStyle = (disabled = false) => ({
    padding: "12px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: disabled ? "#ef9a9a" : "#d62828",
    color: "#ffffff",
    fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
  });

  if (loading) {
    return (
      <section style={outerStyle}>
        <div style={pageStyle}>
          <p style={{ color: "#374151" }}>Loading game...</p>
        </div>
      </section>
    );
  }

  if (errorMessage && !game) {
    return (
      <section style={outerStyle}>
        <div style={pageStyle}>
          <p style={errorStyle}>{errorMessage}</p>
        </div>
      </section>
    );
  }

  if (!game) {
    return (
      <section style={outerStyle}>
        <div style={pageStyle}>
          <p style={errorStyle}>Game not found.</p>
        </div>
      </section>
    );
  }

  return (
    <section style={outerStyle}>
      <div style={pageStyle}>
        <h1 style={titleStyle}>{game.name}</h1>

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

        {!isLoggedIn ? (
          <div style={warningStyle}>
            You can view this game while logged out, but interaction is disabled until you log in.
          </div>
        ) : null}

        {isCompleted ? (
          <div style={successStyle}>Game completed successfully.</div>
        ) : null}

        {hasRecordedWin ? (
          <div style={infoStyle}>
            This completed game has already been recorded for your account.
          </div>
        ) : null}

        {saveMessage ? <div style={infoStyle}>{saveMessage}</div> : null}
        {errorMessage ? <p style={errorStyle}>{errorMessage}</p> : null}

        {canDeleteGame ? (
          <div style={topControlsStyle}>
            <button
              type="button"
              onClick={handleDeleteGame}
              style={deleteButtonStyle(isDeleting)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Game"}
            </button>
          </div>
        ) : null}

        <div style={boardWrapperStyle}>
          {board.map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} style={rowStyle}>
              {row.map((cell, colIndex) => {
                const isFixed = game.initialBoard[rowIndex][colIndex] !== 0;

                return (
                  <input
                    key={`cell-${rowIndex}-${colIndex}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={cell === 0 ? "" : cell}
                    readOnly={isFixed || !isLoggedIn}
                    onChange={(event) =>
                      handleCellChange(rowIndex, colIndex, event.target.value)
                    }
                    style={getCellStyle(rowIndex, colIndex, isFixed)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {isLoggedIn ? (
          <div style={bottomControlsStyle}>
            <button type="button" onClick={handleReset} style={buttonStyle(false)}>
              Reset Game
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}