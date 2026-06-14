import { useEffect, useState } from "react";
import api from "../services/api";

function today() {
  return new Date().toISOString().split("T")[0];
}

function IssueBook() {
  const [books,      setBooks]      = useState([]);
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");

  const [form, setForm] = useState({
    user_id:    "",
    book_id:    "",
    issue_date: today(),
    due_date:   "",
  });

  const selectedBook = books.find(b => String(b.book_id) === String(form.book_id));
  const selectedUser = users.find(u => String(u.user_id) === String(form.user_id));

  useEffect(() => {
    Promise.all([api.get("/books"), api.get("/users")])
      .then(([bRes, uRes]) => { setBooks(bRes.data); setUsers(uRes.data); })
      .catch(() => setError("Failed to load books/users."))
      .finally(() => setLoading(false));
  }, []);

  const availableBooks = books.filter(b => b.available_quantity > 0);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.book_id || !form.user_id) { setError("Please select both a book and a user."); return; }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/books/issue", form);
      setSuccess(`"${selectedBook?.title}" issued to ${selectedUser?.name} successfully.`);
      setForm({ user_id: "", book_id: "", issue_date: today(), due_date: "" });
      const bRes = await api.get("/books");
      setBooks(bRes.data);
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to issue book. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Issue Book</h1>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontWeight: 700, marginBottom: "20px", fontSize: "15px", color: "var(--gray-700)" }}>
              Issue Details
            </h3>

            {loading ? (
              <div className="loading-wrap"><div className="spinner" /></div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Select User</label>
                  <select name="user_id" value={form.user_id} onChange={handleChange} required>
                    <option value="">— Choose a user —</option>
                    {users.map(u => (
                      <option key={u.user_id} value={u.user_id}>
                        {u.name} — {u.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Select Book</label>
                  <select name="book_id" value={form.book_id} onChange={handleChange} required>
                    <option value="">— Choose a book —</option>
                    {availableBooks.map(b => (
                      <option key={b.book_id} value={b.book_id}>
                        {b.title} — {b.author} ({b.available_quantity} available)
                      </option>
                    ))}
                  </select>
                  {availableBooks.length === 0 && (
                    <span style={{ fontSize: "12px", color: "var(--amber)" }}>
                      ⚠️ No books currently available for issue.
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="form-group">
                    <label>Issue Date</label>
                    <input type="date" name="issue_date" value={form.issue_date} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Due Date</label>
                    <input type="date" name="due_date" value={form.due_date} onChange={handleChange} required />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || availableBooks.length === 0}
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                >
                  {submitting ? "Issuing…" : "📤  Issue Book"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Book Preview */}
          <div className="card">
            <div className="card-body">
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Selected Book
              </div>
              {selectedBook ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{selectedBook.title}</div>
                  <div style={{ color: "var(--gray-500)", fontSize: "13px", marginBottom: "8px" }}>{selectedBook.author}</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span className="badge badge-gray">{selectedBook.category}</span>
                    <span className="badge badge-green">{selectedBook.available_quantity} available</span>
                  </div>
                </>
              ) : (
                <div style={{ color: "var(--gray-300)", fontSize: "13px" }}>No book selected</div>
              )}
            </div>
          </div>

          {/* User Preview */}
          <div className="card">
            <div className="card-body">
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Selected User
              </div>
              {selectedUser ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>{selectedUser.name}</div>
                  <div style={{ color: "var(--gray-500)", fontSize: "13px", marginBottom: "8px" }}>{selectedUser.email}</div>
                  <span className={`badge ${selectedUser.role === "admin" ? "badge-red" : selectedUser.role === "librarian" ? "badge-blue" : "badge-green"}`}>
                    {selectedUser.role}
                  </span>
                </>
              ) : (
                <div style={{ color: "var(--gray-300)", fontSize: "13px" }}>No user selected</div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card">
            <div className="card-body">
              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "12px" }}>
                Availability
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                <span style={{ color: "var(--gray-600)" }}>Available books</span>
                <span style={{ fontWeight: 700, color: "var(--green)" }}>{availableBooks.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--gray-600)" }}>Total users</span>
                <span style={{ fontWeight: 700 }}>{users.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IssueBook;
