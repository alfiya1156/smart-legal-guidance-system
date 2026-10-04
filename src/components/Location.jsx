import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Location.css";

function Location() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="location-page">

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
            className="menu-item"
            onClick={() => handleNavigation("/emergency")}
          >
            <span>🚨</span>
            <span>Emergency Assistance</span>
          </button>

          <button
            className="menu-item active"
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
      <main className="location-main">

        {/* Header */}
        <div className="location-header">

          <div>
            <p className="page-small-title">
              SMART LEGAL GUIDANCE SYSTEM
            </p>

            <h1>
              Location <span>Tracker</span>
            </h1>

            <p className="header-description">
              Find nearby legal services, police stations, courts and
              legal aid centres.
            </p>
          </div>

          <div className="header-icon">
            📍
          </div>

        </div>

        {/* Location Main Card */}
        <div className="location-card">

          <div className="location-card-icon">
            📍
          </div>

          <h2>Find Legal Services Near You</h2>

          <p>
            Location tracking helps citizens identify nearby police
            stations, courts, legal aid centres and other important
            law-related services.
          </p>

          <button
            className="location-button"
            onClick={() =>
              alert("Location tracking will be connected later.")
            }
          >
            📍 Detect My Location
          </button>

        </div>

        {/* Services Heading */}
        <div className="section-heading">

          <div>
            <h2>Nearby Legal Services</h2>

            <p>
              Explore important legal and public service locations.
            </p>
          </div>

        </div>

        {/* Service Cards */}
        <div className="location-grid">

          <div className="location-service-card">

            <div className="service-icon">
              👮
            </div>

            <h3>Police Stations</h3>

            <p>
              Find nearby police stations for safety, complaints
              and emergency assistance.
            </p>

            <button>
              View Locations
            </button>

          </div>

          <div className="location-service-card">

            <div className="service-icon">
              ⚖️
            </div>

            <h3>Courts</h3>

            <p>
              Locate nearby courts and get general information
              about legal proceedings.
            </p>

            <button>
              View Locations
            </button>

          </div>

          <div className="location-service-card">

            <div className="service-icon">
              🏛️
            </div>

            <h3>Legal Aid Centres</h3>

            <p>
              Find legal aid centres that provide legal assistance
              and support to citizens.
            </p>

            <button>
              View Locations
            </button>

          </div>

          <div className="location-service-card">

            <div className="service-icon">
              🏢
            </div>

            <h3>Government Offices</h3>

            <p>
              Find nearby government offices that may help with
              legal and citizen services.
            </p>

            <button>
              View Locations
            </button>

          </div>

        </div>

        {/* Information Box */}
        <div className="location-info">

          <div className="info-icon">
            ⚠️
          </div>

          <div>
            <h3>Location Information</h3>

            <p>
              This feature is designed to help citizens locate
              nearby legal and public services. Actual GPS-based
              location services can be connected to the system later.
            </p>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="location-disclaimer">

          <div className="disclaimer-icon">
            ⚖️
          </div>

          <div>
            <h3>Important Notice</h3>

            <p>
              Location information is provided for general guidance.
              Please verify the availability and address of a service
              before visiting.
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Location;