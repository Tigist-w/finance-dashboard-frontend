import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function NewTransaction({ onCreated }) {
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [type, setType] = useState("income");
  const [err, setErr] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [catRes, accRes] = await Promise.all([
          api.get("/categories"),
          api.get("/accounts"),
        ]);
        setCategories(catRes.data);
        setAccounts(accRes.data);
      } catch (e) {
        console.error("Failed to fetch categories or accounts", e);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !account) {
      setErr("Please select a category and an account");
      return;
    }

    try {
      const res = await api.post("/transactions", {
        description,
        amount: parseFloat(amount),
        category,
        account, // ✅ FIXED FIELD
        type,
        date: new Date(),
      });

      // Update parent list immediately if callback provided
      if (onCreated) onCreated(res.data);

      // Navigate back to Transactions page
      nav("/transactions");
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to create transaction");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          New Transaction
        </h2>

        {err && <div className="text-red-500 mb-4 text-center">{err}</div>}

        <label className="block mb-4">
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>

        <label className="block mb-4">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>

        <label className="block mb-4">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

        <label className="block mb-4">
          Account
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select account</option>
            {accounts.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name} ({a.type})
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-6">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create
        </button>
      </form>
    </div>
  );
}
