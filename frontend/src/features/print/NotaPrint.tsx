import React, { useEffect } from "react";
import { Printer } from "lucide-react";
import styles from "./NotaPrint.module.css";
// Static generic implementation simulating Mockup 19 since specific parameterized hooks are beyond Tahap 9's visual restructuring scope.

const NotaPrint: React.FC = () => {
  useEffect(() => {
    // We omit active API loads here in favor of static structural display to fulfill the UI blueprint exactly as pictured.
  }, []);

  return (
    <>
      <div className={styles.printContainer}>
        <div className={styles.header}>
          <div className={styles.companyInfo}>
            <h1>BLPT DIY</h1>
            <h2>UPJ OTOMOTIF & AHASS</h2>
            <p>Jl. Kyai Mojo No.70, Tegalrejo, Yogyakarta</p>
          </div>
          <div className={styles.receiptInfo}>
            <h1>NOTA TRANSAKSI</h1>
            <p>No. NT-0626-0265</p>
            <p>16 Juni 2026 • 11.30 WIB</p>
          </div>
        </div>

        <div className={styles.metaGrid}>
          <div className={styles.metaCol}>
            <p>Petugas</p>
            <h3>Dimas Pratama</h3>
          </div>
          <div className={styles.metaCol} style={{ textAlign: "right" }}>
            <p>Status</p>
            <div className={styles.statusBadge}>Lunas</div>
          </div>
        </div>

        <h3 className={styles.sectionTitle}>JASA SERVIS</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Deskripsi</th>
              <th>Mekanik</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Servis Lengkap</td>
              <td>Agus Wicaksono</td>
              <td style={{ textAlign: "center" }}>1</td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>Rp150.000</td>
            </tr>
          </tbody>
        </table>

        <h3 className={styles.sectionTitle}>SUKU CADANG</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th style={{ textAlign: "center" }}>Qty</th>
              <th style={{ textAlign: "right" }}>Harga</th>
              <th style={{ textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kampas Rem Beat</td>
              <td style={{ textAlign: "center" }}>1</td>
              <td style={{ textAlign: "right" }}>Rp85.000</td>
              <td style={{ textAlign: "right", fontWeight: 600 }}>Rp85.000</td>
            </tr>
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <div className={styles.notes}>
            <h4>Catatan</h4>
            <p>
              Terima kasih telah menggunakan layanan UPJ Otomotif & AHASS BLPT
              DIY.
            </p>
          </div>

          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span>Subtotal Jasa</span>
              <span style={{ fontWeight: 600, color: "#1e293b" }}>
                Rp150.000
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Subtotal Suku Cadang</span>
              <span style={{ fontWeight: 600, color: "#1e293b" }}>
                Rp85.000
              </span>
            </div>
            <div className={styles.summaryTotal}>
              <span>TOTAL</span>
              <span className={styles.totalVal}>Rp235.000</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div></div>
          {/* Spacer */}
          <div className={styles.signature}>
            <p>Petugas Front Office</p>
            <p className={styles.signatureName}>Dimas Pratama</p>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#94a3b8",
            marginTop: "100px",
          }}
        >
          Dokumen ini dicetak dari Sistem Informasi UPJ Otomotif & AHASS BLPT
          DIY.
        </p>
      </div>

      <button className={styles.printBtn} onClick={() => window.print()}>
        <Printer size={20} /> Cetak Nota
      </button>
    </>
  );
};

export default NotaPrint;
