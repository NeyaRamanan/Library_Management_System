import { useEffect, useState } from "react";
import api from "../services/api";

const EMPTY_FORM = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  quantity: "",
  available_quantity: "",
};

function Books() {
  const [books,     setBooks]     = useState([]);
  const [search,    setSearch]    = useState("");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editBook,  setEditBook]  = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [saving,    setSaving]    = useState(false);
  const [deleteId,  setDeleteId]  = useState(null);

  const fetchBooks = () => {
    setLoading(true);
    api.get("/books")
      .then(r => setBooks(r.data))
      .catch(() => setError("Failed to load books."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBooks(); }, []);

  const filtered = books.filter(b =>
    [b.title, b.author, b.isbn, b.category]
      .some(f => f?.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd = () => {
    setEditBook(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = book => {
    setEditBook(book);
    setForm({
      title:              book.title,
      author:             book.author,
      isbn:               book.isbn,
      category:           book.category,
      quantity:           book.quantity,
      available_quantity: book.available_quantity,
    });
    setShowModal(true);
  };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editBook) {
        await api.put(`/books/${editBook.book_id}`, form);
        flash("Book updated successfully.", "success");
      } else {
        await api.post("/books", form);
        flash("Book added successfully.", "success");
      }
      setShowModal(false);
      fetchBooks();
    } catch {
      flash("Failed to save book. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/books/${id}`);
      flash("Book deleted.", "success");
      fetchBooks();
    } catch {
      flash("Failed to delete book.", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const flash = (msg, type) => {
    if (type === "success") { setSuccess(msg); setTimeout(() => setSuccess(""), 3000); }
    else { setError(msg); setTimeout(() => setError(""), 4000); }
  };

  const availBadge = (avail, total) => {
    if (!total) return <span className="badge badge-gray">—</span>;
    const pct = avail / total;
    const cls = pct === 0 ? "badge-red" : pct < 0.3 ? "badge-amber" : "badge-green";
    return <span className={`badge ${cls}`}>{avail} / {total}</span>;
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Books</h1>
        <button className="btn btn-primary" onClick={openAdd}>＋ Add Book</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="table-toolbar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              placeholder="Search by title, author, ISBN…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span style={{ fontSize: "13px", color: "var(--gray-400)" }}>
            {filtered.length} book{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div className="loading-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <p>{search ? "No books match your search." : "No books added yet. Add your first book!"}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>ISBN</th>
                  <th>Category</th>
                  <th>Available / Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(book => (
                  <tr key={book.book_id}>
                    <td style={{ fontWeight: 500 }}>{book.title}</td>
                    <td>{book.author}</td>
                    <td><code style={{ fontSize: "12px", color: "var(--blue)" }}>{book.isbn}</code></td>
                    <td><span className="badge badge-gray">{book.category}</span></td>
                    <td>{availBadge(book.available_quantity, book.quantity)}</td>
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(book)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(book.book_id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editBook ? "Edit Book" : "Add New Book"}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Book Title</label>
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Database Systems" required />
                </div>
                <div className="form-group">
                  <label>Author Name</label>
                  <input name="author" value={form.author} onChange={handleChange} placeholder="e.g. Korth" required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="form-group">
                    <label>ISBN Number</label>
                    <input name="isbn" value={form.isbn} onChange={handleChange} placeholder="e.g. 978-3-16-148410-0" required />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Computer Science" required />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="form-group">
                    <label>Total Quantity</label>
                    <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} placeholder="e.g. 5" required />
                  </div>
                  <div className="form-group">
                    <label>Available Quantity</label>
                    <input name="available_quantity" type="number" min={0} value={form.available_quantity} onChange={handleChange} placeholder="e.g. 5" required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving…" : editBook ? "Save Changes" : "Add Book"}
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
              <span className="modal-title">Delete Book</span>
              <button className="modal-close" onClick={() => setDeleteId(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: "var(--gray-600)", fontSize: "14px" }}>
                Are you sure you want to delete this book? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete Book</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
