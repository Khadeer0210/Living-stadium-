"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function StadiumParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 3000;

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);

    const goldColor = new THREE.Color("#FFB703");
    const turfColor = new THREE.Color("#2A9D8F");
    const whiteColor = new THREE.Color("#F5F5F7");
    const dimColor = new THREE.Color("#424245");

    for (let i = 0; i < count; i++) {
      // Stadium bowl shape — elliptical ring with scattered fill
      const angle = Math.random() * Math.PI * 2;
      const radiusBase = 3 + Math.random() * 5;
      const isInBowl = Math.random() > 0.3;
      const radius = isInBowl ? radiusBase : Math.random() * 12;
      const heightSpread = isInBowl ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 8;

      pos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = heightSpread;
      pos[i * 3 + 2] = Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5) * 1.5;

      // Color distribution: mostly dim, some gold, few turf
      const colorRoll = Math.random();
      const c = colorRoll > 0.92 ? goldColor
              : colorRoll > 0.88 ? turfColor
              : colorRoll > 0.7 ? whiteColor
              : dimColor;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      // Size: gold particles larger
      siz[i] = colorRoll > 0.92 ? 3 + Math.random() * 2
             : colorRoll > 0.88 ? 2.5 + Math.random() * 1.5
             : 1 + Math.random() * 1.5;
    }

    return [pos, col, siz];
  }, []);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const time = state.clock.elapsedTime;

    // Gentle rotation
    particlesRef.current.rotation.y = time * 0.03;

    // Subtle floating
    const posAttr = particlesRef.current.geometry.attributes.position;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const baseY = arr[i * 3 + 1];
      arr[i * 3 + 1] = baseY + Math.sin(time * 0.5 + i * 0.01) * 0.002;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

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
        <fog attach="fog" args={["#0A0E17", 8, 20]} />
        <ambientLight intensity={0.3} />
        <StadiumParticles />
        <AmbientRings />
      </Canvas>
    </div>
  );
}
