import React, { useEffect, useState } from "react";
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

  useEffect(() => {
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
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.metricsGrid}>
        {/* Card 1 */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div
              className={styles.metricIconWrap}
              style={{ background: "#0284c7" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <line x1="20" y1="8" x2="20" y2="14"></line>
                <line x1="23" y1="11" x2="17" y2="11"></line>
              </svg>
            </div>
            <h3 className={styles.metricTitle}>Pengguna Aktif</h3>
          </div>
          <div>
            <p className={styles.metricValue}>{metrics.users_total}</p>
            <p className={styles.metricSubtext}>4 peran pengguna</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div
              className={styles.metricIconWrap}
              style={{ background: "#059669" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <h3 className={styles.metricTitle}>Mekanik Aktif</h3>
          </div>
          <div>
            <p className={styles.metricValue}>{metrics.mechanics_total}</p>
            <p className={styles.metricSubtext}>Seluruh mekanik terdaftar</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div
              className={styles.metricIconWrap}
              style={{ background: "#2563eb" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="9" y1="21" x2="9" y2="9"></line>
              </svg>
            </div>
            <h3 className={styles.metricTitle}>Jenis Suku Cadang</h3>
          </div>
          <div>
            <p className={styles.metricValue}>{metrics.spare_parts_total}</p>
            <p className={styles.metricSubtext}>24 kategori</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className={styles.metricCard}>
          <div className={styles.metricTop}>
            <div
              className={styles.metricIconWrap}
              style={{ background: "#d97706" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3 className={styles.metricTitle}>Stok Minimum</h3>
          </div>
          <div>
            <p className={styles.metricValue}>{metrics.low_stock_count}</p>
            <p className={styles.metricSubtext}>Perlu ditindaklanjuti</p>
          </div>
        </div>
      </div>

      <div className={styles.chartsGrid}>
        {/* Recent Activity Panel */}
        <div className={styles.chartPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Aktivitas Terbaru</h2>
          </div>
          <div className={styles.panelContent} style={{ padding: 0 }}>
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Aktivitas</th>
                  <th>Petugas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>08.12</td>
                  <td>Menambah data suku cadang</td>
                  <td>Admin</td>
                </tr>
                <tr>
                  <td>09.05</td>
                  <td>Memperbarui data mekanik</td>
                  <td>Admin</td>
                </tr>
                <tr>
                  <td>10.20</td>
                  <td>Menonaktifkan akun lama</td>
                  <td>Admin</td>
                </tr>
                <tr>
                  <td>11.08</td>
                  <td>Mengubah batas stok minimum</td>
                  <td>Admin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Master Data Status Panel */}
        <div className={styles.chartPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Status Data Master</h2>
          </div>
          <div className={styles.panelContent}>
            <div className={styles.statusWidget}>
              <div>
                <p className={styles.statusLabel}>
                  Kelengkapan data suku cadang
                </p>
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: "87%" }}
                  ></div>
                </div>
                <p className={styles.progressText}>87%</p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <p className={styles.statusLabel}>Akun pengguna aktif</p>
                <h3 className={styles.statusValue}>
                  {metrics.users_total} dari {metrics.users_total + 1} akun
                </h3>
                <span className={styles.statusBadge}>1 Tidak Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
