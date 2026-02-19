"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAccessCode } from "@/lib/auth";
import styles from "./ForgotPasswordPage.module.css";

function LockHelpIcon() {
  return (
    <svg viewBox="0 0 120 128" role="presentation" aria-hidden>
      <defs>
        <linearGradient id="forgotShield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7db2ef" />
          <stop offset="100%" stopColor="#2e63b7" />
        </linearGradient>
      </defs>
      <path
        d="M60 2 16 17.5v34.2C16 80.8 33 106.3 60 126c27-19.7 44-45.2 44-74.3V17.5L60 2z"
        fill="url(#forgotShield)"
      />
      <path
        d="M60 12.6 25 24.9v26.8c0 26 13.3 47.2 35 64 21.7-16.8 35-38 35-64V24.9L60 12.6z"
        fill="#3d74c4"
      />
      <rect x="41.5" y="54" width="37" height="31" rx="8" fill="#d9e4f6" />
      <path d="M68 54v-7.2a8 8 0 1 0-16 0V54h5.2v-7.2a2.8 2.8 0 1 1 5.6 0V54H68z" fill="#d9e4f6" />
      <path d="M57.4 73.2h5.2v3.6h-5.2z" fill="#3f74be" />
      <circle cx="60" cy="65.8" r="3.1" fill="#3f74be" />
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    const accessCode = getAccessCode();
    if (!accessCode) {
      router.replace("/staff-access");
    }
  }, [router]);

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
              <LockHelpIcon />
            </div>
            <h1>Forgot Password</h1>
          </div>

          <div className={styles.cardBody}>
            <p>
              Self-service password reset is not enabled yet.
              <br />
              Please contact your system administrator for access recovery.
            </p>
            <Link href="/admin/login" className={`${styles.btn} ${styles.btnPrimary} ${styles.actionBtn}`}>
              Back to Login
            </Link>
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

