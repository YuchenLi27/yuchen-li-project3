const API_ROOT = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_ROOT}/user`;

export const checkLogin = async () => {
  const response = await fetch(`${API_BASE}/isLoggedIn`, {
    credentials: "include",
  });
  return response.json();
};

export const loginUser = async (payload) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const registerUser = async (payload) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return response.json();
};

export const logoutUser = async () => {
  const response = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return response.json();
};