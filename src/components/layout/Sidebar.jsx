import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded"
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-white border-r p-4 min-h-screen w-64 fixed sm:relative top-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">FinTrack</h2>
        <nav className="space-y-2">
          <Link
            to="/dashboard"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/transactions"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Transactions
          </Link>
          <Link
            to="/accounts"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Accounts
          </Link>
          <Link
            to="/budgets"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Budgets
          </Link>
          <Link
            to="/reports"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Reports
          </Link>
          <Link
            to="/settings"
            className="block px-3 py-2 hover:bg-gray-100 rounded"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-25 sm:hidden z-30"
        />
      )}
    </>
  );
}
