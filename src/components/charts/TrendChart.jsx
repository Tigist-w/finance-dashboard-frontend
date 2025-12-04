import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
export default function TrendChart({ data }) {
  if (!data) return null;
  return (
    <ResponsiveContainer width="100%" height={300}>
      {" "}
      <LineChart data={data}>
        {" "}
        <XAxis dataKey="month" /> <YAxis /> <Tooltip /> <Legend />{" "}
        <Line type="monotone" dataKey="income" stroke="#4C5FD5" />{" "}
        <Line type="monotone" dataKey="expense" stroke="#E74C3C" />{" "}
      </LineChart>{" "}
    </ResponsiveContainer>
  );
}
