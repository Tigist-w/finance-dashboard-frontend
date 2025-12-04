import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Your AuthContext.jsx
import api from "../services/api"; // Your services/api.js

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(null);

  const { login } = useContext(AuthContext); // From AuthContext.jsx
  const nav = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErr(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    try {
      if (isLogin) {
        // LOGIN - uses login() from AuthContext.jsx
        await login(email, password);
        nav("/dashboard");
      } else {
        // SIGNUP - calls backend /auth/register from routes/auth.js
        if (!name || !email || !password || !confirmPassword) {
          setErr("All fields are required");
          return;
        }
        if (password !== confirmPassword) {
          setErr("Passwords do not match");
          return;
        }

        const res = await api.post("/auth/register", {
          name,
          email,
          password,
        });

        // Store JWT token in localStorage (services/api.js uses it)
        localStorage.setItem("accessToken", res.data.accessToken);

        // Auto-login after signup
        await login(email, password);
        nav("/dashboard");
      }
    } catch (error) {
      console.error(error);
      setErr(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isLogin ? "Sign In" : "Sign Up"}
        </h2>

        {err && <div className="text-red-500 mb-4 text-center">{err}</div>}

        {!isLogin && (
          <label className="block mb-4">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
        )}

        <label className="block mb-4">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block mb-4">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
            required
          />
        </label>

        {!isLogin && (
          <label className="block mb-6">
            Confirm Password
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </label>
        )}

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4 transition"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={toggleMode}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </form>
    </div>
  );
}
