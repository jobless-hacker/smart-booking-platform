"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminPublicApi } from "@/lib/api";
import { setAccessCode } from "@/lib/auth";
import styles from "./StaffAccessPage.module.css";

function ShieldLockIcon() {
  return (
    <svg viewBox="0 0 120 128" role="presentation" aria-hidden>
      <defs>
        <linearGradient id="shieldBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7ab0ee" />
          <stop offset="100%" stopColor="#2d63b7" />
        </linearGradient>
      </defs>
      <path
        d="M60 2 16 17.4v34.3C16 80.8 33 106.3 60 126c27-19.7 44-45.2 44-74.3V17.4L60 2z"
        fill="url(#shieldBg)"
      />
      <path
        d="M60 12.5 25 24.8v26.9c0 26 13.3 47.2 35 64 21.7-16.8 35-38 35-64V24.8L60 12.5z"
        fill="#3f76c7"
      />
      <rect x="43.5" y="57" width="33" height="29" rx="7" fill="#d9e5f8" />
      <path d="M67.4 57v-7.4a7.4 7.4 0 1 0-14.8 0V57h4.8v-7.4a2.6 2.6 0 1 1 5.2 0V57h4.8z" fill="#d9e5f8" />
      <circle cx="60" cy="69.8" r="3.1" fill="#3f76c7" />
      <rect x="58.7" y="71.5" width="2.6" height="6.4" rx="1.3" fill="#3f76c7" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden>
      <path d="M8.7 14.5a5.7 5.7 0 1 1 4.9-8.4 5.7 5.7 0 0 1-2.8 7.8L12 15v2h2v2h2v2h-4.8v-4.8l-2.5-1.7zM8.7 6.8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
    </svg>
  );
}

export default function StaffAccessPage() {
  const router = useRouter();
  const [accessCode, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminPublicApi("/api/auth/access-check", accessCode, { method: "GET" });
      setAccessCode(accessCode);
      router.push("/admin/login");
    } catch (_error) {
      setError("Invalid staff access code.");
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

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.iconWrap}>
              <ShieldLockIcon />
            </div>
            <h1>Staff Access</h1>
          </div>

          <div className={styles.cardBody}>
            <p>Enter the access code to proceed to the admin login.</p>

            <form onSubmit={onSubmit} className={styles.form}>
              <label className={styles.inputShell}>
                <span className={styles.inputIcon} aria-hidden>
                  <KeyIcon />
                </span>
                <span className={styles.inputDivider} aria-hidden />
                <input
                  value={accessCode}
                  onChange={(event) => setCode(event.target.value)}
                  type="password"
                  placeholder="****"
                  autoComplete="current-password"
                  required
                />
              </label>

              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.submitBtn}`} type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Submit"}
              </button>

              {error && <p className={styles.errorMsg}>{error}</p>}
            </form>

            <Link href="/" className={styles.backLink}>
              <span aria-hidden>&larr;</span> Back to Website
            </Link>
          </div>
        </div>
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

