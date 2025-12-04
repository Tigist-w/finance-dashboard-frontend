import React from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = React.useContext(AuthContext);

  return (
    <header className="bg-white border-b p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="text-lg font-semibold">Finance Dashboard</div>
        <div className="text-sm text-gray-500">Monthly overview</div>
      </div>

      <div className="flex items-center gap-4 mt-2 sm:mt-0 w-full sm:w-auto justify-start sm:justify-end">
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-500 text-white rounded w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
