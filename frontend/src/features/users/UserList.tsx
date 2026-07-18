import React, { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import styles from "./UserList.module.css";
import { Users, AlertCircle } from "lucide-react";

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
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("/users");
      setUsers(response.data.data);
    } catch (err: any) {
      console.error(err);
      setError("Gagal mengambil data pengguna dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    return (
      <span className={`${styles.badge} ${styles[role] || ""}`}>
        {role.replace("_", " ")}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const isActive = status === "active";
    return (
      <span
        className={`${styles.badge} ${isActive ? styles.active : styles.inactive}`}
      >
        {isActive ? "Aktif" : "Nonaktif"}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>
          <Users
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />{" "}
          Manajemen Pengguna & Hak Akses
        </h2>
      </div>

      {error && (
        <div className={styles.error}>
          <AlertCircle
            size={18}
            style={{ marginRight: "8px", verticalAlign: "middle" }}
          />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>Memuat data...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Username</th>
                <th>Peran Utama</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{ textAlign: "center", padding: "24px" }}
                  >
                    Tidak ada data pengguna.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.nama_user}</td>
                    <td>
                      {u.login_account?.username || (
                        <span style={{ color: "#aaa", fontStyle: "italic" }}>
                          Belum disetel
                        </span>
                      )}
                    </td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>{getStatusBadge(u.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
