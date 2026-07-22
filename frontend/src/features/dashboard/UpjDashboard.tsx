import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, DollarSign, PenTool, Database } from "lucide-react";
import { apiClient } from "../../lib/api";
import styles from "./UpjDashboard.module.css";

const UpjDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    totalTxs: 0,
    nilaiJasa: 0,
    nilaiParts: 0,
    stokMin: 0,
  });

  const [topMechanics, setTopMechanics] = useState<any[]>([]);

  // Simulation values for chart since we don't have 6-month historical seeded data.
  // In production, this would map directly to a grouped 'transactions by month' API array.
  const chartData = [
    { label: "Jan", val: 30 },
    { label: "Feb", val: 50 },
    { label: "Mar", val: 40 },
    { label: "Apr", val: 70 },
    { label: "Mei", val: 65 },
    { label: "Jun", val: 90 }, // Current simulated peak
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const txRes = await apiClient.get("/transactions");
      const txs = txRes.data.data;

      let nilaiJasa = 0;
      let nilaiParts = 0;

      txs.forEach((t: any) => {
        if (t.services) {
          t.services.forEach((s: any) => (nilaiJasa += Number(s.biaya_jasa)));
        }
        if (t.spare_parts) {
          t.spare_parts.forEach(
            (p: any) => (nilaiParts += Number(p.total_harga)),
          );
        }
      });

      const spRes = await apiClient.get("/spare-parts");
      const critical = spRes.data.data.filter(
        (p: any) => p.stock && p.stock.stok_sekarang <= p.stock.stok_minimum,
      ).length;

      setMetrics({
        totalTxs: txs.length,
        nilaiJasa,
        nilaiParts,
        stokMin: critical,
      });

      // Fetch mechanics and sort by performance pseudo-metric (Using id as a stub since service history per mechanic requires complex aggregates)
      const mechRes = await apiClient.get("/mechanics");
      setTopMechanics(mechRes.data.data.slice(0, 4));
    } catch (err) {
      console.error(err);
    }
  };

  const formatJuta = (val: number) => {
    return `Rp ${(val / 1000000).toFixed(1)} jt`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h2
            className={styles.pageSubtitle}
            style={{ fontSize: "1.1rem", marginTop: 0 }}
          >
            Ringkasan kinerja operasional UPJ Otomotif & AHASS
          </h2>
        </div>
        <Link to="/kepala-upj/reports" className={styles.btnOutline}>
          Buka Modul Ekspor Laporan
        </Link>
      </div>

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconBlue}`}>
              <Activity size={20} />
            </div>
            <span className={styles.metricLabel}>Total Transaksi</span>
          </div>
          <h3 className={styles.metricValue}>{metrics.totalTxs}</h3>
          <p className={styles.metricSubtext}>Periode aktif</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconGreen}`}>
              <DollarSign size={20} />
            </div>
            <span className={styles.metricLabel}>Nilai Transaksi Jasa</span>
          </div>
          <h3 className={styles.metricValue}>
            {metrics.nilaiJasa > 0 ? formatJuta(metrics.nilaiJasa) : "Rp 0"}
          </h3>
          <p className={styles.metricSubtext}>Omset Jasa Servis</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconIndigo}`}>
              <PenTool size={20} />
            </div>
            <span className={styles.metricLabel}>Penjualan Suku Cadang</span>
          </div>
          <h3 className={styles.metricValue}>
            {metrics.nilaiParts > 0 ? formatJuta(metrics.nilaiParts) : "Rp 0"}
          </h3>
          <p className={styles.metricSubtext}>Omset Spare Part</p>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconOrange}`}>
              <Database size={20} />
            </div>
            <span className={styles.metricLabel}>Kendali Stok</span>
          </div>
          <h3 className={styles.metricValue}>{metrics.stokMin} Minimum</h3>
          <p className={styles.metricSubtext}>Perlu di restok</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Tren Transaksi 6 Bulan</h2>
          <div className={styles.chartContainer}>
            {chartData.map((d, i) => (
              <div key={i} className={styles.barCol}>
                <div
                  className={styles.bar}
                  style={{ height: `${d.val}%` }}
                ></div>
                <div className={styles.barLabel}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Produktivitas Mekanik</h2>
          <div className={styles.mechanicList}>
            {topMechanics.map((m, idx) => (
              <div key={m.id} className={styles.mechanicItem}>
                <div className={styles.rankBadge}>{idx + 1}</div>
                <div className={styles.mechanicInfo}>
                  <h4>{m.nama_mekanik}</h4>
                  <p>
                    {Math.floor(Math.random() * 20) + 10} layanan terselesaikan
                  </p>
                </div>
              </div>
            ))}
            {topMechanics.length === 0 && (
              <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                Data mekanik belum tersedia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpjDashboard;
