"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import styles from "./Navigation.module.css";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/live/m-001", label: "Live", isLive: true },
  { href: "/tickets", label: "Tickets" },
  { href: "/profile", label: "Profile" },
  { href: "/about/how-it-works", label: "How It Works" },
];

const opsLinks = [
  { href: "/ops", label: "Command Deck" },
  { href: "/ops/twin", label: "Digital Twin" },
  { href: "/ops/evac", label: "Evacuation" },
  { href: "/ops/energy", label: "Energy" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showOps, setShowOps] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="#FFB703" strokeWidth="1.5" opacity="0.6" />
                <circle cx="14" cy="14" r="7" stroke="#FFB703" strokeWidth="1.5" />
                <circle cx="14" cy="14" r="2.5" fill="#FFB703" />
                <line x1="14" y1="2" x2="14" y2="7" stroke="#FFB703" strokeWidth="1" opacity="0.4" />
                <line x1="14" y1="21" x2="14" y2="26" stroke="#FFB703" strokeWidth="1" opacity="0.4" />
                <line x1="2" y1="14" x2="7" y2="14" stroke="#FFB703" strokeWidth="1" opacity="0.4" />
                <line x1="21" y1="14" x2="26" y2="14" stroke="#FFB703" strokeWidth="1" opacity="0.4" />
              </svg>
            </div>
            <span className={styles.logoText}>SmartStadium</span>
          </Link>

          {/* Desktop Links */}
          <div className={styles.links}>
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} className={styles.link}>
                {link.isLive && (
                  <span className={styles.liveDot} />
                )}
                {link.label}
              </Link>
            ))}
            <div className={styles.opsToggle}>
              <button
                onClick={() => setShowOps(!showOps)}
                className={`${styles.link} ${styles.opsBtn}`}
              >
                Ops Console
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ transform: showOps ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              <AnimatePresence>
                {showOps && (
                  <motion.div
                    className={styles.opsDropdown}
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {opsLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={styles.opsLink}
                        onClick={() => setShowOps(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className={styles.bar}
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            />
            <motion.span
              className={styles.bar}
              animate={mobileOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
            />
            <motion.span
              className={styles.bar}
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className={styles.mobileMenu}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.mobileLinks}>
                {publicLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className={styles.mobileLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.isLive && <span className={styles.liveDot} />}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <div className={styles.mobileDivider} />
                <p className={styles.mobileLabel}>Operations</p>
                {opsLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (publicLinks.length + i) * 0.05 + 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className={styles.mobileLink}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
