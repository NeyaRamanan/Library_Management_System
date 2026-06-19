import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { path: "/",         label: "Dashboard",    icon: "📊" },
  { path: "/books",    label: "Books",        icon: "📚" },
  { path: "/users",    label: "Users",        icon: "👥" },
  { path: "/issue",    label: "Issue Book",   icon: "📤" },
  { path: "/return",   label: "Return Book",  icon: "📥" },
  { path: "/resources",label: "Resources",    icon: "🗂️" },
  { path: "/history",  label: "Issue History",icon: "📋" },
];

function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const name = localStorage.getItem("name") || "Admin";
  const role = localStorage.getItem("role") || "Librarian";
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoIcon}>🐝</div>
        <div>
          <div style={styles.logoText}>BookHive</div>
          <div style={styles.logoSub}>Library Management</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(active ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
              {active && <span style={styles.activeDot} />}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={styles.divider} />

      {/* User card */}
      <div style={styles.userCard}>
        <div style={styles.avatar}>{initials}</div>
        <div style={styles.userInfo}>
          <div style={styles.userName}>{name}</div>
          <div style={styles.userRole}>{role}</div>
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={styles.logoutBtn}>
        <span>🚪</span>
        <span>Log Out</span>
      </button>
    </div>
  );
}

const styles = {
  sidebar: {
    position: "fixed",
    top: 0, left: 0,
    width: "250px",
    height: "100vh",
    background: "#1e2a3a",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 20px 0",
    overflowY: "auto",
    zIndex: 100,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 20px 20px",
  },
  logoIcon: {
    width: "40px", height: "40px",
    background: "#3b82f6",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  logoText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "16px",
    letterSpacing: "-0.01em",
  },
  logoSub: {
    color: "#64748b",
    fontSize: "11px",
    marginTop: "1px",
  },
  divider: {
    height: "1px",
    background: "#2a3a4f",
    margin: "0 20px 8px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    padding: "8px 12px",
    gap: "2px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.15s",
    position: "relative",
  },
  navItemActive: {
    background: "#2a3a4f",
    color: "#ffffff",
  },
  navIcon: {
    fontSize: "16px",
    width: "20px",
    textAlign: "center",
  },
  activeDot: {
    width: "6px", height: "6px",
    background: "#3b82f6",
    borderRadius: "50%",
    marginLeft: "auto",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    margin: "8px 12px 4px",
    background: "#2a3a4f",
    borderRadius: "8px",
  },
  avatar: {
    width: "34px", height: "34px",
    background: "#3b82f6",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "13px",
    flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: "hidden" },
  userName: {
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    color: "#64748b",
    fontSize: "11px",
    textTransform: "capitalize",
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    margin: "4px 12px 0",
    padding: "10px",
    background: "transparent",
    border: "1px solid #2a3a4f",
    borderRadius: "8px",
    color: "#64748b",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.15s",
  },
};

export default Sidebar;
