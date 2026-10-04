import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div
      className="signup-page"
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
      <nav className="signup-navbar">

        <div className="signup-nav-brand">
          <span className="signup-nav-icon">⚖</span>

          <div className="signup-nav-title">
            <span>Smart Legal</span>
            <small>Guidance System</small>
          </div>
        </div>

        <button
          className="signup-back-button"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>

      </nav>

      <main className="signup-main">

        <div className="signup-card">

          <div className="signup-card-icon">⚖</div>

          <h1>Create Account</h1>

          <p className="signup-subtitle">
            Join Smart Legal Guidance System
          </p>

          <form onSubmit={handleSignup}>

            <div className="signup-input-group">
              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="signup-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="signup-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="signup-input-group">
              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="signup-button"
            >
              Create Account
            </button>

          </form>

          <p className="signup-login-text">
            Already have an account?

            <span onClick={() => navigate("/login")}>
              Login
            </span>
          </p>

        </div>

      </main>
    </div>
  );
}

export default Signup;