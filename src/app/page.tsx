"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import { liveMatch, venue, generateMomentumData, upcomingEvents } from "@/lib/mock-data";
import styles from "./page.module.css";

const HeroParticles = dynamic(() => import("@/components/hero/HeroParticles"), {
  ssr: false,
  loading: () => <div className={styles.particleFallback} />,
});

/* ---- Mini Momentum Waveform (Canvas) ---- */
function MiniWaveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef(generateMomentumData(120));
  const animFrameRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      const data = dataRef.current;
      offsetRef.current += 0.3;

      // Draw waveform
      ctx.beginPath();
      ctx.strokeStyle = "#FFB703";
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let i = 0; i < w; i++) {
        const dataIdx = Math.floor((i + offsetRef.current) % data.length);
        const point = data[dataIdx];
        const y = h - (point.intensity / 100) * h * 0.8 - h * 0.1;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Glow effect
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = "#FFD166";
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Baseline
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      ctx.moveTo(0, h * 0.5);
      ctx.lineTo(w, h * 0.5);
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return <canvas ref={canvasRef} className={styles.waveformCanvas} />;
}

/* ---- Animated Counter ---- */
function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return <span ref={ref} className="mono-data">{count.toLocaleString()}{suffix}</span>;
}

/* ---- Countdown Timer ---- */
function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = Math.max(0, target - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className={styles.countdown}>
      {Object.entries(timeLeft).map(([unit, val]) => (
        <div key={unit} className={styles.countdownUnit}>
          <span className={styles.countdownNum}>{String(val).padStart(2, "0")}</span>
          <span className={styles.countdownLabel}>{unit}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Five Systems Card ---- */
const systems = [
  {
    name: "Nervous System",
    icon: "⚡",
    desc: "847 sensors feeding real-time data. Acoustic, thermal, LIDAR — the stadium's senses.",
    color: "#FFB703",
    stat: "12ms",
    statLabel: "Latency",
  },
  {
    name: "Circulatory System",
    icon: "🌊",
    desc: "Ant-colony routing optimises crowd flow every 30 seconds. No bottleneck goes unnoticed.",
    color: "#2A9D8F",
    stat: "30s",
    statLabel: "Refresh cycle",
  },
  {
    name: "Muscles",
    icon: "🔋",
    desc: "Piezoelectric floors, solar panels, and wind turbines. The stadium generates its own energy.",
    color: "#FFD166",
    stat: "61%",
    statLabel: "Self-powered",
  },
  {
    name: "Immune System",
    icon: "🛡️",
    desc: "Graph-based evacuation with capacity-aware Dijkstra. Safety always wins, unconditionally.",
    color: "#6A4C93",
    stat: "<90s",
    statLabel: "Full evac time",
  },
  {
    name: "The Brain",
    icon: "🧠",
    desc: "Priority-ordered arbitration engine. Not a black box — every decision is logged and auditable.",
    color: "#EF233C",
    stat: "4.2/m",
    statLabel: "Decisions",
  },
];

/* ---- MAIN PAGE ---- */
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 60]);

  const getTimeDiff = useCallback(() => {
    const start = new Date(liveMatch.startsAt).getTime();
    return Math.floor((Date.now() - start) / 60000);
  }, []);

  return (
    <main>
      <Navigation />

      {/* ========== HERO ========== */}
      <motion.section
        ref={heroRef}
        className={styles.hero}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
      >
        <HeroParticles />
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              <span>Live Match · {venue.name}</span>
            </div>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            The Stadium
            <br />
            <span className={styles.heroAccent}>is Alive</span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Five interconnected systems. One living organism.
            <br />
            Real-time crowd intelligence for the future of live sport.
          </motion.p>

          <motion.div
            className={styles.heroCtas}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/live/m-001" className="btn btn-primary btn-lg">
              Enter Live Pulse
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <Link href="/about/how-it-works" className="btn btn-secondary btn-lg">
              How It Works
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <div className={styles.scrollLine}>
            <div className={styles.scrollDot} />
          </div>
        </motion.div>
      </motion.section>

      {/* ========== LIVE MOMENTUM TEASER ========== */}
      <section className={styles.momentumTeaser}>
        <div className={styles.container}>
          <motion.div
            className={styles.momentumCard}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.momentumHeader}>
              <div>
                <div className="pulse-badge">
                  <span className="pulse-badge__dot animate-glow" />
                  LIVE
                </div>
                <h3 className={styles.momentumTitle}>
                  {liveMatch.homeTeam.short} {liveMatch.score.home} — {liveMatch.score.away} {liveMatch.awayTeam.short}
                </h3>
                <p className={styles.momentumMeta}>
                  Over {liveMatch.overs.away} · {getTimeDiff()}th minute · Crowd Momentum
                </p>
              </div>
              <Link href="/live/m-001/momentum" className="btn btn-secondary">
                Full Screen
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 13L13 1M13 1H5M13 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className={styles.waveformWrap}>
              <MiniWaveform />
              <div className={styles.waveformOverlay} />
            </div>
            <div className={styles.momentumStats}>
              <div className={styles.momentumStat}>
                <span className={styles.momentumStatValue}>78.4</span>
                <span className={styles.momentumStatLabel}>dB Average</span>
              </div>
              <div className={styles.momentumStat}>
                <span className={styles.momentumStatValue} style={{ color: "var(--crimson-live)" }}>12</span>
                <span className={styles.momentumStatLabel}>Spike Events</span>
              </div>
              <div className={styles.momentumStat}>
                <span className={styles.momentumStatValue} style={{ color: "var(--turf-success)" }}>94.2</span>
                <span className={styles.momentumStatLabel}>Peak dB</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== FIVE SYSTEMS ========== */}
      <section className={styles.systemsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label text-gold">Architecture</span>
            <h2 className="heading-section">
              One Organism,<br />Five Systems
            </h2>
            <p className="body-large" style={{ maxWidth: 560 }}>
              Not bolted-on widgets. Not a ticketing site with a scoreboard. A single interconnected intelligence.
            </p>
          </motion.div>

          <div className={styles.systemsGrid}>
            {systems.map((sys, i) => (
              <motion.div
                key={sys.name}
                className={styles.systemCard}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.systemCardGlow} style={{ background: `radial-gradient(circle at 50% 0%, ${sys.color}15 0%, transparent 60%)` }} />
                <div className={styles.systemIcon}>{sys.icon}</div>
                <h3 className={styles.systemName}>{sys.name}</h3>
                <p className={styles.systemDesc}>{sys.desc}</p>
                <div className={styles.systemStatRow}>
                  <span className={styles.systemStatVal} style={{ color: sys.color }}>{sys.stat}</span>
                  <span className={styles.systemStatLabel}>{sys.statLabel}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className={styles.statsBar}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              { value: 40000, suffix: "", label: "Capacity" },
              { value: 847, suffix: "", label: "Active Sensors" },
              { value: 12, suffix: "ms", label: "Avg Latency" },
              { value: 61, suffix: "%", label: "Self-Powered" },
              { value: 24000, suffix: "", label: "Concurrent Users" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.statItem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <span className={styles.statValue}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEXT FIXTURE ========== */}
      <section className={styles.fixtureSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="label text-gold">Upcoming</span>
            <h2 className="heading-section">Next at {venue.name}</h2>
          </motion.div>

          <div className={styles.fixturesGrid}>
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                className={`glass-card ${styles.fixtureCard}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className={styles.fixtureDate}>
                  {new Date(event.startsAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
                <h3 className={styles.fixtureName}>{event.title}</h3>
                <p className={styles.fixtureTime}>
                  {new Date(event.startsAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" · "}
                  {event.venue}
                </p>
                {i === 0 && <CountdownTimer targetDate={event.startsAt} />}
                <div className={styles.fixtureBottom}>
                  <span className={styles.fixturePrice}>
                    ₹{event.priceRange[0].toLocaleString()} — ₹{event.priceRange[1].toLocaleString()}
                  </span>
                  {event.ticketsAvailable > 0 ? (
                    <Link href="/tickets" className="btn btn-primary">Book Now</Link>
                  ) : (
                    <span className="chip chip-live">Sold Out</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SIGNATURE FEATURES ========== */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="label text-gold">The Experience</span>
            <h2 className="heading-section">Not Just a Ticketing Site</h2>
            <p className="body-large" style={{ maxWidth: 560 }}>
              A second screen for match day. Something you open during the game, forty times a season.
            </p>
          </motion.div>

          <div className={styles.featuresGrid}>
            {[
              {
                title: "Live Momentum Meter",
                desc: "Full-bleed ECG waveform driven by acoustic sensors. Tap any spike to clip that moment.",
                href: "/live/m-001/momentum",
                gradient: "linear-gradient(135deg, #FFB70320 0%, #FFD16610 100%)",
              },
              {
                title: "Live Pulse Map",
                desc: "Real-time concourse heat overlay. See wait times, find the best route, avoid the crowds.",
                href: "/live/m-001/concourse",
                gradient: "linear-gradient(135deg, #2A9D8F20 0%, #2A9D8F10 100%)",
              },
              {
                title: "Loyalty Constellation",
                desc: "Every match you attend becomes a star. Bigger occasions burn brighter. Share your sky.",
                href: "/profile/constellation",
                gradient: "linear-gradient(135deg, #6A4C9320 0%, #6A4C9310 100%)",
              },
              {
                title: "AR Seat Preview",
                desc: "Before you buy — see the actual sightline from any seat block. Not stock photos.",
                href: "/tickets",
                gradient: "linear-gradient(135deg, #EF233C20 0%, #EF233C10 100%)",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <Link href={feature.href} className={`glass-card ${styles.featureCard}`} style={{ background: feature.gradient }}>
                  <h3 className="heading-card">{feature.title}</h3>
                  <p className="body-small" style={{ marginTop: "var(--space-3)" }}>{feature.desc}</p>
                  <span className={styles.featureArrow}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 16L16 4M16 4H8M16 4V12" stroke="var(--floodlight-gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
