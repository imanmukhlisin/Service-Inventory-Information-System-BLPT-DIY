import React from "react";
import ReceiptList from "../orders/ReceiptList";
import styles from "../dashboard/KoperasiDashboard.module.css";

const KoperasiRiwayat: React.FC = () => {
  return (
    <div>
      <div className={styles.pageHeader} style={{ marginBottom: "0.5rem" }}>
        <h1 className={styles.pageTitle}>Riwayat Penerimaan</h1>
        <p className={styles.pageSubtitle}>
          Log historis kedatangan persediaan dari Vendor
        </p>
      </div>
      <ReceiptList />
    </div>
  );
};

export default KoperasiRiwayat;
