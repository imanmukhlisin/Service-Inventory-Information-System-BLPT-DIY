import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Wrench, Package, AlertTriangle } from "lucide-react";
import { apiClient } from "../../lib/api";
import styles from "./FODashboard.module.css";

const FODashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    transaksiHariIni: 0,
    layananJasa: 0,
    sukuCadangTerjual: 0,
    stokMinimumCount: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [criticalStocks, setCriticalStocks] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Transactions
      const txRes = await apiClient.get("/transactions");
      const txs = txRes.data.data;

      // Calculate basic metrics from client-side for "Hari Ini"
      const today = new Date().toISOString().split("T")[0];
      let todayTxs = 0;
      let totalParts = 0;

      txs.forEach((tx: any) => {
        if (tx.tanggal.startsWith(today)) {
          todayTxs++;
          totalParts += tx.spare_parts?.length || 0;
        }
      });

      setRecentTransactions(txs.slice(0, 5)); // Latest 5

      // 2. Fetch Stocks
      const spRes = await apiClient.get("/spare-parts");
      const parts = spRes.data.data;

      const critical = parts.filter(
        (p: any) => p.stock && p.stock.stok_sekarang <= p.stock.stok_minimum,
      );
      setCriticalStocks(critical.slice(0, 5)); // Show up to 5 critical items

      setMetrics({
        transaksiHariIni: todayTxs,
        layananJasa: txs.filter(
          (t: any) => t.services?.length > 0 && t.tanggal.startsWith(today),
        ).length,
        sukuCadangTerjual: totalParts,
        stokMinimumCount: critical.length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatJenis = (tx: any) => {
    const hasJasa = tx.services?.length > 0;
    const hasPart = tx.spare_parts?.length > 0;
    if (hasJasa && hasPart) return "Jasa + Suku Cadang";
    if (hasJasa) return "Jasa Servis";
    if (hasPart) return "Suku Cadang";
    return "-";
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h2
          className={styles.pageSubtitle}
          style={{ fontSize: "1.1rem", marginTop: 0 }}
        >
          Aktivitas transaksi operasional hari ini
        </h2>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
              <ShoppingCart size={20} />
            </div>
            <span className={styles.metricLabel}>Transaksi Hari Ini</span>
          </div>
          <h3 className={styles.metricValue}>{metrics.transaksiHariIni}</h3>
          <p className={styles.metricSubtext}>Dihitung dari nota baru</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
              <Wrench size={20} />
            </div>
            <span className={styles.metricLabel}>Layanan Jasa</span>
          </div>
          <h3 className={styles.metricValue}>{metrics.layananJasa}</h3>
          <p className={styles.metricSubtext}>Dilayani mekanik hari ini</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconIndigo}`}>
              <Package size={20} />
            </div>
            <span className={styles.metricLabel}>Suku Cadang Terjual</span>
          </div>
          <h3 className={styles.metricValue}>{metrics.sukuCadangTerjual}</h3>
          <p className={styles.metricSubtext}>Item terjual hari ini</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
              <AlertTriangle size={20} />
            </div>
            <span className={styles.metricLabel}>Stok Minimum</span>
          </div>
          <h3 className={styles.metricValue}>{metrics.stokMinimumCount}</h3>
          <p className={styles.metricSubtext}>Segera buat order stok</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Left Side: Recent Transactions */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Transaksi Terbaru</h2>
          <table className={styles.tableGroup}>
            <thead>
              <tr>
                <th>No. Nota</th>
                <th>Waktu</th>
                <th>Jenis</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td style={{ fontWeight: 600 }}>{tx.nomor_nota}</td>
                  <td>
                    {new Date(tx.tanggal).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{formatJenis(tx)}</td>
                  <td style={{ fontWeight: 600, color: "#0f172a" }}>
                    {formatRupiah(tx.total_harga)}
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      color: "#64748b",
                    }}
                  >
                    Belum ada transaksi hari ini
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Right Side: Stock Warnings */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Suku Cadang Perlu Perhatian</h2>
          <div className={styles.stockList}>
            {criticalStocks.map((p) => (
              <div key={p.id} className={styles.stockItem}>
                <div className={styles.stockDetails}>
                  <h4>{p.nama_suku_cadang}</h4>
                  <p>
                    {p.stock?.stok_sekarang} / min {p.stock?.stok_minimum}
                  </p>
                </div>
                <div className={styles.badgeWarning}>Minimum</div>
              </div>
            ))}
            {criticalStocks.length === 0 && (
              <div
                style={{
                  color: "#16a34a",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                Semua stok aman terkendali.
              </div>
            )}
          </div>

          <button
            className={styles.btnCta}
            onClick={() => navigate("/front-office/transactions")}
          >
            Buat Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
};

export default FODashboard;
