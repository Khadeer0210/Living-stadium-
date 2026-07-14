/* ============================================================
   WebSocket Simulator — generates realistic real-time data
   without requiring a backend server.
   ============================================================ */

type Listener<T> = (data: T) => void;

export interface MomentumPoint {
  time: number;
  intensity: number;
  state: "celebration" | "elevated" | "ambient" | "panic_signature";
  db: number;
}

export interface DensitySnapshot {
  nodeId: string;
  density: number;
  timestamp: number;
}

export interface EnergyReading {
  selfGeneratedKwh: number;
  gridDrawnKwh: number;
  piezoOutput: number;
  timestamp: number;
}

class RealtimeSimulator {
  private momentumListeners: Listener<MomentumPoint>[] = [];
  private densityListeners: Listener<DensitySnapshot[]>[] = [];
  private energyListeners: Listener<EnergyReading>[] = [];
  private intervals: ReturnType<typeof setInterval>[] = [];
  private momentumTime = 0;
  private running = false;

  start() {
    if (this.running) return;
    this.running = true;

    // Momentum: every 500ms for smooth waveform
    const momentumInterval = setInterval(() => {
      this.momentumTime += 0.5;
      const base = 55 + Math.sin(this.momentumTime / 6) * 12;
      const noise = (Math.random() - 0.5) * 15;
      
      // Periodic spikes (simulating crowd celebrations)
      const cyclePos = this.momentumTime % 60;
      const spike = (cyclePos > 15 && cyclePos < 18) ? 28 + Math.random() * 10
                   : (cyclePos > 35 && cyclePos < 38) ? 22 + Math.random() * 8
                   : (cyclePos > 50 && cyclePos < 53) ? 32 + Math.random() * 12
                   : 0;
      
      const intensity = Math.min(100, Math.max(8, base + noise + spike));
      const db = 40 + (intensity / 100) * 80;
      const state: MomentumPoint["state"] = 
        intensity > 85 ? "celebration" : 
        intensity > 65 ? "elevated" : 
        "ambient";

      const point: MomentumPoint = {
        time: this.momentumTime,
        intensity,
        state,
        db: Math.round(db * 10) / 10,
      };

      this.momentumListeners.forEach((fn) => fn(point));
    }, 500);

    // Density: every 3 seconds
    const densityInterval = setInterval(() => {
      const nodeIds = [
        "n-gate1", "n-gate2", "n-gate3", "n-gate4",
        "n-j1", "n-j2", "n-j3", "n-j4", "n-j5",
        "n-s1", "n-s2", "n-s3", "n-s4", "n-s5",
      ];

      const snapshots: DensitySnapshot[] = nodeIds.map((nodeId) => {
        const baseDensity: Record<string, number> = {
          "n-gate1": 0.72, "n-gate2": 0.45, "n-gate3": 0.88, "n-gate4": 0.31,
          "n-j1": 0.55, "n-j2": 0.62, "n-j3": 0.78, "n-j4": 0.33, "n-j5": 0.58,
          "n-s1": 0.65, "n-s2": 0.82, "n-s3": 0.41, "n-s4": 0.91, "n-s5": 0.28,
        };
        const drift = (Math.random() - 0.5) * 0.12;
        const density = Math.min(1, Math.max(0, (baseDensity[nodeId] || 0.5) + drift));
        return { nodeId, density, timestamp: Date.now() };
      });

      this.densityListeners.forEach((fn) => fn(snapshots));
    }, 3000);

    // Energy: every 5 seconds
    const energyInterval = setInterval(() => {
      const hour = new Date().getHours();
      const isMatchTime = hour >= 14 && hour <= 20;
      const baseSelf = isMatchTime ? 8.5 : 4.2;
      const baseGrid = isMatchTime ? 5.8 : 3.1;

      const reading: EnergyReading = {
        selfGeneratedKwh: baseSelf + (Math.random() - 0.5) * 2,
        gridDrawnKwh: baseGrid + (Math.random() - 0.5) * 1.5,
        piezoOutput: isMatchTime ? 2.1 + Math.random() * 1.5 : 0.3 + Math.random() * 0.5,
        timestamp: Date.now(),
      };

      this.energyListeners.forEach((fn) => fn(reading));
    }, 5000);

    this.intervals.push(momentumInterval, densityInterval, energyInterval);
  }

  stop() {
    this.running = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
  }

  onMomentum(fn: Listener<MomentumPoint>) {
    this.momentumListeners.push(fn);
    return () => {
      this.momentumListeners = this.momentumListeners.filter((l) => l !== fn);
    };
  }

  onDensity(fn: Listener<DensitySnapshot[]>) {
    this.densityListeners.push(fn);
    return () => {
      this.densityListeners = this.densityListeners.filter((l) => l !== fn);
    };
  }

  onEnergy(fn: Listener<EnergyReading>) {
    this.energyListeners.push(fn);
    return () => {
      this.energyListeners = this.energyListeners.filter((l) => l !== fn);
    };
  }
}

// Singleton instance
let instance: RealtimeSimulator | null = null;

export function getSimulator(): RealtimeSimulator {
  if (!instance) {
    instance = new RealtimeSimulator();
  }
  return instance;
}
