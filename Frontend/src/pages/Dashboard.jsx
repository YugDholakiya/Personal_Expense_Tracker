import ExpenseForm from "../components/ExpenseForm";
import TransactionList from "../components/TransactionList";
import MonthlySummary from "../components/MonthlySummary";
import { useState } from "react";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={styles.container}>
      {/* Background gradient blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.content}>
        {/* Page heading */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>Track, manage, and analyse your finances</p>
          <div style={styles.titleUnderline} />
        </div>

        {/* Monthly Summary at top */}
        <section style={styles.section}>
          <MonthlySummary refresh={refresh} />
        </section>

        {/* Add Expense + Transaction List side by side on wide screens */}
        <div style={styles.mainGrid}>
          <section style={styles.section}>
            <ExpenseForm refresh={refresh} setRefresh={setRefresh} />
          </section>
          <section style={{ ...styles.section, flex: 1.5, minWidth: 0 }}>
            <TransactionList refresh={refresh} setRefresh={setRefresh} />
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0a0f1e 0%, #0d1530 60%, #0f1a38 100%)",
    color: "#f0f4ff",
    padding: "32px 24px",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed",
    width: "600px",
    height: "600px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)",
    top: "10%",
    right: "-200px",
    pointerEvents: "none",
    zIndex: 0,
  },
  blob2: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
    bottom: "-100px",
    left: "-100px",
    pointerEvents: "none",
    zIndex: 0,
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  pageHeader: {
    marginBottom: "40px",
  },
  pageTitle: {
    fontSize: "2.5rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    background: "linear-gradient(135deg, #f0f4ff 0%, #8fa3c0 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
    lineHeight: 1,
  },
  pageSubtitle: {
    color: "#8fa3c0",
    fontSize: "0.95rem",
    marginTop: "8px",
    marginBottom: "16px",
    fontWeight: 400,
  },
  titleUnderline: {
    width: "48px",
    height: "3px",
    background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
    borderRadius: "2px",
  },
  section: {
    position: "relative",
  },
  mainGrid: {
    display: "flex",
    gap: "28px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
};
