"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import Link from "next/link";
import styles from "./page.module.css";

// A mock 3D component representing the view from the seat
function ViewFromSeat() {
  return (
    <group position={[0, -2, -10]}>
      {/* Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#2A9D8F" roughness={0.8} />
      </mesh>
      
      {/* Stadium Structure (abstract) */}
      <mesh position={[0, 10, -45]}>
        <boxGeometry args={[80, 20, 10]} />
        <meshStandardMaterial color="#0A0E17" roughness={0.7} />
      </mesh>
      
      {/* Lights */}
      <pointLight position={[0, 20, -20]} intensity={1.5} color="#FFD166" distance={100} />
      
      {/* Target Marker on Pitch */}
      <mesh position={[0, 0.1, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.2, 32]} />
        <meshBasicMaterial color="#EF233C" />
      </mesh>
      
      {/* Focus point HTML label */}
      <Html position={[0, 2, -20]} center>
        <div className={styles.arLabel}>Center Pitch View</div>
      </Html>
    </group>
  );
}

export default function ARSeatPreview() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className={styles.page}>
      {/* Top HUD */}
      <div className={styles.hudTop}>
        <Link href="/tickets" className="btn btn-secondary">
          ← Back to Selection
        </Link>
        <div className={styles.hudCenter}>
          <span className="pulse-badge">
            <span className="pulse-badge__dot animate-glow" />
            LIVE LIDAR SIGHTLINE
          </span>
        </div>
        <button className="btn btn-primary">Book This Seat</button>
      </div>

      {loading && (
        <div className={styles.loader}>
          <div className={styles.loaderSpinner} />
          <p>Calibrating LIDAR Geometry...</p>
        </div>
      )}

      {/* 3D Canvas */}
      <motion.div 
        className={styles.canvasWrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 1 }}
      >
        <Canvas camera={{ position: [0, 1.5, 0], fov: 60 }} dpr={[1, 2]}>
          <fog attach="fog" args={["#0A0E17", 10, 50]} />
          <ambientLight intensity={0.4} />
          <ViewFromSeat />
          <OrbitControls 
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2 + 0.1}
            minPolarAngle={Math.PI / 3}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
          <Environment preset="night" />
        </Canvas>
      </motion.div>

      {/* Bottom HUD */}
      <div className={styles.hudBottom}>
        <div className={styles.hudCard}>
          <div className={styles.hudStat}>
            <span className={styles.hudValue}>Block 114</span>
            <span className={styles.hudLabel}>Section</span>
          </div>
          <div className={styles.hudStat}>
            <span className={styles.hudValue} style={{ color: "var(--floodlight-gold)" }}>9.4</span>
            <span className={styles.hudLabel}>Sightline Score</span>
          </div>
          <div className={styles.hudStat}>
            <span className={styles.hudValue}>22m</span>
            <span className={styles.hudLabel}>Dist. to Pitch</span>
          </div>
        </div>
        <p className={styles.hint}>Drag to look around</p>
      </div>
    </main>
  );
}
