"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";

const systems = [
  { name: "The Nervous System", emoji: "⚡", color: "#FFB703", desc: "847 sensors — acoustic, thermal, LIDAR — form the stadium's senses. Every 12 milliseconds, a fresh reading streams to the orchestration brain. The stadium feels the crowd before any human operator could.", stat: "847 sensors, 12ms latency", visual: "Sensor data flows like electrical signals through nerves" },
  { name: "The Circulatory System", emoji: "🌊", color: "#2A9D8F", desc: "Ant-colony optimisation re-scores every corridor every 30 seconds based on live density. The result: 24,000 phones receive the least-congested path to their food stall, gate, or seat — without any human hand-tuning routing rules.", stat: "30s refresh, 24,000 concurrent routes", visual: "Crowd flow like blood through arteries" },
  { name: "The Muscles", emoji: "🔋", color: "#FFD166", desc: "Piezoelectric tiles beneath 34,000 feet, solar membranes on the canopy, micro-turbines in the ventilation stacks. Together they generate 61% of the stadium's match-day energy. The crowd doesn't just watch — they power the experience.", stat: "61.5% self-powered", visual: "Energy generation from human movement" },
  { name: "The Immune System", emoji: "🛡️", color: "#6A4C93", desc: "Graph-based dynamic evacuation using the same concourse topology as the Circulatory System — so the two never disagree on venue geometry. Safety wins over every other system, unconditionally, encoded as a static priority constant.", stat: "<90s full evacuation", visual: "Evacuation routes light up like immune response" },
  { name: "The Brain", emoji: "🧠", color: "#EF233C", desc: "A priority-ordered rule table — deliberately simple, deliberately not a black-box model. When the Immune System says 'clear Gate 3,' the Brain doesn't ask questions. Every arbitration decision is logged append-only for post-incident audit.", stat: "4.2 decisions/minute", visual: "Central orchestration hub" },
];

export default function HowItWorksPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--stadium-void)" }}>
      <Navigation />

      {/* Hero */}
      <section style={{ paddingTop: "calc(var(--nav-height) + 4rem)", paddingBottom: "4rem", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 1.5rem" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="label text-gold" style={{ display: "block", marginBottom: "var(--space-4)" }}>The Philosophy</span>
            <h1 className="heading-hero">How the Organism Thinks</h1>
            <p className="body-large" style={{ marginTop: "var(--space-6)" }}>
              Most "smart stadium" pitches are a pile of unrelated widgets bolted onto a ticketing site.
              This is different. The stadium is a single organism — five subsystems, one shared nervous system of data.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Scrollytelling Sections */}
      {systems.map((sys, i) => (
        <SystemSection key={sys.name} system={sys} index={i} />
      ))}

      {/* Closing */}
      <section style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <h2 className="heading-section">One Stadium. One Heartbeat.</h2>
          <p className="body-large" style={{ marginTop: "var(--space-4)" }}>
            When these five systems share data in real time, the stadium stops being a building.
            It becomes an organism that senses, adapts, protects, and powers itself.
          </p>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}

function SystemSection({ system, index }: { system: typeof systems[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const x = useTransform(scrollYProgress, [0, 0.3], [index % 2 === 0 ? -60 : 60, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ opacity, padding: "6rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.03)" }}
    >
      <motion.div
        style={{ x, maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}
      >
        <div style={{ order: index % 2 === 0 ? 0 : 1 }}>
          <span style={{ fontSize: "3rem" }}>{system.emoji}</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", fontWeight: 400, color: "var(--chrome-100)", marginTop: "var(--space-4)", letterSpacing: "-0.02em" }}>
            {system.name}
          </h2>
          <p style={{ fontSize: "var(--text-base)", color: "var(--chrome-60)", lineHeight: 1.7, marginTop: "var(--space-4)" }}>
            {system.desc}
          </p>
          <div style={{ marginTop: "var(--space-4)", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: system.color, fontWeight: 600 }}>
            {system.stat}
          </div>
        </div>
        <div style={{ order: index % 2 === 0 ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 280, height: 280, borderRadius: "50%",
            background: `radial-gradient(circle, ${system.color}15 0%, ${system.color}05 50%, transparent 70%)`,
            border: `1px solid ${system.color}20`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "5rem",
          }}>
            {system.emoji}
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
