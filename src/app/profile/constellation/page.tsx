"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import { loyaltyEvents, userProfile } from "@/lib/mock-data";
import styles from "./page.module.css";

interface StarData {
  id: string;
  title: string;
  date: string;
  significance: number;
  position: [number, number, number];
}

/* Star Points */
function ConstellationStars({ stars, onHover, onUnhover, selectedId }: {
  stars: StarData[];
  onHover: (star: StarData) => void;
  onUnhover: () => void;
  selectedId: string | null;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Points>(null);

  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(stars.length * 3);
    const siz = new Float32Array(stars.length);
    const col = new Float32Array(stars.length * 3);

    const goldColor = new THREE.Color("#FFB703");
    const warmColor = new THREE.Color("#FFD166");
    const brightColor = new THREE.Color("#F5F5F7");

    stars.forEach((star, i) => {
      pos[i * 3] = star.position[0];
      pos[i * 3 + 1] = star.position[1];
      pos[i * 3 + 2] = star.position[2];

      siz[i] = 0.08 + star.significance * 0.15;

      const c = star.significance > 0.9 ? brightColor
              : star.significance > 0.7 ? goldColor
              : warmColor;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    });

    return [pos, siz, col];
  }, [stars]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    // Gentle twinkle
    const time = state.clock.elapsedTime;
    const sizeArr = pointsRef.current.geometry.attributes.size.array as Float32Array;
    stars.forEach((star, i) => {
      const base = 0.08 + star.significance * 0.15;
      sizeArr[i] = base + Math.sin(time * 2 + i * 1.5) * 0.02;
    });
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <>
      {/* Glow layer */}
      <points ref={glowRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors
          transparent
          opacity={0.15}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Main stars */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Clickable spheres for interaction */}
      {stars.map((star) => (
        <mesh
          key={star.id}
          position={star.position}
          onPointerEnter={(e) => { e.stopPropagation(); onHover(star); }}
          onPointerLeave={onUnhover}
        >
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}
    </>
  );
}

/* Connection Lines */
function ConstellationLines({ stars }: { stars: StarData[] }) {
  const lineRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < stars.length - 1; i++) {
      positions.push(...stars[i].position, ...stars[i + 1].position);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [stars]);

  useFrame((state) => {
    if (!lineRef.current) return;
    const mat = lineRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#FFB703" transparent opacity={0.2} />
    </lineSegments>
  );
}

/* Background Dust */
function StarDust() {
  const count = 800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#424245"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneSetup() {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.z += (4 - camera.position.z) * 0.01;
  });
  return null;
}

export default function ConstellationPage() {
  const [hoveredStar, setHoveredStar] = useState<StarData | null>(null);

  const stars: StarData[] = useMemo(() =>
    loyaltyEvents.map((le) => ({
      id: le.id,
      title: le.eventTitle,
      date: le.date,
      significance: le.significance,
      position: [
        (le.x - 0.5) * 5,
        (le.y - 0.5) * 4,
        le.z * 2,
      ] as [number, number, number],
    })),
  []);

  return (
    <main className={styles.page}>
      <Navigation />
      <div className={styles.content}>
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="label text-gold">Your Story</span>
            <h1 className={styles.title}>Loyalty Constellation</h1>
            <p className={styles.subtitle}>
              {userProfile.matchesAttended} matches. {stars.length} stars.
              Fan since {userProfile.seasonSince}.
            </p>
          </motion.div>
          <motion.div
            className={styles.profileBadge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className={styles.profileTier}>{userProfile.loyaltyTier}</span>
            <span className={styles.profileName}>{userProfile.displayName}</span>
          </motion.div>
        </div>

        <motion.div
          className={styles.canvasWrap}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <fog attach="fog" args={["#0A0E17", 6, 14]} />
            <ambientLight intensity={0.5} />
            <SceneSetup />
            <StarDust />
            <ConstellationStars
              stars={stars}
              onHover={setHoveredStar}
              onUnhover={() => setHoveredStar(null)}
              selectedId={hoveredStar?.id ?? null}
            />
            <ConstellationLines stars={stars} />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={2}
              maxDistance={8}
              autoRotate
              autoRotateSpeed={0.3}
              dampingFactor={0.1}
            />
          </Canvas>

          {/* Hover tooltip */}
          {hoveredStar && (
            <div className={styles.starTooltip}>
              <div className={styles.tooltipTitle}>{hoveredStar.title}</div>
              <div className={styles.tooltipDate}>{hoveredStar.date}</div>
              <div className={styles.tooltipSignificance}>
                <span className={styles.tooltipLabel}>Significance</span>
                <div className={styles.sigBar}>
                  <div className={styles.sigFill} style={{ width: `${hoveredStar.significance * 100}%` }} />
                </div>
              </div>
            </div>
          )}

          {/* Ambient overlay */}
          <div className={styles.canvasOverlay} />
        </motion.div>

        {/* Match Timeline */}
        <div className={styles.timeline}>
          <h3 className={styles.timelineTitle}>Match Timeline</h3>
          <div className={styles.timelineList}>
            {loyaltyEvents.slice().reverse().map((event, i) => (
              <motion.div
                key={event.id}
                className={styles.timelineItem}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
              >
                <div className={styles.timelineStar} style={{
                  width: 8 + event.significance * 12,
                  height: 8 + event.significance * 12,
                  background: event.significance > 0.9 ? "var(--chrome-100)" : "var(--floodlight-gold)",
                  boxShadow: event.significance > 0.9 ? "0 0 12px rgba(255,183,3,0.4)" : "none",
                }} />
                <div className={styles.timelineContent}>
                  <span className={styles.timelineEventTitle}>{event.eventTitle}</span>
                  <span className={styles.timelineDate}>{event.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
