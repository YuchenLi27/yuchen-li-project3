import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, authLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "#111", 
    color: "#fff",
  };

  const leftStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  };

  const rightStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#e5e5e5", 
    fontWeight: "600",
  };

  const userBadgeStyle = {
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "#333",
    color: "#fff",
    fontWeight: "600",
  };

  const buttonStyle = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb", 
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <nav style={navStyle}>
      <div style={leftStyle}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/games" style={linkStyle}>Games</Link>
        <Link to="/rules" style={linkStyle}>Rules</Link>
        <Link to="/scores" style={linkStyle}>Scores</Link>
      </div>

      <div style={rightStyle}>
        {authLoading ? (
          <span>Loading...</span>
        ) : isLoggedIn ? (
          <>
            <span style={userBadgeStyle}>{user?.username}</span>
            <button onClick={handleLogout} style={buttonStyle}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}