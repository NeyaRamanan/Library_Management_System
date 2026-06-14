import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboardApi";
import { Link } from "react-router-dom";

const STAT_CONFIG = [
  { key: "totalBooks",    label: "Total Books",    icon: "📚", accent: "#3b82f6", iconBg: "#dbeafe", textColor: "#1d4ed8" },
  { key: "availableBooks",label: "Available",      icon: "✅", accent: "#10b981", iconBg: "#d1fae5", textColor: "#065f46" },
  { key: "issuedBooks",   label: "Issued Books",   icon: "📤", accent: "#f59e0b", iconBg: "#fde68a", textColor: "#92400e" },
  { key: "totalUsers",    label: "Total Users",    icon: "👥", accent: "#8b5cf6", iconBg: "#ede9fe", textColor: "#5b21b6" },
];

const QUICK_ACTIONS = [
  { label: "Issue a Book",  to: "/issue",   icon: "📤", accent: "#3b82f6", bg: "#eff6ff" },
  { label: "Return a Book", to: "/return",  icon: "📥", accent: "#10b981", bg: "#ecfdf5" },
  { label: "Manage Books",  to: "/books",   icon: "📚", accent: "#f59e0b", bg: "#fffbeb" },
  { label: "View History",  to: "/history", icon: "📋", accent: "#8b5cf6", bg: "#f5f3ff" },
  { label: "Manage Users",  to: "/users",   icon: "👥", accent: "#ef4444", bg: "#fef2f2" },
  { label: "Resources",     to: "/resources",icon: "🗂️",accent: "#06b6d4", bg: "#ecfeff" },
];

function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(data => setStats(data))
      .catch(() => setError("Failed to load stats. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const utilizationPct = stats
    ? Math.round((stats.issuedBooks / (stats.totalBooks || 1)) * 100)
    : 0;

  const availablePct = stats
    ? Math.round(((stats.availableBooks ?? (stats.totalBooks - stats.issuedBooks)) / (stats.totalBooks || 1)) * 100)
    : 0;

  const name = localStorage.getItem("name") || "Admin";

  return (
    <div className="page">

      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--gray-800)", marginBottom: "4px" }}>
              👋 Welcome back, {name}
            </h1>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff", border: "1px solid var(--gray-200)", borderRadius: "var(--radius)", padding: "8px 14px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: "13px", color: "var(--gray-600)", fontWeight: 500 }}>System Online</span>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="stats-grid">
            {STAT_CONFIG.map(cfg => (
              <div key={cfg.key} style={{
                background: "#fff",
                borderRadius: "var(--radius-lg)",
                padding: "24px",
                boxShadow: "var(--shadow-sm)",
                border: "1px solid var(--gray-200)",
                borderLeft: `4px solid ${cfg.accent}`,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--gray-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {cfg.label}
                  </span>
                  <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                    {cfg.icon}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "32px", fontWeight: 800, color: "var(--gray-800)", lineHeight: 1 }}>
                    {stats?.[cfg.key] ?? "—"}
                  </div>
                  <div style={{ fontSize: "12px", color: cfg.textColor, fontWeight: 600, marginTop: "6px", background: cfg.iconBg, display: "inline-block", padding: "2px 8px", borderRadius: "999px" }}>
                    {cfg.key === "availableBooks" ? `${availablePct}% of collection` :
                     cfg.key === "issuedBooks"    ? `${utilizationPct}% utilization` :
                     cfg.key === "totalBooks"     ? `${stats?.issuedBooks ?? 0} issued` :
                                                    `registered users`}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row: Utilization + Quick Actions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "24px", alignItems: "start" }}>

            {/* Utilization Card */}
            <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-200)" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--gray-700)", marginBottom: "20px" }}>
                📊 Collection Overview
              </div>

              {/* Issued bar */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--gray-500)", fontWeight: 500 }}>Books Issued</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#f59e0b" }}>{utilizationPct}%</span>
                </div>
                <div style={{ height: "8px", background: "var(--gray-100)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${utilizationPct}%`, height: "100%", background: "linear-gradient(90deg, #f59e0b, #d97706)", borderRadius: "999px", transition: "width 0.8s ease" }} />
                </div>
              </div>

              {/* Available bar */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "var(--gray-500)", fontWeight: 500 }}>Available</span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#10b981" }}>{availablePct}%</span>
                </div>
                <div style={{ height: "8px", background: "var(--gray-100)", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${availablePct}%`, height: "100%", background: "linear-gradient(90deg, #10b981, #059669)", borderRadius: "999px", transition: "width 0.8s ease" }} />
                </div>
              </div>

              {/* Summary row */}
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { label: "Total",     value: stats?.totalBooks   ?? 0, color: "#3b82f6" },
                  { label: "Issued",    value: stats?.issuedBooks  ?? 0, color: "#f59e0b" },
                  { label: "Available", value: stats?.availableBooks ?? (stats?.totalBooks - stats?.issuedBooks) ?? 0, color: "#10b981" },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, textAlign: "center", background: "var(--gray-50)", borderRadius: "var(--radius)", padding: "10px 8px" }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: "11px", color: "var(--gray-400)", fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background: "#fff", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)", border: "1px solid var(--gray-200)" }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--gray-700)", marginBottom: "16px" }}>
                ⚡ Quick Actions
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                {QUICK_ACTIONS.map(action => (
                  <Link
                    key={action.to}
                    to={action.to}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      padding: "16px 8px",
                      background: action.bg,
                      border: `1.5px solid transparent`,
                      borderRadius: "var(--radius)",
                      textDecoration: "none",
                      color: "var(--gray-700)",
                      fontSize: "12px",
                      fontWeight: 600,
                      transition: "all 0.15s",
                      textAlign: "center",
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = action.accent; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow)"; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <span style={{ fontSize: "22px" }}>{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
