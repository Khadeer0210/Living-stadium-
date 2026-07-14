"use client";

import { motion } from "motion/react";
import { evacNodes, venue } from "@/lib/mock-data";
import styles from "./page.module.css";

function statusColor(s: string) {
  if (s === "critical") return "var(--crimson-live)";
  if (s === "warning") return "var(--floodlight-gold)";
  return "var(--turf-success)";
}

export default function EvacPage() {
  const criticalCount = evacNodes.filter(n => n.capacityStatus === "critical").length;
  const warningCount = evacNodes.filter(n => n.capacityStatus === "warning").length;
  const avgEvacTime = Math.round(evacNodes.reduce((a, n) => a + n.estimatedEvacSeconds, 0) / evacNodes.length);

  return (
    <div className={styles.page}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Evacuation Dashboard</h1>
        <p className={styles.subtitle}>Graph-based dynamic evacuation · Capacity-aware Dijkstra routing</p>
      </motion.div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {[
          { label: "Readiness", value: "GREEN", color: "var(--turf-success)" },
          { label: "Critical Zones", value: String(criticalCount), color: criticalCount > 0 ? "var(--crimson-live)" : "var(--turf-success)" },
          { label: "Warning Zones", value: String(warningCount), color: warningCount > 0 ? "var(--floodlight-gold)" : "var(--turf-success)" },
          { label: "Avg Evac Time", value: `${avgEvacTime}s`, color: avgEvacTime > 90 ? "var(--floodlight-gold)" : "var(--turf-success)" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            className={styles.summaryCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <span className={styles.summaryValue} style={{ color: card.color }}>{card.value}</span>
            <span className={styles.summaryLabel}>{card.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Node Table */}
      <motion.div
        className={styles.tableWrap}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Node</th>
              <th>Type</th>
              <th>Density</th>
              <th>Status</th>
              <th>Rec. Exit</th>
              <th>Est. Time</th>
            </tr>
          </thead>
          <tbody>
            {evacNodes.map((node) => (
              <tr key={node.id}>
                <td className={styles.nodeLabel}>{node.label}</td>
                <td><span className={styles.nodeType}>{node.type}</span></td>
                <td>
                  <div className={styles.densityCell}>
                    <div className={styles.densityMiniBar}>
                      <div className={styles.densityMiniFill} style={{ width: `${node.density * 100}%`, background: statusColor(node.capacityStatus) }} />
                    </div>
                    <span>{Math.round(node.density * 100)}%</span>
                  </div>
                </td>
                <td><span className={styles.statusBadge} style={{ color: statusColor(node.capacityStatus), borderColor: statusColor(node.capacityStatus) }}>{node.capacityStatus}</span></td>
                <td className={styles.exitCell}>{node.recommendedExit === "n-exit1" ? "Exit A" : "Exit B"}</td>
                <td className={styles.timeCell}>{node.estimatedEvacSeconds}s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <button className="btn btn-danger" style={{ marginTop: "var(--space-4)" }}>
        🚨 Simulate Evacuation Drill
      </button>
    </div>
  );
}
