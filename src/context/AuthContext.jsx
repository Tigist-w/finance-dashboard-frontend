import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const r = await api.get("/auth/me");
        setUser(r.data.user);
      } catch (err) {
        console.log("Auto-login failed:", err);
        localStorage.removeItem("accessToken");
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Login
  const login = async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", r.data.accessToken);
    setUser(r.data.user);
    return r.data;
  };

  // Signup
  const signup = async (name, email, password) => {
    const r = await api.post("/auth/signup", { name, email, password });
    localStorage.setItem("accessToken", r.data.accessToken);
    setUser(r.data.user);
    return r.data;
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {}
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
