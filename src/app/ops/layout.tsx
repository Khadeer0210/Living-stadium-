"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import styles from "./layout.module.css";

const opsRoutes = [
  { href: "/ops", label: "Command Deck", icon: "⚡" },
  { href: "/ops/twin", label: "Digital Twin", icon: "🏟️" },
  { href: "/ops/evac", label: "Evacuation", icon: "🛡️" },
  { href: "/ops/energy", label: "Energy Autopsy", icon: "🔋" },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <motion.aside
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#FFB703" strokeWidth="1.5" opacity="0.6" />
              <circle cx="14" cy="14" r="7" stroke="#FFB703" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="2.5" fill="#FFB703" />
            </svg>
            <span>SmartStadium</span>
          </Link>
          <span className={styles.opsLabel}>OPS CONSOLE</span>
        </div>

        <nav className={styles.sidebarNav}>
          {opsRoutes.map((route) => (
            <Link key={route.href} href={route.href} className={styles.navItem}>
              <span className={styles.navIcon}>{route.icon}</span>
              <span>{route.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.authBadge}>
            <span className={styles.authDot} />
            <span>Ops Level: Admin</span>
          </div>
          <Link href="/" className={styles.exitLink}>
            ← Exit to Public Site
          </Link>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className={styles.main}>
        <div className={styles.topBar}>
          <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 5H15M3 9H15M3 13H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className={styles.topBarRight}>
            <span className="pulse-badge">
              <span className="pulse-badge__dot animate-glow" />
              LIVE OPS
            </span>
          </div>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
