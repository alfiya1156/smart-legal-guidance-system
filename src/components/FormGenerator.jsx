import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../style/FormGenerator.css";

const FORMS_CONFIG = {
  police: {
    id: "police",
    icon: "🚔",
    title: "Police Complaint",
    description: "Create a structured draft for reporting a complaint or incident to the police.",
    subjectPlaceholder: "e.g., Complaint regarding lost property / unauthorized transaction",
    descriptionPlaceholder: "State the incident chronologically: What happened, where, who was involved, and any witnesses...",
  },
  "cyber-crime": {
    id: "cyber-crime",
    icon: "💻",
    title: "Cyber Crime Complaint",
    description: "Create a structured draft for reporting online fraud, cybercrime or digital issues.",
    subjectPlaceholder: "e.g., Financial phishing scam / Unauthorized social media account takeover",
    descriptionPlaceholder: "Describe the cyber incident: Transaction ID, fake website, caller phone number, lost amount, dates...",
  },
  rti: {
    id: "rti",
    icon: "📋",
    title: "RTI Application",
    description: "Prepare a structured draft for requesting information from a public authority under RTI Act, 2005.",
    subjectPlaceholder: "e.g., Request for certified copies of government scheme beneficiary list",
    descriptionPlaceholder: "Clearly specify the particular information / documents required and the relevant department/year...",
  },
  consumer: {
    id: "consumer",
    icon: "🛒",
    title: "Consumer Complaint",
    description: "Create a structured draft for complaints related to products, services or consumer issues.",
    subjectPlaceholder: "e.g., Complaint regarding defective electronics / refusal of warranty service",
    descriptionPlaceholder: "Describe the product/service, purchase date, invoice number, defect, and response from the seller...",
  },
  grievance: {
    id: "grievance",
    icon: "🏛️",
    title: "Government Grievance",
    description: "Prepare a structured draft for submitting a grievance related to a government service.",
    subjectPlaceholder: "e.g., Grievance regarding delay in pension disbursement / road repair",
    descriptionPlaceholder: "Provide details of your application or grievance, prior representations, and requested administrative relief...",
  },
};

