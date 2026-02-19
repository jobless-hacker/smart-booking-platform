"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminPublicApi } from "@/lib/api";
import { getAccessCode, setToken } from "@/lib/auth";
import styles from "./AdminLoginPage.module.css";

function LockBadgeIcon() {
  return (
    <svg viewBox="0 0 144 144" role="presentation" aria-hidden>
      <defs>
        <linearGradient id="loginBadgeOuter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6fa9ee" />
          <stop offset="100%" stopColor="#2f66b9" />
        </linearGradient>
        <linearGradient id="loginBadgeInner" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c8ee0" />
          <stop offset="100%" stopColor="#2d62b7" />
        </linearGradient>
      </defs>
      <ellipse cx="72" cy="120" rx="53" ry="13" fill="#bfd2ef" />
      <circle cx="72" cy="72" r="57" fill="url(#loginBadgeOuter)" />
      <circle cx="72" cy="72" r="50" fill="url(#loginBadgeInner)" />
      <rect x="48" y="60" width="48" height="36" rx="8" fill="#d8e3f6" />
      <path d="M82 60V50a10 10 0 1 0-20 0v10h6v-10a4 4 0 1 1 8 0v10h6z" fill="#d8e3f6" />
      <circle cx="72" cy="76" r="4" fill="#3f72bd" />
      <rect x="70.4" y="78.3" width="3.2" height="8" rx="1.6" fill="#3f72bd" />
    </svg>
  );
}

function EyeIcon({ slashed = false }) {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M12 6.4c5.5 0 9.5 4.5 10.8 5.6-1.3 1.1-5.3 5.6-10.8 5.6S2.5 13.1 1.2 12C2.5 10.9 6.5 6.4 12 6.4zm0 8.4a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6z" />
      {slashed && <path d="M4.1 4.9 19.1 20l-1.4 1.4L2.7 6.3z" />}
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const accessCode = getAccessCode();
    if (!accessCode) {
      router.replace("/staff-access");
    }
  }, [router]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await adminPublicApi("/api/auth/login", getAccessCode(), {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      setToken(data.token);
      router.push("/admin/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.root}>
      <header className={styles.topbar}>
        <div className={`${styles.container} ${styles.topbarInner}`}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandMark} aria-hidden>
              SA
            </span>
            <span className={styles.brandText}>SmartAppointments</span>
          </Link>

          <nav className={styles.nav}>
            <button className={styles.langBtn} type="button">
              EN v
            </button>
            <Link href="/book" className={`${styles.btn} ${styles.btnPrimary}`}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.stage}>
        <div className={styles.stageShapeLeft} aria-hidden />
        <div className={styles.stageShapeRight} aria-hidden />

        <section className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.iconWrap}>
              <LockBadgeIcon />
            </div>
            <h1>Admin Login</h1>
            <p>Sign in to manage appointments.</p>
          </div>

          <div className={styles.cardBody}>
            <form onSubmit={onSubmit} className={styles.form}>
              <label className={styles.field}>
                <span>Email Address</span>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  autoComplete="email"
                  placeholder="admin@example.com"
                  required
                />
              </label>

              <label className={styles.field}>
                <span>Password</span>
                <div className={styles.passwordShell}>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="****"
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <EyeIcon slashed={!showPassword} />
                  </button>
                </div>
              </label>

              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.submitBtn}`} type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              {error && <p className={styles.errorMsg}>{error}</p>}
            </form>

            <Link href="/admin/forgot-password" className={styles.secondaryLink}>
              Forgot Password?
            </Link>

            <div className={styles.divider} />

            <Link href="/" className={styles.backLink}>
              <span aria-hidden>&larr;</span> Back to Website
            </Link>
          </div>
        </section>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.container}>
            <div className={styles.footerSocials}>
              <span>f</span>
              <span>t</span>
              <span>ig</span>
            </div>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <div className={styles.container}>
            <p>(c) 2024 SmartAppointments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

