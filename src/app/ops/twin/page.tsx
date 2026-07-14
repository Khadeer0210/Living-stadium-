"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";
import { venue, concourseNodes } from "@/lib/mock-data";
import styles from "./page.module.css";

/* Multi-tiered Stadium Bowl */
function StadiumBowl() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.04;
  });

  const tiers = useMemo(() => [
    { radius: 3.0, tube: 0.5, y: -0.3, color: "#1a3050", opacity: 0.7 },
    { radius: 3.6, tube: 0.4, y: 0.2, color: "#1a2840", opacity: 0.6 },
    { radius: 4.1, tube: 0.35, y: 0.7, color: "#1a2535", opacity: 0.5 },
  ], []);

  return (
    <group ref={groupRef}>
      {/* Stadium tiers */}
      {tiers.map((tier, i) => (
        <mesh key={`tier-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, tier.y, 0]}>
          <torusGeometry args={[tier.radius, tier.tube, 16, 64]} />
          <meshPhysicalMaterial
            color={tier.color}
            roughness={0.6}
            metalness={0.3}
            transparent
            opacity={tier.opacity}
          />
        </mesh>
      ))}

      {/* Cricket Pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#1a4a2a" roughness={0.85} />
      </mesh>

      {/* Pitch markings (center strip) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.24, 0]}>
        <planeGeometry args={[0.3, 1.2]} />
        <meshStandardMaterial color="#2a5a3a" roughness={0.9} />
      </mesh>

      {/* Glass facade panels */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={`glass-${i}`} position={[Math.cos(angle) * 4.5, 0.8, Math.sin(angle) * 4.5 * 0.6]} rotation={[0, -angle + Math.PI / 2, 0]}>
            <boxGeometry args={[2, 1.8, 0.05]} />
            <meshPhysicalMaterial
              color="#1a3050"
              transmission={0.5}
              roughness={0.1}
              metalness={0.3}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* Roof canopy segments */}
      {[0, 1, 2, 3].map((i) => {
        const startAngle = (i / 4) * Math.PI * 2 + 0.2;
        const endAngle = startAngle + Math.PI / 3;
        return (
          <mesh key={`roof-${i}`} rotation={[-Math.PI / 2 + 0.15, 0, 0]} position={[0, 1.5, 0]}>
            <ringGeometry args={[3.5, 4.8, 32, 1, startAngle, endAngle - startAngle]} />
            <meshPhysicalMaterial
              color="#1a2535"
              transparent
              opacity={0.25}
              roughness={0.3}
              metalness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        );
      })}

      {/* Crowd density heatmap sections */}
      {concourseNodes.slice(0, 8).map((node, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const density = node.density ?? 0.5;
        const color = density > 0.8 ? "#EF233C" : density > 0.6 ? "#FFB703" : "#2A9D8F";
        return (
          <mesh key={`crowd-${node.id}`} position={[Math.cos(angle) * 3.3, 0, Math.sin(angle) * 3.3 * 0.6]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[1.2, 0.6, 0.3]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.15 + density * 0.35}
              roughness={0.5}
              emissive={color}
              emissiveIntensity={0.15}
            />
          </mesh>
        );
      })}

      {/* Floodlight towers with visible beams */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={`light-${i}`} position={[Math.cos(angle + Math.PI / 4) * 5, 0, Math.sin(angle + Math.PI / 4) * 5 * 0.6]}>
          {/* Tower */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.04, 0.07, 3.5, 8]} />
            <meshStandardMaterial color="#3a3a40" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Light head */}
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[0.3, 0.1, 0.15]} />
            <meshBasicMaterial color="#FFD166" />
          </mesh>
          {/* Visible light beam */}
          <mesh position={[0, 1.5, 0]} rotation={[Math.PI * 0.85, 0, 0]}>
            <coneGeometry args={[1.2, 3.5, 16, 1, true]} />
            <meshBasicMaterial
              color="#FFB703"
              transparent
              opacity={0.04}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <pointLight color="#FFB703" intensity={0.6} distance={8} position={[0, 3.2, 0]} />
        </group>
      ))}

      {/* Sensor dots */}
      {concourseNodes.slice(0, 12).map((node, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r = 2.5 + (node.density ?? 0.5) * 1.5;
        return (
          <mesh key={`sensor-${node.id}`} position={[Math.cos(angle) * r, 0.9, Math.sin(angle) * r * 0.6]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color={node.density > 0.7 ? "#FFB703" : "#2A9D8F"}
            />
          </mesh>
        );
      })}
    </group>
  );
}

/* Atmospheric particles */
function AtmosphereParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 6 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(t * 0.3 + i * 0.05) * 0.001;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#FFB703"
        transparent
        opacity={0.2}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Reflective ground */
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshPhysicalMaterial
        color="#0A0E17"
        roughness={0.25}
        metalness={0.5}
        transparent
        opacity={0.7}
      />
    </mesh>
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
        <Canvas camera={{ position: [6, 5, 6], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true }}>
          <fog attach="fog" args={["#0A0E17", 10, 24]} />
          <ambientLight intensity={0.25} />
          <directionalLight position={[5, 10, 5]} intensity={0.5} color="#FFD166" />
          <directionalLight position={[-3, 6, -4]} intensity={0.2} color="#2A9D8F" />
          <StadiumBowl />
          <AtmosphereParticles />
          <GroundPlane />
          <OrbitControls enablePan autoRotate autoRotateSpeed={0.4} dampingFactor={0.08} minDistance={4} maxDistance={14} />
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
