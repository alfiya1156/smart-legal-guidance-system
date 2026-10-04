import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Emergency.css";

function Emergency() {
  const navigate = useNavigate();

  const emergencyNumbers = [
    {
      number: "112",
      title: "Emergency Response",
      description:
        "For immediate emergency assistance including police, fire and medical emergencies.",
      icon: "🚨",
    },
    {
      number: "100",
      title: "Police",
      description:
        "Contact the police for immediate law and order or safety-related emergencies.",
      icon: "👮",
    },
    {
      number: "101",
      title: "Fire & Rescue",
      description:
        "Call this number for fire accidents and rescue assistance.",
      icon: "🚒",
    },
    {
      number: "108",
      title: "Ambulance",
      description:
        "Emergency medical assistance and ambulance service for urgent situations.",
      icon: "🚑",
    },
    {
      number: "1091",
      title: "Women Helpline",
      description:
        "Support and emergency assistance for women facing danger, violence or harassment.",
      icon: "👩",
    },
    {
      number: "181",
      title: "Women Support Helpline",
      description:
        "Provides support and assistance to women in distress and emergency situations.",
      icon: "🛡️",
    },
    {
      number: "1098",
      title: "Child Helpline",
      description:
        "Emergency support and protection services for children in need of help.",
      icon: "👧",
    },
    {
      number: "15100",
      title: "Legal Aid Helpline",
      description:
        "Free legal aid and legal assistance information through the National Legal Services Authority.",
      icon: "⚖️",
    },
    {
      number: "1930",
      title: "Cyber Crime Helpline",
      description:
        "Report cybercrime incidents such as online fraud, scams and financial cyber offences.",
      icon: "💻",
    },
    {
      number: "14567",
      title: "Senior Citizens Helpline",
      description:
        "Support and assistance for senior citizens facing emergencies or difficulties.",
      icon: "👴",
    },
    {
      number: "1906",
      title: "LPG Emergency",
      description:
        "Emergency helpline for LPG gas leakage and related safety concerns.",
      icon: "🔥",
    },
    {
      number: "139",
      title: "Railway Assistance",
      description:
        "Railway enquiry and assistance service for passengers and railway-related emergencies.",
      icon: "🚆",
    },
    {
      number: "1073",
      title: "Road Accident Assistance",
      description:
        "Helpline for reporting road accidents and requesting assistance.",
      icon: "🚗",
    },
    {
      number: "1070",
      title: "Disaster Management",
      description:
        "Emergency assistance and information during natural disasters and major emergencies.",
      icon: "🌪️",
    },
    {
      number: "1077",
      title: "District Emergency Control",
      description:
        "Emergency control room assistance during disasters and major local emergencies.",
      icon: "📞",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="emergency-page">

      {/* Sidebar */}
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
            className="menu-item active"
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
            onClick={() => handleNavigation("/")}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="emergency-main">

        {/* Header */}
        <div className="emergency-header">

          <div>
            <p className="page-small-title">
              SMART LEGAL GUIDANCE SYSTEM
            </p>

            <h1>
              Emergency <span>Assistance</span>
            </h1>

            <p className="header-description">
              Quick access to important emergency and legal assistance
              helpline numbers.
            </p>
          </div>

          <div className="header-icon">
            🚨
          </div>

        </div>

        {/* Emergency Alert */}
        <div className="emergency-alert">

          <div className="alert-icon">
            ⚠️
          </div>

          <div>
            <h3>Need Immediate Help?</h3>

            <p>
              In a serious emergency, contact the appropriate emergency
              service immediately. Stay calm and provide your location
              and necessary details clearly.
            </p>
          </div>

        </div>

        {/* Section Heading */}
        <div className="section-heading">

          <div>
            <h2>Important Helpline Numbers</h2>

            <p>
              Keep these numbers accessible for emergency, safety and
              legal assistance.
            </p>
          </div>

          <div className="number-count">
            {emergencyNumbers.length} Helplines
          </div>

        </div>

        {/* Emergency Cards */}
        <div className="emergency-grid">

          {emergencyNumbers.map((item, index) => (

            <div
              className="emergency-card"
              key={index}
            >

              <div className="card-top">

                <div className="emergency-icon">
                  {item.icon}
                </div>

                <span className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

              </div>

              <h3>{item.title}</h3>

              <div className="phone-number">
                {item.number}
              </div>

              <p>
                {item.description}
              </p>

              <a
                href={`tel:${item.number}`}
                className="call-button"
              >
                <span>📞</span>
                Call {item.number}
              </a>

            </div>

          ))}

        </div>

        {/* Disclaimer */}
        <div className="emergency-disclaimer">

          <div className="disclaimer-icon">
            ⚖️
          </div>

          <div>
            <h3>Important Notice</h3>

            <p>
              These helpline numbers are provided for general emergency
              and public assistance purposes. Availability and services
              may vary depending on the situation and location. For
              immediate danger, contact the appropriate emergency
              service without delay.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Emergency;