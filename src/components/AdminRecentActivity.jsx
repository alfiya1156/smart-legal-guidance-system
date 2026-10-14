import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/UserManagement.css";

const API_URL = "http://localhost:5000/api/admin/recent-activity";

function AdminRecentActivity() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getAdminDetails = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("admin")) ||
        JSON.parse(localStorage.getItem("user")) ||
        {}
      );
    } catch {
      return {};
    }
  };

  const admin = getAdminDetails();
  const adminName = admin.name || admin.username || "Admin";
  const adminEmail = admin.email || "Administrator";

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin-dashboard" },
    { label: "User Management", icon: "👥", path: "/admin/users" },
    { label: "Legal Awareness", icon: "⚖️", path: "/admin/legal-awareness" },
    { label: "AI Legal Knowledge", icon: "📚", path: "/admin/ai-legal-knowledge" },
    { label: "Recent Activity", icon: "🕒", path: "/admin/recent-activity" },
  ];

  const fetchActivities = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(API_URL, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load system activities.");
      }

      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filtered = activities.filter((act) => {
    const q = search.trim().toLowerCase();
    return (
      String(act.activity || "").toLowerCase().includes(q) ||
      String(act.activity_type || "").toLowerCase().includes(q) ||
      String(act.user_name || "").toLowerCase().includes(q) ||
      String(act.user_email || "").toLowerCase().includes(q)
    );
  });

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard um-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">⚖️</div>
          <div className="admin-brand-text">
            <h2>SMART LEGAL</h2>
            <p>GUIDANCE SYSTEM</p>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">{adminName.charAt(0).toUpperCase()}</div>
          <div className="admin-profile-info">
            <h3>{adminName}</h3>
          </div>
        </div>

        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`admin-menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="admin-menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button type="button" className="admin-logout-button" onClick={handleLogout}>
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-content um-main">
        <header className="admin-topbar">
          <div>
            <h1>System Activity Logs</h1>
            <p>Review real-time citizen logins, AI consultations, and form generations.</p>
          </div>

          <div className="admin-topbar-user">
            <span className="admin-topbar-avatar">{adminName.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{adminName}</strong>
              <p>{adminEmail}</p>
            </div>
          </div>
        </header>

        <section className="um-summary">
          <div className="um-summary-icon">🕒</div>
          <div>
            <p>Recent Activity Entries</p>
            <h2>{loading ? "..." : activities.length}</h2>
          </div>
        </section>

        <section className="um-panel">
          <div className="um-panel-heading">
            <div>
              <h2>User Activity Log</h2>
              <p>Auditable system interactions across the Smart Legal Guidance platform.</p>
            </div>

            <button
              type="button"
              className="um-refresh-button"
              onClick={fetchActivities}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          <div className="um-search">
            <span>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, category, citizen name, or email..."
            />
          </div>

          {loading ? (
            <div className="um-state">
              <span className="um-spinner" />
              <p>Loading activity logs...</p>
            </div>
          ) : error ? (
            <div className="um-state um-error">
              <span>⚠️</span>
              <p>{error}</p>
              <button type="button" className="um-refresh-button" onClick={fetchActivities}>
                Try Again
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="um-state">
              <span>🕒</span>
              <h3>No activities found</h3>
              <p>{search ? "Try another search term." : "No activities recorded."}</p>
            </div>
          ) : (
            <div className="um-table-wrapper">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Citizen User</th>
                    <th>Activity</th>
                    <th>Module / Type</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((act) => (
                    <tr key={act.id}>
                      <td>#{act.id}</td>
                      <td>
                        <strong>{act.user_name || `User #${act.user_id}`}</strong>
                        <br />
                        <small style={{ color: "#a5978b" }}>{act.user_email || "—"}</small>
                      </td>
                      <td>{act.activity}</td>
                      <td>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: "4px",
                            fontSize: "12px",
                            background:
                              act.activity_type === "Login"
                                ? "#2d4a22"
                                : act.activity_type === "AI Assistant"
                                ? "#4a3c1c"
                                : "#30261f",
                            color: "#f1e5d1",
                          }}
                        >
                          {act.activity_type || "General"}
                        </span>
                      </td>
                      <td>{act.created_at ? new Date(act.created_at).toLocaleString("en-IN") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="admin-footer">
          <p>© Smart Legal Guidance System for Indian Citizens</p>
        </footer>
      </main>
    </div>
  );
}

export default AdminRecentActivity;
