import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/KnowMyRights.css";

function KnowMyRights() {
  const navigate = useNavigate();
  const [selectedRight, setSelectedRight] = useState(null);
  const [databaseRights, setDatabaseRights] = useState([]);
  const [loadingRights, setLoadingRights] = useState(true);
  const [rightsError, setRightsError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const storedUser = localStorage.getItem("user");
  let currentUser = {};
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    currentUser = {};
  }
  const userName = currentUser.name || currentUser.email?.split("@")[0] || "Citizen";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const fetchLegalAwareness = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/legal-awareness"
        );

        if (!response.ok) {
          throw new Error("Failed to load legal awareness");
        }

        const data = await response.json();
        setDatabaseRights(data);
      } catch (error) {
        console.error("Legal awareness error:", error);
        setRightsError("Unable to load legal information from database.");
      } finally {
        setLoadingRights(false);
      }
    };

    fetchLegalAwareness();
  }, []);


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
  
const displayRights = databaseRights.length > 0
  ? databaseRights.map((law) => {
      const existingRight = rights.find(
        (right) =>
          right.title.trim().toLowerCase() ===
          law.title.trim().toLowerCase()
      );

      return {
        icon: existingRight?.icon || "⚖️",
        title: law.title,
        article:
          existingRight?.article ||
          law.applicable_section ||
          law.category,
        category: law.category || existingRight?.category,
        description:
          existingRight?.description || law.description,
        details:
          existingRight?.details ||
          law.law_explanation ||
          law.description,
        points:
          existingRight?.points?.length > 0
            ? existingRight.points
            : [
                law.applies_to &&
                  `Applies to: ${law.applies_to}`,
                law.exceptions &&
                  `Exceptions: ${law.exceptions}`,
                law.practical_example &&
                  `Example: ${law.practical_example}`,
                law.help_information &&
                  `Help: ${law.help_information}`,
              ].filter(Boolean),
      };
    })
  : rights;

  const categories = ["All", ...Array.from(new Set(displayRights.map(r => r.category).filter(Boolean)))];

  const filteredRights = displayRights.filter((right) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (right.title && right.title.toLowerCase().includes(term)) ||
      (right.description && right.description.toLowerCase().includes(term)) ||
      (right.article && right.article.toLowerCase().includes(term)) ||
      (right.details && right.details.toLowerCase().includes(term)) ||
      (right.category && right.category.toLowerCase().includes(term));

    const matchesCategory =
      selectedCategory === "All" || right.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="rights-page">

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


      <main className="rights-main">

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

            <div className="profile" onClick={() => handleNavigation("/profile")} style={{ cursor: "pointer" }}>

              <div className="profile-circle">
                {userInitial}
              </div>

              <div>
                <strong>{userName}</strong>
                <small>{currentUser.role === "admin" ? "Administrator" : "Citizen"}</small>
              </div>

            </div>

          </div>

        </header>

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

        {/* Search & Category Filter */}
        <section style={{ margin: "1.5rem 0", background: "#fcfbf7", border: "1px solid #e7ded4", borderRadius: "12px", padding: "1.2rem" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <input
                type="text"
                placeholder="🔍 Search rights, articles, IPC/BNS, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #c5a059",
                  background: "#fff",
                  color: "#2c1810",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid #d4c5b9",
                  background: "#fff",
                  color: "#6b584c",
                  cursor: "pointer",
                  fontSize: "0.9rem"
                }}
              >
                Clear Search
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "20px",
                  border: selectedCategory === cat ? "1px solid #8c6d37" : "1px solid #d4c5b9",
                  background: selectedCategory === cat ? "#8c6d37" : "#fff",
                  color: selectedCategory === cat ? "#fff" : "#3b2219",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: selectedCategory === cat ? "600" : "normal",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

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
             ⚖ {filteredRights.length} Found
          </span>

        </div>

        {loadingRights && (
          <div style={{ textAlign: "center", padding: "1rem", color: "#8c6d37", fontStyle: "italic" }}>
            ⚖ Synchronizing legal rights from database...
          </div>
        )}

        {rightsError && (
          <div style={{ textAlign: "center", padding: "0.5rem", color: "#b3261e", fontSize: "0.88rem" }}>
            ⚠️ {rightsError} (Displaying foundational constitutional rights)
          </div>
        )}

        <section className="rights-grid">

            {filteredRights.length === 0 ? (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", background: "#fcfbf7", borderRadius: "12px", border: "1px dashed #c5a059" }}>
                <p style={{ fontSize: "1.2rem", color: "#6b584c", margin: "0 0 0.5rem" }}>
                  No legal rights found matching "{searchTerm}" {selectedCategory !== "All" ? `in category "${selectedCategory}"` : ""}
                </p>
                <button
                  type="button"
                  onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
                  style={{
                    padding: "0.6rem 1.2rem",
                    borderRadius: "6px",
                    border: "1px solid #8c6d37",
                    background: "#8c6d37",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredRights.map((right, index) => (

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

          )))}

        </section>

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

        <footer className="rights-footer">

          <span>
            ⚖ Smart Legal Guidance System
          </span>

          <span>
            Know Your Rights • Know the Law
          </span>

        </footer>

      </main>

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