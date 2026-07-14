"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import { liveMatch, venue } from "@/lib/mock-data";
import styles from "./page.module.css";

export default function LivePulseHub() {
  const [activeTab, setActiveTab] = useState<"overview" | "momentum" | "concourse">("overview");

  return (
    <main>
      <Navigation />
      <div className={styles.page}>
        {/* Match Header */}
        <motion.div
          className={styles.matchHeader}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.matchBadge}>
            <span className="pulse-badge">
              <span className="pulse-badge__dot animate-glow" />
              LIVE
            </span>
            <span className={styles.matchVenue}>{venue.name} · {liveMatch.overs.away} overs</span>
          </div>

          <div className={styles.scoreBoard}>
            <div className={styles.team}>
              <div className={styles.teamBadge} style={{ background: liveMatch.homeTeam.color }}>
                {liveMatch.homeTeam.short}
              </div>
              <span className={styles.teamName}>{liveMatch.homeTeam.name}</span>
            </div>
            <div className={styles.scoreCenter}>
              <span className={styles.scoreNum}>{liveMatch.score.home}</span>
              <span className={styles.scoreDash}>—</span>
              <span className={styles.scoreNum}>{liveMatch.score.away}</span>
            </div>
            <div className={styles.team}>
              <div className={styles.teamBadge} style={{ background: liveMatch.awayTeam.color }}>
                {liveMatch.awayTeam.short}
              </div>
              <span className={styles.teamName}>{liveMatch.awayTeam.name}</span>
            </div>
          </div>

          <div className={styles.matchMeta}>
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="var(--chrome-40)" strokeWidth="1" /><path d="M7 4V7L9 9" stroke="var(--chrome-40)" strokeWidth="1" strokeLinecap="round" /></svg>
              Match Minute {liveMatch.matchMinute}
            </span>
            <span className={styles.metaItem}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L7 2L12 12H2Z" stroke="var(--chrome-40)" strokeWidth="1" strokeLinejoin="round" /></svg>
              {venue.currentOccupancy.toLocaleString()} / {venue.capacity.toLocaleString()} fans
            </span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {[
            { key: "overview", label: "Overview" },
            { key: "momentum", label: "Momentum", href: "/live/m-001/momentum" },
            { key: "concourse", label: "Concourse", href: "/live/m-001/concourse" },
          ].map((tab) => (
            tab.href ? (
              <Link key={tab.key} href={tab.href} className={styles.tab}>
                {tab.label}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 9L9 3M9 3H5M9 3V7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></svg>
              </Link>
            ) : (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
              >
                {tab.label}
              </button>
            )
          ))}
        </div>

        {/* Overview Content */}
        <motion.div
          className={styles.overviewGrid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* Quick Stats */}
          <div className={`glass-card ${styles.quickStats}`}>
            <h3 className={styles.cardTitle}>Match Pulse</h3>
            <div className={styles.pulseGrid}>
              {[
                { label: "Crowd dB", value: "78.4", color: "var(--floodlight-gold)" },
                { label: "Avg Queue", value: "6m", color: "var(--turf-success)" },
                { label: "Gate Flow", value: "94%", color: "var(--chrome-100)" },
                { label: "Spikes", value: "12", color: "var(--crimson-live)" },
              ].map((s) => (
                <div key={s.label} className={styles.pulseItem}>
                  <span className={styles.pulseValue} style={{ color: s.color }}>{s.value}</span>
                  <span className={styles.pulseLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Momentum Mini */}
          <Link href="/live/m-001/momentum" className={`glass-card ${styles.momentumMini}`}>
            <div className={styles.miniHeader}>
              <h3 className={styles.cardTitle}>Crowd Momentum</h3>
              <span className="chip chip-gold">View Full</span>
            </div>
            <div className={styles.miniWaveform}>
              <svg viewBox="0 0 400 80" className={styles.miniSvg}>
                <path
                  d="M0,40 Q20,35 40,40 Q60,20 80,35 Q100,50 120,40 Q140,15 160,30 Q180,45 200,40 Q220,10 240,30 Q260,50 280,40 Q300,25 320,35 Q340,45 360,40 Q380,30 400,40"
                  stroke="var(--floodlight-gold)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M0,40 Q20,35 40,40 Q60,20 80,35 Q100,50 120,40 Q140,15 160,30 Q180,45 200,40 Q220,10 240,30 Q260,50 280,40 Q300,25 320,35 Q340,45 360,40 Q380,30 400,40"
                  stroke="var(--floodlight-warm)"
                  strokeWidth="6"
                  fill="none"
                  opacity="0.15"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Link>

          {/* Concourse Mini */}
          <Link href="/live/m-001/concourse" className={`glass-card ${styles.concourseMini}`}>
            <div className={styles.miniHeader}>
              <h3 className={styles.cardTitle}>Concourse Status</h3>
              <span className="chip chip-gold">View Map</span>
            </div>
            <div className={styles.gateBars}>
              {venue.gates.map((gate) => {
                const pct = (gate.throughput / gate.maxThroughput) * 100;
                const color = pct > 90 ? "var(--crimson-live)" : pct > 70 ? "var(--floodlight-gold)" : "var(--turf-success)";
                return (
                  <div key={gate.id} className={styles.gateBar}>
                    <span className={styles.gateLabel}>{gate.label.split(" — ")[0]}</span>
                    <div className={styles.barTrack}>
                      <div className={styles.barFill} style={{ width: `${pct}%`, background: color }} />
                    </div>
                    <span className={styles.gatePct} style={{ color }}>{Math.round(pct)}%</span>
                  </div>
                );
              })}
            </div>
          </Link>

          {/* Systems Health */}
          <div className={`glass-card ${styles.systemsHealth}`}>
            <h3 className={styles.cardTitle}>Systems Health</h3>
            <div className={styles.healthList}>
              {[
                { name: "Nervous System", status: "nominal", color: "var(--turf-success)" },
                { name: "Circulatory", status: "elevated", color: "var(--floodlight-gold)" },
                { name: "Muscles", status: "nominal", color: "var(--turf-success)" },
                { name: "Immune", status: "ready", color: "var(--turf-success)" },
                { name: "Brain", status: "active", color: "var(--floodlight-gold)" },
              ].map((sys) => (
                <div key={sys.name} className={styles.healthItem}>
                  <span className={styles.healthDot} style={{ background: sys.color }} />
                  <span className={styles.healthName}>{sys.name}</span>
                  <span className={styles.healthStatus} style={{ color: sys.color }}>{sys.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}
