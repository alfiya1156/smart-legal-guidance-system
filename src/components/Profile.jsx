import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Profile.css";

function Profile() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="profile-page">

      {/* =====================================================
          SIDEBAR / NAVBAR
          SAME AS YOUR EMERGENCY PAGE
      ===================================================== */}

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


      {/* =====================================================
          MAIN PROFILE CONTENT
      ===================================================== */}

      <main className="profile-main">

        {/* PAGE HEADER */}

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


        {/* =====================================================
            PROFILE HERO
        ===================================================== */}

        <section className="profile-hero">

          <div className="hero-left">

            <div className="large-avatar">
              👤
            </div>

            <div className="hero-user-info">

              <div className="verified-name">
                <h2>Alfiya</h2>
                <span>✓ Verified</span>
              </div>

              <p className="citizen-label">
                Indian Citizen • Citizen Account
              </p>

              <p className="email-text">
                alfiya@example.com
              </p>

              <div className="member-badge">
                ⚖️ Smart Legal Member
              </div>

            </div>

          </div>


          <div className="hero-right">

            <div className="account-status">
              <span className="status-dot"></span>
              Account Active
            </div>

            <button className="edit-profile-btn">
              ✏️ Edit Profile
            </button>

          </div>

        </section>


        {/* =====================================================
            PROFILE STATISTICS
        ===================================================== */}

        <section className="profile-stat-grid">

          <div className="stat-card">

            <div className="stat-icon rights-icon">
              ⚖️
            </div>

            <div>
              <span className="stat-number">12</span>
              <p>Rights Viewed</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon form-icon">
              📄
            </div>

            <div>
              <span className="stat-number">5</span>
              <p>Forms Generated</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon scan-icon">
              🔍
            </div>

            <div>
              <span className="stat-number">3</span>
              <p>Documents Scanned</p>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon emergency-icon">
              🚨
            </div>

            <div>
              <span className="stat-number">2</span>
              <p>Emergency Access</p>
            </div>

          </div>

        </section>


        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

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
                Alfiya
              </div>
            </div>


            <div className="personal-item">
              <label>Email Address</label>
              <div className="personal-value">
                alfiya@example.com
              </div>
            </div>


            <div className="personal-item">
              <label>Mobile Number</label>
              <div className="personal-value">
                +91 XXXXX XXXXX
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


        {/* =====================================================
            LEGAL SERVICES
        ===================================================== */}

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

              <button>
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

              <button>
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

      </main>

    </div>
  );
}

export default Profile;