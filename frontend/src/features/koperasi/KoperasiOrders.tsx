import React from "react";
import OrderList from "../orders/OrderList";
import styles from "../dashboard/KoperasiDashboard.module.css";
// We reuse Koperasi CSS to maintain the sleek aesthetic

const KoperasiOrders: React.FC = () => {
  return (
    <div>
      {/* Wrapper matching Mockup 12 layout purely leveraging existing solid mechanics */}
      <div className={styles.pageHeader} style={{ marginBottom: "0.5rem" }}>
        <h1 className={styles.pageTitle}>Order Suku Cadang</h1>
        <p className={styles.pageSubtitle}>
          Kelola kebutuhan barang dari stok minimum UPJ
        </p>
      </div>
      <OrderList />
    </div>
  );
};

export default KoperasiOrders;
