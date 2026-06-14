import { useEffect, useState } from "react";
import api from "../services/api";

function ReturnBook() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [success,     setSuccess]     = useState("");
  const [error,       setError]       = useState("");
  const [returning,   setReturning]   = useState(null); // issue_id in progress
  const [confirm,     setConfirm]     = useState(null); // record to confirm

  const fetchIssuedBooks = () => {
    setLoading(true);
    api.get("/books/issued")
      .then(r => {
        console.log(r.data);
        setIssuedBooks(r.data);
      })
      .catch(() => setError("Failed to load issued books."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchIssuedBooks(); }, []);

  const filtered = issuedBooks.filter(b =>
    [b.title, b.name, String(b.book_id), String(b.issue_id)]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleReturn = async record => {
    setReturning(record.issue_id);
    setConfirm(null);
    try {
      await api.post("/books/return", {
        issue_id: record.issue_id,
        book_id:  record.book_id,
      });
      flash(`"${record.title}" returned successfully.`, "success");
      fetchIssuedBooks();
    } catch (err) {
      flash(err.response?.data?.message || "Error returning book.", "error");
    } finally {
      setReturning(null);
    }
  };

  const flash = (msg, type) => {
    if (type === "success") { setSuccess(msg); setTimeout(() => setSuccess(""), 4000); }
    else { setError(msg); setTimeout(() => setError(""), 4000); }
  };

  const fmtDate = d => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const daysSince = dateStr => Math.floor((Date.now() - new Date(dateStr)) / 86400000);

  const daysUntil = dateStr => Math.ceil((new Date(dateStr) - Date.now()) / 86400000);

  const dueBadge = due_date => {
    if (!due_date) return null;
    const days = daysUntil(due_date);
    if (days < 0)  return <span className="badge badge-red">Overdue by {Math.abs(days)}d</span>;
    if (days <= 3) return <span className="badge badge-amber">Due in {days}d</span>;
    return <span className="badge badge-green">Due in {days}d</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Return Book</h1>
        <span style={{ fontSize: "13px", color: "var(--gray-400)" }}>
          {filtered.length} book{filtered.length !== 1 ? "s" : ""} currently issued
        </span>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search by book title, user name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📥</div>
              <p>{search ? "No records match your search." : "No books are currently issued."}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Issued To</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Days Out</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(book => (
                  <tr key={book.issue_id}>
                    <td style={{ fontWeight: 500 }}>{book.title}</td>
                    <td>{book.name}</td>
                    <td style={{ fontSize: "13px", color: "var(--gray-500)" }}>{fmtDate(book.issue_date)}</td>
                    <td style={{ fontSize: "13px", color: "var(--gray-500)" }}>{fmtDate(book.due_date)}</td>
                    <td>{dueBadge(book.due_date)}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={returning === book.issue_id}
                        onClick={() => setConfirm(book)}
                      >
                        {returning === book.issue_id ? "Returning…" : "📥 Return"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "440px" }}>
            <div className="modal-header">
              <span className="modal-title">Confirm Return</span>
              <button className="modal-close" onClick={() => setConfirm(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ background: "var(--gray-50)", border: "1px solid var(--gray-200)", borderRadius: "var(--radius)", padding: "14px 16px", marginBottom: "14px" }}>
                <div style={{ fontWeight: 600, marginBottom: "4px" }}>{confirm.title}</div>
                <div style={{ fontSize: "13px", color: "var(--gray-500)" }}>Issued to: {confirm.name}</div>
                <div style={{ fontSize: "13px", color: "var(--gray-500)" }}>Issue date: {fmtDate(confirm.issue_date)}</div>
                <div style={{ fontSize: "13px", color: "var(--gray-500)" }}>Due date: {fmtDate(confirm.due_date)}</div>
              </div>
              <p style={{ fontSize: "14px", color: "var(--gray-600)" }}>
                Mark this book as returned today ({fmtDate(new Date())})?
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleReturn(confirm)}>
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReturnBook;
