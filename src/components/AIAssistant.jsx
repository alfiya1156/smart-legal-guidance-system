import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackActivity } from "../utils/activityTracker";
import "../style/AIAssistant.css";

function AIAssistant() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  
const sendMessage = async () => {
  if (message.trim() === "") return;

  const question = message.trim();

  const newMessage = {
    type: "user",
    text: question,
  };

  trackActivity("Legal question submitted", "AI Assistant");

  setMessages((prev) => [...prev, newMessage]);
  setMessage("");

  try {
    const response = await fetch(
      "http://localhost:5000/api/ai-assistant/ask",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: data.answer,
      },
    ]);
  } catch (error) {
    console.error("AI Assistant error:", error);

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: "Unable to connect to the legal guidance server. Please try again.",
      },
    ]);
  }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const quickQuestions = [
    {
      icon: "🏠",
      title: "Property Issue",
      text: "Property and ownership problems",
    },
    {
      icon: "💼",
      title: "Workplace Issue",
      text: "Know your workplace rights",
    },
    {
      icon: "🛒",
      title: "Consumer Problem",
      text: "Consumer complaints and rights",
    },
    {
      icon: "🔐",
      title: "Cyber Crime",
      text: "Online fraud and cyber safety",
    },
    {
      icon: "👩",
      title: "Women Protection",
      text: "Rights and legal protection",
    },
  ];

  return (
    <div className="ai-page">

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
            className="menu-item"
            onClick={() => handleNavigation("/dashboard")}
          >
            <span>🏠</span>
            <span>Dashboard</span>
          </button>

          <button
            className="menu-item active"
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
            onClick={() => handleNavigation("/")}
          >
            <span>↪</span>
            <span>Logout</span>
          </button>

        </div>

      </aside>

      <main className="ai-main">

        <header className="ai-header">

          <div className="header-left">

            <p className="breadcrumb">
              Dashboard
              <span>›</span>
              AI Legal Assistant
            </p>

            <h1>
              AI Legal Assistant
            </h1>

            <p className="header-subtitle">
              Describe your legal problem and get simple legal guidance.
            </p>

          </div>


          <div className="header-right">

            <select className="language-select">
              <option>English</option>
              <option>Tamil</option>
            </select>


            <button className="notification-btn">
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

        <section className="legal-quote">

          <div className="quote-icon">
            “
          </div>

          <p>
            “Not just an AI chatbot — a citizen-focused legal guidance platform.”
          </p>

          <div className="quote-icon quote-end">
            ”
          </div>

        </section>

        <section className="quick-section">

          <div className="section-title">

            <h2>
              Quick Start
            </h2>

            <p>
              Select a topic or describe your legal concern below.
            </p>

          </div>


          <div className="quick-grid">

            {quickQuestions.map((item, index) => (

              <button
                className="quick-card"
                key={index}
                onClick={() => setMessage(item.title)}
              >

                <div className="quick-icon">
                  {item.icon}
                </div>

                <div>

                  <strong>
                    {item.title}
                  </strong>

                  <span>
                    {item.text}
                  </span>

                </div>

              </button>

            ))}

          </div>

        </section>

        <section className="chat-container">

          <div className="chat-header">

            <div className="ai-profile">

              <div className="ai-avatar">
                🤖
              </div>

              <div>

                <h3>
                  Smart Legal AI
                </h3>

                <p>
                  <span className="online-dot"></span>
                  Ready to assist you
                </p>

              </div>

            </div>


            <button
              className="clear-chat"
              onClick={clearChat}
            >
              Clear Chat
            </button>

          </div>

          <div className="chat-body">

            {messages.length === 0 ? (

              <div className="empty-chat">

                <div className="empty-icon">
                  ⚖
                </div>

                <h2>
                  How can I help you?
                </h2>

                <p>
                  Describe your legal problem in simple words.
                  I can help you understand relevant laws,
                  rights and general legal information.
                </p>

              </div>

            ) : (

              <div className="messages">

                {messages.map((item, index) => (

                  <div
                    className={`message ${
                      item.type === "user"
                        ? "user-message"
                        : "ai-message"
                    }`}
                    key={index}
                  >

                    {item.type === "ai" && (
                      <div className="message-avatar">
                        🤖
                      </div>
                    )}

                    <div className="message-bubble">
                      {item.text}
                    </div>

                    {item.type === "user" && (
                      <div className="message-avatar">
                        A
                      </div>
                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

          <div className="chat-input-area">

            <button className="attach-btn">
              📎
            </button>


            <input
              type="text"
              placeholder="Describe your legal problem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />


            <button className="mic-btn">
              🎙
            </button>


            <button
              className="send-btn"
              onClick={sendMessage}
            >
              ➤
            </button>

          </div>

          <div className="legal-disclaimer">

            <div className="disclaimer-icon">
              ⚠
            </div>

            <div>

              <strong>
                Legal Information Disclaimer
              </strong>

              <p>
                The information provided here is for general
                guidance and should not be considered legal advice.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AIAssistant;