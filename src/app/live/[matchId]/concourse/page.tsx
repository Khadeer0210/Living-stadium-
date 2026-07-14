"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import Navigation from "@/components/shared/Navigation";
import { concourseNodes, concourseEdges, venue, liveMatch } from "@/lib/mock-data";
import { getSimulator, type DensitySnapshot } from "@/lib/ws-simulator";
import styles from "./page.module.css";

type NodeData = typeof concourseNodes[number] & { density: number };

function getDensityColor(d: number): string {
  if (d > 0.85) return "#EF233C";
  if (d > 0.7) return "#FFB703";
  if (d > 0.5) return "#FFD166";
  return "#2A9D8F";
}

function getDensityLabel(d: number): string {
  if (d > 0.85) return "Critical";
  if (d > 0.7) return "High";
  if (d > 0.5) return "Moderate";
  return "Clear";
}

export default function ConcoursePage() {
  const [nodes, setNodes] = useState<NodeData[]>(concourseNodes.map(n => ({ ...n, density: n.density })));
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const sim = getSimulator();
    const unsub = sim.onDensity((snapshots: DensitySnapshot[]) => {
      setNodes(prev => prev.map(node => {
        const snap = snapshots.find(s => s.nodeId === node.id);
        return snap ? { ...node, density: snap.density } : node;
      }));
      setLastUpdate(new Date());
    });
    sim.start();
    return () => { unsub(); };
  }, []);

  return (
    <main className={styles.page}>
      <Navigation />
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <Link href={`/live/${liveMatch.id}`} className={styles.backLink}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Live Hub
            </Link>
            <h1 className={styles.title}>Live Pulse Map</h1>
            <p className={styles.subtitle}>
              {venue.name} · Updated {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="pulse-badge">
            <span className="pulse-badge__dot animate-glow" />
            LIVE · 30s REFRESH
          </div>
        </div>

        <div className={styles.mapContainer}>
          {/* SVG Map */}
          <svg viewBox="0 0 800 620" className={styles.mapSvg}>
            {/* Stadium outline */}
            <ellipse cx="400" cy="310" rx="370" ry="270" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <ellipse cx="400" cy="310" rx="280" ry="200" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="8 4" />

            {/* Pitch rectangle */}
            <rect x="280" y="230" width="240" height="160" rx="8" fill="rgba(42,157,143,0.06)" stroke="rgba(42,157,143,0.15)" strokeWidth="1" />
            <text x="400" y="315" textAnchor="middle" fill="rgba(42,157,143,0.3)" fontSize="14" fontFamily="var(--font-mono)">PITCH</text>

            {/* Edges */}
            {concourseEdges.map((edge, i) => {
              const from = nodes.find(n => n.id === edge.from);
              const to = nodes.find(n => n.id === edge.to);
              if (!from || !to) return null;
              const avgDensity = (from.density + to.density) / 2;
              return (
                <line
                  key={i}
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={getDensityColor(avgDensity)}
                  strokeWidth="2"
                  opacity="0.25"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isStall = node.type === "stall";
              const isGate = node.type === "gate";
              const isExit = node.type === "exit";
              const r = isStall ? 18 : isGate ? 22 : isExit ? 16 : 12;
              const color = getDensityColor(node.density);

              return (
                <g
                  key={node.id}
                  className={styles.mapNode}
                  onClick={() => setSelectedNode(selectedNode?.id === node.id ? null : node)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Density halo */}
                  <circle cx={node.x} cy={node.y} r={r + 12} fill={color} opacity={node.density * 0.1} />
                  <circle cx={node.x} cy={node.y} r={r + 6} fill={color} opacity={node.density * 0.15} />

                  {/* Node circle */}
                  <circle
                    cx={node.x} cy={node.y} r={r}
                    fill="var(--stadium-surface)"
                    stroke={color}
                    strokeWidth={selectedNode?.id === node.id ? 3 : 1.5}
                    opacity={0.9}
                  />

                  {/* Icon/Label */}
                  <text
                    x={node.x} y={node.y + 4}
                    textAnchor="middle"
                    fill={color}
                    fontSize={isStall || isGate ? "10" : "8"}
                    fontFamily="var(--font-mono)"
                    fontWeight="600"
                  >
                    {isGate ? "G" : isStall ? "🍔" : isExit ? "🚪" : "•"}
                  </text>

                  {/* Label below */}
                  <text
                    x={node.x} y={node.y + r + 16}
                    textAnchor="middle"
                    fill="var(--chrome-60)"
                    fontSize="10"
                    fontFamily="var(--font-body)"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Detail Panel */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                className={styles.detailPanel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.detailHeader}>
                  <h3>{selectedNode.label}</h3>
                  <button className={styles.detailClose} onClick={() => setSelectedNode(null)}>✕</button>
                </div>
                <div className={styles.detailType}>{selectedNode.type.toUpperCase()}</div>
                <div className={styles.detailStats}>
                  <div className={styles.detailStat}>
                    <span className={styles.detailValue} style={{ color: getDensityColor(selectedNode.density) }}>
                      {Math.round(selectedNode.density * 100)}%
                    </span>
                    <span className={styles.detailLabel}>Density</span>
                  </div>
                  <div className={styles.detailStat}>
                    <span className={styles.detailValue} style={{ color: getDensityColor(selectedNode.density) }}>
                      {getDensityLabel(selectedNode.density)}
                    </span>
                    <span className={styles.detailLabel}>Status</span>
                  </div>
                  {selectedNode.type === "stall" && "waitTime" in selectedNode && (
                    <>
                      <div className={styles.detailStat}>
                        <span className={styles.detailValue}>{(selectedNode as { waitTime: number }).waitTime}m</span>
                        <span className={styles.detailLabel}>Wait Time</span>
                      </div>
                      <div className={styles.detailStat}>
                        <span className={styles.detailValue} style={{ color: (selectedNode as { worthWalk: number }).worthWalk > 7 ? "var(--turf-success)" : "var(--floodlight-gold)" }}>
                          {(selectedNode as { worthWalk: number }).worthWalk.toFixed(1)}
                        </span>
                        <span className={styles.detailLabel}>Worth the Walk</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Density bar */}
                <div className={styles.densityBarWrap}>
                  <div className={styles.densityBarTrack}>
                    <motion.div
                      className={styles.densityBarFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedNode.density * 100}%` }}
                      style={{ background: getDensityColor(selectedNode.density) }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {[
            { color: "#2A9D8F", label: "Clear (<50%)" },
            { color: "#FFD166", label: "Moderate (50-70%)" },
            { color: "#FFB703", label: "High (70-85%)" },
            { color: "#EF233C", label: "Critical (>85%)" },
          ].map(item => (
            <div key={item.label} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
