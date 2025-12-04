import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1d4ed8", "#dc2626", "#f59e0b", "#10b981", "#8b5cf6"];

export default function Reports() {
  const [trend, setTrend] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recent, setRecent] = useState([]);
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpense: 0 });

  const fetchReport = async () => {
    try {
      const res = await api.get("/reports/summary");
      setTrend(res.data.trend);
      setCategoryBreakdown(res.data.categoryBreakdown);
      setRecent(res.data.recent);
      setTotals({
        totalIncome: res.data.totalIncome,
        totalExpense: res.data.totalExpense,
      });
    } catch (e) {
      console.error("Failed to fetch report", e);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
        Reports
      </h2>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded shadow text-center">
          <h3 className="text-lg font-medium mb-2">Total Income</h3>
          <p className="text-2xl sm:text-3xl font-semibold text-green-600">
            ${totals.totalIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded shadow text-center">
          <h3 className="text-lg font-medium mb-2">Total Expense</h3>
          <p className="text-2xl sm:text-3xl font-semibold text-red-600">
            ${totals.totalExpense.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white p-4 sm:p-6 rounded shadow mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
          Last 6 Months Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trend}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expense" fill="#dc2626" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-4 sm:p-6 rounded shadow mb-8">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
          Expense by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryBreakdown}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {categoryBreakdown.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions */}
      <div className="overflow-x-auto bg-white p-4 sm:p-6 rounded shadow">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">
          Recent Transactions
        </h3>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Type</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((tx) => (
              <tr key={tx._id}>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  {new Date(tx.date).toLocaleDateString()}
                </td>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  {tx.description}
                </td>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  {tx.category?.name || "Uncategorized"}
                </td>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  ${tx.amount.toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  {tx.type}
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-sm sm:text-base"
                >
                  No recent transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CSV Export */}
      <div className="text-center mt-6">
        <button
          onClick={() => {
            const csvContent =
              "data:text/csv;charset=utf-8," +
              ["Date,Description,Category,Amount,Type"]
                .concat(
                  recent.map(
                    (tx) =>
                      `${new Date(tx.date).toLocaleDateString()},${
                        tx.description
                      },${tx.category?.name || "Uncategorized"},${tx.amount},${
                        tx.type
                      }`
                  )
                )
                .join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "transactions_report.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
