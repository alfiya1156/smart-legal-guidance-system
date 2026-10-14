import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!email.trim() || !password) {
      setMessage("Please enter admin email and password.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Admin login failed.");
        setMessageType("error");
        return;
      }

      // Verify that the backend identifies this account as admin.
      if (!data.admin || data.admin.role !== "admin") {
        setMessage("Admin access denied.");
        setMessageType("error");
        return;
      }

      // Keep admin session separate from the user session.
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      setMessage("Admin login successful!");
      setMessageType("success");

      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 700);
    } catch (error) {
      console.error("Admin login error:", error);
      setMessage(
        "Unable to connect to server. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-login-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(20, 12, 6, 0.76),
            rgba(20, 12, 6, 0.88)
          ),
          url("/legal-img.jpeg")
        `,
      }}
    >
      <nav className="admin-navbar">
        <div className="admin-brand">
          <span className="admin-brand-icon">⚖</span>

          <div>
            <h2>Smart Legal</h2>
            <p>Guidance System</p>
          </div>
        </div>

        <button
          className="admin-back-button"
          onClick={() => navigate("/login")}
        >
          ← User Login
        </button>
      </nav>

      <main className="admin-login-main">
        <div className="admin-login-card">
          <div className="admin-icon">♙</div>

          <p className="admin-label">RESTRICTED ACCESS</p>

          <h1>Administrator Login</h1>

          <p className="admin-subtitle">
            Authorized administrators only
          </p>

          <form onSubmit={handleAdminLogin}>
            <div className="admin-input-group">
              <label>Admin Email Address</label>

              <input
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {message && (
              <div
                className={`admin-message ${
                  messageType === "success"
                    ? "admin-success"
                    : "admin-error"
                }`}
                role="status"
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="admin-submit-button"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Secure Admin Login"}
            </button>
          </form>

          <p className="admin-security-note">
            🔒 Secure access for authorized administrators.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;