import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import styles from "./UserList.module.css";

interface User {
  id: number;
  nama_user: string;
  role: string;
  status: string;
  login_account?: {
    username: string;
  };
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama_user: "",
    username: "",
    role: "",
    status: "active",
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/users");
      setUsers(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleForm = () => {
    setIsFormOpen(!isFormOpen);
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

  const mapRoleReadable = (role: string) => {
    const roles: Record<string, string> = {
      admin: "Admin",
      front_office: "Front Office",
      koperasi: "Koperasi",
      kepala_upj: "Kepala UPJ",
    };
    return roles[role] || role;
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Data Pengguna</h1>
        <p className={styles.pageSubtitle}>
          Kelola akun dan hak akses pengguna sistem
        </p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Cari Pengguna</label>
            <input
              type="text"
              placeholder="Nama atau username"
              className={styles.searchInput}
            />
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Peran</label>
            <select className={styles.selectInput}>
              <option value="">Semua peran</option>
              <option value="admin">Admin</option>
              <option value="front_office">Front Office</option>
              <option value="koperasi">Koperasi</option>
              <option value="kepala_upj">Kepala UPJ</option>
            </select>
          </div>
        </div>

        <button className={styles.addBtn} onClick={handleToggleForm}>
          + Tambah Pengguna
        </button>
      </div>

      <div className={styles.tableCard}>
        <div style={{ overflowX: "auto" }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nama</th>
                <th>Username</th>
                <th>Peran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Memuat...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500, color: "#0f2c4a" }}>
                      {u.nama_user}
                    </td>
                    <td>{u.login_account?.username || "-"}</td>
                    <td>{mapRoleReadable(u.role)}</td>
                    <td>{getStatusBadge(u.status)}</td>
                    <td>
                      <div className={styles.actionLinks}>
                        <span className={styles.actionLink}>Lihat</span>
                        {u.status === "active" && (
                          <span className={styles.actionLink}>Edit</span>
                        )}
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
        <div className={styles.bottomSplit}>
          {/* Form Create */}
          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>Form Tambah Pengguna</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nama Lengkap *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama_user}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_user: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Username *</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Peran *</label>
                <select
                  className={styles.formSelect}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <option value="" disabled>
                    Pilih peran
                  </option>
                  <option value="admin">Admin</option>
                  <option value="front_office">Front Office</option>
                  <option value="koperasi">Koperasi</option>
                  <option value="kepala_upj">Kepala UPJ</option>
                </select>
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

          {/* Access Rules Widget */}
          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>Aturan Akses</h2>
            <div className={styles.rulesList}>
              <div className={styles.ruleItem}>
                <span className={styles.rolePill}>Admin</span>
                <p className={styles.ruleDesc}>
                  Mengelola akun dan data master
                </p>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.rolePill}>Front Office</span>
                <p className={styles.ruleDesc}>
                  Mencatat transaksi dan melihat stok
                </p>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.rolePill}>Koperasi</span>
                <p className={styles.ruleDesc}>
                  Mengelola order dan penerimaan
                </p>
              </div>
              <div className={styles.ruleItem}>
                <span className={styles.rolePill}>Kepala UPJ</span>
                <p className={styles.ruleDesc}>Melihat dashboard dan laporan</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
