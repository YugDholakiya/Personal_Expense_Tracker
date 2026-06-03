import { LineChart, Line, ResponsiveContainer } from "recharts";

const data = [
  { value: 200 },
  { value: 400 },
  { value: 300 },
  { value: 600 },
  { value: 500 },
  { value: 700 }
];

export default function GraphBackground() {
  return (
    <div style={styles.container}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const styles = {
  container: {
    height: "200px",
    opacity: 0.2,
    marginBottom: "20px"
  }
};
