import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  checkLogin,
  loginUser,
  logoutUser,
  registerUser,
} from "../api/auth";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const data = await checkLogin();

        if (data?.success && data?.username) {
          setUser({
            username: data.username,
            wins: data.wins ?? 0,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = async (payload) => {
    const data = await loginUser(payload);

    setUser({
      username: data.username,
      wins: data.wins ?? 0,
    });

    return data;
  };

  const register = async (payload) => {
    const data = await registerUser(payload);

    setUser({
      username: data.username,
      wins: data.wins ?? 0,
    });

    return data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(() => {
    return {
      user,
      setUser,
      authLoading,
      isLoggedIn: Boolean(user?.username),
      login,
      register,
      logout,
    };
  }, [user, authLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};