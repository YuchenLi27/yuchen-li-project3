const API_ROOT = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_ROOT}/sudoku`;

export const getAllGames = async () => {
  const response = await fetch(API_BASE, {
    credentials: "include",
  });
  return response.json();
};

export const createGame = async (difficulty) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ difficulty }),
  });

  return response.json();
};

export const getGameById = async (gameId) => {
  const response = await fetch(`${API_BASE}/${gameId}`, {
    credentials: "include",
  });
  return response.json();
};

export const updateGame = async (gameId, payload) => {
  const response = await fetch(`${API_BASE}/${gameId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const deleteGame = async (gameId) => {
  const response = await fetch(`${API_BASE}/${gameId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return response.json();
};