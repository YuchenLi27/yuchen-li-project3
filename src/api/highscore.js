const API_BASE = "http://localhost:5050/api/highscore";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getHighscores = async () => {
  const response = await fetch(API_BASE, {
    credentials: "include",
  });

  return handleResponse(response);
};

export const updateHighscore = async (payload) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

export const getHighscoreByGameId = async (gameId) => {
  const response = await fetch(`${API_BASE}/${gameId}`, {
    credentials: "include",
  });

  return handleResponse(response);
};