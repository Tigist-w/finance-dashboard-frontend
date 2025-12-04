import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Accounts() {
  const [accs, setAccs] = useState([]);
  const [txs, setTxs] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [currency, setCurrency] = useState("USD");
  const [balance, setBalance] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState(null);

  // Fetch accounts and transactions
  const fetchAccounts = async () => {
    try {
      const r = await api.get("/accounts");
      setAccs(r.data);
    } catch (e) {
      console.error("Failed to fetch accounts:", e);
    }
  };

  const fetchTransactions = async () => {
    try {
      const r = await api.get("/transactions");
      setTxs(r.data);
    } catch (e) {
      console.error("Failed to fetch transactions:", e);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, []);

  const getDynamicBalance = (account) => {
    const accountTxs = txs.filter((t) => t.account?._id === account._id);
    const txBalance = accountTxs.reduce(
      (acc, t) =>
        acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount)),
      0
    );
    return (Number(account.balance) || 0) + txBalance;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/accounts/${editingId}`, {
          name,
          type,
          currency,
          balance,
        });
        setAccs((prev) =>
          prev.map((a) =>
            a._id === editingId ? { ...a, name, type, currency, balance } : a
          )
        );
      } else {
        const res = await api.post("/accounts", {
          name,
          type,
          currency,
          balance,
        });
        setAccs((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save account");
    }
  };

  const resetForm = () => {
    setName("");
    setType("checking");
    setCurrency("USD");
    setBalance(0);
    setEditingId(null);
    setErr(null);
  };

  const handleEdit = (acc) => {
    setName(acc.name);
    setType(acc.type);
    setCurrency(acc.currency);
    setBalance(acc.balance || 0);
    setEditingId(acc._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this account?"))
      return;
    try {
      await api.delete(`/accounts/${id}`);
      setAccs((prev) => prev.filter((a) => a._id !== id));
      setTxs((prev) => prev.filter((t) => t.account?._id !== id));
    } catch (e) {
      console.error("Failed to delete account:", e);
    }
  };

  const handleTransactionChange = async () => {
    await fetchAccounts();
    await fetchTransactions();
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Accounts</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 rounded-xl shadow-md max-w-md mx-auto mb-8"
      >
        {err && <div className="text-red-500 mb-4 text-center">{err}</div>}

        <label className="block mb-4">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>

        <label className="block mb-4">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit</option>
          </select>
        </label>

        <label className="block mb-4">
          Currency
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ETB">ETB</option>
          </select>
        </label>

        <label className="block mb-6">
          Initial Balance
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {editingId ? "Update Account" : "Add Account"}
        </button>
      </form>

      {/* Account table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded border-collapse sm:border-separate sm:border-spacing-0">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-2 sm:px-4 py-2 border">Name</th>
              <th className="px-2 sm:px-4 py-2 border">Type</th>
              <th className="px-2 sm:px-4 py-2 border">Currency</th>
              <th className="px-2 sm:px-4 py-2 border">Balance</th>
              <th className="px-2 sm:px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {accs.map((a) => (
              <tr key={a._id} className="text-sm sm:text-base">
                <td className="px-2 sm:px-4 py-2 border">{a.name}</td>
                <td className="px-2 sm:px-4 py-2 border">{a.type}</td>
                <td className="px-2 sm:px-4 py-2 border">{a.currency}</td>
                <td className="px-2 sm:px-4 py-2 border">
                  {getDynamicBalance(a).toFixed(2)}
                </td>
                <td className="px-2 sm:px-4 py-2 border space-x-1 sm:space-x-2">
                  <button
                    onClick={() => handleEdit(a)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 text-xs sm:text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
