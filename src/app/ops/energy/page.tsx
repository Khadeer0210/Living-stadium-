"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { energySnapshot, venue } from "@/lib/mock-data";
import { getSimulator, type EnergyReading } from "@/lib/ws-simulator";
import styles from "./page.module.css";

export default function EnergyPage() {
  const [liveReading, setLiveReading] = useState<EnergyReading | null>(null);

  useEffect(() => {
    const sim = getSimulator();
    const unsub = sim.onEnergy((reading) => setLiveReading(reading));
    sim.start();
    return () => { unsub(); };
  }, []);

  const history = energySnapshot.history;

  return (
    <div className={styles.page}>
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={styles.title}>Energy Autopsy</h1>
        <p className={styles.subtitle}>{venue.name} · Self-generated vs grid power over 24 hours</p>
      </motion.div>

      {/* Big Numbers */}
      <div className={styles.bigNumbers}>
        {[
          { label: "Total Today", value: `${energySnapshot.totalKwh.toFixed(0)} kWh`, color: "var(--chrome-100)" },
          { label: "Self-Generated", value: `${energySnapshot.selfGeneratedKwh.toFixed(1)} kWh`, color: "var(--turf-success)" },
          { label: "Grid Drawn", value: `${energySnapshot.gridDrawnKwh.toFixed(1)} kWh`, color: "var(--floodlight-gold)" },
          { label: "Self-Powered", value: `${energySnapshot.selfGeneratedPct}%`, color: "var(--turf-success)" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className={styles.bigNum}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
          >
            <span className={styles.bigValue} style={{ color: item.color }}>{item.value}</span>
            <span className={styles.bigLabel}>{item.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        className={styles.chartCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className={styles.chartTitle}>24-Hour Energy Profile</h3>
        <div className={styles.chart}>
          <svg viewBox="0 0 720 200" className={styles.chartSvg}>
            {/* Grid */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={i} x1="0" y1={i * 50} x2="720" y2={i * 50} stroke="rgba(255,255,255,0.04)" />
            ))}

            {/* Self-generated area */}
            <path
              d={`M ${history.map((h, i) => `${i * 30},${200 - h.selfGenerated * 14}`).join(" L ")} L 690,200 L 0,200 Z`}
              fill="rgba(42, 157, 143, 0.15)"
            />
            <path
              d={`M ${history.map((h, i) => `${i * 30},${200 - h.selfGenerated * 14}`).join(" L ")}`}
              fill="none"
              stroke="#2A9D8F"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Grid drawn area */}
            <path
              d={`M ${history.map((h, i) => `${i * 30},${200 - h.gridDrawn * 14}`).join(" L ")} L 690,200 L 0,200 Z`}
              fill="rgba(255, 183, 3, 0.08)"
            />
            <path
              d={`M ${history.map((h, i) => `${i * 30},${200 - h.gridDrawn * 14}`).join(" L ")}`}
              fill="none"
              stroke="#FFB703"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeDasharray="6 3"
            />

            {/* Hour labels */}
            {[0, 6, 12, 18, 23].map(h => (
              <text key={h} x={h * 30} y="196" fill="var(--chrome-40)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
                {`${String(h).padStart(2, "0")}:00`}
              </text>
            ))}
          </svg>
        </div>
        <div className={styles.chartLegend}>
          <span className={styles.legendItem}><span className={styles.legendLine} style={{ background: "var(--turf-success)" }} />Self-Generated</span>
          <span className={styles.legendItem}><span className={styles.legendLine} style={{ background: "var(--floodlight-gold)", borderStyle: "dashed" }} />Grid Drawn</span>
        </div>
      </motion.div>

      {/* Sources Breakdown */}
      <div className={styles.sourcesGrid}>
        {[
          { name: "Solar Panels", value: energySnapshot.solarKwh, icon: "☀️", color: "var(--floodlight-gold)" },
          { name: "Piezoelectric Floor", value: energySnapshot.piezoFloorKwh, icon: "👣", color: "var(--turf-success)" },
          { name: "Wind Turbines", value: energySnapshot.windKwh, icon: "💨", color: "var(--violet-safety)" },
        ].map((src, i) => (
          <motion.div
            key={src.name}
            className={styles.sourceCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
          >
            <span className={styles.sourceIcon}>{src.icon}</span>
            <span className={styles.sourceValue} style={{ color: src.color }}>{src.value} kWh</span>
            <span className={styles.sourceName}>{src.name}</span>
            {liveReading && src.name === "Piezoelectric Floor" && (
              <span className={styles.liveIndicator}>
                Live: {liveReading.piezoOutput.toFixed(1)} kW
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
