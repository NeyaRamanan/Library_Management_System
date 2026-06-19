import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role",  res.data.role);
      localStorage.setItem("name",  res.data.name);
      navigate("/");
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.leftPanel}>
        <div style={styles.brandMark}>
          <div style={styles.logoIcon}>🐝</div>
          <div>
            <div style={styles.brandName}>BookHive</div>
            <div style={styles.brandTagline}>Library Management System</div>
          </div>
        </div>

        <div style={styles.heroText}>
          <h2 style={styles.heroHeadline}>Your library,<br />fully organized.</h2>
          <p style={styles.heroSub}>
            Manage books, track issues, handle returns, and monitor your library's resources — all in one place.
          </p>
        </div>

        <div style={styles.features}>
          {[
            { icon: "📚", text: "Book inventory management" },
            { icon: "📤", text: "Issue & return tracking" },
            { icon: "📊", text: "Real-time dashboard stats" },
            { icon: "📋", text: "Complete issue history" },
          ].map(f => (
            <div key={f.text} style={styles.featureItem}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <span style={styles.featureText}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <div style={styles.formHeader}>
            <h1 style={styles.formTitle}>Sign in</h1>
            <p style={styles.formSub}>Enter your credentials to continue</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseOver={e => !loading && (e.currentTarget.style.background = "#2563eb")}
              onMouseOut={e => !loading && (e.currentTarget.style.background = "#3b82f6")}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(145deg, #1e2a3a 0%, #2a3a4f 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "48px 52px",
  },
  brandMark: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    width: "44px", height: "44px",
    background: "#3b82f6",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },
  brandName: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "18px",
    letterSpacing: "-0.01em",
  },
  brandTagline: {
    color: "#64748b",
    fontSize: "12px",
    marginTop: "2px",
  },
  heroText: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heroHeadline: {
    color: "#ffffff",
    fontSize: "38px",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    marginBottom: "16px",
  },
  heroSub: {
    color: "#94a3b8",
    fontSize: "15px",
    lineHeight: 1.7,
    maxWidth: "360px",
  },
  features: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  featureItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  featureIcon: {
    width: "32px", height: "32px",
    background: "#2a3a4f",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    flexShrink: 0,
  },
  featureText: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 500,
  },
  rightPanel: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#f8fafc",
  },
  formCard: {
    width: "100%",
    maxWidth: "380px",
  },
  formHeader: {
    marginBottom: "28px",
  },
  formTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#1e293b",
    letterSpacing: "-0.01em",
    marginBottom: "6px",
  },
  formSub: {
    color: "#64748b",
    fontSize: "14px",
  },
  submitBtn: {
    width: "100%",
    padding: "13px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 700,
    marginTop: "8px",
    transition: "background 0.15s",
    fontFamily: "'Inter', system-ui, sans-serif",
    letterSpacing: "-0.01em",
  },
};

export default Login;
