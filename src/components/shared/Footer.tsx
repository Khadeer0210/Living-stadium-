import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logoRow}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="#FFB703" strokeWidth="1.5" opacity="0.6" />
                <circle cx="14" cy="14" r="7" stroke="#FFB703" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="2.5" fill="#FFB703" />
              </svg>
              <span className={styles.logoText}>SmartStadium</span>
            </div>
            <p className={styles.tagline}>
              The stadium is a living organism. Five systems, one shared nervous system of data.
            </p>
          </div>

          {/* Fan Experience */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Fan Experience</h4>
            <Link href="/live/m-001" className={styles.footerLink}>Live Pulse Hub</Link>
            <Link href="/live/m-001/momentum" className={styles.footerLink}>Momentum Meter</Link>
            <Link href="/tickets" className={styles.footerLink}>Tickets</Link>
            <Link href="/profile/constellation" className={styles.footerLink}>Loyalty Constellation</Link>
          </div>

          {/* Operations */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Operations</h4>
            <Link href="/ops" className={styles.footerLink}>Command Deck</Link>
            <Link href="/ops/twin" className={styles.footerLink}>Digital Twin</Link>
            <Link href="/ops/evac" className={styles.footerLink}>Evacuation</Link>
            <Link href="/ops/energy" className={styles.footerLink}>Energy Autopsy</Link>
          </div>

          {/* Legal */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Legal & Trust</h4>
            <Link href="/legal/privacy" className={styles.footerLink}>Privacy (DPDP Act)</Link>
            <Link href="/legal/haptic-consent" className={styles.footerLink}>Haptic Consent</Link>
            <Link href="/about/how-it-works" className={styles.footerLink}>How the Organism Thinks</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 SmartStadium · Systems Design Track · Built for the future of live sport
          </p>
          <div className={styles.badges}>
            <span className={styles.badge}>DPDP Compliant</span>
            <span className={styles.badge}>WCAG 2.2</span>
            <span className={styles.badge}>ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
