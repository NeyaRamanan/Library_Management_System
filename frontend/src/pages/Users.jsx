import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY_FORM = { name: "", email: "", password: "", role: "student" };

function Users() {
  const [users,   setUsers]   = useState([]);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser,  setEditUser]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    api.get("/users")
      .then(r => setUsers(r.data))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = users.filter(u =>
    [u.name, u.email, u.role]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => { setEditUser(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = u => { setEditUser(u); setForm({ name: u.name, email: u.email, password: "", role: u.role }); setShowModal(true); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) { await api.put(`/users/${editUser.user_id}`, form); flash("User updated.", "success"); }
      else          { await api.post("/users", form);                    flash("User added.", "success"); }
      setShowModal(false);
      fetchUsers();
    } catch {
      flash("Failed to save user.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async id => {
    try { await api.delete(`/users/${id}`); flash("User removed.", "success"); fetchUsers(); }
    catch { flash("Failed to delete user.", "error"); }
    finally { setDeleteId(null); }
  };

  const flash = (msg, type) => {
    if (type === "success") { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); }
    else { setError(msg); setTimeout(() => setError(""), 4000); }
  };

  const initials = name => name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <button className="btn btn-primary" onClick={openAdd}>＋ Add User</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search by name, ID, department…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--gray-400)" }}>
            {filtered.length} user{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">👥</div>
              <p>{search ? "No users match your search." : "No users added yet."}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.user_id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                          width: "34px", height: "34px",
                          borderRadius: "50%",
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: "12px", flexShrink: 0,
                        }}>
                          {initials(user.name)}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === "admin" ? "badge-red" : user.role === "librarian" ? "badge-blue" : "badge-green"}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(user)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(user.user_id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editUser ? "Edit User" : "Add New User"}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Doe" required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="e.g. john@college.edu" required />
                </div>
                <div className="form-group">
                  <label>Password {editUser && <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>(leave blank to keep current)</span>}</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} placeholder={editUser ? "Leave blank to keep current" : "Set a password"} {...(!editUser && { required: true })} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="student">Student</option>
                    <option value="librarian">Librarian</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : editUser ? "Save Changes" : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <span className="modal-title">Remove User</span>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Remove this user from the system? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Remove User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
