"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import { venue, concourseNodes } from "@/lib/mock-data";
import styles from "./page.module.css";

function StadiumModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={groupRef}>
      {/* Stadium base ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <torusGeometry args={[3, 0.8, 16, 64]} />
        <meshStandardMaterial color="#16283F" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Inner pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#1a3a2a" roughness={0.9} />
      </mesh>

      {/* Stand sections */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => {
        const nodeIdx = i % concourseNodes.length;
        const density = concourseNodes[nodeIdx]?.density ?? 0.5;
        const color = density > 0.8 ? "#EF233C" : density > 0.6 ? "#FFB703" : "#2A9D8F";
        return (
          <mesh key={i} position={[Math.cos(angle) * 3, 0.3, Math.sin(angle) * 3 * 0.6]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[2.5, 1.2, 0.5]} />
            <meshStandardMaterial color={color} transparent opacity={0.4 + density * 0.4} roughness={0.6} />
          </mesh>
        );
      })}

      {/* Floodlight towers */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={`light-${i}`} position={[Math.cos(angle + Math.PI / 4) * 4, 0, Math.sin(angle + Math.PI / 4) * 4 * 0.6]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
            <meshStandardMaterial color="#424245" metalness={0.8} roughness={0.3} />
          </mesh>
          <pointLight color="#FFB703" intensity={0.5} distance={6} position={[0, 3, 0]} />
        </group>
      ))}

      {/* Sensor dots */}
      {concourseNodes.slice(0, 8).map((node, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const r = 2 + (node.density ?? 0.5) * 1.5;
        return (
          <mesh key={node.id} position={[Math.cos(angle) * r, 0.8, Math.sin(angle) * r * 0.6]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={node.density > 0.7 ? "#FFB703" : "#2A9D8F"} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function TwinPage() {
  return (
    <div className={styles.page}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={styles.title}>Digital Twin</h1>
        <p className={styles.subtitle}>Live 3D model of {venue.name} with real-time sensor overlays</p>
      </motion.div>

      <motion.div
        className={styles.canvasWrap}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Canvas camera={{ position: [5, 4, 5], fov: 40 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <fog attach="fog" args={["#0A0E17", 8, 20]} />
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 8, 5]} intensity={0.6} color="#FFD166" />
          <StadiumModel />
          <OrbitControls enablePan autoRotate autoRotateSpeed={0.5} dampingFactor={0.1} minDistance={3} maxDistance={12} />
          <Environment preset="night" />
        </Canvas>
        <div className={styles.canvasOverlay} />
      </motion.div>

      <div className={styles.layerToggles}>
        {["Density", "Thermal", "Acoustic", "Energy"].map((layer) => (
          <button key={layer} className={styles.layerBtn}>
            <span className={styles.layerDot} />
            {layer}
          </button>
        ))}
      </div>
    </div>
  );
}
