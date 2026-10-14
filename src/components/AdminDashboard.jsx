import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    usersCount: 0,
    awarenessCount: 0,
    knowledgeCount: 0,
    submissionsCount: 0,
    activitiesCount: 0,
  });

  const getAdminDetails = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("admin")) ||
        JSON.parse(localStorage.getItem("user")) ||
        {}
      );
    } catch (error) {
      return {};
    }
  };

  const admin = getAdminDetails();
  const adminName = admin.name || admin.username || "Admin";
  const adminEmail = admin.email || "Administrator";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/stats", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (res.ok && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        console.warn("Could not load admin stats:", err.message);
      }
    };
    fetchStats();
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      icon: "📊",
      path: "/admin-dashboard",
    },
    {
      label: "User Management",
      icon: "👥",
      path: "/admin/users",
    },
    {
      label: "Legal Awareness",
      icon: "⚖️",
      path: "/admin/legal-awareness",
    },
    {
      label: "AI Legal Knowledge",
      icon: "📚",
      path: "/admin/ai-legal-knowledge",
    },
    {
      label: "Recent Activity",
      icon: "🕒",
      path: "/admin/recent-activity",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="admin-dashboard">

      {/* FIXED SIDEBAR */}
      <aside className="admin-sidebar">

        {/* BRAND */}
        <div className="admin-brand">
          <div className="admin-brand-icon">⚖️</div>

          <div className="admin-brand-text">
            <h2>SMART LEGAL</h2>
            <p>GUIDANCE SYSTEM</p>
          </div>
        </div>

        {/* ADMIN NAME ONLY */}
        <div className="admin-profile">
          <div className="admin-avatar">
            {adminName.charAt(0).toUpperCase()}
          </div>

          <div className="admin-profile-info">
            <h3>{adminName}</h3>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="admin-navigation">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path;

            return (
              <button
                key={item.path}
                type="button"
                className={`admin-menu-item ${
                  isActive ? "active" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="admin-menu-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-logout-button"
            onClick={() => setShowLogoutModal(true)}
          >
            <span>↪</span>
            Logout
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-content">

        <header className="admin-topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>
              Smart Legal Guidance System for Indian Citizens
            </p>
          </div>

          <div className="admin-topbar-user">
            <span className="admin-topbar-avatar">
              {adminName.charAt(0).toUpperCase()}
            </span>

            <div>
              <strong>{adminName}</strong>
              <p>{adminEmail}</p>
            </div>
          </div>
        </header>

        {/* WELCOME BANNER */}
        <section className="admin-welcome-banner">
          <div>
            <span className="admin-welcome-label">
              ADMINISTRATION PANEL
            </span>

            <h2>Welcome back, {adminName}!</h2>

            <p>
              Manage users and maintain legal information
              through your administration panel.
            </p>
          </div>

          <div className="admin-banner-icon">⚖️</div>
        </section>

        {/* DASHBOARD OVERVIEW */}
        <section className="admin-overview-section">
          <div className="admin-section-heading">
            <div>
              <h2>Dashboard Overview</h2>
              <p>Manage your legal guidance system</p>
            </div>
          </div>

          <div className="admin-overview-grid">

            <button
              type="button"
              className="admin-overview-card"
              onClick={() => navigate("/admin/users")}
            >
              <div className="admin-card-icon users-icon">
                👥
              </div>

              <div className="admin-card-details">
                <h3>User Management</h3>
                <p>{stats.usersCount} Registered Citizens</p>
              </div>

              <span className="admin-card-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-overview-card"
              onClick={() =>
                navigate("/admin/legal-awareness")
              }
            >
              <div className="admin-card-icon awareness-icon">
                ⚖️
              </div>

              <div className="admin-card-details">
                <h3>Legal Awareness</h3>
                <p>{stats.awarenessCount} Awareness Laws</p>
              </div>

              <span className="admin-card-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-overview-card"
              onClick={() =>
                navigate("/admin/ai-legal-knowledge")
              }
            >
              <div className="admin-card-icon knowledge-icon">
                📚
              </div>

              <div className="admin-card-details">
                <h3>AI Legal Knowledge</h3>
                <p>{stats.knowledgeCount} Legal Citations</p>
              </div>

              <span className="admin-card-arrow">→</span>
            </button>

            <button
              type="button"
              className="admin-overview-card"
              onClick={() =>
                navigate("/admin/recent-activity")
              }
            >
              <div className="admin-card-icon activity-icon">
                🕒
              </div>

              <div className="admin-card-details">
                <h3>Recent Activity</h3>
                <p>{stats.activitiesCount} Recorded Actions</p>
              </div>

              <span className="admin-card-arrow">→</span>
            </button>

          </div>
        </section>

        {/* ADMIN INFORMATION */}
        <section className="admin-information-panel">
          <div className="admin-information-icon">🛡️</div>

          <div>
            <h3>Administrator Access</h3>
            <p>
              Use the administration menu to manage registered
              users and legal information. Changes should be
              made only by authorized administrators.
            </p>
          </div>
        </section>

        <footer className="admin-footer">
          <p>
            © Smart Legal Guidance System for Indian Citizens
          </p>
        </footer>

      </main>

      {/* LOGOUT CONFIRMATION */}
      {showLogoutModal && (
        <div
          className="admin-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="admin-logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-logout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-icon">⚖️</div>

            <h2 id="admin-logout-title">
              Confirm Logout
            </h2>

            <p>
              Are you sure you want to logout from
              the Admin Dashboard?
            </p>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-cancel-button"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-confirm-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;