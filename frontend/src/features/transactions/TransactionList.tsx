import React, { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";
import { Trash2, ShoppingCart, Wrench, Package } from "lucide-react";
import Swal from "sweetalert2";
import styles from "./TransactionList.module.css";

interface Mechanic {
  id: number;
  nama_mekanik: string;
}

interface SparePart {
  id: number;
  nama_suku_cadang: string;
  harga_jual: number;
  stok_sekarang: number;
}

interface CartItem {
  type: "jasa" | "sukucadang";
  id_mekanik?: number;
  nama_mekanik?: string;
  id_master_suku_cadang?: number;
  nama_suku_cadang?: string;
  nama_jasa?: string;
  biaya_jasa?: number;
  keterangan_jasa?: string;
  jumlah?: number;
  harga_satuan?: number;
  total_harga: number;
}

const TransactionList: React.FC = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Jasa Form State
  const [jasaForm, setJasaForm] = useState({
    id_mekanik: "",
    nama_jasa: "",
    biaya_jasa: "",
    keterangan_jasa: "",
  });

  // Spare Part Form State
  const [partForm, setPartForm] = useState({
    id_master_suku_cadang: "",
    jumlah: "1",
  });

  useEffect(() => {
    fetchDependancies();
  }, []);

  const fetchDependancies = async () => {
    try {
      const [resMech, resParts] = await Promise.all([
        apiClient.get("/mechanics"),
        apiClient.get("/spare-parts"),
      ]);
      setMechanics(resMech.data.data.filter((m: any) => m.status === "active"));

      const mappedParts = resParts.data.data.map((p: any) => ({
        id: p.id,
        nama_suku_cadang: p.nama_suku_cadang,
        harga_jual: parseFloat(p.harga_jual),
        stok_sekarang: p.stock?.stok_sekarang || 0,
      }));
      setSpareParts(mappedParts);
    } catch (err) {
      console.error("Gagal load masters", err);
    }
  };

  const addJasa = () => {
    if (!jasaForm.id_mekanik || !jasaForm.nama_jasa || !jasaForm.biaya_jasa) {
      Swal.fire({ icon: "warning", text: "Lengkapi data jasa servis!" });
      return;
    }
    const mech = mechanics.find((m) => m.id === parseInt(jasaForm.id_mekanik));
    const newItem: CartItem = {
      type: "jasa",
      id_mekanik: parseInt(jasaForm.id_mekanik),
      nama_mekanik: mech?.nama_mekanik,
      nama_jasa: jasaForm.nama_jasa,
      biaya_jasa: parseFloat(jasaForm.biaya_jasa),
      keterangan_jasa: jasaForm.keterangan_jasa,
      total_harga: parseFloat(jasaForm.biaya_jasa),
    };
    setCart([...cart, newItem]);
    setJasaForm({
      id_mekanik: "",
      nama_jasa: "",
      biaya_jasa: "",
      keterangan_jasa: "",
    });
  };

  const addPart = () => {
    if (!partForm.id_master_suku_cadang || !partForm.jumlah) {
      Swal.fire({ icon: "warning", text: "Lengkapi data suku cadang!" });
      return;
    }
    const qty = parseInt(partForm.jumlah);
    const part = spareParts.find(
      (p) => p.id === parseInt(partForm.id_master_suku_cadang),
    );

    if (!part) return;
    if (qty > part.stok_sekarang) {
      Swal.fire({
        icon: "error",
        title: "Stok Tidak Cukup!",
        text: `Stok ${part.nama_suku_cadang} tersisa ${part.stok_sekarang}`,
      });
      return;
    }

    const newItem: CartItem = {
      type: "sukucadang",
      id_master_suku_cadang: part.id,
      nama_suku_cadang: part.nama_suku_cadang,
      jumlah: qty,
      harga_satuan: part.harga_jual,
      total_harga: part.harga_jual * qty,
    };
    setCart([...cart, newItem]);
    setPartForm({ id_master_suku_cadang: "", jumlah: "1" });
  };

  const removeCartItem = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const grandTotal = cart.reduce((acc, curr) => acc + curr.total_harga, 0);

  const formatIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire({ icon: "warning", text: "Keranjang masih kosong!" });
      return;
    }

    const payload = {
      services: cart
        .filter((c) => c.type === "jasa")
        .map((c) => ({
          id_mekanik: c.id_mekanik,
          nama_jasa: c.nama_jasa,
          biaya_jasa: c.biaya_jasa,
          keterangan_jasa: c.keterangan_jasa,
        })),
      spare_parts: cart
        .filter((c) => c.type === "sukucadang")
        .map((c) => ({
          id_master_suku_cadang: c.id_master_suku_cadang,
          jumlah: c.jumlah,
        })),
    };

    try {
      await apiClient.post("/transactions", payload);
      Swal.fire({
        icon: "success",
        title: "Transaksi Berhasil",
        text: "Stok telah terpotong (jika ada).",
      });
      setCart([]);
      fetchDependancies(); // refresh stock
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal memproses transaksi",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Transaksi Kasir</h1>
        <p className={styles.pageSubtitle}>
          Catat transaksi jasa servis dan penjualan suku cadang (Front Office)
        </p>
      </div>

      <div className={styles.posGrid}>
        <div className={styles.entryPanel}>
          {/* JASA CARD */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Wrench
                size={20}
                style={{
                  display: "inline",
                  marginRight: 8,
                  verticalAlign: "middle",
                  color: "#3b82f6",
                }}
              />
              Pelayanan Jasa Servis
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mekanik</label>
                <select
                  className={styles.formInput}
                  value={jasaForm.id_mekanik}
                  onChange={(e) =>
                    setJasaForm({ ...jasaForm, id_mekanik: e.target.value })
                  }
                >
                  <option value="">Pilih Mekanik</option>
                  {mechanics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama_mekanik}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Jasa</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Servis Ringan..."
                  value={jasaForm.nama_jasa}
                  onChange={(e) =>
                    setJasaForm({ ...jasaForm, nama_jasa: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Biaya Jasa (Rp)</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="0"
                  value={jasaForm.biaya_jasa}
                  onChange={(e) =>
                    setJasaForm({ ...jasaForm, biaya_jasa: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Catatan tambahan"
                  value={jasaForm.keterangan_jasa}
                  onChange={(e) =>
                    setJasaForm({
                      ...jasaForm,
                      keterangan_jasa: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <button className={styles.btnAdd} onClick={addJasa}>
              + Tambah Jasa Ke Keranjang
            </button>
          </div>

          {/* SPARE PART CARD */}
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Package
                size={20}
                style={{
                  display: "inline",
                  marginRight: 8,
                  verticalAlign: "middle",
                  color: "#10b981",
                }}
              />
              Penjualan Suku Cadang
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Suku Cadang</label>
                <select
                  className={styles.formInput}
                  value={partForm.id_master_suku_cadang}
                  onChange={(e) =>
                    setPartForm({
                      ...partForm,
                      id_master_suku_cadang: e.target.value,
                    })
                  }
                >
                  <option value="">Pilih Barang...</option>
                  {spareParts.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                      disabled={p.stok_sekarang <= 0}
                    >
                      {p.nama_suku_cadang} - {formatIDR(p.harga_jual)} (Stok:{" "}
                      {p.stok_sekarang})
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Jumlah (Qty)</label>
                <input
                  type="number"
                  min="1"
                  className={styles.formInput}
                  value={partForm.jumlah}
                  onChange={(e) =>
                    setPartForm({ ...partForm, jumlah: e.target.value })
                  }
                />
              </div>
            </div>
            <button
              className={styles.btnAdd}
              style={{
                background: "linear-gradient(135deg, #0f2c4a 0%, #059669 100%)",
              }}
              onClick={addPart}
            >
              + Tambah Suku Cadang Ke Keranjang
            </button>
          </div>
        </div>

        {/* CART (NOTA) PANEL */}
        <div className={styles.cartPanel}>
          <div className={styles.cardTitle}>
            <ShoppingCart
              size={20}
              style={{
                display: "inline",
                marginRight: 8,
                verticalAlign: "middle",
              }}
            />
            Keranjang Nota
          </div>

          <div className={styles.cartList}>
            {cart.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#94a3b8",
                }}
              >
                Keranjang kosong
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className={styles.cartItem}>
                  <div className={styles.cartItemInfo}>
                    <span className={styles.itemName}>
                      {item.type === "jasa"
                        ? `[Jasa] ${item.nama_jasa}`
                        : `[Part] ${item.nama_suku_cadang}`}
                    </span>
                    <span className={styles.itemSub}>
                      {item.type === "jasa"
                        ? `Mekanik: ${item.nama_mekanik}`
                        : `${item.jumlah} x ${formatIDR(item.harga_satuan || 0)}`}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span className={styles.itemPrice}>
                      {formatIDR(item.total_harga)}
                    </span>
                    <button
                      className={styles.removeBtn}
                      onClick={() => removeCartItem(idx)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className={styles.cartTotals}>
            <div className={styles.grandTotalRow}>
              <span>Grand Total</span>
              <span>{formatIDR(grandTotal)}</span>
            </div>
            <button
              className={styles.checkoutBtn}
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              Proses Transaksi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
