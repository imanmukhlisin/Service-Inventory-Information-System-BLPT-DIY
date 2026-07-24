import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { apiClient } from "../../lib/api";
import { useAuth } from "../../app/AuthContext";
import styles from "./Login.module.css";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Typewriter effect state
  const [typingText, setTypingText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const welcomeMessage = "Welcome to BLPT DIY...";

  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (isDeleting) {
      if (typingText.length > 0) {
        timeout = setTimeout(() => {
          setTypingText(welcomeMessage.substring(0, typingText.length - 1));
        }, 50);
      } else {
        timeout = setTimeout(() => setIsDeleting(false), 500); // pause before retyping
      }
    } else {
      if (typingText.length < welcomeMessage.length) {
        timeout = setTimeout(() => {
          setTypingText(welcomeMessage.substring(0, typingText.length + 1));
        }, 120);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 3000); // pause before deleting
      }
    }

    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, welcomeMessage]);

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
      setError(
        err.response?.data?.message || "Nama pengguna atau kata sandi salah.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      {/* LEFT PANEL - Branding */}
      <div className={styles.leftPanel}>
        {/* Placeholder for the Logo, loaded from the public folder */}
        <img
          src="/logo-blpt.png"
          alt="Logo Pemda / Instansi"
          className={styles.brandLogo}
          onError={(e) => {
            // Fallback gracefully if logo is not yet placed
            e.currentTarget.src =
              "https://upload.wikimedia.org/wikipedia/commons/9/9d/Logo_Pendidikan_Nasional_%28Indonesia%29.svg";
          }}
        />

        <div className={styles.welcomeWrapper}>
          <h2 className={styles.typewriterText}>
            {typingText}
            <span className={styles.cursor}>|</span>
          </h2>
        </div>

        <p className={styles.systemLabel}>SISTEM INFORMASI</p>
        <h1 className={styles.mainTitle}>
          Penjualan Suku Cadang
          <br />
          dan Jasa Servis
        </h1>
        <h3 className={styles.subTitle}>UPJ Otomotif & AHASS BLPT DIY</h3>

        <p className={styles.description}>
          Pengelolaan transaksi dan persediaan yang terintegrasi, akurat, dan
          mudah dipantau.
        </p>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className={styles.rightPanel}>
        <div className={styles.loginCard}>
          <div className={styles.cardHeader}>
            <h2>Masuk ke Sistem</h2>
            <p>Gunakan akun yang telah diberikan oleh administrator.</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.formGroup}>
              <label>Nama Pengguna</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  placeholder="Masukkan nama pengguna"
                  className={styles.inputField}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Kata Sandi</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  className={styles.inputField}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ingat saya
              </label>
              <button
                type="button"
                className={styles.forgotPassword}
                onClick={() =>
                  Swal.fire({
                    icon: "info",
                    title: "Lupa Password?",
                    text: "Silahkan Hubungi Admin UPJ AHHAS BLPT DIY Untuk Mereset Password Anda",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#3085d6",
                  })
                }
              >
                Lupa kata sandi?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !username || !password}
              className={styles.submitBtn}
            >
              {isSubmitting ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className={styles.cardFooter}>
            <p>Sistem internal BLPT DIY • Akses terbatas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
