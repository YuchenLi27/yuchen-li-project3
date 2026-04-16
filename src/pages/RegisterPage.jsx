import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    verifyPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormFilled =
    formData.username.trim() !== "" &&
    formData.password.trim() !== "" &&
    formData.verifyPassword.trim() !== "";

  const passwordsMatch = formData.password === formData.verifyPassword;
  const canSubmit = isFormFilled && passwordsMatch && !isSubmitting;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormFilled) {
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await register({
        username: formData.username,
        password: formData.password,
      });

      navigate("/games");
    } catch (error) {
      setErrorMessage(error.message || "Registration failed. Please try again.");
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
    backgroundColor: canSubmit ? "#222" : "#999",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: canSubmit ? "pointer" : "not-allowed",
  };

  const errorStyle = {
    color: "#b00020",
    fontSize: "14px",
  };

  const helperStyle = {
    color:
      formData.verifyPassword && !passwordsMatch ? "#b00020" : "#555",
    fontSize: "14px",
  };

  const footerStyle = {
    marginTop: "18px",
    color: "#555",
  };

  return (
    <section style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Register</h1>
        <p style={descriptionStyle}>
          Create a new account to track game progress and show up on the high score board.
        </p>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldWrapperStyle}>
            <label htmlFor="username" style={labelStyle}>Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Choose a username"
            />
          </div>

          <div style={fieldWrapperStyle}>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Create a password"
            />
          </div>

          <div style={fieldWrapperStyle}>
            <label htmlFor="verifyPassword" style={labelStyle}>Verify Password</label>
            <input
              id="verifyPassword"
              name="verifyPassword"
              type="password"
              value={formData.verifyPassword}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Re-enter your password"
            />
            <p style={helperStyle}>
              {formData.verifyPassword
                ? passwordsMatch
                  ? "Passwords match."
                  : "Passwords do not match."
                : "Please enter your password again."}
            </p>
          </div>

          {errorMessage ? <p style={errorStyle}>{errorMessage}</p> : null}

          <button type="submit" disabled={!canSubmit} style={buttonStyle}>
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p style={footerStyle}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  );
}