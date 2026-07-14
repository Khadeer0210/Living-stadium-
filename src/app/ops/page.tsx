"use client";

import { motion } from "motion/react";
import { systemHealth, recentIncidents, venue, energySnapshot } from "@/lib/mock-data";
import styles from "./page.module.css";

const systemCards = [
  { key: "nervousSystem", name: "Nervous System", icon: "⚡", data: systemHealth.nervousSystem },
  { key: "circulatorySystem", name: "Circulatory System", icon: "🌊", data: systemHealth.circulatorySystem },
  { key: "muscles", name: "Muscles", icon: "🔋", data: systemHealth.muscles },
  { key: "immuneSystem", name: "Immune System", icon: "🛡️", data: systemHealth.immuneSystem },
  { key: "brain", name: "The Brain", icon: "🧠", data: systemHealth.brain },
];

function statusColor(s: string): string {
  if (s === "nominal" || s === "ready" || s === "green" || s === "normal") return "var(--turf-success)";
  if (s === "elevated" || s === "active") return "var(--floodlight-gold)";
  if (s === "critical" || s === "alert") return "var(--crimson-live)";
  return "var(--chrome-60)";
}

function severityColor(s: string): string {
  if (s === "warning") return "var(--floodlight-gold)";
  if (s === "critical") return "var(--crimson-live)";
  return "var(--chrome-40)";
}

export default function OpsCommandDeck() {
  return (
    <div className={styles.deck}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={styles.pageTitle}>Command Deck</h1>
        <p className={styles.pageSubtitle}>
          {venue.name} · {venue.currentOccupancy.toLocaleString()} / {venue.capacity.toLocaleString()} capacity ·
          All systems operational
        </p>
      </motion.div>

      {/* System Health Cards */}
      <div className={styles.systemsGrid}>
        {systemCards.map((sys, i) => {
          const entries = Object.entries(sys.data);
          return (
            <motion.div
              key={sys.key}
              className={styles.systemCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <div className={styles.systemHeader}>
                <span className={styles.systemIcon}>{sys.icon}</span>
                <h3 className={styles.systemName}>{sys.name}</h3>
                <span className={styles.systemStatus} style={{ color: statusColor(String(entries[0][1])) }}>
                  {String(entries[0][1]).toUpperCase()}
                </span>
              </div>
              <div className={styles.systemMetrics}>
                {entries.slice(1).map(([key, val]) => (
                  <div key={key} className={styles.metric}>
                    <span className={styles.metricValue}>{String(val)}</span>
                    <span className={styles.metricLabel}>{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Row: Incidents + Energy */}
      <div className={styles.bottomGrid}>
        {/* Recent Incidents */}
        <motion.div
          className={styles.incidentsCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h3 className={styles.cardTitle}>Recent Events</h3>
          <div className={styles.incidentsList}>
            {recentIncidents.map((inc) => (
              <div key={inc.id} className={styles.incident}>
                <span className={styles.incidentTime}>{inc.time}</span>
                <span className={styles.incidentSeverity} style={{ color: severityColor(inc.severity) }}>
                  {inc.severity === "warning" ? "⚠" : inc.severity === "critical" ? "🔴" : "○"}
                </span>
                <span className={styles.incidentSystem}>{inc.system}</span>
                <span className={styles.incidentDetail}>{inc.detail}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Energy Quick */}
        <motion.div
          className={styles.energyCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className={styles.cardTitle}>Energy Overview</h3>
          <div className={styles.energyCircle}>
            <svg viewBox="0 0 120 120" className={styles.energySvg}>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="var(--turf-success)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${energySnapshot.selfGeneratedPct * 3.14} ${(100 - energySnapshot.selfGeneratedPct) * 3.14}`}
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="55" textAnchor="middle" fill="var(--chrome-100)" fontSize="20" fontWeight="700" fontFamily="var(--font-mono)">
                {energySnapshot.selfGeneratedPct}%
              </text>
              <text x="60" y="72" textAnchor="middle" fill="var(--chrome-40)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.05em">
                SELF-POWERED
              </text>
            </svg>
          </div>
          <div className={styles.energyBreakdown}>
            <div className={styles.energyItem}>
              <span className={styles.energyDot} style={{ background: "var(--turf-success)" }} />
              <span>Solar: {energySnapshot.solarKwh} kWh</span>
            </div>
            <div className={styles.energyItem}>
              <span className={styles.energyDot} style={{ background: "var(--floodlight-gold)" }} />
              <span>Piezo: {energySnapshot.piezoFloorKwh} kWh</span>
            </div>
            <div className={styles.energyItem}>
              <span className={styles.energyDot} style={{ background: "var(--violet-safety)" }} />
              <span>Wind: {energySnapshot.windKwh} kWh</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
