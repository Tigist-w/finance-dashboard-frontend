import React, { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState(null);
  const [summary, setSummary] = useState([]);
  const [txs, setTxs] = useState([]);

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets", { params: { month } });
      setBudgets(res.data);
    } catch (e) {
      console.error("Failed to fetch budgets", e);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setTxs(res.data);
    } catch (e) {
      console.error("Failed to fetch transactions", e);
    }
  };

  const fetchSummary = () => {
    const monthTxs = txs.filter(
      (t) => t.type === "expense" && t.date.startsWith(month)
    );
    const summaryData = budgets.map((b) => {
      const spent = monthTxs
        .filter((t) => t.category?._id === b.categoryId?._id)
        .reduce((acc, t) => acc + t.amount, 0);
      return {
        _id: b._id,
        category: b.categoryId?.name,
        limit: b.limit,
        spent,
      };
    });
    setSummary(summaryData);
  };

  useEffect(() => {
    fetchCategories();
    fetchBudgets();
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [budgets, txs, month]);

  const resetForm = () => {
    setCategoryId("");
    setLimit("");
    setEditingId(null);
    setErr(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryId || !month || !limit) {
      setErr("All fields are required");
      return;
    }
    try {
      if (editingId) {
        await api.put(`/budgets/${editingId}`, { categoryId, month, limit });
      } else {
        await api.post("/budgets", { categoryId, month, limit });
      }
      resetForm();
      await fetchBudgets();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save budget");
    }
  };

  const handleEdit = (b) => {
    setCategoryId(b.categoryId?._id || "");
    setMonth(b.month || "");
    setLimit(b.limit || "");
    setEditingId(b._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await api.delete(`/budgets/${id}`);
      await fetchBudgets();
    } catch (e) {
      console.error("Failed to delete budget", e);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Budgets</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-md mx-auto mb-8"
      >
        {err && <div className="text-red-500 mb-4 text-center">{err}</div>}

        <label className="block mb-4">
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>

        <label className="block mb-4">
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-6">
          Limit
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Update Budget" : "Add Budget"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white shadow rounded border-collapse sm:border-separate sm:border-spacing-0">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-2 sm:px-4 py-2 border">Month</th>
              <th className="px-2 sm:px-4 py-2 border">Category</th>
              <th className="px-2 sm:px-4 py-2 border">Limit</th>
              <th className="px-2 sm:px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b._id} className="text-sm sm:text-base">
                <td className="px-2 sm:px-4 py-2 border">{b.month}</td>
                <td className="px-2 sm:px-4 py-2 border">
                  {b.categoryId?.name}
                </td>
                <td className="px-2 sm:px-4 py-2 border">{b.limit}</td>
                <td className="px-2 sm:px-4 py-2 border space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleEdit(b)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {budgets.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  No budgets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Chart */}
      <h3 className="text-xl font-semibold mb-4 text-center">
        Budget vs Spending
      </h3>
      <div className="bg-white p-4 sm:p-6 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="limit" fill="#1d4ed8" name="Budget Limit" />
            <Bar dataKey="spent" fill="#dc2626" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
