import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wrench,
  Package,
  ShoppingCart,
  FileText,
  Menu,
  X,
  Users,
} from "lucide-react";
import { useAuth } from "../../app/AuthContext";
import styles from "./BaseLayout.module.css";

interface BaseLayoutProps {
  title: string;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const getMenuByRole = () => {
    const role = user?.role;
    const menu = [];

    // All Roles typically have Dashboard
    menu.push({ path: "dashboard", icon: LayoutDashboard, label: "Dashboard" });

    if (role === "admin") {
      menu.push({ path: "users", icon: Users, label: "Data Pengguna" });
      menu.push({ path: "mechanics", icon: Wrench, label: "Data Mekanik" });
      menu.push({
        path: "spare-parts",
        icon: Package,
        label: "Master Suku Cadang",
      });
    } else if (role === "front_office") {
      menu.push({
        path: "transactions",
        icon: ShoppingCart,
        label: "Transaksi Baru",
      });
      menu.push({ path: "stocks", icon: Package, label: "Informasi Stok" });
      menu.push({ path: "orders", icon: FileText, label: "Order ke Koperasi" });
    } else if (role === "koperasi") {
      menu.push({ path: "orders", icon: FileText, label: "Pesanan Masuk" });
      menu.push({
        path: "receipts",
        icon: Package,
        label: "Penerimaan Barang",
      });
    } else if (role === "kepala_upj") {
      menu.push({
        path: "reports/services",
        icon: Wrench,
        label: "Laporan Jasa",
      });
      menu.push({
        path: "reports/sales",
        icon: ShoppingCart,
        label: "Laporan Penjualan",
      });
      menu.push({
        path: "reports/stocks",
        icon: Package,
        label: "Laporan Stok",
      });
    }

    return menu;
  };

  return (
    <div className={styles.layoutWrapper}>
      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? "" : styles.sidebarClosed}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            {isSidebarOpen && (
              <>
                <img
                  src="/logo-blpt.png"
                  alt="Logo BLPT DIY"
                  className={styles.sidebarLogo}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span>BLPT DIY</span>
                <small>UPJ Otomotif & AHASS</small>
              </>
            )}
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {getMenuByRole().map((item, idx) => (
            <NavLink
              key={idx}
              to={`/${user?.role.replace("_", "-")}/${item.path}`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              {item.icon && <item.icon size={20} />}
              {isSidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div
            className={styles.navItem}
            style={{
              pointerEvents: "none",
              color: "white",
              marginBottom: "8px",
              fontSize: "13px",
              padding: "12px 16px",
              fontWeight: "bold",
            }}
          >
            {isSidebarOpen && <span>Admin</span>}
          </div>
          <button onClick={logout} className={styles.logoutBtn}>
            {isSidebarOpen && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.menuToggle}
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.userInfoPill}>
              <div className={styles.avatar}>
                {user?.nama_user
                  .split(" ")
                  .map((n) => n.charAt(0))
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <span className={styles.userName}>{user?.nama_user}</span>
            </div>
          </div>
        </header>

        {/* Page Content Map point */}
        <div className={styles.contentCanvas}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default BaseLayout;
