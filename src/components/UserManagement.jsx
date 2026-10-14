import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/UserManagement.css";

const API_URL = "http://localhost:5000/api/admin/users";

function UserManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

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
    {
      label: "Legal Awareness",
      icon: "⚖️",
      path: "/admin/legal-awareness",
    },
    {
      label: "AI Legal Knowledge",
      icon: "📚",
      path: "/admin/ai-legal-knowledge",
    },
    {
      label: "Recent Activity",
      icon: "🕒",
      path: "/admin/recent-activity",
    },
  ];

  // Load registered users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

      const response = await fetch(API_URL, {
        headers: {
          ...(token
            ? { Authorization: `Bearer ${token}` }
            : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load registered users."
        );
      }

      const userList = Array.isArray(data)
        ? data
        : data.users;

      if (!Array.isArray(userList)) {
        throw new Error(
          "The server response does not contain a users list."
        );
      }

      setUsers(userList);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the backend. Check your server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.trim().toLowerCase();

    return (
      String(user.name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(user.email || "")
        .toLowerCase()
        .includes(searchText) ||
      String(user.id || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  // Delete a user through the backend
  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    setActionMessage("");

    try {
      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(deleteUser.id)}`,
        {
          method: "DELETE",
          headers: {
            ...(token
              ? { Authorization: `Bearer ${token}` }
              : {}),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete this user."
        );
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== deleteUser.id
        )
      );

      setSelectedUser(null);
      setDeleteUser(null);
      setActionMessage("User deleted successfully.");
    } catch (err) {
      setActionMessage(
        err.message || "Unable to delete this user."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div className="admin-dashboard um-layout">

      {/* SAME FIXED SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">⚖️</div>

          <div className="admin-brand-text">
            <h2>SMART LEGAL</h2>
            <p>GUIDANCE SYSTEM</p>
          </div>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">
            {adminName.charAt(0).toUpperCase()}
          </div>

          <div className="admin-profile-info">
            <h3>{adminName}</h3>
          </div>
        </div>

        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <button
              key={item.path}
              type="button"
              className={`admin-menu-item ${
                location.pathname === item.path ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="admin-menu-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-logout-button"
            onClick={() => setShowLogoutModal(true)}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* USER MANAGEMENT CONTENT */}
      <main className="admin-main-content um-main">

        <header className="admin-topbar">
          <div>
            <h1>User Management</h1>
            <p>
              View and manage registered users
              in the Smart Legal Guidance System.
            </p>
          </div>

          <div className="admin-topbar-user">
            <span className="admin-topbar-avatar">
              {adminName.charAt(0).toUpperCase()}
            </span>

            <div>
              <strong>{adminName}</strong>
              <p>{adminEmail}</p>
            </div>
          </div>
        </header>

        {/* SUMMARY */}
        <section className="um-summary">
          <div className="um-summary-icon">👥</div>

          <div>
            <p>Total Registered Users</p>
            <h2>{loading ? "..." : users.length}</h2>
          </div>
        </section>

        {/* USER LIST */}
        <section className="um-panel">
          <div className="um-panel-heading">
            <div>
              <h2>Registered Users</h2>
              <p>Search and view user account details.</p>
            </div>

            <button
              type="button"
              className="um-refresh-button"
              onClick={fetchUsers}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>

          <div className="um-search">
            <span>🔍</span>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email or ID..."
              aria-label="Search registered users"
            />
          </div>

          {actionMessage && (
            <p className="um-action-message" role="status">
              {actionMessage}
            </p>
          )}

          {loading ? (
            <div className="um-state">
              <span className="um-spinner" />
              <p>Loading registered users...</p>
            </div>
          ) : error ? (
            <div className="um-state um-error">
              <span>⚠️</span>
              <p>{error}</p>

              <button
                type="button"
                className="um-refresh-button"
                onClick={fetchUsers}
              >
                Try Again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="um-state">
              <span>👥</span>
              <h3>No users found</h3>
              <p>
                {search
                  ? "Try another name, email or ID."
                  : "No registered users are available."}
              </p>
            </div>
          ) : (
            <div className="um-table-wrapper">
              <table className="um-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Registered On</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>

                      <td>
                        <div className="um-user-cell">
                          <span className="um-user-avatar">
                            {String(user.name || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </span>

                          <strong>{user.name || "Unnamed User"}</strong>
                        </div>
                      </td>

                      <td>{user.email || "—"}</td>

                      <td>
                        {user.created_at
                          ? new Date(
                              user.created_at
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td>
                        <div className="um-actions">
                          <button
                            type="button"
                            className="um-view-button"
                            onClick={() => setSelectedUser(user)}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="um-delete-button"
                            onClick={() => setDeleteUser(user)}
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

          {!loading && !error && users.length > 0 && (
            <div className="um-table-footer">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </section>

        <footer className="admin-footer">
          <p>
            © Smart Legal Guidance System for Indian Citizens
          </p>
        </footer>
      </main>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div
          className="um-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="um-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="um-modal-icon">👤</div>

            <h2 id="um-details-title">User Details</h2>

            <div className="um-detail-row">
              <span>User ID</span>
              <strong>{selectedUser.id}</strong>
            </div>

            <div className="um-detail-row">
              <span>Name</span>
              <strong>{selectedUser.name || "—"}</strong>
            </div>

            <div className="um-detail-row">
              <span>Email</span>
              <strong>{selectedUser.email || "—"}</strong>
            </div>

            <div className="um-detail-row">
              <span>Registered On</span>
              <strong>
                {selectedUser.created_at
                  ? new Date(
                      selectedUser.created_at
                    ).toLocaleString("en-IN")
                  : "—"}
              </strong>
            </div>

            <button
              type="button"
              className="um-modal-close"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteUser && (
        <div
          className="um-modal-overlay"
          onClick={() => setDeleteUser(null)}
        >
          <div
            className="um-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-delete-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="um-modal-icon">⚠️</div>

            <h2 id="um-delete-title">Delete User?</h2>

            <p className="um-confirm-text">
              Are you sure you want to delete{" "}
              <strong>{deleteUser.name}</strong>?
              This action may permanently remove the account.
            </p>

            <div className="um-modal-actions">
              <button
                type="button"
                className="um-modal-close"
                onClick={() => setDeleteUser(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="um-confirm-delete"
                onClick={handleDeleteUser}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT CONFIRMATION */}
      {showLogoutModal && (
        <div
          className="um-modal-overlay"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="um-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="um-logout-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="um-modal-icon">⚖️</div>

            <h2 id="um-logout-title">Confirm Logout</h2>

            <p className="um-confirm-text">
              Are you sure you want to logout from
              the Admin Dashboard?
            </p>

            <div className="um-modal-actions">
              <button
                type="button"
                className="um-modal-close"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="um-confirm-delete"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
