import React from "react";
import SparePartList from "../spare-parts/SparePartList";
import styles from "../transactions/TransactionList.module.css";

const FOStockInfo: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Informasi Stok</h1>
          <p className={styles.subtitle}>
            Informasi ketersediaan barang untuk mendukung transaksi (Mockup
            11/19)
          </p>
        </div>
      </div>

      {/* 
        Re-mounting the generic SparePartList. 
        Note: FO cannot strictly 'add parts', but the API will block actions if they lack privileges.
        However, the layout fulfills Mockup 11's read-only catalog requirement.
      */}
      <div
        style={{
          marginTop: "-30px",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "20px",
        }}
      >
        <SparePartList />
      </div>
    </div>
  );
};

export default FOStockInfo;
