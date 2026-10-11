import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    // Clear previous message
    setMessage("");
    setMessageType("");

    // Frontend validation
    if (!email || !password) {
      setMessage("Please enter email and password");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Store complete logged-in user details
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setMessage("Login successful!");
        setMessageType("success");

        // Go to Dashboard after short delay
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setMessage(data.message || "Invalid email or password");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Login error:", error);

      setMessage("Unable to connect to server");
      setMessageType("error");
    }
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

            {/* LOGIN MESSAGE */}
            {message && (
              <div
                className={
                  messageType === "success"
                    ? "login-message success-login-message"
                    : "login-message error-login-message"
                }
              >
                {message}
              </div>
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




