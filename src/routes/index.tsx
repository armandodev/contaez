import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AuthPage from "../pages/AuthPage";
import Dashboard from "../pages/Dashboard";
import { AuthProvider } from "../context/AuthProvider";
import CreateTransactionPage from "../pages/CreateTransactionPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create/transaction"
            element={
              <PrivateRoute>
                <CreateTransactionPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
