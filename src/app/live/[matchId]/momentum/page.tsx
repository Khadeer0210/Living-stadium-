"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Navigation from "@/components/shared/Navigation";
import { liveMatch } from "@/lib/mock-data";
import { getSimulator, type MomentumPoint } from "@/lib/ws-simulator";
import styles from "./page.module.css";

export default function MomentumPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<MomentumPoint[]>([]);
  const animRef = useRef<number>(0);
  const [currentDb, setCurrentDb] = useState(0);
  const [currentState, setCurrentState] = useState<string>("ambient");
  const [peakDb, setPeakDb] = useState(0);
  const [spikeCount, setSpikeCount] = useState(0);
  const [clippedMoment, setClippedMoment] = useState<string | null>(null);

  const handleClip = useCallback(() => {
    setClippedMoment(`Moment clipped at ${currentDb.toFixed(1)} dB — ${new Date().toLocaleTimeString()}`);
    setTimeout(() => setClippedMoment(null), 3000);
  }, [currentDb]);

  useEffect(() => {
    const sim = getSimulator();
    let localSpikes = 0;
    let localPeak = 0;

    const unsub = sim.onMomentum((point) => {
      dataRef.current.push(point);
      // Keep last 300 points (150 seconds at 500ms intervals)
      if (dataRef.current.length > 300) {
        dataRef.current = dataRef.current.slice(-300);
      }
      setCurrentDb(point.db);
      setCurrentState(point.state);
      if (point.db > localPeak) {
        localPeak = point.db;
        setPeakDb(localPeak);
      }
      if (point.state === "celebration") {
        localSpikes++;
        setSpikeCount(localSpikes);
      }
    });

    sim.start();

    return () => {
      unsub();
    };
  }, []);

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      const data = dataRef.current;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += h / 6) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // dB scale labels
      ctx.font = "11px 'IBM Plex Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.textAlign = "right";
      for (let i = 0; i <= 5; i++) {
        const y = (h / 5) * i;
        const dbVal = 120 - (i * 24);
        ctx.fillText(`${dbVal} dB`, w - 8, y + 14);
      }

      if (data.length < 2) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Main waveform
      const pointSpacing = w / Math.min(data.length, 200);
      const startIdx = Math.max(0, data.length - 200);

      // Glow layer
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 209, 102, 0.12)";
      ctx.lineWidth = 12;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let i = startIdx; i < data.length; i++) {
        const x = (i - startIdx) * pointSpacing;
        const y = h - (data[i].intensity / 100) * h * 0.85 - h * 0.05;
        if (i === startIdx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Main line
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // Gradient stroke
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "#EF233C");
      gradient.addColorStop(0.3, "#FFB703");
      gradient.addColorStop(0.7, "#FFD166");
      gradient.addColorStop(1, "#2A9D8F");
      ctx.strokeStyle = gradient;

      for (let i = startIdx; i < data.length; i++) {
        const x = (i - startIdx) * pointSpacing;
        const y = h - (data[i].intensity / 100) * h * 0.85 - h * 0.05;
        if (i === startIdx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Fill under curve
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
      fillGrad.addColorStop(0, "rgba(255, 183, 3, 0.08)");
      fillGrad.addColorStop(1, "rgba(255, 183, 3, 0)");
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Spike markers
      for (let i = startIdx; i < data.length; i++) {
        if (data[i].state === "celebration") {
          const x = (i - startIdx) * pointSpacing;
          const y = h - (data[i].intensity / 100) * h * 0.85 - h * 0.05;
          
          // Spike glow
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(239, 35, 60, 0.2)";
          ctx.fill();

          // Spike dot
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#EF233C";
          ctx.fill();
        }
      }

      // Current value line
      if (data.length > 0) {
        const lastPoint = data[data.length - 1];
        const lastY = h - (lastPoint.intensity / 100) * h * 0.85 - h * 0.05;
        
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "rgba(255, 183, 3, 0.3)";
        ctx.lineWidth = 1;
        ctx.moveTo(0, lastY);
        ctx.lineTo(w, lastY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const stateColor = currentState === "celebration" ? "var(--crimson-live)" :
                     currentState === "elevated" ? "var(--floodlight-gold)" :
                     "var(--turf-success)";

  return (
    <main className={styles.page}>
      <Navigation />
      <div className={styles.header}>
        <Link href={`/live/${liveMatch.id}`} className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Live Hub
        </Link>
        <div className={styles.headerCenter}>
          <span className="pulse-badge">
            <span className="pulse-badge__dot animate-glow" />
            LIVE MOMENTUM
          </span>
        </div>
        <button className={`btn btn-secondary ${styles.clipBtn}`} onClick={handleClip}>
          ✂️ Clip Moment
        </button>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: stateColor }}>
            {currentDb.toFixed(1)}
          </span>
          <span className={styles.statLabel}>Current dB</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{peakDb.toFixed(1)}</span>
          <span className={styles.statLabel}>Peak dB</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statValue} ${styles.stateIndicator}`} style={{ color: stateColor }}>
            {currentState.toUpperCase()}
          </span>
          <span className={styles.statLabel}>Crowd State</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue} style={{ color: "var(--crimson-live)" }}>{spikeCount}</span>
          <span className={styles.statLabel}>Celebrations</span>
        </div>
      </div>

      {/* Canvas Waveform */}
      <div className={styles.waveformContainer}>
        <canvas ref={canvasRef} className={styles.waveformCanvas} />
        <div className={styles.waveformEdgeFade} />
      </div>

      {/* Clip toast */}
      {clippedMoment && (
        <motion.div
          className={styles.clipToast}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          {clippedMoment}
        </motion.div>
      )}

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--turf-success)" }} />
          <span>Ambient</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--floodlight-gold)" }} />
          <span>Elevated</span>
        </div>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: "var(--crimson-live)" }} />
          <span>Celebration</span>
        </div>
      </div>
    </main>
  );
}
