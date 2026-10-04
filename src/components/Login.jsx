import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");

    // Simple frontend validation
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    // Temporary login
    // Backend connect later
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: email,
      })
    );

    // Go to Dashboard
    navigate("/dashboard");
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.68)
          ),
          url("/legal-img.jpeg")
        `,
      }}
    >
      <nav className="legal-navbar">

        <div className="nav-brand">
          <span className="nav-icon">⚖</span>

          <div className="nav-title">
            <span>Smart Legal</span>
            <small>Guidance System</small>
          </div>
        </div>

        <button
          className="nav-back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

      </nav>

      <main className="login-main">

        <div className="login-card">

          <div className="login-card-icon">⚖</div>

          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Login to Smart Legal Guidance System
          </p>

          <form onSubmit={handleLogin}>

            <div className="login-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          <p className="login-signup-text">
            Don't have an account?

            <span onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>

        </div>

      </main>
    </div>
  );
}

export default Login;

