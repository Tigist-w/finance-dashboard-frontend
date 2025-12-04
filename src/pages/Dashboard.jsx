import React, { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/ui/Card";
import TrendChart from "../components/charts/TrendChart";
import Table from "../components/ui/Table";

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get("/reports/summary");
        setData(r.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Income" value={data ? data.totalIncome : "—"} />
        <Card title="Total Expense" value={data ? data.totalExpense : "—"} />
        <Card
          title="Savings"
          value={data ? data.totalIncome - data.totalExpense : "—"}
        />
        <Card
          title="Net"
          value={data ? data.totalIncome - data.totalExpense : "—"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded shadow overflow-x-auto">
          <h3 className="mb-4 text-lg sm:text-xl font-semibold">
            Financial Trends
          </h3>
          <TrendChart data={data?.trend} />
        </div>
        <div className="bg-white p-4 sm:p-6 rounded shadow overflow-x-auto">
          <h3 className="mb-4 text-lg sm:text-xl font-semibold">
            Expense by Category
          </h3>
          <ul className="space-y-2 text-sm sm:text-base">
            {data?.categoryBreakdown?.map((c) => (
              <li key={c.name} className="flex justify-between">
                <span>{c.name}</span>
                <span>{c.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white p-4 sm:p-6 rounded shadow overflow-x-auto">
        <h3 className="mb-4 text-lg sm:text-xl font-semibold">
          Recent Transactions
        </h3>
        <Table
          columns={[
            {
              title: "Date",
              key: "date",
              render: (r) => new Date(r.date).toLocaleDateString(),
            },
            { title: "Desc", key: "description" },
            {
              title: "Category",
              key: "category",
              render: (r) => r.category?.name,
            },
            { title: "Amount", key: "amount", render: (r) => r.amount },
            { title: "Type", key: "type" },
          ]}
          data={data?.recent || []}
        />
      </div>
    </div>
  );
}
