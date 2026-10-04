import React from "react";
import { useNavigate } from "react-router-dom";
import "../style/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">

      {/* HOME BACKGROUND IMAGE ONLY */}
      <img
        src="/legal-img.jpeg"
        alt="Legal Guidance"
        className="home-background"
      />

      {/* DARK OVERLAY */}
      <div className="home-overlay"></div>

      {/* HOME CONTENT */}
      <div className="home-content">

        <div className="home-legal-icon">⚖</div>

        <h1>
          Smart Legal
          <br />
          Guidance System
        </h1>

        <h2>For Indian Citizens</h2>

        <p className="home-description">
          Know Your Rights | Find Relevant Laws | Get Clear Citizen Guidance
        </p>

        <p className="home-quote">
          “Justice is not a privilege,
          <br />
          it is a right for every citizen.”
        </p>

        <button
          className="home-get-started"
          onClick={() => navigate("/login")}
        >
          Get Started ➩
        </button>

      </div>

    </div>
  );
}

export default Home;