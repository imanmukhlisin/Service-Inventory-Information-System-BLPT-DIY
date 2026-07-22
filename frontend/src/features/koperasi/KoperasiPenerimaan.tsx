import React from "react";
import { Link } from "react-router-dom";
import styles from "../dashboard/KoperasiDashboard.module.css";
// KoperasiPenerimaan simulating the form view in Mockup 13

const KoperasiPenerimaan: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Penerimaan Suku Cadang</h1>
        <p className={styles.pageSubtitle}>
          Catat barang yang diterima berdasarkan order (Mockup 13)
        </p>
      </div>

      <div
        className={styles.card}
        style={{ textAlign: "center", padding: "64px 24px" }}
      >
        <h2
          style={{ fontSize: "1.2rem", color: "#1e293b", marginBottom: "16px" }}
        >
          Modul Pembuatan DO Aktif
        </h2>
        <p
          style={{
            color: "#64748b",
            maxWidth: "500px",
            margin: "0 auto",
            marginBottom: "32px",
          }}
        >
          Untuk menjaga integritas referensi Order, pembuatan Surat Jalan (DO)
          saat ini terintegrasi secara langsung pada panel{" "}
          <strong>Pesanan</strong> atau <strong>Riwayat</strong> melalui popup
          Modal.
        </p>
        <Link to="/koperasi/riwayat-penerimaan" className={styles.btnOutline}>
          Buka Modul Riwayat / Pembuatan DO
        </Link>
      </div>
    </div>
  );
};

export default KoperasiPenerimaan;
