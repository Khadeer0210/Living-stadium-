"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function StadiumParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 5000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const goldColor = new THREE.Color("#FFB703");
    const turfColor = new THREE.Color("#2A9D8F");
    const whiteColor = new THREE.Color("#F5F5F7");
    const dimColor = new THREE.Color("#424245");
    const warmGold = new THREE.Color("#FFD166");

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radiusBase = 3 + Math.random() * 5;
      const isInBowl = Math.random() > 0.25;
      const radius = isInBowl ? radiusBase : Math.random() * 14;
      const heightSpread = isInBowl ? (Math.random() - 0.5) * 2.5 : (Math.random() - 0.5) * 10;

      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = heightSpread;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 1.5;

      // More gold and teal, fewer dim particles
      const colorRoll = Math.random();
      const c = colorRoll > 0.85 ? goldColor
              : colorRoll > 0.78 ? warmGold
              : colorRoll > 0.72 ? turfColor
              : colorRoll > 0.55 ? whiteColor
              : dimColor;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      siz[i] = colorRoll > 0.85 ? 3.5 + Math.random() * 2.5
             : colorRoll > 0.72 ? 2.5 + Math.random() * 2
             : 1 + Math.random() * 1.5;
    }

    return [pos, col, siz];
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.elapsedTime;
    particlesRef.current.rotation.y = time * 0.025;

    const posAttr = particlesRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += Math.sin(time * 0.4 + i * 0.008) * 0.0015;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Stadium Bowl Ring */
function StadiumBowl() {
  const bowlRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!bowlRef.current) return;
    bowlRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <group ref={bowlRef}>
      {/* Gold ring - main bowl */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 0.12, 16, 128]} />
        <meshBasicMaterial color="#FFB703" transparent opacity={0.15} />
      </mesh>
      {/* Teal ring - inner */}
      <mesh rotation={[Math.PI / 2 + 0.08, 0, 0]}>
        <torusGeometry args={[3.8, 0.08, 16, 128]} />
        <meshBasicMaterial color="#2A9D8F" transparent opacity={0.1} />
      </mesh>
      {/* Upper tier ring */}
      <mesh rotation={[Math.PI / 2 - 0.06, 0, 0]} position={[0, 0.5, 0]}>
        <torusGeometry args={[5.2, 0.06, 16, 128]} />
        <meshBasicMaterial color="#FFD166" transparent opacity={0.08} />
      </mesh>
    </group>
  );
}

/* Ambient Glow Orbs */
function GlowOrbs() {
  const orbsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!orbsRef.current) return;
    const t = state.clock.elapsedTime;
    orbsRef.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.3 + i * 1.5) * 0.5 + (i % 2 === 0 ? 1 : -0.5);
    });
  });

  const orbs = useMemo(() => [
    { pos: [6, 1, 0] as [number, number, number], color: "#FFB703", scale: 1.2 },
    { pos: [-5, 0, 3] as [number, number, number], color: "#2A9D8F", scale: 0.9 },
    { pos: [3, -1, -5] as [number, number, number], color: "#FFD166", scale: 1.0 },
    { pos: [-4, 2, -3] as [number, number, number], color: "#6A4C93", scale: 0.7 },
    { pos: [0, 1.5, 6] as [number, number, number], color: "#FFB703", scale: 0.8 },
  ], []);

  return (
    <group ref={orbsRef}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.pos} scale={orb.scale}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Volumetric Spotlight Cones */
function SpotlightCones() {
  const conesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!conesRef.current) return;
    conesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
  });

  const positions = useMemo(() => [
    { angle: Math.PI / 4, x: 5.5, z: 3.3 },
    { angle: (3 * Math.PI) / 4, x: -5.5, z: 3.3 },
    { angle: (5 * Math.PI) / 4, x: -5.5, z: -3.3 },
    { angle: (7 * Math.PI) / 4, x: 5.5, z: -3.3 },
  ], []);

  return (
    <group ref={conesRef}>
      {positions.map((p, i) => (
        <group key={i} position={[p.x, 4, p.z * 0.6]}>
          <mesh rotation={[Math.PI * 0.85, 0, 0]}>
            <coneGeometry args={[1.5, 5, 16, 1, true]} />
            <meshBasicMaterial
              color="#FFB703"
              transparent
              opacity={0.03}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* Ambient Rings */
function AmbientRings() {
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ringsRef.current) return;
    ringsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <group ref={ringsRef}>
      {[4, 5.5, 7].map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.1, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 128]} />
          <meshBasicMaterial
            color="#FFB703"
            transparent
            opacity={0.06 - i * 0.015}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Ground Reflection Plane */
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#0A0E17"
        roughness={0.3}
        metalness={0.4}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

export default function HeroParticles() {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
    }}>
      <Canvas
        camera={{ position: [0, 3, 10], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0A0E17", 8, 22]} />
        <ambientLight intensity={0.35} />
        <StadiumParticles />
        <StadiumBowl />
        <GlowOrbs />
        <SpotlightCones />
        <AmbientRings />
        <GroundPlane />
      </Canvas>
    </div>
  );
}
