import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function VerifyEmail() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", otp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verifyEmail`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid OTP. Please try again.");
      }
      setSuccess("Email verified! Redirecting to login…");
      setTimeout(() => navigate("/auth/login"), 1500);
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
            <span style={{ fontSize: "1.6rem" }}>📬</span>
          </div>
          <h2 style={styles.title}>Verify Your Email</h2>
          <p style={styles.subtitle}>Enter the OTP sent to your inbox</p>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={styles.successBanner}>
            <span>✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrap}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={styles.inputIcon}>✉</span>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required style={styles.input} />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>One-Time Password</label>
            <div style={styles.inputWrap}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <span style={styles.inputIcon}>🔑</span>
              <input type="text" name="otp" placeholder="Enter 6-digit OTP"
                value={form.otp} onChange={handleChange} required
                style={{ ...styles.input, letterSpacing: "0.3em", fontSize: "1.1rem" }} />
            </div>
          </div>

          <button type="submit" disabled={isLoading} style={{ ...styles.button, opacity: isLoading ? 0.7 : 1 }}
            onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,212,255,0.35)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,212,255,0.2)"; }}
          >
            {isLoading ? "Verifying…" : "Verify Email ✓"}
          </button>
        </form>

        <p style={styles.footerText}>
          Back to <Link to="/auth/login" style={styles.footerLink}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0f1e 0%, #0d1530 50%, #0f1a38 100%)",
    display: "flex", justifyContent: "center", alignItems: "center",
    padding: "20px", position: "relative", overflow: "hidden",
  },
  orb1: {
    position: "absolute", width: "400px", height: "400px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,180,160,0.08) 0%, transparent 70%)",
    top: "-100px", right: "-100px", pointerEvents: "none",
  },
  orb2: {
    position: "absolute", width: "300px", height: "300px", borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
    bottom: "-80px", left: "-80px", pointerEvents: "none",
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
    width: "64px", height: "64px", borderRadius: "20px",
    background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,180,160,0.15) 100%)",
    border: "1px solid rgba(0,212,255,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 20px",
  },
  title: { fontSize: "1.75rem", fontWeight: 800, color: "#f0f4ff", marginBottom: "8px", letterSpacing: "-0.03em" },
  subtitle: { fontSize: "0.9rem", color: "#8fa3c0" },
  errorBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", marginBottom: "20px",
    background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "10px", color: "#ff6b6b", fontSize: "0.875rem", fontWeight: 500,
  },
  successBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", marginBottom: "20px",
    background: "rgba(16,217,160,0.1)", border: "1px solid rgba(16,217,160,0.3)",
    borderRadius: "10px", color: "#10d9a0", fontSize: "0.875rem", fontWeight: 500,
  },
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
    background: "linear-gradient(135deg, #00d4ff 0%, #00b4a0 100%)",
    color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer",
    fontSize: "1rem", fontWeight: 700, letterSpacing: "0.01em",
    boxShadow: "0 4px 20px rgba(0,212,255,0.2)", transition: "all 0.25s ease",
  },
  footerText: { textAlign: "center", marginTop: "28px", fontSize: "0.875rem", color: "#8fa3c0" },
  footerLink: { color: "#00d4ff", fontWeight: 600, textDecoration: "none" },
};