function FormGenerator() {
  const navigate = useNavigate();
  const params = useParams();

  // If URL is /forms/police, open that form; otherwise null
  const initialFormType = params.formType && FORMS_CONFIG[params.formType] ? params.formType : null;
  const [selectedFormKey, setSelectedFormKey] = useState(initialFormType);

  const storedUser = localStorage.getItem("user");
  let currentUser = {};
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    currentUser = {};
  }

  const [formData, setFormData] = useState({
    applicantName: currentUser.name || "",
    email: currentUser.email || "",
    phone: "",
    subject: "",
    incidentDate: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [generating, setGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [userForms, setUserForms] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (params.formType && FORMS_CONFIG[params.formType]) {
      setSelectedFormKey(params.formType);
    }
  }, [params.formType]);

  // Load previous forms if user is logged in
  useEffect(() => {
    if (currentUser.id) {
      fetch(`http://localhost:5000/api/forms/user/${currentUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setUserForms(data.forms || []);
        })
        .catch((err) => console.warn("Failed to load user forms:", err));
    }
  }, [currentUser.id, generatedDraft]);

  const handleSelectForm = (key) => {
    setSelectedFormKey(key);
    setGeneratedDraft(null);
    setErrorMessage("");
    navigate(`/forms/${key}`);
  };

  const handleBackToList = () => {
    setSelectedFormKey(null);
    setGeneratedDraft(null);
    setErrorMessage("");
    navigate("/forms");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.applicantName.trim() || !formData.subject.trim() || !formData.description.trim()) {
      setErrorMessage("Please complete Applicant Name, Subject, and Description.");
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch("http://localhost:5000/api/forms/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id || null,
          formType: selectedFormKey,
          applicantName: formData.applicantName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          incidentDate: formData.incidentDate,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate form draft.");
      }

      setGeneratedDraft({
        formId: data.formId,
        formTitle: data.formTitle,
        draft: data.draft,
      });
    } catch (err) {
      setErrorMessage(err.message || "Unable to connect to the backend server.");
    } finally {
      setGenerating(false);
    }
  };

  const downloadDraft = () => {
    if (!generatedDraft?.draft) return;
    const blob = new Blob([generatedDraft.draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedFormKey}_draft_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const activeFormConfig = selectedFormKey ? FORMS_CONFIG[selectedFormKey] : null;

  return (
    <div className="form-generator-page">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-symbol">⚖</div>
          <div>
            <h2>Smart Legal</h2>
            <span>Guidance System</span>
          </div>
        </div>

        <div className="sidebar-menu">
          <button className="menu-item" onClick={() => handleNavigation("/dashboard")}>
            <span>🏠</span>
            <span>Dashboard</span>
          </button>

          <button className="menu-item" onClick={() => handleNavigation("/ai-assistant")}>
            <span>🤖</span>
            <span>AI Assistant</span>
          </button>

          <button className="menu-item" onClick={() => handleNavigation("/know-my-rights")}>
            <span>⚖️</span>
            <span>Know My Rights</span>
          </button>

          <button className="menu-item" onClick={() => handleNavigation("/emergency")}>
            <span>🚨</span>
            <span>Emergency Assistance</span>
          </button>

          <button className="menu-item" onClick={() => handleNavigation("/location")}>
            <span>📍</span>
            <span>Location Tracker</span>
          </button>

          <button className="menu-item active" onClick={() => handleNavigation("/forms")}>
            <span>📄</span>
            <span>Forms Generator</span>
          </button>

          <button className="menu-item" onClick={() => handleNavigation("/scanner")}>
            <span>📑</span>
            <span>Document Scanner</span>
          </button>
        </div>

        <div className="sidebar-bottom">
          <button className="menu-item" onClick={() => handleNavigation("/profile")}>
            <span>👤</span>
            <span>Profile</span>
          </button>

          <button className="menu-item logout" onClick={() => handleNavigation("/")}>
            <span>↪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="form-generator-main">
        <div className="form-generator-header">
          <div>
            <p className="form-small-title">SMART LEGAL GUIDANCE SYSTEM</p>
            <h1>
              Forms <span>Generator</span>
            </h1>
            <p className="form-header-description">
              Create structured legal drafts and representations based on your requirements.
            </p>
          </div>

          <div className="form-header-icon">📄</div>
        </div>

        <div className="form-info-banner">
          <div className="form-info-icon">⚖️</div>
          <div>
            <h3>Legal Form Assistant</h3>
            <p>
              Fill out the required information to generate an editable legal draft. Verify the draft before official submission.
            </p>
          </div>
        </div>

        {/* VIEW 1: FORM LIST SELECTION */}
        {!activeFormConfig ? (
          <section className="forms-section">
            <div className="forms-section-heading">
              <div>
                <h2>Choose a Form</h2>
                <p>Select one of the following citizen-oriented legal forms.</p>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {userForms.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowHistory(!showHistory)}
                    style={{
                      background: "#3b2417",
                      color: "#f6d78c",
                      border: "1px solid #c59a3f",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    {showHistory ? "Hide My Drafts" : `My Drafts (${userForms.length})`}
                  </button>
                )}
                <span className="forms-count">5 FORMS</span>
              </div>
            </div>

            {showHistory && userForms.length > 0 && (
              <div style={{ background: "#ffffff", border: "1px solid #d4b884", borderRadius: "10px", padding: "16px", marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#4a2d1b" }}>Your Previous Form Drafts</h3>
                <div style={{ display: "grid", gap: "10px" }}>
                  {userForms.map((f) => (
                    <div key={f.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0e0ca", paddingBottom: "8px" }}>
                      <div>
                        <strong>{f.form_type?.toUpperCase()}</strong>: {f.subject}
                        <br />
                        <small style={{ color: "#777" }}>Generated on {new Date(f.created_at).toLocaleDateString("en-IN")}</small>
                      </div>
                      <span style={{ background: "#f8eedb", color: "#774a12", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                        {f.status || "Draft"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="forms-grid">
              {Object.keys(FORMS_CONFIG).map((key, index) => {
                const form = FORMS_CONFIG[key];
                return (
                  <div className="form-card" key={key} onClick={() => handleSelectForm(key)}>
                    <div className="form-card-top">
                      <div className="form-card-icon">{form.icon}</div>
                      <span className="form-card-number">0{index + 1}</span>
                    </div>

                    <h3>{form.title}</h3>
                    <p>{form.description}</p>

                    <button
                      type="button"
                      className="form-card-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectForm(key);
                      }}
                    >
                      Create Form <span>→</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          /* VIEW 2: FORM FILLING & DRAFT PREVIEW */
          <section className="forms-section" style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2cfb4" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "32px" }}>{activeFormConfig.icon}</span>
                <div>
                  <h2 style={{ margin: 0, color: "#3b2417" }}>{activeFormConfig.title} Draft Generator</h2>
                  <p style={{ margin: 0, color: "#6b5443", fontSize: "14px" }}>{activeFormConfig.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleBackToList}
                style={{
                  background: "transparent",
                  border: "1px solid #b38634",
                  color: "#5a3a1f",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ← Back to All Forms
              </button>
            </div>

            {errorMessage && (
              <div style={{ background: "#fde8e8", color: "#9b1c1c", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #f8b4b4" }}>
                {errorMessage}
              </div>
            )}

            {!generatedDraft ? (
              <form onSubmit={handleGenerate} style={{ display: "grid", gap: "16px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#3b2417" }}>
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      name="applicantName"
                      required
                      value={formData.applicantName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cfbfa8", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#3b2417" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cfbfa8", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#3b2417" }}>
                      Contact Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cfbfa8", fontSize: "14px" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#3b2417" }}>
                      Incident / Representation Date
                    </label>
                    <input
                      type="date"
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleInputChange}
                      style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cfbfa8", fontSize: "14px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#3b2417" }}>
                    Subject / Matter *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder={activeFormConfig.subjectPlaceholder}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cfbfa8", fontSize: "14px" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", color: "#3b2417" }}>
                    Detailed Statement of Facts *
                  </label>
                  <textarea
                    rows="6"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder={activeFormConfig.descriptionPlaceholder}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cfbfa8", fontSize: "14px", fontFamily: "inherit" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                  <button
                    type="button"
                    onClick={handleBackToList}
                    style={{
                      background: "#e8ded1",
                      border: "none",
                      color: "#4a3320",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={generating}
                    style={{
                      background: "linear-gradient(135deg, #c59a3f, #a77c27)",
                      border: "none",
                      color: "#1c140c",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    {generating ? "Generating Draft..." : "Generate Legal Draft ➔"}
                  </button>
                </div>
              </form>
            ) : (
              /* DRAFT RESULT & ACTIONS */
              <div style={{ marginTop: "10px" }}>
                <div style={{ background: "#fefcf8", border: "2px dashed #c59a3f", borderRadius: "8px", padding: "20px", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", paddingBottom: "10px", marginBottom: "15px" }}>
                    <span style={{ background: "#732918", color: "#fff", padding: "3px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                      CITIZEN AID LEGAL DRAFT - NOT OFFICIAL SUBMISSION
                    </span>
                    <span style={{ color: "#777", fontSize: "12px" }}>Submission ID #{generatedDraft.formId}</span>
                  </div>

                  <pre style={{ whiteSpace: "pre-wrap", fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: "1.6", color: "#222", margin: 0 }}>
                    {generatedDraft.draft}
                  </pre>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
                  <button
                    type="button"
                    onClick={() => setGeneratedDraft(null)}
                    style={{
                      background: "#e8ded1",
                      border: "none",
                      color: "#4a3320",
                      padding: "10px 18px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ✏️ Edit Information
                  </button>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{
                        background: "#3b2417",
                        border: "none",
                        color: "#f6d78c",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      🖨️ Print Draft
                    </button>

                    <button
                      type="button"
                      onClick={downloadDraft}
                      style={{
                        background: "linear-gradient(135deg, #c59a3f, #a77c27)",
                        border: "none",
                        color: "#1c140c",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      📥 Download Draft (.txt)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <div className="form-generator-disclaimer">
          <div className="disclaimer-symbol">⚖️</div>
          <div>
            <h3>Important Notice</h3>
            <p>
              This tool creates a general citizen draft based on the information provided. It does not constitute formal legal representation or verified filing. Review the draft, verify with local authorities or legal counsel, and submit through the designated official channel.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FormGenerator;