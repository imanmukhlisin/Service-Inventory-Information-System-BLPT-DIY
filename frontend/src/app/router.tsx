import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "./AuthContext";

// Placeholders for major pages
import Login from "../features/authorizer/Login";
import BaseLayout from "../components/layout/BaseLayout";
// Admin
import AdminDashboard from "../features/dashboards/AdminDashboard";
import UserList from "../features/users/UserList";
import MechanicList from "../features/mechanics/MechanicList";
import SparePartList from "../features/spare-parts/SparePartList";
// FO & KOPERASI
import TransactionList from "../features/transactions/TransactionList";
import OrderList from "../features/orders/OrderList";
import ReceiptList from "../features/orders/ReceiptList";
import ReportsDashboard from "../features/reports/ReportsDashboard";

// Simple Unauthorized template
const Unauthorized = () => (
  <div style={{ textAlign: "center", padding: "50px" }}>
    <h1 style={{ color: "var(--color-danger)" }}>403 - Akses Ditolak</h1>
    <p>Anda tidak memiliki hak akses untuk halaman ini.</p>
    <a href="/" style={{ color: "var(--color-primary)" }}>
      Kembali ke Beranda
    </a>
  </div>
);

// Root redirector based on role
const RootRedirect = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "front_office":
      return <Navigate to="/front-office/dashboard" replace />;
    case "koperasi":
      return <Navigate to="/koperasi/dashboard" replace />;
    case "kepala_upj":
      return <Navigate to="/kepala-upj/dashboard" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={["admin"]} />,
    children: [
      {
        element: <BaseLayout title="Admin Panel" />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <UserList /> },
          { path: "mechanics", element: <MechanicList /> },
          { path: "spare-parts", element: <SparePartList /> },
        ],
      },
    ],
  },
  {
    path: "/front-office",
    element: <ProtectedRoute allowedRoles={["front_office"]} />,
    children: [
      {
        element: <BaseLayout title="Front Office" />,
        children: [
          { path: "dashboard", element: <div>FO Dashboard</div> },
          { path: "transactions", element: <TransactionList /> },
          { path: "orders", element: <OrderList /> },
          { path: "receipts", element: <ReceiptList /> },
        ],
      },
    ],
  },
  {
    path: "/koperasi",
    element: <ProtectedRoute allowedRoles={["koperasi"]} />,
    children: [
      {
        element: <BaseLayout title="Logistik Koperasi" />,
        children: [
          { path: "dashboard", element: <div>Koperasi Dashboard</div> },
          { path: "orders", element: <OrderList /> },
          { path: "receipts", element: <ReceiptList /> },
        ],
      },
    ],
  },
  {
    path: "/kepala-upj",
    element: <ProtectedRoute allowedRoles={["kepala_upj"]} />,
    children: [
      {
        element: <BaseLayout title="Dashboard Laporan UPJ" />,
        children: [{ path: "dashboard", element: <ReportsDashboard /> }],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
