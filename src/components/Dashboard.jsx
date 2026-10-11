import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Dashboard.css";


function Dashboard() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    user = {};
  }

  const userName =
    user.name ||
    user.fullName ||
    user.username ||
    user.email?.split("@")[0] ||
    "User";

  const quickActions = [
    {
      icon: "🤖",
      title: "AI Legal Assistant",
      text: "Describe your legal problem and get relevant guidance.",
      path: "/ai-assistant",
    },
    {
      icon: "⚖️",
      title: "Know My Rights",
      text: "Explore important rights available to Indian citizens.",
      path: "/know-my-rights",
    },
    {
      icon: "📞",
      title: "Emergency Assistance",
      text: "Find important emergency and legal-support contacts.",
      path: "/emergency",
    },
    {
      icon: "📄",
      title: "Forms Generator",
      text: "Create commonly needed legal/application forms.",
      path: "/forms",
    },
  ];

  const [recentActivities, setRecentActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");


  const [legalLaws, setLegalLaws] = useState([]);
  const [legalLoading, setLegalLoading] = useState(true);
  const [legalError, setLegalError] = useState("");
  const [showAllLaws, setShowAllLaws] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState(null);

  useEffect(() => {
    const fetchLegalAwareness = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/legal-awareness"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load legal awareness"
          );
        }

        setLegalLaws(Array.isArray(data) ? data : []);
      } catch (error) {
        setLegalError(error.message || "Unable to load legal awareness");
      } finally {
        setLegalLoading(false);
      }
    };

    fetchLegalAwareness();
  }, []);


  useEffect(() => {
    const fetchActivities = async () => {
      const currentUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const userId = currentUser.id || currentUser.user_id;

      if (!userId) {
        setActivityError("User ID not found. Please log in again.");
        setActivityLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/activity/${userId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load activities");
        }

        setRecentActivities(Array.isArray(data) ? data : []);
      } catch (error) {
        setActivityError(error.message || "Unable to load activities");
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-page">

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-symbol">
            ⚖
          </div>

          <div>
            <h2>Smart Legal</h2>
            <span>Guidance System</span>
          </div>

        </div>


        <div className="sidebar-menu">

          <button
            className="menu-item active"
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
            className="menu-item"
            onClick={() => handleNavigation("/profile")}
          >
            <span>👤</span>
            <span>Profile</span>
          </button>


          <button
            className="menu-item logout"
            onClick={() => setShowLogoutModal(true)}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">

          <div className="header-small-logo">
            ⚖
          </div>

          <div className="user-area">

            <div className="user-avatar">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <small>Welcome,</small>
              <strong>{userName}</strong>
            </div>

            <span className="user-arrow">
              ⌄
            </span>

          </div>

        </header>
        <div className="dashboard-greeting">
          Welcome, {userName}!
        </div>

        <section className="dashboard-hero">

          <img
            src="/legal-bnr.img.jpeg"
            alt="Legal background"
            className="hero-background"
          />

          <div className="hero-overlay"></div>

          <div className="hero-decoration">
            ❧
          </div>

          <div className="hero-content">

            <span className="hero-welcome">
              Welcome to
            </span>

            <h1>
              Smart Legal
              <br />
              Guidance System
            </h1>

            <p>
              Get simple and accessible legal information
              <br />
              for your needs.
            </p>

            <div className="hero-line"></div>

          </div>

        </section>

        <section className="dashboard-section">

          <div className="section-heading">
            <h2>Quick Actions</h2>
            <span></span>
          </div>


          <div className="quick-actions">

            {quickActions.map((item, index) => (

              <div
                className="action-card"
                key={index}
                onClick={() => handleNavigation(item.path)}
              >

                <div className="action-icon">
                  {item.icon}
                </div>

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.text}
                </p>

                <button
                  className="action-arrow"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation(item.path);
                  }}
                >
                  →
                </button>

                <div className="card-leaf">
                  ❧
                </div>

              </div>

            ))}

          </div>

        </section>

        <section className="dashboard-lower">

          <div className="info-panel">

            <div className="panel-heading">

              <div>
                <h2>Recent Activity</h2>
                <span></span>
              </div>

              <button className="view-all">
                View All →
              </button>

            </div>


            <div className="activity-list">

              {activityLoading ? (
                <p>Loading recent activities...</p>
              ) : activityError ? (
                <p>{activityError}</p>
              ) : recentActivities.length === 0 ? (
                <p>No recent activities yet.</p>
              ) : (
                recentActivities.map((item) => (
                  <div className="activity-item" key={item.id}>
                    <div className="activity-icon">
                      {item.activity_type === "AI Assistant" ? "🤖" : "⚖️"}
                    </div>

                    <div className="activity-content">
                      <strong>{item.activity}</strong>
                      <p>{item.activity_type || "General"}</p>
                    </div>

                    <small>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("en-IN")
                        : ""}
                    </small>
                  </div>
                ))
              )}
            </div>

          </div>

          <div className="info-panel awareness-panel">

            <div className="panel-heading">

              <div>
                <h2>Legal Awareness</h2>
                <span></span>
              </div>

              <button
                type="button"
                className="view-all"
                onClick={() => setShowAllLaws(true)}
              >
                View All →
              </button>

            </div>

            <div className="awareness-list">
              {legalLoading ? (
                <p>Loading legal awareness...</p>
              ) : legalError ? (
                <p>{legalError}</p>
              ) : legalLaws.length === 0 ? (
                <p>No legal awareness entries available.</p>
              ) : (
                legalLaws.slice(0, 5).map((law, index) => (
                  <div
                    className="awareness-item"
                    key={law.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedLaw(law)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedLaw(law);
                      }
                    }}
                  >
                    <div className="awareness-icon">
                      {["⚖️", "📖", "🛡️", "🔐", "📚"][index % 5]}
                    </div>

                    <div>
                      <strong>{law.title}</strong>
                      <p>{law.category}</p>
                    </div>

                    <span className="awareness-arrow">›</span>
                  </div>
                )
                )
              )}
            </div>
          </div>

        </section>

        <section className="emergency-bar">

          <div className="emergency-left">

            <div className="emergency-icon">
              ☎
            </div>

            <div>

              <h3>
                Need Immediate Help?
              </h3>

              <p>
                Access emergency assistance and important support contacts.
              </p>

            </div>

          </div>


          <button
            onClick={() => handleNavigation("/emergency")}
          >
            View Emergency Contacts →
          </button>

        </section>

        <footer className="dashboard-footer">

          <span></span>

          <p>
            This system provides general legal information and guidance.
            It is not a substitute for professional legal advice.
          </p>

          <span></span>

        </footer>


      </main>


      {selectedLaw && (
        <div
          className="legal-detail-overlay"
          onClick={() => setSelectedLaw(null)}
        >
          <div
            className="legal-detail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="legal-detail-close"
              onClick={() => setSelectedLaw(null)}
              aria-label="Close legal details"
            >
              ✕
            </button>

            <span className="legal-detail-category">
              {selectedLaw.category}
            </span>

            <h2 id="legal-detail-title">
              {selectedLaw.title}
            </h2>

            <p>{selectedLaw.description}</p>

            {selectedLaw.law_explanation && (
              <section>
                <h3>⚖️ About This Law</h3>
                <p>{selectedLaw.law_explanation}</p>
              </section>
            )}

            {selectedLaw.applicable_section && (
              <section>
                <h3>📖 Applicable Article / Section</h3>
                <p>{selectedLaw.applicable_section}</p>
              </section>
            )}

            {selectedLaw.applies_to && (
              <section>
                <h3>👥 Who Does It Apply To?</h3>
                <p>{selectedLaw.applies_to}</p>
              </section>
            )}

            {selectedLaw.exceptions && (
              <section>
                <h3>ℹ️ Exceptions / Limitations</h3>
                <p>{selectedLaw.exceptions}</p>
              </section>
            )}

            {selectedLaw.practical_example && (
              <section>
                <h3>💡 Practical Example</h3>
                <p>{selectedLaw.practical_example}</p>
              </section>
            )}

            {selectedLaw.help_information && (
              <section>
                <h3>📞 Where to Get Help</h3>
                <p>{selectedLaw.help_information}</p>
              </section>
            )}

            <p className="legal-detail-disclaimer">
              This information is for general legal awareness only
              and is not a substitute for professional legal advice.
            </p>

            <button
              type="button"
              className="legal-detail-button"
              onClick={() => setSelectedLaw(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {showAllLaws && (
        <div
          className="legal-detail-overlay"
          onClick={() => setShowAllLaws(false)}
        >
          <div
            className="legal-detail-modal all-laws-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-laws-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="legal-detail-close"
              onClick={() => setShowAllLaws(false)}
              aria-label="Close all laws"
            >
              ✕
            </button>

            <span className="legal-detail-category">
              INDIAN LEGAL INFORMATION
            </span>

            <h2 id="all-laws-title">Legal Awareness</h2>

            <p>Explore the available laws and legal information.</p>

            {legalLoading ? (
              <p>Loading laws...</p>
            ) : legalError ? (
              <p>{legalError}</p>
            ) : legalLaws.length === 0 ? (
              <p>No laws available.</p>
            ) : (
              <div className="all-laws-list">
                {legalLaws.map((law) => (
                  <button
                    type="button"
                    className="all-laws-item"
                    key={law.id}
                    onClick={() => {
                      setShowAllLaws(false);
                      setSelectedLaw(law);
                    }}
                  >
                    <span className="all-laws-icon">⚖️</span>

                    <span className="all-laws-text">
                      <strong>{law.title}</strong>
                      <small>{law.category}</small>
                    </span>

                    <span className="awareness-arrow">›</span>
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              className="legal-detail-button"
              onClick={() => setShowAllLaws(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {showLogoutModal && (
        <div
          className="logout-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logout-icon">⚖</div>

            <h2 id="logout-title">Confirm Logout</h2>

            <p>Are you sure you want to logout?</p>

            <div className="logout-actions">
              <button
                type="button"
                className="logout-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-confirm-btn"
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

export default Dashboard;
