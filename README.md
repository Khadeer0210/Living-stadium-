<div align="center">
  <img src="https://raw.githubusercontent.com/Khadeer0210/Living-stadium-/master/public/globe.svg" width="80" alt="Logo" />
  <h1>The Smart Stadium 🏟️</h1>
  <p><strong>A Living Organism • Not just a building, but a real-time intelligence</strong></p>
</div>

<br />

Welcome to **The Smart Stadium**. This is not a bolt-on ticketing app or a simple digital scoreboard. It is a highly performant, visually premium, and fully functional web application representing the digital twin of a next-generation sports venue, architected as a living organism. 

Built with **Next.js 15 (App Router)**, **Three.js** (`@react-three/fiber`), **Framer Motion**, and a bespoke vanilla CSS design system, this platform prioritizes depth, visual perfection, and real-time responsiveness.

---

## 🌟 The Philosophy: Five Interconnected Systems

The stadium is divided into five biological subsystems that share a unified data stream. They don't just exist; they communicate and react in real-time.

1. **⚡ The Nervous System**
   847 sensors feeding real-time acoustic, thermal, and LIDAR data. Every 12 milliseconds, a fresh reading streams to the orchestration brain. The stadium feels the crowd before any human operator could.

2. **🌊 The Circulatory System**
   Ant-colony optimization re-scores every corridor every 30 seconds based on live density. The result: 24,000 phones receive the least-congested path to their food stall, gate, or seat — without human intervention.

3. **🔋 The Muscles**
   Piezoelectric tiles beneath 34,000 feet, solar membranes on the canopy, and micro-turbines in the ventilation stacks. Together they generate 61% of the stadium's match-day energy. The crowd doesn't just watch — they power the experience.

4. **🛡️ The Immune System**
   Graph-based dynamic evacuation using the same concourse topology as the Circulatory System. Safety wins over every other system, unconditionally, encoded as a static priority constant.

5. **🧠 The Brain**
   A priority-ordered rule table — deliberately simple, deliberately not a black-box model. When the Immune System says 'clear Gate 3,' the Brain acts immediately. Every arbitration decision is logged append-only for post-incident audits.

---

## ✨ Signature Features

### 📈 Live Momentum Meter (Canvas)
A full-bleed, real-time Canvas ECG waveform driven by simulated acoustic sensors. It captures the roar of the crowd at 60fps, auto-detecting "celebration spikes." Users can clip historic moments (e.g., an 118dB goal celebration) instantly.

### 🌌 Loyalty Constellation (Three.js)
An interactive 3D starfield. Every match a fan attends becomes a star plotted in 3D space. The louder and more significant the match, the brighter and larger the star burns. Navigate your personal fandom history in a cinematic environment.

### 🗺️ Live Pulse Map (SVG Graph)
A real-time SVG visualization of the stadium concourse. Wait times, density metrics, and gate flows are updated live. Instead of just showing queue lengths, it calculates a dynamic "Worth the Walk" score to optimize fan movement.

### 🎛️ Operations Command Deck
A dense, dark-mode terminal designed for venue operators. 
- **Digital Twin:** A full 3D interactive model of the stadium (`@react-three/drei`), where individual seating blocks change color (Green -> Yellow -> Red) based on live concourse density data.
- **Energy Autopsy:** Custom SVG charting analyzing grid power vs. self-generated power.
- **Evacuation Dashboard:** Node-by-node capacity status and dynamic evacuation routing.

### 🔭 AR Seat Preview (LIDAR Simulation)
A Three.js powered LIDAR sightline preview. Fans can see the exact view from their seat block before purchasing a ticket, rendered entirely in real-time 3D, replacing outdated static photos.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (React 19, App Router)
- **Styling:** Vanilla CSS & CSS Modules (A completely bespoke design system; absolutely zero Tailwind CSS templates to maintain a unique "Blender-level" aesthetic).
- **3D Rendering:** Three.js, `@react-three/fiber`, `@react-three/drei`
- **Animations:** Framer Motion (`motion/react`) for fluid, hardware-accelerated UI transitions.
- **Data Simulation:** Custom Singleton WebSocket simulator (`ws-simulator.ts`) pushing real-time streams (60fps momentum, 30s density snapshots) seamlessly to the UI via Zustand stores.

---

## 🎨 Design System: "Midnight Stadium"

The UI uses a custom color palette aimed at a premium, luxury aesthetic (inspired by top-tier tech keynotes):
- **Deep Space / Void:** `#0A0E17`, `#141E2E`
- **Floodlight Gold:** `#FFB703` (Primary interactive accents, hover states)
- **Crimson Live:** `#EF233C` (Live markers, critical alerts, celebration spikes)
- **Turf Success:** `#2A9D8F` (Clear paths, nominal statuses, pitch accents)
- **Violet Safety:** `#6A4C93` (Immune system, specialized data)

**Typography:**
- **UI:** System font stack (`Inter`/`SF Pro`) for crisp legibility.
- **Display:** `Fraunces` variable font for editorial-style headers.
- **Data:** `IBM Plex Mono` for tabular figures to prevent layout jitter during rapid real-time updates.

---

## 🚀 Getting Started

To run the Smart Stadium digital twin locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Khadeer0210/Living-stadium-.git
   cd Living-stadium-
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Explore the Organism:**
   - **Public Fan Hub:** [http://localhost:3000/](http://localhost:3000/)
   - **How It Works (Scrollytelling):** [http://localhost:3000/about/how-it-works](http://localhost:3000/about/how-it-works)
   - **Live Pulse (Momentum):** [http://localhost:3000/live/m-001/momentum](http://localhost:3000/live/m-001/momentum)
   - **Loyalty Constellation:** [http://localhost:3000/profile/constellation](http://localhost:3000/profile/constellation)
   - **Operations Command Deck:** [http://localhost:3000/ops](http://localhost:3000/ops)

---

<div align="center">
  <i>"A stadium shouldn't just host the match. It should feel it."</i><br/>
  <b>Built for the future of live sport.</b>
</div>
