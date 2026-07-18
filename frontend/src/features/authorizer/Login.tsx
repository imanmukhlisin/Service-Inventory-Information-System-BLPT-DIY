import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Key, User as UserIcon } from "lucide-react";
import { apiClient } from "../../lib/api";
import { useAuth } from "../../app/AuthContext";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiClient.post("/authorizer/login", {
        username,
        password,
      });

      if (response.data.success) {
        await checkAuth(); // Pull full user context
        const role = response.data.data.role as string;

        // Redirect based on role explicitly for UX
        switch (role) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "front_office":
            navigate("/front-office/dashboard");
            break;
          case "koperasi":
            navigate("/koperasi/dashboard");
            break;
          case "kepala_upj":
            navigate("/kepala-upj/dashboard");
            break;
          default:
            navigate("/");
            break;
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Username atau password salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.brandBox}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Pendidikan_Nasional_%28Indonesia%29.svg"
            alt="Logo"
            className={styles.brandIcon}
          />
          <h2>SISTEM INFORMASI UPJ</h2>
          <p>AHASS BLPT YOGYAKARTA</p>
        </div>

        <form className={styles.loginForm} onSubmit={handleLogin}>
          {error && (
            <div className={styles.errorBox}>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Username</label>
            <div className={styles.inputWrapper}>
              <UserIcon size={18} className={styles.inputIcon} />
              <input
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Password</label>
            <div className={styles.inputWrapper}>
              <Key size={18} className={styles.inputIcon} />
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username || !password}
            className={styles.loginBtn}
          >
            {isSubmitting ? (
              "Loading..."
            ) : (
              <>
                <LogIn size={18} />
                <span>Masuk</span>
              </>
            )}
          </button>
        </form>

        <div className={styles.footerNote}>
          &copy; 2026 BLPT DIY. Hak Cipta Dilindungi.
        </div>
      </div>
    </div>
  );
};

export default Login;
