import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }
      navigate("/auth/verifyEmail");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.orb1} />
      <div style={styles.orb2} />
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.iconWrap}>
            <span style={styles.headerIcon}>✦</span>
          </div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Start tracking your finances today</p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span style={styles.errorIcon}>⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { name: "name", type: "text", placeholder: "Your full name", label: "Full Name", icon: "👤" },
            { name: "email", type: "email", placeholder: "you@example.com", label: "Email Address", icon: "✉" },
            { name: "password", type: "password", placeholder: "Choose a strong password", label: "Password", icon: "🔒" },
          ].map((field) => (
            <div key={field.name} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}</label>
              <div style={styles.inputWrap}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={styles.inputIcon}>{field.icon}</span>
                <input type={field.type} name={field.name} placeholder={field.placeholder}
                  value={form[field.name]} onChange={handleChange} required style={styles.input} />
              </div>
            </div>
          ))}

          <button type="submit" disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,212,255,0.35)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,212,255,0.2)"; }}
          >
            {isLoading ? "Creating Account…" : "Create Account ✦"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/auth/login" style={styles.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0f1a38 100%)",
    display: "flex", justifyContent: "center", alignItems: "center",
    padding: "20px", position: "relative", overflow: "hidden",
  },
  orb1: {
    position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)",
    top: "-100px", left: "-100px", pointerEvents: "none",
  },
  orb2: {
    position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
    bottom: "-80px", right: "-80px", pointerEvents: "none",
  },
  card: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
    padding: "48px 40px", width: "100%", maxWidth: "420px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
    animation: "fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1) both",
  },
  header: { textAlign: "center", marginBottom: "32px" },
  iconWrap: {
    width: "56px", height: "56px", borderRadius: "16px",
    background: "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,212,255,0.2) 100%)",
    border: "1px solid rgba(124,58,237,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px", fontSize: "1.5rem",
  },
  headerIcon: {
    background: "linear-gradient(135deg, #7c3aed, #00d4ff)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    backgroundClip: "text", fontWeight: 800,
  },
  title: { fontSize: "1.75rem", fontWeight: 800, color: "#f0f4ff", marginBottom: "8px", letterSpacing: "-0.03em" },
  subtitle: { fontSize: "0.9rem", color: "#8fa3c0" },
  errorBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", marginBottom: "20px",
    background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "10px", color: "#ff6b6b", fontSize: "0.875rem", fontWeight: 500,
  },
  errorIcon: { fontSize: "1rem", flexShrink: 0 },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.8rem", fontWeight: 600, color: "#8fa3c0", textTransform: "uppercase", letterSpacing: "0.06em" },
  inputWrap: {
    display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "0 14px", transition: "all 0.25s ease",
  },
  inputIcon: { fontSize: "0.9rem", marginRight: "10px", opacity: 0.5, userSelect: "none" },
  input: { flex: 1, padding: "13px 0", background: "transparent", border: "none", color: "#f0f4ff", fontSize: "0.9rem", outline: "none" },
  button: {
    padding: "15px", marginTop: "8px",
    background: "linear-gradient(135deg, #7c3aed 0%, #00b4a0 50%, #00d4ff 100%)",
    color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer",
    fontSize: "1rem", fontWeight: 700, letterSpacing: "0.01em",
    boxShadow: "0 4px 20px rgba(0,212,255,0.2)", transition: "all 0.25s ease",
  },
  footerText: { textAlign: "center", marginTop: "28px", fontSize: "0.875rem", color: "#8fa3c0" },
  footerLink: { color: "#00d4ff", fontWeight: 600, textDecoration: "none" },
};
