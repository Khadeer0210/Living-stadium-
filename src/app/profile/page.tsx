"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import { userProfile, loyaltyEvents } from "@/lib/mock-data";

export default function ProfilePage() {
  const recentMatches = loyaltyEvents.slice(-5).reverse();
  return (
    <main style={{ minHeight: "100vh", background: "var(--stadium-void)" }}>
      <Navigation />
      <div style={{ paddingTop: "calc(var(--nav-height) + var(--space-8))", maxWidth: "var(--max-width)", margin: "0 auto", padding: "calc(var(--nav-height) + 2rem) 1.5rem 4rem" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="label text-gold">Profile</span>
          <h1 className="heading-section" style={{ marginTop: "var(--space-2)" }}>{userProfile.displayName}</h1>
          <p className="body-large" style={{ marginTop: "var(--space-2)" }}>
            {userProfile.loyaltyTier} Member · Fan since {userProfile.seasonSince} · {userProfile.matchesAttended} matches attended
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-4)", marginTop: "var(--space-8)" }}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="heading-card" style={{ marginBottom: "var(--space-4)" }}>Quick Stats</h3>
            {[
              { label: "Matches Attended", value: userProfile.matchesAttended },
              { label: "Loyalty Tier", value: userProfile.loyaltyTier },
              { label: "Favorite Stall", value: userProfile.favoriteStall },
              { label: "Fan Since", value: userProfile.seasonSince },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-2) 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="body-small">{s.label}</span>
                <span className="mono-data" style={{ color: "var(--floodlight-gold)" }}>{s.value}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
              <h3 className="heading-card">Recent Matches</h3>
              <Link href="/profile/constellation" className="chip chip-gold">View Constellation →</Link>
            </div>
            {recentMatches.map(m => (
              <div key={m.id} style={{ padding: "var(--space-2) 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--chrome-70)" }}>{m.eventTitle}</span>
                <span className="mono-data" style={{ fontSize: "var(--text-xs)", color: "var(--chrome-40)" }}>{m.date}</span>
              </div>
            ))}
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h3 className="heading-card" style={{ marginBottom: "var(--space-4)" }}>Data & Privacy</h3>
            <p className="body-small" style={{ marginBottom: "var(--space-4)" }}>
              Your data is protected under the DPDP Act 2023. You have full control.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
              <Link href="/legal/privacy" className="btn btn-secondary" style={{ fontSize: "var(--text-xs)", justifyContent: "flex-start" }}>Privacy Policy</Link>
              <Link href="/legal/haptic-consent" className="btn btn-secondary" style={{ fontSize: "var(--text-xs)", justifyContent: "flex-start" }}>Haptic Fandom Sync Settings</Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
