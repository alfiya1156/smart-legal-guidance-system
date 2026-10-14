import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [stats, setStats] = useState({
    rightsViewed: 12,
    formsGenerated: 0,
    aiConsultations: 0,
    recentActivitiesCount: 0,
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [saveMessage, setSaveMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user.name || user.email) {
      setEditForm((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }

    const fetchProfile = async () => {
      if (!user.id) return;
      try {
        const res = await fetch(`http://localhost:5000/api/auth/profile/${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser((prev) => ({ ...prev, ...data.user }));
            setEditForm({
              name: data.user.name || "",
              email: data.user.email || "",
              password: "",
            });
          }
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [user.id, user.name, user.email]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!user.id) return;
    setIsSaving(true);
    setSaveMessage({ type: "", text: "" });

    try {
      const res = await fetch(`http://localhost:5000/api/auth/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          ...(editForm.password ? { password: editForm.password } : {}),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSaveMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => {
        setIsEditOpen(false);
        setSaveMessage({ type: "", text: "" });
      }, 1200);
    } catch (err) {
      setSaveMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : "U");
  const userName = user.name || (user.email ? user.email.split("@")[0] : "Citizen");

  return (
    <div className="profile-page">

      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-symbol">⚖</div>

          <div>
            <h2>Smart Legal</h2>
            <span>Guidance System</span>
          </div>
        </div>

        <div className="sidebar-menu">

          <button
            className="menu-item"
            onClick={() => handleNavigation("/dashboard")}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/ai-assistant")}
          >
            <span>🤖</span>
            <span>AI Assistant</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/know-my-rights")}
          >
            <span>⚖️</span>
            <span>Know My Rights</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/emergency")}
          >
            <span>🚨</span>
            <span>Emergency Assistance</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/location")}
          >
            <span>📍</span>
            <span>Location Tracker</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/forms")}
          >
            <span>📄</span>
            <span>Forms Generator</span>
          </button>

          <button
            className="menu-item"
            onClick={() => handleNavigation("/scanner")}
          >
            <span>📑</span>
            <span>Document Scanner</span>
          </button>

        </div>

        <div className="sidebar-bottom">

          <button
            className="menu-item active"
            onClick={() => handleNavigation("/profile")}
          >
            <span>👤</span>
            <span>Profile</span>
          </button>

          <button
            className="menu-item logout"
            onClick={() => handleNavigation("/")}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      <main className="profile-main">

        <div className="profile-header">

          <div>
            <p className="page-small-title">
              SMART LEGAL GUIDANCE SYSTEM
            </p>

            <h1>
              My <span>Profile</span>
            </h1>

            <p className="header-description">
              Manage your personal information and access your legal
              assistance activities.
            </p>
          </div>

          <div className="profile-header-icon">
            👤
          </div>

        </div>


        <section className="profile-hero">

          <div className="hero-left">

            <div className="large-avatar">
              {userInitial}
            </div>

            <div className="hero-user-info">

              <div className="verified-name">
                <h2>{userName}</h2>
                <span>✓ Verified</span>
              </div>

              <p className="citizen-label">
                Indian Citizen • {user.role === "admin" ? "Administrator Account" : "Citizen Account"}
              </p>

              <p className="email-text">
                {user.email || "citizen@smartlegal.in"}
              </p>

              <div className="member-badge">
                ⚖️ Smart Legal Member {user.created_at ? `• Since ${new Date(user.created_at).toLocaleDateString()}` : ""}
              </div>

            </div>

          </div>


          <div className="hero-right">

            <div className="account-status">
              <span className="status-dot"></span>
              Account Active
            </div>

            <button
              className="edit-profile-btn"
              type="button"
              onClick={() => setIsEditOpen(true)}
            >
              ✏️ Edit Profile
            </button>

          </div>

        </section>

        <section className="profile-stat-grid">

          <div className="stat-card">

            <div className="stat-icon rights-icon">
              ⚖️
            </div>

            <div>
              <span className="stat-number">{stats.rightsViewed ?? 12}</span>
              <p>Rights Explored</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon form-icon">
              📄
            </div>

            <div>
              <span className="stat-number">{stats.formsGenerated ?? 0}</span>
              <p>Forms Generated</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon scan-icon">
              🔍
            </div>

            <div>
              <span className="stat-number">{stats.aiConsultations ?? 0}</span>
              <p>AI Consultations</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon emergency-icon">
              📜
            </div>

            <div>
              <span className="stat-number">{stats.recentActivitiesCount ?? 0}</span>
              <p>Recent Activities</p>
            </div>

          </div>

        </section>


        <section className="profile-card">

          <div className="card-header">

            <div className="card-title-icon">
              👤
            </div>

            <div>
              <h2>Personal Information</h2>

              <p>
                Your basic personal and contact details
              </p>
            </div>

          </div>


          <div className="personal-grid">

            <div className="personal-item">
              <label>Full Name</label>
              <div className="personal-value">
                {userName}
              </div>
            </div>


            <div className="personal-item">
              <label>Email Address</label>
              <div className="personal-value">
                {user.email || "citizen@smartlegal.in"}
              </div>
            </div>


            <div className="personal-item">
              <label>Citizen ID</label>
              <div className="personal-value">
                SLG-{String(user.id || 1).padStart(4, "0")}
              </div>
            </div>


            <div className="personal-item">
              <label>Preferred Language</label>
              <div className="personal-value">
                English
              </div>
            </div>

          </div>

        </section>


        <section className="profile-card">

          <div className="card-header">

            <div className="card-title-icon">
              ⚖️
            </div>

            <div>
              <h2>My Legal Services</h2>

              <p>
                Quickly access the services available in your account
              </p>
            </div>

          </div>


          <div className="service-grid">

            <button
              onClick={() => handleNavigation("/know-my-rights")}
            >
              <div className="service-icon">
                ⚖️
              </div>

              <div>
                <h3>Know My Rights</h3>
                <p>Learn about your legal rights</p>
              </div>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              onClick={() => handleNavigation("/forms")}
            >
              <div className="service-icon">
                📄
              </div>

              <div>
                <h3>Forms Generator</h3>
                <p>Create useful legal forms</p>
              </div>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              onClick={() => handleNavigation("/scanner")}
            >
              <div className="service-icon">
                📑
              </div>

              <div>
                <h3>Document Scanner</h3>
                <p>Check documents for possible risks</p>
              </div>

              <span className="arrow">
                →
              </span>
            </button>


            <button
              onClick={() => handleNavigation("/location")}
            >
              <div className="service-icon">
                📍
              </div>

              <div>
                <h3>Location Tracker</h3>
                <p>Find nearby legal services</p>
              </div>

              <span className="arrow">
                →
              </span>
            </button>

          </div>

        </section>


        {/* =====================================================
            ACCOUNT SECURITY
        ===================================================== */}

        <section className="profile-card">

          <div className="card-header">

            <div className="card-title-icon">
              🔐
            </div>

            <div>
              <h2>Account & Security</h2>

              <p>
                Manage your account security preferences
              </p>
            </div>

          </div>


          <div className="security-list">

            <div className="security-row">

              <div className="security-left">

                <div className="security-icon">
                  🔑
                </div>

                <div>
                  <h3>Password</h3>
                  <p>Your password is protected</p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
              >
                Change
              </button>

            </div>


            <div className="security-row">

              <div className="security-left">

                <div className="security-icon">
                  🌐
                </div>

                <div>
                  <h3>Language</h3>
                  <p>English</p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => alert("Language preferences can be toggled from the top header.")}
              >
                Change
              </button>

            </div>


            <div className="security-row">

              <div className="security-left">

                <div className="security-icon">
                  🛡️
                </div>

                <div>
                  <h3>Privacy</h3>
                  <p>Your account information is protected</p>
                </div>

              </div>

              <span className="protected">
                Protected
              </span>

            </div>

          </div>

        </section>


        {/* =====================================================
            LEGAL NOTICE
        ===================================================== */}

        <div className="profile-notice">

          <div className="notice-icon">
            ⚖️
          </div>

          <div>

            <h3>
              Legal Awareness Notice
            </h3>

            <p>
              Smart Legal Guidance System provides general legal
              information and citizen awareness support. The
              information provided through this system should not
              be considered as professional legal advice.
            </p>

          </div>

        </div>


        {/* FOOTER */}

        <div className="profile-footer">
          Smart Legal Guidance System for Indian Citizens
        </div>

        {/* EDIT PROFILE MODAL */}
        {isEditOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(30, 18, 12, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
              backdropFilter: "blur(3px)"
            }}
            onClick={() => setIsEditOpen(false)}
          >
            <div
              style={{
                background: "#fcfbf7",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "500px",
                border: "2px solid #c5a059",
                boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
                padding: "2rem",
                position: "relative"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.5rem",
                  color: "#6b584c",
                  cursor: "pointer"
                }}
              >
                ✕
              </button>

              <h2 style={{ margin: "0 0 0.5rem", color: "#3b2219", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>✏️</span> Edit Profile
              </h2>
              <p style={{ margin: "0 0 1.5rem", color: "#6b584c", fontSize: "0.9rem" }}>
                Update your account details and security credentials.
              </p>

              {saveMessage.text && (
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    backgroundColor: saveMessage.type === "success" ? "#e6f4ea" : "#fce8e6",
                    color: saveMessage.type === "success" ? "#137333" : "#c5221f",
                    border: `1px solid ${saveMessage.type === "success" ? "#a8dab5" : "#f5c2c7"}`,
                    fontSize: "0.9rem"
                  }}
                >
                  {saveMessage.text}
                </div>
              )}

              <form onSubmit={handleEditSubmit}>
                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", fontSize: "0.88rem", color: "#3b2219" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #c5a059",
                      boxSizing: "border-box",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.2rem" }}>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", fontSize: "0.88rem", color: "#3b2219" }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #c5a059",
                      boxSizing: "border-box",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: "600", fontSize: "0.88rem", color: "#3b2219" }}>
                    New Password <span style={{ fontWeight: "normal", color: "#806e5d", fontSize: "0.8rem" }}>(Leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password (optional)"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      border: "1px solid #c5a059",
                      boxSizing: "border-box",
                      fontSize: "0.95rem"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    style={{
                      padding: "0.75rem 1.4rem",
                      borderRadius: "8px",
                      border: "1px solid #d4c5b9",
                      background: "#fff",
                      color: "#6b584c",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "linear-gradient(135deg, #c5a059, #8c6d37)",
                      color: "#fff",
                      cursor: isSaving ? "not-allowed" : "pointer",
                      fontWeight: "600"
                    }}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}

export default Profile;