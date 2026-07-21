import React, { useState } from "react";
import { Wrench, ShoppingBag, Package, DownloadCloud } from "lucide-react";
import { apiClient } from "../../lib/api";
import Swal from "sweetalert2";
import styles from "./ReportsDashboard.module.css";

const ReportsDashboard: React.FC = () => {
  // Default dates: Current month
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const currentDay = today.toISOString().split("T")[0];

  const [dateService, setDateService] = useState({
    start: firstDay,
    end: currentDay,
  });
  const [dateSales, setDateSales] = useState({
    start: firstDay,
    end: currentDay,
  });
  const [stockFilter, setStockFilter] = useState("all");

  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleDownload = async (
    endpoint: string,
    params: any,
    filename: string,
    loadingKey: string,
  ) => {
    try {
      setIsLoading(loadingKey);
      const res = await apiClient.get(endpoint, {
        params: { ...params, export: "pdf" },
        responseType: "blob",
      });

      // Construct dummy element to trigger browser download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Laporan ${filename} telah diunduh.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal Mengunduh Laporan",
        text: "Terjadi kesalahan sistem atau akses ditolak.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard Laporan Eksekutif</h1>
        <p className={styles.pageSubtitle}>
          Panel export laporan PDF resmi untuk Kepala UPJ
        </p>
      </div>

      <div className={styles.cardsContainer}>
        {/* REPORT: Jasa Servis */}
        <div className={styles.reportCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconServices}`}>
              <Wrench size={24} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Laporan Jasa Servis</h2>
              <p className={styles.cardDesc}>
                Rekapitulasi transaksi layanan montir
              </p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Rentang Waktu</label>
            <div className={styles.formControls}>
              <input
                type="date"
                className={styles.formInput}
                value={dateService.start}
                onChange={(e) =>
                  setDateService({ ...dateService, start: e.target.value })
                }
              />
              <input
                type="date"
                className={styles.formInput}
                value={dateService.end}
                onChange={(e) =>
                  setDateService({ ...dateService, end: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.cardFooter}>
            <button
              className={`${styles.btnAction} ${styles.btnDownload} ${styles.btnServices}`}
              disabled={isLoading === "services"}
              onClick={() =>
                handleDownload(
                  "/reports/services",
                  { start_date: dateService.start, end_date: dateService.end },
                  `Laporan_Jasa_Servis_${dateService.start}_${dateService.end}.pdf`,
                  "services",
                )
              }
            >
              <DownloadCloud size={18} />
              {isLoading === "services"
                ? "Membangun PDF..."
                : "Unduh Laporan (PDF)"}
            </button>
          </div>
        </div>

        {/* REPORT: Penjualan Suku Cadang */}
        <div className={styles.reportCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconSales}`}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Laporan Penjualan</h2>
              <p className={styles.cardDesc}>
                Rekap pendapatan suku cadang dari Front Office
              </p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Rentang Waktu</label>
            <div className={styles.formControls}>
              <input
                type="date"
                className={styles.formInput}
                value={dateSales.start}
                onChange={(e) =>
                  setDateSales({ ...dateSales, start: e.target.value })
                }
              />
              <input
                type="date"
                className={styles.formInput}
                value={dateSales.end}
                onChange={(e) =>
                  setDateSales({ ...dateSales, end: e.target.value })
                }
              />
            </div>
          </div>

          <div className={styles.cardFooter}>
            <button
              className={`${styles.btnAction} ${styles.btnDownload} ${styles.btnSales}`}
              disabled={isLoading === "sales"}
              onClick={() =>
                handleDownload(
                  "/reports/spare-parts-sales",
                  { start_date: dateSales.start, end_date: dateSales.end },
                  `Laporan_Penjualan_Suku_Cadang_${dateSales.start}_${dateSales.end}.pdf`,
                  "sales",
                )
              }
            >
              <DownloadCloud size={18} />
              {isLoading === "sales"
                ? "Membangun PDF..."
                : "Unduh Laporan (PDF)"}
            </button>
          </div>
        </div>

        {/* REPORT: Status Stok Inventori */}
        <div className={styles.reportCard}>
          <div className={styles.cardHeader}>
            <div className={`${styles.iconWrapper} ${styles.iconStocks}`}>
              <Package size={24} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Laporan Inventori Gudang</h2>
              <p className={styles.cardDesc}>
                Status sisa stok riil suku cadang
              </p>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Filter Kapasitas Barang</label>
            <select
              className={styles.formInput}
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">Semua Suku Cadang (Total Stok)</option>
              <option value="minimum">Hanya Suku Cadang Kritis / Kosong</option>
            </select>
          </div>

          <div className={styles.cardFooter}>
            <button
              className={`${styles.btnAction} ${styles.btnDownload} ${styles.btnStocks}`}
              disabled={isLoading === "stocks"}
              onClick={() =>
                handleDownload(
                  "/reports/stocks",
                  { filter: stockFilter },
                  `Laporan_Stok_Inventori_${new Date().toISOString().split("T")[0]}.pdf`,
                  "stocks",
                )
              }
            >
              <DownloadCloud size={18} />
              {isLoading === "stocks"
                ? "Membangun PDF..."
                : "Unduh Laporan (PDF)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
