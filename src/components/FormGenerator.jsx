import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/FormGenerator.css";

function FormGenerator() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const forms = [
    {
      icon: "🚔",
      title: "Police Complaint",
      description:
        "Create a structured draft for reporting a complaint or incident to the police.",
      path: "/forms/police",
    },
    {
      icon: "💻",
      title: "Cyber Crime Complaint",
      description:
        "Create a structured draft for reporting online fraud, cybercrime or digital issues.",
      path: "/forms/cyber-crime",
    },
    {
      icon: "📋",
      title: "RTI Application",
      description:
        "Prepare a structured draft for requesting information from a public authority.",
      path: "/forms/rti",
    },
    {
      icon: "🛒",
      title: "Consumer Complaint",
      description:
        "Create a structured draft for complaints related to products, services or consumer issues.",
      path: "/forms/consumer",
    },
    {
      icon: "🏛️",
      title: "Government Grievance",
      description:
        "Prepare a structured draft for submitting a grievance related to a government service.",
      path: "/forms/grievance",
    },
  ];

  return (
    <div className="form-generator-page">

      {/* ================= SIDEBAR ================= */}
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
            className="menu-item active"
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
            onClick={() => handleNavigation("/")}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="form-generator-main">

        <div className="form-generator-header">

          <div>
            <p className="form-small-title">
              SMART LEGAL GUIDANCE SYSTEM
            </p>

            <h1>
              Forms <span>Generator</span>
            </h1>

            <p className="form-header-description">
              Select a legal form to create a structured draft based on
              your requirements.
            </p>
          </div>

          <div className="form-header-icon">
            📄
          </div>

        </div>

        {/* ================= INFO BANNER ================= */}
        <div className="form-info-banner">

          <div className="form-info-icon">
            ⚖️
          </div>

          <div>
            <h3>Legal Form Assistant</h3>

            <p>
              Choose the type of form you need. You can provide the
              required information and generate a structured draft.
            </p>
          </div>

        </div>

        {/* ================= FORM CARDS ================= */}
        <section className="forms-section">

          <div className="forms-section-heading">

            <div>
              <h2>Choose a Form</h2>

              <p>
                Select one of the following citizen-oriented legal forms.
              </p>
            </div>

            <span className="forms-count">
              5 FORMS
            </span>

          </div>

          <div className="forms-grid">

            {forms.map((form, index) => (
              <div
                className="form-card"
                key={index}
                onClick={() => handleNavigation(form.path)}
              >

                <div className="form-card-top">

                  <div className="form-card-icon">
                    {form.icon}
                  </div>

                  <span className="form-card-number">
                    0{index + 1}
                  </span>

                </div>

                <h3>{form.title}</h3>

                <p>{form.description}</p>

                <button
                  type="button"
                  className="form-card-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigation(form.path);
                  }}
                >
                  Create Form
                  <span>→</span>
                </button>

              </div>
            ))}

          </div>

        </section>

        {/* ================= NOTICE ================= */}
        <div className="form-generator-disclaimer">

          <div className="disclaimer-symbol">
            ⚖️
          </div>

          <div>
            <h3>Important Notice</h3>

            <p>
              This tool creates a general draft based on the information
              provided by the user. It is not an official legal document
              or professional legal advice. Please verify the requirements
              with the appropriate authority before submission.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}

export default FormGenerator;