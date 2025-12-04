import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/ui/Table";

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const nav = useNavigate();

  const fetchTxs = async () => {
    try {
      const r = await api.get("/transactions");
      setTxs(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const r = await api.get("/accounts");
      setAccounts(r.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTxs();
    fetchAccounts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      setTxs((prev) => prev.filter((t) => t._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (tx) => {
    nav(`/transactions/edit/${tx._id}`);
  };

  // Dynamic balance
  const getDynamicBalance = (account) => {
    const txList = txs.filter((t) => t.account?._id === account._id);
    return txList.reduce(
      (sum, t) => sum + (t.type === "income" ? t.amount : -t.amount),
      account.balance || 0
    );
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full">
      {/* Header Section */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full">
        <h2 className="text-xl sm:text-2xl font-semibold">Transactions</h2>

        <Link
          to="/transactions/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto text-center"
        >
          New
        </Link>
      </div>

      {/* Table Wrapper */}
      <div className="bg-white p-3 sm:p-4 rounded shadow w-full overflow-x-auto">
        <div className="min-w-[700px]">
          <Table
            columns={[
              {
                title: "Date",
                key: "date",
                render: (r) => new Date(r.date).toLocaleDateString(),
              },
              { title: "Description", key: "description" },
              {
                title: "Category",
                key: "category",
                render: (r) => r.category?.name || "-",
              },
              {
                title: "Account",
                key: "account",
                render: (r) =>
                  r.account
                    ? `${r.account.name} (${getDynamicBalance(
                        r.account
                      ).toFixed(2)})`
                    : "-",
              },
              { title: "Amount", key: "amount" },
              { title: "Type", key: "type" },
              {
                title: "Actions",
                key: "actions",
                render: (r) => (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleEdit(r)}
                      className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 w-full sm:w-auto"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 w-full sm:w-auto"
                    >
                      Delete
                    </button>
                  </div>
                ),
              },
            ]}
            data={txs}
          />
        </div>
      </div>
    </div>
  );
}
