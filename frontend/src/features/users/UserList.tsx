import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import { Trash2, Eye, EyeOff } from "lucide-react";
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
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama_user: "",
    username: "",
    role: "",
    status: "active",
    password: "",
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
    if (isFormOpen) {
      setIsFormOpen(false);
      setEditUserId(null);
      setShowPassword(false);
      setFormData({
        nama_user: "",
        username: "",
        role: "",
        status: "active",
        password: "",
      });
    } else {
      setIsFormOpen(true);
    }
  };

  const handleEdit = (u: User) => {
    setEditUserId(u.id);
    setFormData({
      nama_user: u.nama_user,
      username: u.login_account?.username || "",
      role: u.role,
      status: u.status,
      password: "",
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Yakin ingin menghapus pengguna ini?")) {
      // Stub for actual API deletion logic
      console.log("Delete user", id);
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
                        <span
                          className={styles.actionLink}
                          onClick={() => handleEdit(u)}
                        >
                          Edit
                        </span>
                        <Trash2
                          size={18}
                          className={styles.actionIconDanger}
                          onClick={() => handleDelete(u.id)}
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
              {editUserId ? "Edit Pengguna" : "Form Tambah Pengguna"}
            </h2>
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

              {/* Password overrides */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  {editUserId ? "Password Baru" : "Password *"}
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`${styles.formInput} ${styles.inputWithIcon}`}
                    placeholder={
                      editUserId
                        ? "Kosongkan jika tak diubah"
                        : "Masukkan password baru"
                    }
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className={styles.passwordToggleBtn}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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

export default UserList;
