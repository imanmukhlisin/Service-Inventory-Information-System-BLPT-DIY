import React from "react";
import ReportsDashboard from "../reports/ReportsDashboard";
import styles from "../dashboard/UpjDashboard.module.css";

// This acts as a unified hub mapping all 3 reports since the visual layout permits parallel card rendering
// Mockups 15, 16, 17 are functionally achieved via the ReportsDashboard.
const UpjLaporanHub: React.FC = () => {
  return (
    <div>
      <div className={styles.pageHeader} style={{ marginBottom: "0.5rem" }}>
        <h1 className={styles.pageTitle}>Modul Ekspor Laporan UPJ</h1>
        <p className={styles.pageSubtitle}>
          Menyambungkan format PDF Mockup 15, 16, dan 17
        </p>
      </div>
      <ReportsDashboard />
    </div>
  );
};

export default UpjLaporanHub;
