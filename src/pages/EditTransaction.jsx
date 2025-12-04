import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditTransaction() {
  const { id } = useParams();
  const nav = useNavigate();

  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [type, setType] = useState("income");
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, accRes, txRes] = await Promise.all([
          api.get("/categories"),
          api.get("/accounts"),
          api.get(`/transactions/${id}`),
        ]);

        setCategories(catRes.data);
        setAccounts(accRes.data);

        const tx = txRes.data;
        setDescription(tx.description);
        setAmount(tx.amount);
        setCategory(tx.category?._id || "");
        setAccount(tx.account?._id || "");
        setType(tx.type);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !account) {
      setErr("Please select category and account");
      return;
    }

    try {
      await api.put(`/transactions/${id}`, {
        description,
        amount: parseFloat(amount),
        category,
        account, // ✅ FIXED FIELD
        type,
        date: new Date(),
      });

      nav("/transactions");
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to update transaction");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
          Edit Transaction
        </h2>

        {err && <div className="text-red-500 mb-4 text-center">{err}</div>}

        <label className="block mb-4">
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <label className="block mb-4">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </label>

        <label className="block mb-4">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Transaction
        </button>
      </form>
    </div>
  );
}
