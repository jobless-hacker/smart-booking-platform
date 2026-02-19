import Link from "next/link";
import { FEATURE_CARDS, HOW_IT_WORKS, TESTIMONIALS } from "./constants";
import styles from "./HomePage.module.css";

export default function HomePage() {
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
            <Link href="/book" className={styles.navLink}>
              Book Appointment
            </Link>
            <Link href="/staff-access" className={styles.navLink}>
              Staff Login
            </Link>
            <button className={styles.langBtn} type="button">
              EN v
            </button>
            <Link href="/book" className={`${styles.btn} ${styles.btnPrimary}`}>
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1>Book Your Appointment Easily &amp; Quickly</h1>
            <p>Schedule Your Visit with Just a Few Clicks!</p>
            <div className={styles.heroActions}>
              <Link href="/book" className={`${styles.btn} ${styles.btnPrimary}`}>
                Book Appointment
              </Link>
              <Link href="/staff-access" className={`${styles.btn} ${styles.btnOutline}`}>
                Staff Login
              </Link>
            </div>
          </div>

          <div className={styles.heroArt} aria-hidden>
            <div className={styles.artBackdrop} />
            <div className={styles.calendar}>
              <div className={styles.calendarHead} />
              <div className={styles.calendarGrid}>
                {Array.from({ length: 18 }).map((_, index) => (
                  <span
                    key={`slot-${index}`}
                    className={index % 6 === 0 ? `${styles.calCell} ${styles.calCellActive}` : styles.calCell}
                  />
                ))}
              </div>
            </div>
            <div className={`${styles.avatar} ${styles.avatarLeft}`}>DR</div>
            <div className={`${styles.avatar} ${styles.avatarRight}`}>ST</div>
          </div>
        </div>
      </section>

      <section className={styles.featureStrip}>
        <div className={`${styles.container} ${styles.grid3}`}>
          {FEATURE_CARDS.map((feature) => (
            <article key={feature.title} className={styles.panelCard}>
              <span className={styles.iconChip} aria-hidden>
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} id="how-it-works">
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span />
            How It Works
            <span />
          </h2>
          <div className={styles.grid3}>
            {HOW_IT_WORKS.map((step) => (
              <article key={step.title} className={`${styles.panelCard} ${styles.workCard}`}>
                <span className={`${styles.iconChip} ${styles.iconChipAlt}`} aria-hidden>
                  {step.icon}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            <span />
            What Our Clients Say
            <span />
          </h2>
          <div className={styles.grid2}>
            {TESTIMONIALS.map((item) => (
              <article key={item.author} className={styles.testimonial}>
                <span className={styles.avatarChip} aria-hidden>
                  {item.initials}
                </span>
                <div>
                  <p className={styles.quote}>&ldquo;{item.quote}&rdquo;</p>
                  <p className={styles.author}>- {item.author}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerGrid}`}>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link href="/book">Book Appointment</Link>
              </li>
              <li>
                <Link href="/staff-access">Staff Login</Link>
              </li>
              <li>
                <a href="#how-it-works">FAQ</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <ul>
              <li>Email: info@smartappointments.com</li>
              <li>Phone: +91 9876643210</li>
            </ul>
          </div>
          <div>
            <h4>Follow Us</h4>
            <div className={styles.socials}>
              <span>f</span>
              <span>t</span>
              <span>in</span>
            </div>
          </div>
        </div>
        <p className={styles.copyright}>(c) 2024 SmartAppointments. All rights reserved.</p>
      </footer>
    </main>
  );
}

