import { useState } from "react";

const CATEGORIES = [
  "Food", "Transport", "Rent", "Utilities", "Shopping",
  "Health", "Education", "Entertainment", "Travel", "EMI/Loan", "Savings", "Other"
];

const CATEGORY_ICONS = {
  Food: "🍔", Transport: "🚗", Rent: "🏠", Utilities: "⚡", Shopping: "🛍",
  Health: "❤️", Education: "📚", Entertainment: "🎬", Travel: "✈️",
  "EMI/Loan": "💳", Savings: "🏦", Other: "📦"
};

export default function ExpenseForm({ refresh, setRefresh }) {
  const initialForm = { title: "", price: "", type: "expense", category: "Food", date: "" };
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/expense/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: form.title, price: form.price, type: form.type, category: form.category, date: form.date }),
      });
      const info = await response.json();
      if (!response.ok || !info.title) {
        throw new Error(info.message || "Failed to add transaction.");
      }
      setSuccessMsg("Transaction added successfully!");
      setForm(initialForm);
      setRefresh(!refresh);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isExpense = form.type === "expense";

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.errorBanner}><span>⚠</span><span>{error}</span></div>
      )}
      {successMsg && (
        <div style={styles.successBanner}><span>✓</span><span>{successMsg}</span></div>
      )}
      <div style={styles.cardHeader}>
        <div style={{ ...styles.typeIndicator, background: isExpense ? "rgba(255,107,107,0.15)" : "rgba(16,217,160,0.15)", borderColor: isExpense ? "rgba(255,107,107,0.3)" : "rgba(16,217,160,0.3)" }}>
          <span style={{ fontSize: "1.3rem" }}>{isExpense ? "↓" : "↑"}</span>
        </div>
        <div>
          <h3 style={styles.title}>Add Transaction</h3>
          <p style={styles.subtitle}>Log a new income or expense</p>
        </div>
      </div>

      <form onSubmit={submitHandler} style={styles.form}>
        {/* Title */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Title</label>
          <input
            name="title"
            placeholder="e.g. Grocery shopping"
            value={form.title}
            onChange={handleChange}
            required
            style={styles.input}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        {/* Amount */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Amount (₹)</label>
          <input
            name="price"
            type="number"
            placeholder="0.00"
            value={form.price}
            onChange={handleChange}
            required
            style={{ ...styles.input, fontWeight: 700, fontSize: "1.1rem" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        {/* Type Toggle */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Type</label>
          <div style={styles.typeToggle}>
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                style={{
                  ...styles.typeBtn,
                  ...(form.type === t
                    ? t === "expense"
                      ? styles.typeBtnExpenseActive
                      : styles.typeBtnIncomeActive
                    : {}),
                }}
              >
                {t === "expense" ? "↓ Expense" : "↑ Income"}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Category</label>
          <select name="category" value={form.category} onChange={handleChange} style={styles.select}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Date</label>
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            style={styles.input}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,212,255,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.submitBtn,
            background: isExpense
              ? "linear-gradient(135deg, #ff6b6b, #ee0979)"
              : "linear-gradient(135deg, #10d9a0, #00b4a0)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.92"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
        >
          {isLoading ? "Adding..." : `Add ${form.type === "expense" ? "Expense" : "Income"}`}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    padding: "28px",
    maxWidth: "480px",
    margin: "0 auto 28px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    animation: "fadeInUp 0.5s ease 0.1s both",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "28px",
  },
  typeIndicator: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    border: "1px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    flexShrink: 0,
    transition: "all 0.3s ease",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#f0f4ff",
    margin: 0,
    letterSpacing: "-0.02em",
  },
  subtitle: {
    fontSize: "0.8rem",
    color: "#8fa3c0",
    margin: "2px 0 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#8fa3c0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    padding: "12px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#f0f4ff",
    fontSize: "0.9rem",
    outline: "none",
    transition: "all 0.25s ease",
  },
  select: {
    padding: "12px 14px",
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#f0f4ff",
    fontSize: "0.9rem",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 0.25s ease",
  },
  typeToggle: {
    display: "flex",
    gap: "10px",
  },
  typeBtn: {
    flex: 1,
    padding: "11px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: "10px",
    color: "#8fa3c0",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  typeBtnExpenseActive: {
    background: "rgba(255,107,107,0.12)",
    borderColor: "rgba(255,107,107,0.4)",
    color: "#ff6b6b",
  },
  typeBtnIncomeActive: {
    background: "rgba(16,217,160,0.12)",
    borderColor: "rgba(16,217,160,0.4)",
    color: "#10d9a0",
  },
  errorBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 14px", marginBottom: "16px",
    background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "10px", color: "#ff6b6b", fontSize: "0.85rem", fontWeight: 500,
  },
  successBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "10px 14px", marginBottom: "16px",
    background: "rgba(16,217,160,0.1)", border: "1px solid rgba(16,217,160,0.3)",
    borderRadius: "10px", color: "#10d9a0", fontSize: "0.85rem", fontWeight: 500,
  },
  submitBtn: {
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "6px",
    transition: "all 0.25s ease",
    letterSpacing: "0.01em",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },
};
