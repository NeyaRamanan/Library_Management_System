import { useEffect, useState } from "react";
import api from "../services/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");

  useEffect(() => {
    api.get("/history")
      .then(r => setHistory(r.data))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = history.filter(item => {
    const matchSearch = [String(item.user_id), String(item.book_id), item.status]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchFilter = filter === "All" || item.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    All:      history.length,
    Issued:   history.filter(i => i.status === "Issued").length,
    Returned: history.filter(i => i.status === "Returned").length,
  };

  const fmtDate = d => d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

  const daysUntil = dateStr => Math.ceil((new Date(dateStr) - Date.now()) / 86400000);

  const dueBadge = (due_date, status) => {
    if (status === "Returned") return <span className="badge badge-green">✓ Returned</span>;
    if (!due_date) return <span className="badge badge-amber">📤 Issued</span>;
    const days = daysUntil(due_date);
    if (days < 0)  return <span className="badge badge-red">Overdue by {Math.abs(days)}d</span>;
    if (days <= 3) return <span className="badge badge-amber">Due in {days}d</span>;
    return <span className="badge badge-blue">Due in {days}d</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Issue History</h1>
        <span style={{ fontSize: "13px", color: "var(--gray-400)" }}>
          {history.length} total record{history.length !== 1 ? "s" : ""}
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {["All", "Issued", "Returned"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: "7px 16px",
              borderRadius: "999px",
              border: "1.5px solid",
              borderColor: filter === tab ? "var(--blue)" : "var(--gray-200)",
              background:  filter === tab ? "var(--blue)" : "var(--white)",
              color:       filter === tab ? "var(--white)" : "var(--gray-600)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {tab}
            <span style={{
              background: filter === tab ? "rgba(255,255,255,0.25)" : "var(--gray-100)",
              color:      filter === tab ? "var(--white)" : "var(--gray-500)",
              borderRadius: "999px",
              padding: "1px 7px",
              fontSize: "11px",
              fontWeight: 700,
            }}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search by user ID, book ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--gray-400)" }}>
            Showing {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p>{search ? "No records match your search." : "No history records found."}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>User ID</th>
                  <th>Book ID</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item.issue_id}>
                    <td><span style={{ fontSize: "13px", fontWeight: 600, color: "var(--blue)" }}>#{item.issue_id}</span></td>
                    <td><span style={{ fontSize: "13px", color: "var(--gray-600)" }}>{item.user_id}</span></td>
                    <td><span style={{ fontSize: "13px", color: "var(--gray-600)" }}>{item.book_id}</span></td>
                    <td style={{ fontSize: "13px", color: "var(--gray-500)" }}>{fmtDate(item.issue_date)}</td>
                    <td style={{ fontSize: "13px", color: "var(--gray-500)" }}>{fmtDate(item.due_date)}</td>
                    <td>{dueBadge(item.due_date, item.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
