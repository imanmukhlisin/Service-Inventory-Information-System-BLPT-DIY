import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import { Trash2 } from "lucide-react";
import styles from "./SparePartList.module.css";

interface SparePart {
  id: number;
  kode_suku_cadang: string;
  nama_suku_cadang: string;
  kategori: string;
  satuan?: string;
  harga_jual: number;
  stok_sekarang?: number;
  stok_minimum?: number;
  status?: string;
}

const SparePartList: React.FC = () => {
  const [parts, setParts] = useState<SparePart[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPartId, setEditPartId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    kode_suku_cadang: "",
    nama_suku_cadang: "",
    kategori: "",
    satuan: "Pcs",
    harga_jual: 0,
    stok_sekarang: 0,
    stok_minimum: 0,
    status: "active",
  });

  const fetchParts = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/spare-parts");

      // Mapping API model if `stock` relation is nested
      const mappedParts = (response.data.data || []).map((p: any) => ({
        id: p.id,
        kode_suku_cadang: p.kode_suku_cadang,
        nama_suku_cadang: p.nama_suku_cadang,
        kategori: p.kategori,
        harga_jual: parseFloat(p.harga_jual || 0),
        stok_sekarang: p.stock?.stok_sekarang || 0,
        stok_minimum: p.stock?.stok_minimum || 0,
        satuan: "Pcs", // Mock UI missing from API
        status:
          (p.stock?.stok_sekarang || 0) > (p.stock?.stok_minimum || 0)
            ? "active"
            : "inactive",
      }));

      setParts(mappedParts);
    } catch (err) {
      console.error("Gagal mengambil data suku cadang", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditPartId(null);
      setFormData({
        kode_suku_cadang: "",
        nama_suku_cadang: "",
        kategori: "",
        satuan: "Pcs",
        harga_jual: 0,
        stok_sekarang: 0,
        stok_minimum: 0,
        status: "active",
      });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleEdit = (p: SparePart) => {
    setEditPartId(p.id);
    setFormData({
      kode_suku_cadang: p.kode_suku_cadang,
      nama_suku_cadang: p.nama_suku_cadang,
      kategori: p.kategori,
      satuan: p.satuan || "Pcs",
      harga_jual: p.harga_jual,
      stok_sekarang: p.stok_sekarang || 0,
      stok_minimum: p.stok_minimum || 0,
      status: "active", // defaulting as not all mocked in database
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus suku cadang ini?")) {
      // API call stub
      console.log("Delete part", id);
    }
  };

  const getStockStatus = (current: number, min: number) => {
    const isAman = current >= min;
    return (
      <span
        className={`${styles.statusBadge} ${isAman ? styles.statusAman : styles.statusMinimum}`}
      >
        {isAman ? "Aman" : "Minimum"}
      </span>
    );
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Master Suku Cadang</h1>
        <p className={styles.pageSubtitle}>
          Kelola referensi barang, harga jual, dan batas stok minimum
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Cari</label>
            <input
              type="text"
              placeholder="Kode atau nama suku cadang"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Kategori</label>
            <select className={styles.selectInput}>
              <option value="">Semua kategori</option>
              <option value="pengereman">Pengereman</option>
              <option value="transmisi">Transmisi</option>
              <option value="pelumas">Pelumas</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status Stok</label>
            <select className={styles.selectInput}>
              <option value="">Semua status</option>
              <option value="aman">Aman</option>
              <option value="minimum">Minimum</option>
            </select>
          </div>
        </div>

        <button className={styles.addBtn} onClick={handleToggleForm}>
          + Tambah Suku Cadang
        </button>
      </div>

      <div className={styles.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Suku Cadang</th>
                <th>Kategori</th>
                <th>Harga Jual</th>
                <th>Stok</th>
                <th>Minimum</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Memuat...
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Tidak ada data master suku cadang.
                  </td>
                </tr>
              ) : (
                parts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.kode_suku_cadang}</td>
                    <td style={{ fontWeight: 500, color: "#0f2c4a" }}>
                      {p.nama_suku_cadang}
                    </td>
                    <td>{p.kategori}</td>
                    <td>{formatCurrency(p.harga_jual)}</td>
                    <td>{p.stok_sekarang}</td>
                    <td>{p.stok_minimum}</td>
                    <td>
                      {getStockStatus(
                        p.stok_sekarang || 0,
                        p.stok_minimum || 0,
                      )}
                    </td>
                    <td>
                      <div className={styles.actionLinks}>
                        <span
                          className={styles.actionLink}
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </span>
                        <Trash2
                          size={18}
                          className={styles.actionIconDanger}
                          onClick={() => handleDelete(p.id)}
                          style={{ cursor: "pointer", color: "#f43f5e" }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className={styles.modalOverlay} onClick={handleToggleForm}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.panelTitle}>
              {editPartId ? "Edit Suku Cadang" : "Form Suku Cadang"}
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kode *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="SC-006"
                  value={formData.kode_suku_cadang}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kode_suku_cadang: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Suku Cadang *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Masukkan nama barang"
                  value={formData.nama_suku_cadang}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nama_suku_cadang: e.target.value,
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kategori *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Pilih kategori"
                  value={formData.kategori}
                  onChange={(e) =>
                    setFormData({ ...formData, kategori: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Satuan *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Pcs"
                  value={formData.satuan}
                  onChange={(e) =>
                    setFormData({ ...formData, satuan: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Harga Jual *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="Rp0"
                  value={formData.harga_jual}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      harga_jual: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Stok Awal *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="0"
                  value={formData.stok_sekarang}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stok_sekarang: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Batas Minimum *</label>
                <input
                  type="number"
                  className={styles.formInput}
                  placeholder="0"
                  value={formData.stok_minimum}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stok_minimum: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Status *</label>
                <select
                  className={styles.formSelect}
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={handleToggleForm}
              >
                Batal
              </button>
              <button type="button" className={styles.btnSave}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SparePartList;
