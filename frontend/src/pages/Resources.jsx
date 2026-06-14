import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY_FORM = { title: "", category: "", file_url: "" };

const CATEGORY_COLORS = {
  Journal: "badge-blue", Magazine: "badge-green", "E-Book": "badge-blue",
  Manual: "badge-gray", "Reference Book": "badge-amber", "CD/DVD": "badge-gray",
};

function Resources() {
  const [resources, setResources] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [search,    setSearch]    = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);

  const fetchResources = () => {
    setLoading(true);
    api.get("/resources")
      .then(r => setResources(r.data))
      .catch(() => setError("Failed to load resources."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchResources(); }, []);

  const categories = ["All", ...new Set(resources.map(r => r.category).filter(Boolean))];

  const filtered = resources.filter(r => {
    const matchSearch = [r.title, r.category]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()));
    const matchCat = catFilter === "All" || r.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/resources", form);
      flash("Resource added successfully.", "success");
      setShowModal(false);
      setForm(EMPTY_FORM);
      fetchResources();
    } catch {
      flash("Failed to add resource.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/resources/${id}`);
      flash("Resource deleted.", "success");
      fetchResources();
    } catch {
      flash("Failed to delete resource.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const flash = (msg, type) => {
    if (type === "success") { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); }
    else { setError(msg); setTimeout(() => setError(""), 4000); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Digital Resources</h1>
        <button className="btn btn-primary" onClick={() => { setForm(EMPTY_FORM); setShowModal(true); }}>
          ＋ Add Resource
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-toolbar" style={{ flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                placeholder="Search resources…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              style={{ padding: "9px 12px", borderRadius: "var(--radius)", border: "1.5px solid var(--gray-200)", fontSize: "13px", color: "var(--gray-700)", cursor: "pointer", background: "var(--white)" }}
            >
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <span style={{ fontSize: "13px", color: "var(--gray-400)" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🗂️</div>
              <p>{search ? "No resources match your search." : "No resources added yet."}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>File URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(resource => (
                  <tr key={resource.resource_id}>
                    <td style={{ fontWeight: 500 }}>{resource.title}</td>
                    <td>
                      <span className={`badge ${CATEGORY_COLORS[resource.category] || "badge-gray"}`}>
                        {resource.category}
                      </span>
                    </td>
                    <td>
                      {resource.file_url ? (
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "var(--blue)", fontSize: "13px", textDecoration: "none" }}
                        >
                          🔗 Open Resource
                        </a>
                      ) : (
                        <span style={{ color: "var(--gray-300)", fontSize: "13px" }}>No link</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(resource.resource_id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Add New Resource</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Resource Title</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Introduction to Algorithms" required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. E-Book, Journal, Magazine" required />
                </div>
                <div className="form-group">
                  <label>File URL <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>(optional)</span></label>
                  <input name="file_url" type="url" value={form.file_url} onChange={handleChange} placeholder="https://example.com/file.pdf" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Adding…" : "Add Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "420px" }}>
            <div className="modal-header">
              <span className="modal-title">Delete Resource</span>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Delete this resource? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Resources;
