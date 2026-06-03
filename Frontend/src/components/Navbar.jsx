import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const { isLoggedIn, userName, checkAuth, loading } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");
      const info = await response.json();
      await checkAuth(); // Re-sync auth state
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Still navigate to login even if request failed
      await checkAuth();
      navigate("/auth/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  // Links shown to everyone
  const publicLinks = [
    { to: "/", label: "Home", icon: "⌂" },
  ];

  // Links shown only when NOT logged in
  const guestLinks = [
    { to: "/auth/login", label: "Login", icon: "→" },
    { to: "/auth/register", label: "Register", icon: "✦" },
  ];

  // Links shown only when logged in
  const authLinks = [
    { to: "/analysis", label: "Analysis", icon: "◈" },
  ];

  const visibleLinks = [
    ...publicLinks,
    ...(isLoggedIn ? authLinks : guestLinks),
  ];

  if (loading) return (
    <nav style={styles.nav}>
      <div style={styles.logoWrap}>
        <span style={styles.logoIcon}>💰</span>
        <span style={styles.logoText}>ExpenseTracker</span>
      </div>
    </nav>
  );

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logoWrap}>
        <span style={styles.logoIcon}>💰</span>
        <span style={styles.logoText}>ExpenseTracker</span>
      </div>

      {/* Nav links */}
      <div style={styles.links}>
        {visibleLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={styles.linkBase}
            onMouseEnter={() => setHoveredLink(link.to)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span
              style={{
                ...styles.navButton,
                ...(isActive(link.to) ? styles.navButtonActive : {}),
                ...(hoveredLink === link.to && !isActive(link.to) ? styles.navButtonHover : {}),
              }}
            >
              <span style={styles.navIcon}>{link.icon}</span>
              {link.label}
            </span>
          </Link>
        ))}

        {/* Show user greeting + logout only when logged in */}
        {isLoggedIn && (
          <>
            {userName && (
              <span style={styles.userGreeting}>
                👋 {userName}
              </span>
            )}
            <button
              onClick={handleLogout}
              style={styles.logoutButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,107,107,0.2)";
                e.currentTarget.style.color = "#ff6b6b";
                e.currentTarget.style.borderColor = "rgba(255,107,107,0.5)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                e.currentTarget.style.color = "#8fa3c0";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ⏻ Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    height: "68px",
    background: "rgba(10, 15, 30, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(0, 212, 255, 0.1)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcon: {
    fontSize: "1.5rem",
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: 800,
    background: "linear-gradient(135deg, #00d4ff 0%, #00b4a0 50%, #7c3aed 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    letterSpacing: "-0.03em",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  linkBase: {
    textDecoration: "none",
  },
  navButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#8fa3c0",
    background: "transparent",
    border: "1px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.01em",
  },
  navButtonActive: {
    background: "rgba(0, 212, 255, 0.12)",
    color: "#00d4ff",
    border: "1px solid rgba(0, 212, 255, 0.25)",
    boxShadow: "0 0 12px rgba(0, 212, 255, 0.1)",
  },
  navButtonHover: {
    background: "rgba(255,255,255,0.06)",
    color: "#e0eaff",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  navIcon: {
    fontSize: "0.75rem",
    opacity: 0.8,
  },
  userGreeting: {
    padding: "6px 14px",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#00d4ff",
    background: "rgba(0,212,255,0.07)",
    border: "1px solid rgba(0,212,255,0.15)",
    borderRadius: "20px",
    marginLeft: "4px",
  },
  logoutButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#8fa3c0",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginLeft: "8px",
  },
};
