import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { trackActivity } from "../utils/activityTracker";
import "../style/AIAssistant.css";

function AIAssistant() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const recognitionRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  let currentUser = {};
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    currentUser = {};
  }
  const userName = currentUser.name || currentUser.email?.split("@")[0] || "Citizen";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleNavigation = (path) => {
    navigate(path);
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === "Tamil" ? "ta-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please try Google Chrome or Microsoft Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = language === "Tamil" ? "ta-IN" : "en-IN";
          recognitionRef.current.start();
        }
      } catch (err) {
        console.warn("Speech recognition start failed:", err.message);
        setIsListening(false);
      }
    }
  };

  const handleSpeak = (text, index) => {
    if (!window.speechSynthesis) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown/separators from text for smooth speech
    const cleanSpeechText = text
      .replace(/---+/g, "")
      .replace(/[*_#`]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = language === "Tamil" ? "ta-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (overrideText) => {
    const textToSend = typeof overrideText === "string" ? overrideText : message;
    if (!textToSend.trim() || loading) return;

    const question = textToSend.trim();
    const newMessage = {
      type: "user",
      text: question,
    };

    trackActivity("Legal question submitted", "AI Assistant");

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/ai-assistant/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question, language }),
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
          text:
            language === "Tamil"
              ? "சட்ட வழிகாட்டல் சேவையகத்துடன் இணைக்க முடியவில்லை. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
              : "Unable to connect to the legal guidance server. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
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

            <select
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="English">English</option>
              <option value="Tamil">Tamil (தமிழ்)</option>
            </select>

            <button className="notification-btn" type="button" aria-label="Notifications">
              🔔
            </button>

            <div className="profile" onClick={() => handleNavigation("/profile")} style={{ cursor: "pointer" }}>
              <div className="profile-circle">
                {userInitial}
              </div>

              <div>
                <strong>{userName}</strong>
                <small>Citizen</small>
              </div>
            </div>

          </div>

        </header>

        <section className="legal-quote">

          <div className="quote-icon">
            “
          </div>

          <p>
            {language === "Tamil"
              ? "“இது வெறும் AI சாட்போட் மட்டுமல்ல — குடிமக்களுக்கான சட்ட வழிகாட்டல் தளம்.”"
              : "“Not just an AI chatbot — a citizen-focused legal guidance platform.”"}
          </p>

          <div className="quote-icon quote-end">
            ”
          </div>

        </section>

        <section className="quick-section">

          <div className="section-title">

            <h2>
              {language === "Tamil" ? "விரைவு தலைப்புகள்" : "Quick Start"}
            </h2>

            <p>
              {language === "Tamil"
                ? "ஒரு தலைப்பைத் தேர்ந்தெடுக்கவும் அல்லது உங்கள் சட்ட வினவலை கீழே உள்ளிடவும்."
                : "Select a topic or describe your legal concern below."}
            </p>

          </div>


          <div className="quick-grid">

            {quickQuestions.map((item, index) => (

              <button
                className="quick-card"
                key={index}
                onClick={() => {
                  setMessage(item.title);
                  sendMessage(item.title);
                }}
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
                  {language === "Tamil" ? "உங்களுக்கு உதவ தயார்" : "Ready to assist you"}
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
                  {language === "Tamil" ? "நான் உங்களுக்கு எப்படி உதவ முடியும்?" : "How can I help you?"}
                </h2>

                <p>
                  {language === "Tamil"
                    ? "உங்கள் சட்ட பிரச்சனையை எளிய தமிழில் விவரிக்கவும். தொடர்புடைய சட்டங்கள், பிரிவுகள் மற்றும் வழிகாட்டல்களைப் பெறலாம்."
                    : "Describe your legal problem in simple words. I can help you understand relevant laws, rights and verified citizen guidance."}
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

                    <div className="message-bubble" style={{ whiteSpace: "pre-line" }}>
                      {item.text}

                      {item.type === "ai" && (
                        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => handleSpeak(item.text, index)}
                            style={{
                              background: speakingIndex === index ? "#732918" : "#f1e3c8",
                              color: speakingIndex === index ? "#fff" : "#4a2d1b",
                              border: "1px solid #d4b884",
                              borderRadius: "6px",
                              padding: "4px 10px",
                              fontSize: "12px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            {speakingIndex === index ? "⏹ Stop Voice" : "🔊 Listen (TTS)"}
                          </button>
                        </div>
                      )}
                    </div>

                    {item.type === "user" && (
                      <div className="message-avatar">
                        {userInitial}
                      </div>
                    )}

                  </div>

                ))}

                {loading && (
                  <div className="message ai-message">
                    <div className="message-avatar">🤖</div>
                    <div className="message-bubble" style={{ fontStyle: "italic", opacity: 0.8 }}>
                      {language === "Tamil" ? "சட்ட தரவுத்தளத்தில் தேடுகிறது..." : "Searching legal databases..."}
                    </div>
                  </div>
                )}

              </div>

            )}

          </div>

          <div className="chat-input-area">

            <button
              className="attach-btn"
              type="button"
              title="Open Document Scanner"
              onClick={() => handleNavigation("/scanner")}
            >
              📎
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? "🎙 Listening... Speak now..."
                  : language === "Tamil"
                  ? "உங்கள் சட்ட கேள்வியை உள்ளிடவும்..."
                  : "Describe your legal problem..."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                borderColor: isListening ? "#d14318" : undefined,
                background: isListening ? "#fff9f5" : undefined,
              }}
            />

            <button
              className="mic-btn"
              type="button"
              onClick={toggleListening}
              title={isListening ? "Stop listening" : "Start voice speech recognition"}
              style={{
                background: isListening ? "#d14318" : undefined,
                color: isListening ? "#ffffff" : undefined,
                animation: isListening ? "pulse 1.5s infinite" : undefined,
              }}
            >
              {isListening ? "🔴" : "🎙"}
            </button>

            <button
              className="send-btn"
              type="button"
              disabled={loading || !message.trim()}
              onClick={() => sendMessage()}
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