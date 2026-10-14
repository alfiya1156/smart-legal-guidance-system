import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/UserManagement.css";

const API_URL = "http://localhost:5000/api/admin/ai-legal-knowledge";

function AdminLegalKnowledge() {
  const navigate = useNavigate();
  const location = useLocation();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [actionMessage, setActionMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    act_name: "",
    section_number: "",
    keywords: "",
    explanation: "",
    tamil_explanation: "",
    rights: "",
    guidance: "",
    source_url: "",
  });

  const getAdminDetails = () => {
    try {
      return (
        JSON.parse(localStorage.getItem("admin")) ||
        JSON.parse(localStorage.getItem("user")) ||
        {}
      );
    } catch {
      return {};
    }
  };

  const admin = getAdminDetails();
  const adminName = admin.name || admin.username || "Admin";
  const adminEmail = admin.email || "Administrator";

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin-dashboard" },
    { label: "User Management", icon: "👥", path: "/admin/users" },
    { label: "Legal Awareness", icon: "⚖️", path: "/admin/legal-awareness" },
    { label: "AI Legal Knowledge", icon: "📚", path: "/admin/ai-legal-knowledge" },
    { label: "Recent Activity", icon: "🕒", path: "/admin/recent-activity" },
  ];

  const fetchRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await fetch(API_URL, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load AI knowledge records.");
      }

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((r) => {
    const q = search.trim().toLowerCase();
    return (
      String(r.title || "").toLowerCase().includes(q) ||
      String(r.act_name || "").toLowerCase().includes(q) ||
      String(r.section_number || "").toLowerCase().includes(q) ||
      String(r.keywords || "").toLowerCase().includes(q) ||
      String(r.explanation || "").toLowerCase().includes(q)
    );
  });

  const openAddModal = () => {
    setEditRecord(null);
    setFormData({
      title: "",
      act_name: "",
      section_number: "",
      keywords: "",
      explanation: "",
      tamil_explanation: "",
      rights: "",
      guidance: "",
      source_url: "",
    });
    setShowModal(true);
  };

  const openEditModal = (rec) => {
    setEditRecord(rec);
    setFormData({
      title: rec.title || "",
      act_name: rec.act_name || "",
      section_number: rec.section_number || "",
      keywords: rec.keywords || "",
      explanation: rec.explanation || "",
      tamil_explanation: rec.tamil_explanation || "",
      rights: rec.rights || "",
      guidance: rec.guidance || "",
      source_url: rec.source_url || "",
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setActionMessage("");

    if (!formData.title.trim() || !formData.explanation.trim()) {
      alert("Please fill in Title and Explanation.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const url = editRecord ? `${API_URL}/${editRecord.id}` : API_URL;
      const method = editRecord ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Operation failed.");

      setShowModal(false);
      setActionMessage(editRecord ? "Knowledge record updated successfully." : "Knowledge record added successfully.");
      fetchRecords();
    } catch (err) {
      alert(err.message || "Failed to save knowledge record.");
    }
  };

  const handleDelete = async () => {
    if (!deleteRecord) return;
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${deleteRecord.id}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed.");

      setDeleteRecord(null);
      setActionMessage("Record deleted successfully.");
      fetchRecords();
    } catch (err) {
      alert(err.message || "Failed to delete record.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-dashboard um-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">⚖️</div>
          <div className="admin-brand-text">
            <h2>SMART LEGAL</h2>
            <p>GUIDANCE SYSTEM</p>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">{adminName.charAt(0).toUpperCase()}</div>
          <div className="admin-profile-info">
            <h3>{adminName}</h3>
          </div>
        </div>

        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`admin-menu-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="admin-menu-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button type="button" className="admin-logout-button" onClick={handleLogout}>
            <span>↪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main-content um-main">
        <header className="admin-topbar">
          <div>
            <h1>AI Legal Knowledge Base</h1>
            <p>Manage knowledge entries and citations used by the AI Legal Assistant.</p>
          </div>

          <div className="admin-topbar-user">
            <span className="admin-topbar-avatar">{adminName.charAt(0).toUpperCase()}</span>
            <div>
              <strong>{adminName}</strong>
              <p>{adminEmail}</p>
            </div>
          </div>
        </header>

        <section className="um-summary">
          <div className="um-summary-icon">📚</div>
          <div>
            <p>Total Knowledge Records</p>
            <h2>{loading ? "..." : records.length}</h2>
          </div>
        </section>

        <section className="um-panel">
          <div className="um-panel-heading">
            <div>
              <h2>AI Knowledge Records</h2>
              <p>Add and manage verified legal citations, sections and guidance.</p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="um-refresh-button"
                style={{ background: "#c59a3f", color: "#1c140c", fontWeight: "bold" }}
                onClick={openAddModal}
              >
                + Add New Citation
              </button>
              <button
                type="button"
                className="um-refresh-button"
                onClick={fetchRecords}
                disabled={loading}
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          <div className="um-search">
            <span>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, act, section, or keywords..."
            />
          </div>

          {actionMessage && <p className="um-action-message">{actionMessage}</p>}

          {loading ? (
            <div className="um-state">
              <span className="um-spinner" />
              <p>Loading AI knowledge records...</p>
            </div>
          ) : error ? (
            <div className="um-state um-error">
              <span>⚠️</span>
              <p>{error}</p>
              <button type="button" className="um-refresh-button" onClick={fetchRecords}>
                Try Again
              </button>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="um-state">
              <span>📚</span>
              <h3>No records found</h3>
              <p>{search ? "Try another search keyword." : "No knowledge records available."}</p>
            </div>
          ) : (
            <div className="um-table-wrapper">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Topic / Title</th>
                    <th>Act / Law</th>
                    <th>Section / Article</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>
                        <strong>{r.title}</strong>
                      </td>
                      <td>{r.act_name || "—"}</td>
                      <td>{r.section_number || "—"}</td>
                      <td>
                        <div className="um-actions">
                          <button
                            type="button"
                            className="um-view-button"
                            onClick={() => openEditModal(r)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="um-delete-button"
                            onClick={() => setDeleteRecord(r)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="admin-footer">
          <p>© Smart Legal Guidance System for Indian Citizens</p>
        </footer>
      </main>

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="um-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="um-modal"
            style={{ maxWidth: "650px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="um-modal-icon">📚</div>
            <h2>{editRecord ? "Edit AI Knowledge Citation" : "Add AI Knowledge Citation"}</h2>

            <form onSubmit={handleSave} style={{ display: "grid", gap: "12px", textAlign: "left", marginTop: "16px" }}>
              <div>
                <label style={{ fontSize: "12px", color: "#c59a3f" }}>Title / Legal Topic *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#c59a3f" }}>Act / Statute Name</label>
                  <input
                    type="text"
                    value={formData.act_name}
                    onChange={(e) => setFormData({ ...formData, act_name: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#c59a3f" }}>Section / Article</label>
                  <input
                    type="text"
                    value={formData.section_number}
                    onChange={(e) => setFormData({ ...formData, section_number: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#c59a3f" }}>Keywords (comma separated)</label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#c59a3f" }}>Legal Explanation (English) *</label>
                <textarea
                  rows="2"
                  required
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", color: "#c59a3f" }}>Tamil Explanation (Optional)</label>
                <textarea
                  rows="2"
                  value={formData.tamil_explanation}
                  onChange={(e) => setFormData({ ...formData, tamil_explanation: e.target.value })}
                  style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", color: "#c59a3f" }}>Key Rights</label>
                  <input
                    type="text"
                    value={formData.rights}
                    onChange={(e) => setFormData({ ...formData, rights: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", color: "#c59a3f" }}>Citizen Guidance</label>
                  <input
                    type="text"
                    value={formData.guidance}
                    onChange={(e) => setFormData({ ...formData, guidance: e.target.value })}
                    style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #4a3420", background: "#1b120a", color: "#fff" }}
                  />
                </div>
              </div>

              <div className="um-modal-actions" style={{ marginTop: "16px" }}>
                <button type="button" className="um-modal-close" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="um-refresh-button"
                  style={{ background: "#c59a3f", color: "#1c140c", fontWeight: "bold" }}
                >
                  {editRecord ? "Update Citation" : "Save Citation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteRecord && (
        <div className="um-modal-overlay" onClick={() => setDeleteRecord(null)}>
          <div className="um-modal" onClick={(e) => e.stopPropagation()}>
            <div className="um-modal-icon">⚠️</div>
            <h2>Delete Knowledge Citation?</h2>
            <p className="um-confirm-text">
              Are you sure you want to delete <strong>{deleteRecord.title}</strong>?
            </p>
            <div className="um-modal-actions">
              <button type="button" className="um-modal-close" onClick={() => setDeleteRecord(null)}>
                Cancel
              </button>
              <button type="button" className="um-confirm-delete" onClick={handleDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLegalKnowledge;
