// src/context/AppContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    if (!user) return;
    const res = await api.get("/accounts");
    setAccounts(res.data);
  };

  const fetchTransactions = async () => {
    if (!user) return;
    const res = await api.get("/transactions");
    setTransactions(res.data);
  };

  const refreshData = async () => {
    setLoading(true);
    await Promise.all([fetchAccounts(), fetchTransactions()]);
    setLoading(false);
  };

  useEffect(() => {
    if (user) refreshData();
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        accounts,
        setAccounts,
        transactions,
        setTransactions,
        refreshData,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
