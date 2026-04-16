const API_BASE = "http://localhost:5050/api/sudoku";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getAllGames = async () => {
  const response = await fetch(API_BASE, {
    credentials: "include",
  });

  return handleResponse(response);
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

  return handleResponse(response);
};

export const getGameById = async (gameId) => {
  const response = await fetch(`${API_BASE}/${gameId}`, {
    credentials: "include",
  });

  return handleResponse(response);
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

  return handleResponse(response);
};

export const deleteGame = async (gameId) => {
  const response = await fetch(`${API_BASE}/${gameId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(response);
};