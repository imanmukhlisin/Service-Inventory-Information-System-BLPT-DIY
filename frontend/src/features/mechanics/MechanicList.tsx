import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import { Trash2 } from "lucide-react";
import styles from "./MechanicList.module.css";

interface Mechanic {
  id: number;
  mechanic_code: string;
  nama_mechanic: string;
  status: string;
}

const MechanicList: React.FC = () => {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMechanicId, setEditMechanicId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    mechanic_code: "",
    nama_mechanic: "",
    status: "active",
  });

  const fetchMechanics = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/mechanics");
      // Fallback if data is missing
      setMechanics(response.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil data mekanik", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, []);

  const handleToggleForm = () => {
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditMechanicId(null);
      setFormData({
        mechanic_code: "",
        nama_mechanic: "",
        status: "active",
      });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleEdit = (m: Mechanic) => {
    setEditMechanicId(m.id);
    setFormData({
      mechanic_code: m.mechanic_code,
      nama_mechanic: m.nama_mechanic,
      status: m.status,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus mekanik ini?")) {
      // Stub for actual API deletion logic
      console.log("Delete mechanic", id);
    }
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusInactive}`}
      >
        {isActive ? "Aktif" : "Tidak Aktif"}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Data Mekanik</h1>
        <p className={styles.pageSubtitle}>
          Kelola mekanik untuk pencatatan layanan jasa servis
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Cari Mekanik</label>
            <input
              type="text"
              placeholder="Nama atau kode mekanik"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Status</label>
            <select className={styles.selectInput}>
              <option value="">Semua status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>

        <button className={styles.addBtn} onClick={handleToggleForm}>
          + Tambah Mekanik
        </button>
      </div>

      <div className={styles.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama Mekanik</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Memuat...
                  </td>
                </tr>
              ) : mechanics.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                mechanics.map((m) => (
                  <tr key={m.id}>
                    <td>{m.mechanic_code}</td>
                    <td style={{ fontWeight: 500, color: "#0f2c4a" }}>
                      {m.nama_mechanic}
                    </td>
                    <td>{getStatusBadge(m.status)}</td>
                    <td>
                      <div className={styles.actionLinks}>
                        <span
                          className={styles.actionLink}
                          onClick={() => handleEdit(m)}
                        >
                          Edit
                        </span>
                        <Trash2
                          size={18}
                          className={styles.actionIconDanger}
                          onClick={() => handleDelete(m.id)}
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
              {editMechanicId ? "Edit Mekanik" : "Form Tambah Mekanik"}
            </h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Kode Mekanik *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Otomatis: MK-XXX"
                  value={formData.mechanic_code}
                  disabled
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Mekanik *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Masukkan nama mekanik"
                  value={formData.nama_mechanic}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_mechanic: e.target.value })
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

export default MechanicList;
