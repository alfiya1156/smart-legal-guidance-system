import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/KnowMyRights.css";

function KnowMyRights() {
  const navigate = useNavigate();
  const [selectedRight, setSelectedRight] = useState(null);

  const rights = [
    {
      icon: "⚖️",
      title: "Fundamental Rights",
      article: "Articles 12–35",
      category: "Constitutional Rights",
      description:
        "Fundamental Rights protect individual freedom, equality and dignity under the Constitution of India.",
      details:
        "Fundamental Rights are guaranteed under Part III of the Constitution of India. They include the Right to Equality, Right to Freedom, protection against exploitation, freedom of religion, cultural and educational rights, and the Right to Constitutional Remedies.",
      points: [
        "Protect individual freedom and dignity.",
        "Provide equality and protection under the law.",
        "Allow people to approach courts to enforce their rights."
      ]
    },
    {
      icon: "⚖️",
      title: "Right to Equality",
      article: "Articles 14–18",
      category: "Equality & Justice",
      description:
        "Every person is entitled to equality before the law and equal protection of the laws.",
      details:
        "The Right to Equality ensures that people are treated fairly under the law. It addresses discrimination and promotes equal opportunity in public life.",
      points: [
        "Equality before the law.",
        "Protection against specified forms of discrimination.",
        "Equality of opportunity in public employment, subject to constitutional provisions."
      ]
    },
    {
      icon: "🗣️",
      title: "Right to Freedom",
      article: "Articles 19–22",
      category: "Freedom & Liberty",
      description:
        "Understand important freedoms and constitutional safeguards available to individuals.",
      details:
        "The Right to Freedom includes several important freedoms, such as speech and expression, peaceful assembly, association, movement, residence and profession, subject to constitutional restrictions. It also includes safeguards relating to criminal convictions, life and personal liberty.",
      points: [
        "Freedom of speech and expression, subject to lawful restrictions.",
        "Freedom to assemble peacefully and form associations.",
        "Protection of life and personal liberty under Article 21."
      ]
    },
    {
      icon: "🛡️",
      title: "Right to Life & Liberty",
      article: "Article 21",
      category: "Personal Protection",
      description:
        "The Constitution protects life, personal liberty and human dignity.",
      details:
        "Article 21 states that no person shall be deprived of life or personal liberty except according to procedure established by law. Courts have interpreted this protection to include several aspects of a dignified life.",
      points: [
        "Protection of life and personal liberty.",
        "Safeguards against unlawful deprivation of liberty.",
        "Protection of human dignity under constitutional law."
      ]
    },
    {
      icon: "🙏",
      title: "Freedom of Religion",
      article: "Articles 25–28",
      category: "Religious Freedom",
      description:
        "Learn about freedom of conscience and the right to practise and profess religion.",
      details:
        "The Constitution protects freedom of conscience and the freedom to profess, practise and propagate religion, subject to public order, morality, health and other constitutional provisions.",
      points: [
        "Freedom of conscience.",
        "Freedom to profess, practise and propagate religion.",
        "Protection for religious denominations under constitutional conditions."
      ]
    },
    {
      icon: "🎓",
      title: "Right to Education",
      article: "Article 21A",
      category: "Education & Development",
      description:
        "Every child aged 6 to 14 has a constitutional right to free and compulsory education.",
      details:
        "Article 21A requires the State to provide free and compulsory education to all children between six and fourteen years of age in the manner determined by law.",
      points: [
        "Free and compulsory education for children aged 6–14.",
        "Constitutional support for access to elementary education.",
        "The Right of Children to Free and Compulsory Education Act, 2009."
      ]
    },
    {
      icon: "👩",
      title: "Women Protection",
      article: "Constitution & Indian Laws",
      category: "Safety & Protection",
      description:
        "Understand legal protections available to women against harassment, violence and discrimination.",
      details:
        "Various constitutional provisions and Indian laws protect women’s equality, safety and dignity. The appropriate legal protection depends on the situation and the applicable law.",
      points: [
        "Constitutional equality and protection against discrimination.",
        "Legal safeguards against domestic violence and workplace sexual harassment.",
        "Access to appropriate police, legal aid and support services."
      ]
    },
    {
      icon: "👶",
      title: "Child Rights",
      article: "Constitution & Child Protection Laws",
      category: "Child Safety",
      description:
        "Learn about children's rights to safety, education, dignity and protection.",
      details:
        "Indian laws provide protections for children, including safeguards against exploitation and abuse, access to education and support for their welfare and development.",
      points: [
        "Protection against exploitation and abuse.",
        "Right to education and development.",
        "Legal safeguards under child protection laws, including the POCSO Act."
      ]
    },
    {
      icon: "🛒",
      title: "Consumer Rights",
      article: "Consumer Protection Act, 2019",
      category: "Consumer Awareness",
      description:
        "Know your rights when purchasing products and using services.",
      details:
        "The Consumer Protection Act, 2019 provides a framework for protecting consumer interests and addressing complaints about defective goods, deficient services and unfair trade practices.",
      points: [
        "Protection against unfair trade practices.",
        "Right to seek remedies for eligible consumer complaints.",
        "Access to consumer dispute redressal commissions."
      ]
    },
    {
      icon: "💻",
      title: "Cyber Rights & Safety",
      article: "Information Technology Act, 2000",
      category: "Digital Protection",
      description:
        "Learn general legal information about online fraud, cyber offences and digital safety.",
      details:
        "Indian cyber laws address various forms of unlawful activity involving computers and digital communication. The applicable legal provisions depend on the nature of the incident.",
      points: [
        "Legal provisions addressing certain cyber offences.",
        "Awareness of online fraud and digital safety.",
        "Options for reporting cybercrime through official channels."
      ]
    },
    {
      icon: "🏠",
      title: "Property Rights",
      article: "Indian Property Laws",
      category: "Ownership & Property",
      description:
        "Understand general legal information relating to property ownership and disputes.",
      details:
        "Property rights in India are governed by constitutional protections and several laws relating to transfer, ownership, inheritance and registration. Property disputes may require examination of relevant documents and facts.",
      points: [
        "Legal rules relating to property ownership and transfer.",
        "Awareness of inheritance and succession laws.",
        "Legal remedies for eligible property disputes."
      ]
    },
    {
      icon: "💼",
      title: "Workplace Rights",
      article: "Applicable Labour Laws",
      category: "Employment Protection",
      description:
        "Learn about legal protections and rights related to employment and workplaces.",
      details:
        "Workplace rights depend on the applicable employment and labour laws. Legal protections may cover wages, workplace safety, working conditions and protection against certain forms of harassment.",
      points: [
        "Awareness of applicable wage and employment protections.",
        "Workplace safety and dignity.",
        "Available complaint and dispute resolution mechanisms."
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="rights-page">

      {/* ================= SIDEBAR ================= */}
      {/* SAME SIDEBAR DESIGN AS EMERGENCY */}

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

          {/* ACTIVE PAGE */}
          <button
            className="menu-item active"
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
            onClick={() => handleNavigation("/")}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>


      {/* ================= MAIN CONTENT ================= */}

      <main className="rights-main">

        {/* HEADER */}
        <header className="rights-header">

          <div className="header-left">

            <p className="breadcrumb">
              Dashboard <span>›</span> Know My Rights
            </p>

            <h1>Know My Rights</h1>

            <p className="header-subtitle">
              Understand your rights and learn how Indian laws protect you.
            </p>

          </div>

          <div className="header-right">

            <select
              className="language-select"
              defaultValue="English"
            >
              <option>English</option>
              <option>Tamil</option>
            </select>

            <button
              className="notification-btn"
              type="button"
              aria-label="Notifications"
            >
              🔔
            </button>

            <div className="profile">

              <div className="profile-circle">
                A
              </div>

              <div>
                <strong>Alfiya</strong>
                <small>User</small>
              </div>

            </div>

          </div>

        </header>


        {/* INTRO BANNER */}

        <section className="rights-intro">

          <div className="intro-icon">
            ⚖
          </div>

          <div className="intro-content">

            <span className="intro-label">
              LEGAL AWARENESS
            </span>

            <h2>
              Know Your Rights. Empower Yourself.
            </h2>

            <p>
              Your rights are the foundation of a fair and equal society.
              Explore important constitutional rights and Indian laws to
              understand your freedoms, protections and legal options.
            </p>

          </div>

        </section>


        {/* RIGHTS TITLE */}

        <div className="rights-title">

          <div>

            <span className="section-label">
              YOUR KNOWLEDGE HUB
            </span>

            <h2>
              Explore Your Legal Rights
            </h2>

            <p>
              Simple information about important rights and legal protections.
            </p>

          </div>

          <span className="rights-total">
            ⚖ {rights.length} Categories
          </span>

        </div>


        {/* RIGHTS CARDS */}

        <section className="rights-grid">

          {rights.map((right, index) => (

            <article
              className="right-card"
              key={right.title}
            >

              <div className="card-header">

                <div className="right-icon">
                  {right.icon}
                </div>

                <span className="card-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

              </div>

              <span className="right-category">
                {right.category}
              </span>

              <h3>
                {right.title}
              </h3>

              <div className="article-box">

                <span>
                  RELEVANT PROVISION
                </span>

                <strong>
                  {right.article}
                </strong>

              </div>

              <p className="right-description">
                {right.description}
              </p>

              <button
                className="learn-more-btn"
                type="button"
                onClick={() => setSelectedRight(right)}
              >
                Explore Details <span>→</span>
              </button>

            </article>

          ))}

        </section>


        {/* DISCLAIMER */}

        <section className="rights-disclaimer">

          <div className="disclaimer-icon">
            ⓘ
          </div>

          <div>

            <strong>
              Legal Information Disclaimer
            </strong>

            <p>
              The information provided here is for general legal awareness
              and guidance only. It should not be considered legal advice.
              Laws and their application may vary according to individual
              circumstances. Consult a qualified legal professional for
              advice about a specific matter.
            </p>

          </div>

        </section>


        {/* FOOTER */}

        <footer className="rights-footer">

          <span>
            ⚖ Smart Legal Guidance System
          </span>

          <span>
            Know Your Rights • Know the Law
          </span>

        </footer>

      </main>


      {/* ================= DETAILS POPUP ================= */}

      {selectedRight && (

        <div
          className="rights-modal-overlay"
          onClick={() => setSelectedRight(null)}
        >

          <div
            className="rights-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedRight(null)}
              aria-label="Close details"
            >
              ×
            </button>

            <div className="modal-icon">
              {selectedRight.icon}
            </div>

            <span className="modal-category">
              {selectedRight.category}
            </span>

            <h2 id="modal-title">
              {selectedRight.title}
            </h2>

            <div className="modal-article">
              Relevant Provision:{" "}
              <strong>
                {selectedRight.article}
              </strong>
            </div>

            <p className="modal-description">
              {selectedRight.details}
            </p>

            <h3>
              Key Points to Remember
            </h3>

            <ul className="modal-points">

              {selectedRight.points.map((point, index) => (

                <li key={index}>
                  <span>✓</span>
                  {point}
                </li>

              ))}

            </ul>

            <div className="modal-note">
              This content is for general legal awareness and is not a
              substitute for professional legal advice.
            </div>

            <button
              className="modal-done-btn"
              type="button"
              onClick={() => setSelectedRight(null)}
            >
              Got It
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default KnowMyRights;