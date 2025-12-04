// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import NewTransaction from "./pages/NewTransaction";
import EditTransaction from "./pages/EditTransaction";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

function PrivateLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RoutesWrapper />
      </AppProvider>
    </AuthProvider>
  );
}

// Separate component to consume AuthContext safely
function RoutesWrapper() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
      />
      <Route
        path="/dashboard"
        element={
          <PrivateLayout>
            <Dashboard />
          </PrivateLayout>
        }
      />
      <Route
        path="/transactions"
        element={
          <PrivateLayout>
            <Transactions />
          </PrivateLayout>
        }
      />
      <Route
        path="/transactions/new"
        element={
          <PrivateLayout>
            <NewTransaction />
          </PrivateLayout>
        }
      />
      <Route
        path="/transactions/edit/:id"
        element={
          <PrivateLayout>
            <EditTransaction />
          </PrivateLayout>
        }
      />
      <Route
        path="/accounts"
        element={
          <PrivateLayout>
            <Accounts />
          </PrivateLayout>
        }
      />
      <Route
        path="/budgets"
        element={
          <PrivateLayout>
            <Budgets />
          </PrivateLayout>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateLayout>
            <Reports />
          </PrivateLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateLayout>
            <Settings />
          </PrivateLayout>
        }
      />
    </Routes>
  );
}
