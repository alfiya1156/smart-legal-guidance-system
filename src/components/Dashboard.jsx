import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: "🤖",
      title: "AI Legal Assistant",
      text: "Describe your legal problem and get relevant guidance.",
      path: "/ai-assistant",
    },
    {
      icon: "⚖",
      title: "Know My Rights",
      text: "Explore important rights available to Indian citizens.",
      path: "/rights",
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

  const awarenessItems = [
    {
      icon: "📖",
      title: "Fundamental Rights",
      text: "Know your constitutional rights",
    },
    {
      icon: "🛡",
      title: "Consumer Rights",
      text: "Be aware. Be protected.",
    },
    {
      icon: "👥",
      title: "Women & Child Protection",
      text: "Safety and support for a better future",
    },
    {
      icon: "🔐",
      title: "Cyber Safety",
      text: "Stay safe in the digital world",
    },
    {
      icon: "⚖",
      title: "Legal Aid",
      text: "Access to justice for all",
    },
  ];

  const recentActivities = [
    {
      icon: "⌂",
      title: "Property-related issue",
      text: "Asked about property rights and laws",
      date: "02 Oct 2026, 10:24 AM",
    },
    {
      icon: "🛒",
      title: "Consumer complaint",
      text: "Searched for consumer protection act",
      date: "01 Oct 2026, 04:15 PM",
    },
    {
      icon: "💼",
      title: "Workplace issue",
      text: "Asked about workplace rights",
      date: "30 Sep 2026, 11:32 AM",
    },
  ];

  const handleAction = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <div className="brand-scale">⚖</div>

          <div>
            <h2>Smart Legal</h2>
            <span>Guidance System</span>
          </div>
        </div>

        <nav className="sidebar-menu">

          <button className="sidebar-item active">
            <span>⌂</span>
            <p>Dashboard</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/ai-assistant")}
          >
            <span>🤖</span>
            <p>AI Legal Assistant</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/rights")}
          >
            <span>⚖</span>
            <p>Know My Rights</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/emergency")}
          >
            <span>📞</span>
            <p>Emergency Assistance</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/location")}
          >
            <span>📍</span>
            <p>Location Tracker</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/forms")}
          >
            <span>📄</span>
            <p>Forms Generator</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/scanner")}
          >
            <span>▣</span>
            <p>Document Scanner</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => handleAction("/voice")}
          >
            <span>🎙</span>
            <p>Voice Interaction</p>
          </button>

        </nav>

        <div className="sidebar-divider"></div>

        <div className="sidebar-bottom">

          <button
            className="sidebar-item"
            onClick={() => handleAction("/profile")}
          >
            <span>●</span>
            <p>Profile</p>
          </button>

          <button
            className="sidebar-item"
            onClick={() => navigate("/login")}
          >
            <span>⇥</span>
            <p>Logout</p>
          </button>

        </div>

        <div className="sidebar-quote">
          "Justice is not a privilege,
          it is a right for every citizen."
        </div>


      </aside>


      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        {/* TOP HEADER */}
        <header className="dashboard-header">

          <div className="header-small-logo">
            ⚖
          </div>

          <div className="user-area">

            <div className="user-avatar">
              A
            </div>

            <div className="user-info">
              <small>Welcome,</small>
              <strong>Alfiya</strong>
            </div>

            <span className="user-arrow">⌄</span>

          </div>

        </header>


        {/* HERO SECTION */}
        <section className="dashboard-hero">

          <img
            src="/legal-bnr.img.jpeg"
            alt="Legal background"
            className="hero-background"
          />

          <div className="hero-overlay"></div>

          <div className="hero-decoration">❧</div>

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


        {/* QUICK ACTIONS */}
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
                onClick={() => handleAction(item.path)}
              >

                <div className="action-icon">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <button className="action-arrow">
                  →
                </button>

                <div className="card-leaf">
                  ❧
                </div>

              </div>
            ))}

          </div>

        </section>


        {/* LOWER CONTENT */}
        <section className="dashboard-lower">

          {/* RECENT ACTIVITY */}
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

              {recentActivities.map((item, index) => (
                <div className="activity-item" key={index}>

                  <div className="activity-icon">
                    {item.icon}
                  </div>

                  <div className="activity-content">
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>

                  <small>{item.date}</small>

                </div>
              ))}

            </div>

          </div>


          {/* LEGAL AWARENESS */}
          <div className="info-panel awareness-panel">

            <div className="panel-heading">

              <div>
                <h2>Legal Awareness</h2>
                <span></span>
              </div>

            </div>

            <div className="awareness-list">

              {awarenessItems.map((item, index) => (
                <div className="awareness-item" key={index}>

                  <div className="awareness-icon">
                    {item.icon}
                  </div>

                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>

                  <span className="awareness-arrow">
                    ›
                  </span>

                </div>
              ))}

            </div>

          </div>

        </section>


        {/* EMERGENCY BAR */}
        <section className="emergency-bar">

          <div className="emergency-left">

            <div className="emergency-icon">
              ☎
            </div>

            <div>
              <h3>Need Immediate Help?</h3>
              <p>
                Access emergency assistance and important support contacts.
              </p>
            </div>

          </div>

          <button
            onClick={() => handleAction("/emergency")}
          >
            View Emergency Contacts →
          </button>

        </section>


        {/* FOOTER */}
        <footer className="dashboard-footer">

          <span></span>

          <p>
            This system provides general legal information and guidance.
            It is not a substitute for professional legal advice.
          </p>

          <span></span>

        </footer>

      </main>

    </div>
  );
}

export default Dashboard;