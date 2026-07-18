import React, { useEffect, useState } from "react";
import {
  Users,
  Wrench,
  Package,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { apiClient } from "../../lib/api";
import styles from "./AdminDashboard.module.css";

interface DashboardMetrics {
  users_total: number;
  mechanics_total: number;
  spare_parts_total: number;
  low_stock_count: number;
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    users_total: 0,
    mechanics_total: 0,
    spare_parts_total: 0,
    low_stock_count: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Parallel data fetching for the dashboard metrics
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get("/dashboard/admin/stats");
        const stats = response.data.data;

        setMetrics({
          users_total: stats.users_total || 0,
          mechanics_total: stats.mechanics_total || 0,
          spare_parts_total: stats.spare_parts_total || 0,
          low_stock_count: stats.low_stock_count || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard metrics", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Memuat Data Dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard Administrator</h1>
        <p className={styles.subtitle}>
          Ringkasan operasional sistem UPJ Otomotif & AHASS BLPT DIY.
        </p>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div
            className={styles.metricIconWrap}
            style={{ background: "#DBEAFE", color: "#1E3A8A" }}
          >
            <Users size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3 className={styles.metricTitle}>Total Pengguna</h3>
            <p className={styles.metricValue}>{metrics.users_total}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIconWrap}
            style={{ background: "#E0E7FF", color: "#1E40AF" }}
          >
            <Wrench size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3 className={styles.metricTitle}>Total Mekanik</h3>
            <p className={styles.metricValue}>{metrics.mechanics_total}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIconWrap}
            style={{ background: "#D1FAE5", color: "#3730A3" }}
          >
            <Package size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3 className={styles.metricTitle}>Katalog Suku Cadang</h3>
            <p className={styles.metricValue}>{metrics.spare_parts_total}</p>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div
            className={styles.metricIconWrap}
            style={{ background: "#FEE2E2", color: "#B91C1C" }}
          >
            <AlertTriangle size={24} />
          </div>
          <div className={styles.metricInfo}>
            <h3 className={styles.metricTitle}>Peringatan Stok Tipis</h3>
            <p className={styles.metricValue}>{metrics.low_stock_count}</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        <div className={styles.chartPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Aktivitas Sistem Terkini</h2>
            <TrendingUp size={20} color="#6B7280" />
          </div>
          <div className={styles.panelContent}>
            <div className={styles.emptyState}>
              <p>
                Data aktivitas akan muncul setelah transaksi dilakukan oleh
                Front Office atau Koperasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
