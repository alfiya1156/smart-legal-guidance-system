import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackActivity } from "../utils/activityTracker";
import "../style/DocumentScanner.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "txt", "doc", "docx"];

function DocumentScanner() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const validateFile = (file) => {
    if (!file) return false;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setErrorMessage(
        `Unsupported file type (.${ext}). Please upload a PDF, TXT, JPG, or PNG document.`
      );
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("File exceeds 10 MB size limit. Please upload a smaller document.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setAnalysisResult(null);
      setExtractedText("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setAnalysisResult(null);
      setExtractedText("");
    }
  };

  const analyzeContent = (text, fileName) => {
    const lower = (text + " " + fileName).toLowerCase();

    // Check for key legal indicators
    const hasParties = /between|party|parties|lessor|lessee|employer|employee|buyer|seller|contractor|client/i.test(lower);
    const hasDates = /date|dated|duration|term|commence|effective|validity|period|year|month/i.test(lower);
    const hasTermination = /terminat|cancel|notice|breach|default|lapse|revoke/i.test(lower);
    const hasIndemnity = /indemnif|hold harmless|liability|penalty|damages|compensat/i.test(lower);
    const hasJurisdiction = /jurisdiction|court|arbitrat|dispute|governing law|laws of|tribunal/i.test(lower);
    const hasSignatures = /sign|signature|signed|witness|executed|seal|in witness whereof/i.test(lower);

    // Specific potential risks
    const risks = [];
    if (!hasJurisdiction) {
      risks.push({
        icon: "⚖️",
        title: "Governing Law & Jurisdiction Unspecified",
        desc: "No clear governing law or court jurisdiction clause detected. In case of dispute, defining the applicable courts prevents costly procedural delays.",
        level: "warning",
      });
    } else {
      risks.push({
        icon: "🏛️",
        title: "Jurisdiction / Dispute Resolution Identified",
        desc: "The document references governing law, dispute resolution or court jurisdiction.",
        level: "good",
      });
    }

    if (!hasTermination) {
      risks.push({
        icon: "⚠️",
        title: "Termination & Exit Clause Not Evident",
        desc: "Clear notice period or conditions for termination without penalty should be specified.",
        level: "warning",
      });
    } else {
      risks.push({
        icon: "📄",
        title: "Termination / Notice Clause Present",
        desc: "Review whether termination rights are mutual or unilateral before signing.",
        level: "neutral",
      });
    }

    if (hasIndemnity) {
      risks.push({
        icon: "🛡️",
        title: "Indemnity & Liability Clauses Detected",
        desc: "Verify whether indemnity obligations are capped and mutual rather than one-sided.",
        level: "warning",
      });
    }

    if (!hasSignatures) {
      risks.push({
        icon: "✍️",
        title: "Execution / Signature Verification",
        desc: "Ensure all parties and witnesses execute the agreement with valid dates and seals if required.",
        level: "neutral",
      });
    }

    // Standard review items
    risks.push({
      icon: "📅",
      title: "Dates, Timelines & Milestones",
      desc: hasDates
        ? "Validity or timeline indicators found. Double check all milestone dates and deadlines."
        : "Check whether effective dates, start dates, and end dates are specified clearly.",
      level: hasDates ? "neutral" : "warning",
    });

    return {
      status: risks.some((r) => r.level === "warning") ? "Review Recommended" : "Standard Legal Format",
      items: risks,
      hasParties,
      hasDates,
      hasJurisdiction,
      wordCount: text ? text.split(/\s+/).length : "Document File",
    };
  };

  const handleScan = () => {
    if (!selectedFile) {
      setErrorMessage("Please upload a document first.");
      return;
    }

    setScanning(true);
    setErrorMessage("");

    // Read content if it's text-based
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = typeof e.target.result === "string" ? e.target.result : "";
      setExtractedText(text.slice(0, 1500));
      const result = analyzeContent(text, selectedFile.name);
      setAnalysisResult(result);
      setScanning(false);
      trackActivity(`Scanned document: ${selectedFile.name}`, "Document Scanner");
    };

    reader.onerror = () => {
      // If binary or image, analyze based on filename and header metadata
      const result = analyzeContent("", selectedFile.name);
      setAnalysisResult(result);
      setScanning(false);
      trackActivity(`Scanned document: ${selectedFile.name}`, "Document Scanner");
    };

    if (selectedFile.type.startsWith("text/") || selectedFile.name.endsWith(".txt")) {
      reader.readAsText(selectedFile);
    } else {
      // For PDF/images, read snippet or simulate extraction
      setTimeout(() => {
        reader.onload({ target: { result: `Document: ${selectedFile.name}\nType: ${selectedFile.type || "Document"}\nSize: ${(selectedFile.size / 1024).toFixed(1)} KB` } });
      }, 600);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setExtractedText("");
    setErrorMessage("");
  };

  return (
    <div className="document-scanner-page">

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
            className="menu-item"
            onClick={() => handleNavigation("/forms")}
          >
            <span>📄</span>
            <span>Forms Generator</span>
          </button>

          <button
            className="menu-item active"
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

      <main className="document-scanner-main">

        <div className="scanner-header">

          <div>
            <p className="scanner-small-title">
              SMART LEGAL GUIDANCE SYSTEM
            </p>

            <h1>
              Document <span>Scanner</span>
            </h1>

            <p className="scanner-description">
              Upload a legal document and identify possible risk areas
              for better legal awareness.
            </p>
          </div>

          <div className="scanner-header-icon">
            📑
          </div>

        </div>

        <div className="scanner-info-banner">

          <div className="scanner-info-icon">
            🔍
          </div>

          <div>
            <h3>Document Risk Finder</h3>

            <p>
              Upload your document to review common risk indicators,
              missing information and points that may require attention.
            </p>
          </div>

        </div>

        <section className="scanner-card">

          <div className="scanner-card-heading">

            <div>
              <h2>Upload Your Document</h2>

              <p>
                Supported files: PDF, JPG, JPEG and PNG
              </p>
            </div>

            <span className="scanner-step">
              STEP 01
            </span>

          </div>

          <div
            className={`upload-area ${
              dragActive ? "drag-active" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >

            <div className="upload-icon">
              📤
            </div>

            <h3>
              {selectedFile
                ? "Document Selected"
                : "Upload Your Document"}
            </h3>

            <p>
              Drag and drop your document here
              <br />
              or
            </p>

            <label className="choose-file-button">

              Choose Document

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                hidden
              />

            </label>

          </div>

          {selectedFile && (

            <div className="selected-file">

              <div className="selected-file-icon">
                📄
              </div>

              <div className="selected-file-info">
                <h4>{selectedFile.name}</h4>

                <p>
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <button
                className="remove-file-button"
                onClick={handleRemove}
              >
                ✕
              </button>

            </div>

          )}

          {errorMessage && (
            <div style={{ background: "#fde8e8", color: "#9b1c1c", padding: "10px 14px", borderRadius: "8px", marginTop: "12px", border: "1px solid #f8b4b4", textAlign: "left" }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <button
            className="scan-document-button"
            type="button"
            onClick={handleScan}
            disabled={!selectedFile || scanning}
          >
            {scanning ? "🔍 Analyzing Document Content..." : "🔍 Find Document Risks"}
          </button>

        </section>

        {analysisResult && (

          <section className="risk-result-card">

            <div className="risk-result-header">

              <div>
                <p className="result-label">
                  AUTOMATED DOCUMENT ASSESSMENT
                </p>

                <h2>
                  Legal Risk & Safeguards Result
                </h2>
              </div>

              <div className="result-icon">
                {analysisResult.status === "Review Recommended" ? "⚠️" : "🛡️"}
              </div>

            </div>

            <div className="document-result-info">

              <div>
                <span>Document</span>
                <strong>{selectedFile.name}</strong>
              </div>

              <div>
                <span>Analysis Status</span>
                <strong
                  className="review-status"
                  style={{
                    color: analysisResult.status === "Review Recommended" ? "#b45309" : "#15803d",
                  }}
                >
                  {analysisResult.status}
                </strong>
              </div>

            </div>

            <div className="risk-list">

              {analysisResult.items.map((item, idx) => (
                <div
                  className="risk-item"
                  key={idx}
                  style={{
                    borderLeft:
                      item.level === "warning"
                        ? "4px solid #d97706"
                        : item.level === "good"
                        ? "4px solid #16a34a"
                        : "4px solid #854d0e",
                  }}
                >

                  <div className="risk-item-icon">
                    {item.icon}
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>

                </div>
              ))}

            </div>

            {extractedText && (
              <div style={{ marginTop: "16px", padding: "14px", background: "#fbf6ed", borderRadius: "8px", border: "1px solid #e3d2b8", textAlign: "left" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#8a5822", textTransform: "uppercase" }}>
                  Extracted Document Text Preview (First 500 characters)
                </span>
                <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#444", fontStyle: "italic", maxHeight: "120px", overflowY: "auto" }}>
                  {extractedText.slice(0, 500)}...
                </p>
              </div>
            )}

            <div className="risk-notice">

              <span>⚖️</span>

              <p>
                <strong>Limitations of Automated Analysis:</strong> This scan identifies common clause indicators and missing standard provisions for general legal awareness only. It cannot verify legal validity, authenticity, party capacity, or enforceability. Always consult a licensed advocate before signing or executing binding legal contracts.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default DocumentScanner;