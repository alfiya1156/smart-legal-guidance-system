import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/DocumentScanner.css";

function DocumentScanner() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setScanned(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];

    if (file) {
      setSelectedFile(file);
      setScanned(false);
    }
  };

  const handleScan = () => {
    if (!selectedFile) {
      alert("Please upload a document first.");
      return;
    }

    setScanned(true);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setScanned(false);
  };

  return (
    <div className="document-scanner-page">

      {/* ================= SIDEBAR - SAME NAVBAR ================= */}
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

      {/* ================= MAIN CONTENT ================= */}

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

        {/* ================= INFO BANNER ================= */}

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

        {/* ================= UPLOAD SECTION ================= */}

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

          {/* ================= SELECTED FILE ================= */}

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

          <button
            className="scan-document-button"
            onClick={handleScan}
            disabled={!selectedFile}
          >
            🔍 Find Document Risks
          </button>

        </section>

        {/* ================= RISK RESULT ================= */}

        {scanned && (

          <section className="risk-result-card">

            <div className="risk-result-header">

              <div>
                <p className="result-label">
                  DOCUMENT ANALYSIS
                </p>

                <h2>
                  Risk Finder Result
                </h2>
              </div>

              <div className="result-icon">
                ⚠️
              </div>

            </div>

            <div className="document-result-info">

              <div>
                <span>Document</span>
                <strong>{selectedFile.name}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong className="review-status">
                  Review Required
                </strong>
              </div>

            </div>

            <div className="risk-list">

              <div className="risk-item">

                <div className="risk-item-icon">
                  ⚠️
                </div>

                <div>
                  <h3>Important Information</h3>

                  <p>
                    Check whether all important names, dates,
                    addresses and identification details are
                    correctly mentioned.
                  </p>
                </div>

              </div>

              <div className="risk-item">

                <div className="risk-item-icon">
                  📅
                </div>

                <div>
                  <h3>Dates and Validity</h3>

                  <p>
                    Review dates, expiry details and validity
                    periods mentioned in the document.
                  </p>
                </div>

              </div>

              <div className="risk-item">

                <div className="risk-item-icon">
                  ✍️
                </div>

                <div>
                  <h3>Signature / Approval</h3>

                  <p>
                    Check whether required signatures, approvals
                    or supporting details are present.
                  </p>
                </div>

              </div>

              <div className="risk-item">

                <div className="risk-item-icon">
                  🔎
                </div>

                <div>
                  <h3>Terms to Review</h3>

                  <p>
                    Carefully review unclear, unusual or
                    important terms before accepting or signing.
                  </p>
                </div>

              </div>

            </div>

            <div className="risk-notice">

              <span>⚖️</span>

              <p>
                This result is for general legal awareness only.
                It does not confirm that a document is legally valid
                or invalid and does not replace professional legal advice.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default DocumentScanner;