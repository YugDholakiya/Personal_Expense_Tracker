import {
  PieChart, Pie, BarChart, Bar, XAxis, ResponsiveContainer, LabelList, Cell, Tooltip
} from "recharts";
import { useEffect, useState } from "react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December", "All Months"
];

export default function Analysis() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [ref, setRef] = useState(true);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const fetchData = async () => {
    setError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/expense/monthlyAnalysis?month=${selectedMonth}&year=${selectedYear}`,
        { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" }
      );
      if (!response.ok) throw new Error("Could not load analysis data.");
      const info = await response.json();
      if (!info.data) throw new Error(info.message || "No data returned.");
      const raw = info.data.map((el) => ({ name: el.category, value: Number(el.price), type: el.type }));
      const grouped = Object.values(
        raw.reduce((acc, curr) => {
          if (!acc[curr.name]) acc[curr.name] = { name: curr.name, value: 0, type: curr.type };
          acc[curr.name].value += curr.value;
          acc[curr.name].type = curr.type;
          return acc;
        }, {})
      );
      setData(grouped);
    } catch (err) {
      setError(err.message || "Failed to load analysis data.");
    }
  };

  useEffect(() => { fetchData(); }, [ref]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div style={styles.tooltip}>
          <p style={{ fontWeight: 700, color: "#f0f4ff", margin: "0 0 4px" }}>{d.name}</p>
          <p style={{ color: d.type === "expense" ? "#ff6b6b" : "#10d9a0", margin: 0, fontWeight: 600 }}>
            ₹{d.value}
          </p>
          <p style={{ color: "#8fa3c0", fontSize: "0.75rem", margin: "2px 0 0", textTransform: "capitalize" }}>{d.type}</p>
        </div>
      );
    }
    return null;
  };

  const Legend = () => (
    <div style={styles.legend}>
      <span style={styles.legendItem}>
        <span style={{ ...styles.legendDot, background: "#10d9a0" }} /> Income
      </span>
      <span style={styles.legendItem}>
        <span style={{ ...styles.legendDot, background: "#ff6b6b" }} /> Expense
      </span>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.content}>
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Analysis</h1>
          <p style={styles.pageSubtitle}>Visual breakdown of your spending patterns</p>
          <div style={styles.titleUnderline} />
        </div>

        {/* Error banner */}
        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", marginBottom: "20px", background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: "10px", color: "#ff6b6b", fontSize: "0.875rem", fontWeight: 500 }}>
            <span>⚠</span><span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div style={styles.filterCard}>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                style={styles.select}
              >
                {MONTH_NAMES.map((name, i) => (
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
                {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setRef(!ref)}
              style={styles.applyBtn}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,212,255,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              Apply
            </button>

            <button
              onClick={fetchData}
              style={styles.refreshBtn}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Charts */}
        {data.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.4 }}>📊</div>
            <p style={{ color: "#8fa3c0", fontWeight: 600 }}>No data for this period.</p>
            <p style={{ color: "#4a5a73", fontSize: "0.875rem" }}>Try selecting a different month or year.</p>
          </div>
        ) : (
          <div style={styles.chartsGrid}>
            {/* Pie Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>📍 Category Breakdown</h3>
                <Legend />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={110}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.type === "expense" ? "#ff6b6b" : "#10d9a0"}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>📊 Amount by Category</h3>
                <Legend />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barSize={36}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#8fa3c0", fontSize: 12 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.type === "expense" ? "#ff6b6b" : "#10d9a0"}
                      />
                    ))}
                    <LabelList
                      dataKey="value"
                      formatter={(v) => `₹${v}`}
                      position="top"
                      style={{ fill: "rgba(255,255,255,0.65)", fontSize: "11px", fontWeight: 600 }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
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
    background: "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
    top: "-200px",
    left: "-100px",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)",
    bottom: "-100px",
    right: "-100px",
    pointerEvents: "none",
  },
  content: {
    maxWidth: "1200px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },
  pageHeader: {
    marginBottom: "36px",
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
  },
  titleUnderline: {
    width: "48px",
    height: "3px",
    background: "linear-gradient(90deg, #7c3aed, #00d4ff)",
    borderRadius: "2px",
  },
  filterCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px 24px",
    marginBottom: "32px",
  },
  filterRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "16px",
    flexWrap: "wrap",
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
    background: "rgba(255,255,255,0.06)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#f0f4ff",
    fontSize: "0.875rem",
    cursor: "pointer",
    outline: "none",
    minWidth: "140px",
  },
  applyBtn: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #00d4ff, #00b4a0)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.875rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
    alignSelf: "flex-end",
  },
  refreshBtn: {
    padding: "10px 20px",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    color: "#c8d8f0",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s ease",
    alignSelf: "flex-end",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "24px",
    animation: "fadeInUp 0.5s ease both",
  },
  chartCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px 24px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  chartTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#f0f4ff",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  legend: {
    display: "flex",
    gap: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.8rem",
    color: "#8fa3c0",
    fontWeight: 500,
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "3px",
    display: "inline-block",
  },
  tooltip: {
    background: "rgba(13,21,48,0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    padding: "12px 16px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "80px 20px",
    textAlign: "center",
    gap: "8px",
  },
};
