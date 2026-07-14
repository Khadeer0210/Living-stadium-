# The Smart Stadium — A Living Organism 🏟️

Welcome to **The Smart Stadium**. This is not a bolt-on ticketing app or a simple digital scoreboard. It is a fully functional web application representing the digital twin of a next-generation sports venue, architected as a living organism. 

Built with **Next.js 15**, **Three.js** (React Three Fiber), **Framer Motion**, and a bespoke vanilla CSS design system, this platform prioritizes depth, visual perfection, and real-time responsiveness.

## 🌟 The Philosophy

The stadium is divided into five interconnected systems that share a unified data stream:

1. **⚡ The Nervous System:** 847 sensors feeding real-time acoustic, thermal, and LIDAR data.
2. **🌊 The Circulatory System:** Ant-colony routing that optimizes crowd flow and concourse density every 30 seconds.
3. **🔋 The Muscles:** Piezoelectric floors, solar membranes, and wind turbines generating the venue's own power.
4. **🛡️ The Immune System:** Graph-based dynamic evacuation relying on capacity-aware Dijkstra routing.
5. **🧠 The Brain:** A priority-ordered orchestration engine ensuring safety always overrides aesthetics.

## ✨ Signature Features

### 📈 Live Momentum Meter
A full-bleed, real-time Canvas ECG waveform driven by simulated acoustic sensors. It captures the roar of the crowd at 60fps, allowing users to "clip" historic moments (e.g., an 118dB goal celebration).

### 🌌 Loyalty Constellation
An interactive 3D starfield (built with Three.js). Every match a fan attends becomes a star. The louder and more significant the match, the brighter the star burns. Navigate your personal history in a beautiful, cinematic 3D space.

### 🗺️ Live Pulse Map (Concourse)
A real-time SVG visualization of the stadium concourse. Wait times and density metrics are updated live, telling fans not just how long the queue is, but if it is "worth the walk."

### 🎛️ Operations Command Deck
A dense, dark-mode terminal for stadium operators. Features a real-time **3D Digital Twin** of the stadium with density overlays, evacuation simulations, and an energy autopsy dashboard.

### 🔭 AR Seat Preview
A Three.js powered LIDAR sightline preview. See the exact view from your seat block before purchasing a ticket, entirely rendered in real-time 3D.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Vanilla CSS (CSS Modules) — highly bespoke, no Tailwind templates here.
- **3D Rendering:** Three.js / `@react-three/fiber` / `@react-three/drei`
- **Animations:** Framer Motion (`motion/react`)
- **State Management:** Zustand
- **Data Simulation:** Custom singleton WebSocket simulator pushing real-time streams (60fps momentum, 30s density snapshots).

## 🚀 Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Explore the Organism:**
   - **Public Fan Hub:** `http://localhost:3000/`
   - **Live Pulse (Momentum):** `http://localhost:3000/live/m-001/momentum`
   - **Constellation:** `http://localhost:3000/profile/constellation`
   - **Ops Command Deck:** `http://localhost:3000/ops`

## 🎨 Design System

The UI uses a **"Midnight Stadium"** color palette featuring:
- **Void & Deep:** `#0A0E17`, `#141E2E`
- **Floodlight Gold:** `#FFB703` (Primary accents, hover states)
- **Crimson Live:** `#EF233C` (Live markers, critical alerts)
- **Turf Success:** `#2A9D8F` (Clear paths, nominal statuses)

Typography utilizes a system font stack for readability, paired with `IBM Plex Mono` for all tabular and real-time data to prevent layout jitter.

---
*Built as a blueprint for the future of live sport.*
