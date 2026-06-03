import { useState } from "react";

const TYPE_COLORS = {
  income: { color: "#10d9a0", bg: "rgba(16,217,160,0.12)", border: "rgba(16,217,160,0.3)" },
  expense: { color: "#ff6b6b", bg: "rgba(255,107,107,0.12)", border: "rgba(255,107,107,0.3)" },
};

export default function TransactionList({ refresh, setRefresh }) {
  const [transactions, setTransactions] = useState([]);
  const [sortOption, setSortOption] = useState("all");
  const [error, setError] = useState("");

  async function myTransaction() {
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/expense/`, {
        method: "GET", credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const info = await response.json();
      if (!info.title) throw new Error(info.message || "Could not load transactions.");

      const arr = Array.isArray(info.data) ? info.data : [];
      arr.forEach((el) => {
        el.date = new Date(el.date).toLocaleDateString();
      });
      setTransactions(arr);
    } catch (err) {
      setError(err.message || "Failed to load transactions.");
    }
  }

  const myTransactionThisMonth = async () => {
    setError("");
    try {
      const d = new Date();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/expense/month?month=${d.getMonth() + 1}&year=${d.getFullYear()}`,
        { method: "GET", credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      const info = await response.json();
      if (!info.title) throw new Error(info.message || "Could not load this month's transactions.");
      info.data.forEach((el) => { el.date = new Date(el.date).toLocaleDateString(); });
      setTransactions([...info.data]);
    } catch (err) {
      setError(err.message || "Failed to load transactions.");
    }
  };

  const getSortedTransactions = () => {
    let sorted = [...transactions];
    if (sortOption === "amount-desc") sorted.sort((a, b) => b.price - a.price);
    else if (sortOption === "amount-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sortOption === "income") sorted = sorted.filter((t) => t.type === "income");
    else if (sortOption === "expense") sorted = sorted.filter((t) => t.type === "expense");
    return sorted;
  };

  const myDelete = async (e) => {
    const id = e.currentTarget.dataset.id;
    const index = Number(e.currentTarget.dataset.index);
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/expense/${id}`, {
        method: "DELETE", credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!data.success) throw new Error("Failed to delete transaction.");
      const updated = [...transactions];
      updated.splice(index, 1);
      setTransactions(updated);
      setRefresh(!refresh);
    } catch (err) {
      setError(err.message || "Could not delete transaction.");
    }
  };

  const sortedTxs = getSortedTransactions();

  return (
    <div style={styles.container}>
      {error && (
        <div style={styles.errorBanner}>
          <span>⚠</span>
          <span>{error}</span>
          <button onClick={() => setError("")} style={styles.errorClose}>✕</button>
        </div>
      )}
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>Recent Transactions</h3>
          <p style={styles.subtitle}>{transactions.length} total entries loaded</p>
        </div>
        <div style={styles.loadBtns}>
          <button
            onClick={myTransaction}
            style={styles.loadBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.15)"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            ⊞ All Transactions
          </button>
          <button
            onClick={myTransactionThisMonth}
            style={styles.loadBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,212,255,0.15)"; e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            📅 This Month
          </button>
        </div>
      </div>

      {/* Sort Bar */}
      <div style={styles.sortBar}>
        <span style={styles.sortLabel}>Sort by</span>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={styles.sortSelect}
        >
          <option value="all">All Transactions</option>
          <option value="amount-desc">Amount: High → Low</option>
          <option value="amount-asc">Amount: Low → High</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>
        {transactions.length > 0 && (
          <span style={styles.countBadge}>{sortedTxs.length} shown</span>
        )}
      </div>

      {transactions.length > 0 ? (
        <div style={styles.tableWrap}>
          {/* Column headers */}
          <div style={styles.columnHeaders}>
            <span style={{ flex: 2 }}>Title</span>
            <span style={{ flex: 1 }}>Type</span>
            <span style={{ flex: 1 }}>Category</span>
            <span style={{ flex: 1, textAlign: "right" }}>Amount</span>
            <span style={{ flex: 1, textAlign: "center" }}>Date</span>
            <span style={{ flex: 1, textAlign: "center" }}>Action</span>
          </div>

          {/* Rows */}
          {sortedTxs.map((item, index) => {
            const tc = TYPE_COLORS[item.type] || TYPE_COLORS.expense;
            return (
              <div
                key={index}
                style={styles.row}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ flex: 2, fontWeight: 500, color: "#e0eaff" }}>{item.title}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ ...styles.typeBadge, color: tc.color, background: tc.bg, borderColor: tc.border }}>
                    {item.type === "income" ? "↑" : "↓"} {item.type}
                  </span>
                </span>
                <span style={{ flex: 1, color: "#8fa3c0", fontSize: "0.85rem" }}>{item.category}</span>
                <span style={{ flex: 1, textAlign: "right", fontWeight: 700, color: tc.color, fontSize: "1rem" }}>
                  ₹{item.price}
                </span>
                <span style={{ flex: 1, textAlign: "center", color: "#8fa3c0", fontSize: "0.85rem" }}>{item.date}</span>
                <span style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                  <button
                    data-id={item._id}
                    data-index={index}
                    onClick={myDelete}
                    style={styles.deleteBtn}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,107,107,0.2)"; e.currentTarget.style.borderColor = "rgba(255,107,107,0.5)"; e.currentTarget.style.color = "#ff6b6b"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#8fa3c0"; }}
                  >
                    🗑
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <p style={styles.emptyText}>No transactions loaded yet.</p>
          <p style={styles.emptySubtext}>Click a load button above to fetch your data.</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  errorBanner: {
    display: "flex", alignItems: "center", gap: "10px",
    padding: "12px 16px", marginBottom: "20px",
    background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)",
    borderRadius: "10px", color: "#ff6b6b", fontSize: "0.875rem", fontWeight: 500,
  },
  errorClose: {
    marginLeft: "auto", background: "none", border: "none",
    color: "#ff6b6b", cursor: "pointer", fontSize: "0.9rem", padding: "0 4px",
  },
  container: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    backdropFilter: "blur(12px)",
    padding: "28px",
    maxWidth: "860px",
    margin: "0 auto",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    animation: "fadeInUp 0.5s ease 0.2s both",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
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
  loadBtns: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  loadBtn: {
    padding: "9px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#c8d8f0",
    fontSize: "0.825rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.01em",
  },
  sortBar: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "14px 16px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  sortLabel: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#8fa3c0",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    whiteSpace: "nowrap",
  },
  sortSelect: {
    flex: 1,
    padding: "9px 12px",
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    cursor: "pointer",
    outline: "none",
    minWidth: "180px",
  },
  countBadge: {
    padding: "4px 10px",
    background: "rgba(0,212,255,0.1)",
    border: "1px solid rgba(0,212,255,0.2)",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#00d4ff",
  },
  tableWrap: {
    display: "flex",
    flexDirection: "column",
  },
  columnHeaders: {
    display: "flex",
    padding: "10px 14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "8px 8px 0 0",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#8fa3c0",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    gap: "8px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    gap: "8px",
    transition: "background 0.2s ease",
    borderRadius: "0",
  },
  typeBadge: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "0.75rem",
    fontWeight: 700,
    border: "1px solid",
    textTransform: "capitalize",
  },
  deleteBtn: {
    width: "34px",
    height: "34px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#8fa3c0",
    fontSize: "0.95rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "60px 20px",
    gap: "12px",
  },
  emptyIcon: {
    fontSize: "3rem",
    opacity: 0.4,
    marginBottom: "8px",
  },
  emptyText: {
    color: "#8fa3c0",
    fontWeight: 600,
    fontSize: "1rem",
    margin: 0,
  },
  emptySubtext: {
    color: "#4a5a73",
    fontSize: "0.875rem",
    margin: 0,
    textAlign: "center",
  },
};
