import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    formData.username.trim() !== "" && formData.password.trim() !== "";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await login({
        username: formData.username,
        password: formData.password,
      });

      navigate("/games");
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageStyle = {
    maxWidth: "520px",
    margin: "0 auto",
    padding: "32px 24px",
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "14px",
    padding: "24px",
    backgroundColor: "#fff",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "12px",
  };

  const descriptionStyle = {
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "24px",
  };

  const formStyle = {
    display: "grid",
    gap: "16px",
  };

  const fieldWrapperStyle = {
    display: "grid",
    gap: "8px",
  };

  const labelStyle = {
    fontWeight: "600",
  };

  const inputStyle = {
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: isFormValid && !isSubmitting ? "#222" : "#999",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: isFormValid && !isSubmitting ? "pointer" : "not-allowed",
  };

  const errorStyle = {
    color: "#b00020",
    fontSize: "14px",
  };

  const footerStyle = {
    marginTop: "18px",
    color: "#555",
  };

  return (
    <section style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Login</h1>
        <p style={descriptionStyle}>
          Enter your username and password to continue to the game selection
          page.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldWrapperStyle}>
            <label htmlFor="username" style={labelStyle}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your username"
            />
          </div>

          <div style={fieldWrapperStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your password"
            />
          </div>

          {errorMessage ? <p style={errorStyle}>{errorMessage}</p> : null}

          <button type="submit" disabled={!isFormValid || isSubmitting} style={buttonStyle}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={footerStyle}>
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </section>
  );
}