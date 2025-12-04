import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Settings() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("expense");
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName("");
    setType("expense");
    setEditingId(null);
    setErr(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return setErr("Category name required");
    try {
      if (editingId) {
        const res = await api.put(`/categories/${editingId}`, { name, type });
        setCategories((prev) =>
          prev.map((c) => (c._id === editingId ? res.data : c))
        );
      } else {
        const res = await api.post("/categories", { name, type });
        setCategories((prev) => [...prev, res.data]);
      }
      resetForm();
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to save category");
    }
  };

  const handleEdit = (c) => {
    setName(c.name);
    setType(c.type);
    setEditingId(c._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">
        Category Management
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-6 md:p-8 rounded shadow max-w-md mx-auto mb-6"
      >
        {err && <p className="text-red-500 mb-2 text-center">{err}</p>}
        <label className="block mb-2">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full border rounded px-3 py-2 mt-1"
          />
        </label>

        <label className="block mb-4">
          Type
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="block w-full border rounded px-3 py-2 mt-1"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>

        <button className="w-full bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded hover:bg-blue-700 transition-colors">
          {editingId ? "Update" : "Add"} Category
        </button>
      </form>

      {/* Category Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-2 sm:px-4 py-2 border">Name</th>
              <th className="px-2 sm:px-4 py-2 border">Type</th>
              <th className="px-2 sm:px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id}>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  {c.name}
                </td>
                <td className="px-2 sm:px-4 py-2 border text-sm sm:text-base">
                  {c.type}
                </td>
                <td className="px-2 sm:px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-sm sm:text-base"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
