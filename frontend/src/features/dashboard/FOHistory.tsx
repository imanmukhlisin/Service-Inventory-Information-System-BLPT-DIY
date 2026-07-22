import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiClient } from "../../lib/api";
import styles from "../transactions/TransactionList.module.css";
// Reusing TransactionList CSS for grid tables as it shares aesthetics.

const FOHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/transactions");
      setTransactions(res.data.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Daftar Transaksi</h1>
          <p className={styles.subtitle}>
            Riwayat transaksi jasa dan penjualan suku cadang (Mockup 10/19)
          </p>
        </div>
        <Link to="/front-office/transaksi-baru" className={styles.btnAction}>
          + Transaksi Baru
        </Link>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nomor Nota</th>
              <th>Tanggal</th>
              <th>Customer</th>
              <th>Total Layanan/Jasa</th>
              <th>Total Parts</th>
              <th>Total Biaya</th>
              <th>Opsi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Memuat data...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  Belum ada transaksi
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.nomor_nota}</td>
                  <td>{new Date(t.tanggal).toLocaleDateString("id-ID")}</td>
                  <td>Umum (Cash)</td>
                  <td>{t.services?.length || 0} layanan</td>
                  <td>{t.spare_parts?.length || 0} parts</td>
                  <td style={{ fontWeight: 600 }}>
                    {formatRupiah(t.total_harga)}
                  </td>
                  <td>
                    {/* Placeholder for 19 - Nota Transaksi link */}
                    <button
                      className={styles.btnIcon}
                      style={{ fontSize: "0.85rem", padding: "4px 8px" }}
                    >
                      Cetak Nota (19)
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FOHistory;
