import { useState, useEffect } from "react";

export default function MonthlySummary({ refresh }) {
  const [summary, setSummary] = useState({ budget: 0, income: 0, expense: 0 });
  const [error, setError] = useState("");
  const [ref, setRef] = useState(refresh);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchMonthlySummary();
  }, [ref]);

  const fetchMonthlySummary = async () => {
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/expense/monthly?month=${selectedMonth}&year=${selectedYear}`,
        { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const info = await response.json();
      console.log(info);
      
      // Check if we got valid data
      if (!info.data) {
        throw new Error(info.message || "Could not load monthly summary.");
      }
      
      console.log(info.data.expense);
      setSummary({
        budget: info.data.budget.toFixed(2),
        income: info.data.income.toFixed(2),
        expense: info.data.expense,
      });
      setIsLoaded(true);
    } catch (err) {
      console.error("Monthly summary error:", err);
      setError(err.message);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December", "All Months"
  ];

  const cards = [
    {
      label: "Net Budget",
      value: `₹${summary.budget}`,
      icon: "◈",
      gradient: "linear-gradient(135deg, rgba(96,165,250,0.2) 0%, rgba(124,58,237,0.15) 100%)",
      border: "rgba(96,165,250,0.3)",
      glow: "rgba(96,165,250,0.2)",
      valueCss: { color: "#60a5fa" },
    },
    {
      label: "Total Income",
      value: `₹${summary.income}`,
      icon: "↑",
      gradient: "linear-gradient(135deg, rgba(16,217,160,0.2) 0%, rgba(0,212,255,0.1) 100%)",
      border: "rgba(16,217,160,0.3)",
      glow: "rgba(16,217,160,0.2)",
      valueCss: { color: "#10d9a0" },
    },
    {
      label: "Total Expense",
      value: `₹${summary.expense}`,
      icon: "↓",
      gradient: "linear-gradient(135deg, rgba(255,107,107,0.2) 0%, rgba(124,58,237,0.1) 100%)",
      border: "rgba(255,107,107,0.3)",
      glow: "rgba(255,107,107,0.2)",
      valueCss: { color: "#ff6b6b" },
    },
  ];

  return (
    <div style={styles.wrapper}>
      {error && isLoaded && (
        <div style={styles.errorBanner}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Month</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            style={styles.select}
          >
            {monthNames.map((name, i) => (
              <option key={i} value={i + 1}>{name}</option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={styles.select}
          >
            {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - i).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setRef(!ref)}
          style={styles.applyBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,212,255,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          Apply Filter
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.cardsGrid}>
        {cards.map((card, i) => (
          <div
            key={i}
            style={{
              ...styles.card,
              background: card.gradient,
              borderColor: card.border,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 16px 40px ${card.glow}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
            }}
          >
            <div style={styles.cardIcon}>{card.icon}</div>
            <p style={styles.cardLabel}>{card.label}</p>
            <p style={{ ...styles.cardValue, ...card.valueCss }}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    marginBottom: "32px",
    animation: "fadeInUp 0.5s ease both",
  },
  errorBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", marginBottom: "16px",
    background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "10px", color: "#ff6b6b", fontSize: "0.875rem", fontWeight: 500,
  },
  filterBar: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-end",
    flexWrap: "wrap",
    marginBottom: "28px",
    padding: "20px 24px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  filterLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#8fa3c0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    minWidth: "140px",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  applyBtn: {
    padding: "10px 22px",
    background: "linear-gradient(135deg, #00d4ff, #00b4a0)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
    alignSelf: "flex-end",
    letterSpacing: "0.01em",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid",
    borderRadius: "16px",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
    cursor: "default",
    backdropFilter: "blur(10px)",
  },
  cardIcon: {
    fontSize: "1.8rem",
    marginBottom: "4px",
    opacity: 0.7,
  },
  cardLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: 0,
  },
  cardValue: {
    fontSize: "2rem",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    margin: 0,
  },
};
