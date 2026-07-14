/* ============================================================
   MOCK DATA — Realistic stadium, fixture, and telemetry data
   ============================================================ */

// --- Venue ---
export const venue = {
  id: "v-001",
  name: "Meridian Arena",
  city: "Mumbai",
  capacity: 40000,
  currentOccupancy: 34200,
  digitalTwinAssetUrl: "/assets/twin/meridian.glb",
  gates: [
    { id: "g-1", label: "Gate 1 — North", throughput: 420, maxThroughput: 500, geo: [19.076, 72.878] },
    { id: "g-2", label: "Gate 2 — East", throughput: 380, maxThroughput: 500, geo: [19.076, 72.879] },
    { id: "g-3", label: "Gate 3 — South", throughput: 490, maxThroughput: 500, geo: [19.075, 72.878] },
    { id: "g-4", label: "Gate 4 — West VIP", throughput: 210, maxThroughput: 300, geo: [19.075, 72.877] },
  ],
};

// --- Concourse Nodes ---
export const concourseNodes = [
  { id: "n-gate1", type: "gate", label: "Gate 1", x: 100, y: 50, density: 0.72 },
  { id: "n-gate2", type: "gate", label: "Gate 2", x: 700, y: 100, density: 0.45 },
  { id: "n-gate3", type: "gate", label: "Gate 3", x: 650, y: 550, density: 0.88 },
  { id: "n-gate4", type: "gate", label: "Gate 4", x: 80, y: 500, density: 0.31 },
  { id: "n-j1", type: "junction", label: "North Corridor", x: 300, y: 80, density: 0.55 },
  { id: "n-j2", type: "junction", label: "East Wing", x: 600, y: 250, density: 0.62 },
  { id: "n-j3", type: "junction", label: "South Plaza", x: 450, y: 500, density: 0.78 },
  { id: "n-j4", type: "junction", label: "West Atrium", x: 150, y: 350, density: 0.33 },
  { id: "n-j5", type: "junction", label: "Central Hub", x: 400, y: 300, density: 0.58 },
  { id: "n-s1", type: "stall", label: "Chai & Bites", x: 250, y: 150, density: 0.65, waitTime: 8, worthWalk: 7.2 },
  { id: "n-s2", type: "stall", label: "Stadium Grill", x: 550, y: 180, density: 0.82, waitTime: 14, worthWalk: 5.1 },
  { id: "n-s3", type: "stall", label: "Fresh Juice Bar", x: 500, y: 420, density: 0.41, waitTime: 4, worthWalk: 9.0 },
  { id: "n-s4", type: "stall", label: "Biryani House", x: 200, y: 430, density: 0.91, waitTime: 18, worthWalk: 3.8 },
  { id: "n-s5", type: "stall", label: "Ice Cream Parlour", x: 380, y: 160, density: 0.28, waitTime: 2, worthWalk: 9.5 },
  { id: "n-exit1", type: "exit", label: "Emergency Exit A", x: 50, y: 200, density: 0.1 },
  { id: "n-exit2", type: "exit", label: "Emergency Exit B", x: 750, y: 400, density: 0.05 },
];

export const concourseEdges = [
  { from: "n-gate1", to: "n-j1", walkSeconds: 45 },
  { from: "n-j1", to: "n-s1", walkSeconds: 20 },
  { from: "n-j1", to: "n-s5", walkSeconds: 30 },
  { from: "n-j1", to: "n-j5", walkSeconds: 55 },
  { from: "n-gate2", to: "n-j2", walkSeconds: 40 },
  { from: "n-j2", to: "n-s2", walkSeconds: 25 },
  { from: "n-j2", to: "n-j5", walkSeconds: 50 },
  { from: "n-j5", to: "n-j3", walkSeconds: 45 },
  { from: "n-j5", to: "n-j4", walkSeconds: 40 },
  { from: "n-j5", to: "n-s3", walkSeconds: 35 },
  { from: "n-j3", to: "n-gate3", walkSeconds: 35 },
  { from: "n-j3", to: "n-s4", walkSeconds: 20 },
  { from: "n-j4", to: "n-gate4", walkSeconds: 30 },
  { from: "n-j4", to: "n-s4", walkSeconds: 25 },
  { from: "n-gate1", to: "n-exit1", walkSeconds: 60 },
  { from: "n-j2", to: "n-exit2", walkSeconds: 55 },
];

// --- Live Match ---
export const liveMatch = {
  id: "m-001",
  eventId: "e-001",
  title: "Mumbai Titans vs Delhi Capitals",
  homeTeam: { name: "Mumbai Titans", short: "MT", color: "#FFB703" },
  awayTeam: { name: "Delhi Capitals", short: "DC", color: "#2A9D8F" },
  venue: venue.name,
  startsAt: "2026-07-14T14:00:00+05:30",
  status: "live",
  score: { home: 187, away: 142 },
  overs: { home: "20.0", away: "16.3" },
  currentInnings: 2,
  matchMinute: 67,
};

// --- Upcoming Events ---
export const upcomingEvents = [
  {
    id: "e-002",
    title: "Mumbai Titans vs Kolkata Riders",
    startsAt: "2026-07-18T19:30:00+05:30",
    venue: "Meridian Arena",
    ticketsAvailable: 8420,
    priceRange: [800, 12000],
  },
  {
    id: "e-003",
    title: "Mumbai Titans vs Chennai Kings",
    startsAt: "2026-07-22T15:00:00+05:30",
    venue: "Meridian Arena",
    ticketsAvailable: 15200,
    priceRange: [600, 15000],
  },
  {
    id: "e-004",
    title: "Semi-Final — TBD vs TBD",
    startsAt: "2026-08-02T19:30:00+05:30",
    venue: "Meridian Arena",
    ticketsAvailable: 0,
    priceRange: [2000, 25000],
  },
];

// --- Seat Blocks ---
export const seatBlocks = [
  { id: "sb-1", label: "A1 — Premium North", price: 12000, available: 45, sightlineScore: 9.2 },
  { id: "sb-2", label: "B2 — East Upper", price: 4500, available: 210, sightlineScore: 7.8 },
  { id: "sb-3", label: "C3 — South Stand", price: 2000, available: 580, sightlineScore: 6.5 },
  { id: "sb-4", label: "D4 — West Pavilion", price: 8000, available: 120, sightlineScore: 8.9 },
  { id: "sb-5", label: "E5 — VIP Lounge", price: 25000, available: 12, sightlineScore: 9.8 },
  { id: "sb-6", label: "F6 — Family Zone", price: 3000, available: 340, sightlineScore: 7.2 },
];

// --- User Profile ---
export const userProfile = {
  id: "u-001",
  displayName: "Arjun Mehta",
  phone: "+91 98765 43210",
  loyaltyTier: "Gold",
  matchesAttended: 23,
  seasonSince: 2024,
  favoriteStall: "Chai & Bites",
};

// --- Loyalty Events (Constellation Stars) ---
export const loyaltyEvents = [
  { id: "le-1", eventTitle: "MT vs DC — Season Opener 2024", date: "2024-03-22", significance: 0.7, x: 0.2, y: 0.3, z: 0.1 },
  { id: "le-2", eventTitle: "MT vs KR — Derby Night", date: "2024-04-05", significance: 0.85, x: 0.35, y: 0.45, z: -0.2 },
  { id: "le-3", eventTitle: "MT vs CK — Rain Match", date: "2024-04-18", significance: 0.5, x: 0.5, y: 0.2, z: 0.3 },
  { id: "le-4", eventTitle: "MT vs BB — Mid Season", date: "2024-05-10", significance: 0.6, x: 0.6, y: 0.55, z: -0.1 },
  { id: "le-5", eventTitle: "Qualifier 1", date: "2024-05-24", significance: 0.9, x: 0.7, y: 0.35, z: 0.2 },
  { id: "le-6", eventTitle: "THE FINAL 2024", date: "2024-06-01", significance: 1.0, x: 0.85, y: 0.5, z: 0.0 },
  { id: "le-7", eventTitle: "MT vs DC — Season Opener 2025", date: "2025-03-20", significance: 0.75, x: 0.15, y: 0.7, z: -0.15 },
  { id: "le-8", eventTitle: "MT vs RR — Night Game", date: "2025-04-02", significance: 0.55, x: 0.3, y: 0.8, z: 0.25 },
  { id: "le-9", eventTitle: "MT vs CK — Revenge Match", date: "2025-04-22", significance: 0.8, x: 0.45, y: 0.65, z: -0.05 },
  { id: "le-10", eventTitle: "MT vs KR — Super Over!", date: "2025-05-08", significance: 0.95, x: 0.55, y: 0.78, z: 0.15 },
  { id: "le-11", eventTitle: "Eliminator", date: "2025-05-20", significance: 0.88, x: 0.7, y: 0.72, z: -0.1 },
  { id: "le-12", eventTitle: "THE FINAL 2025", date: "2025-06-05", significance: 1.0, x: 0.9, y: 0.6, z: 0.0 },
  { id: "le-13", eventTitle: "MT vs DC — 2026 Opener", date: "2026-03-18", significance: 0.7, x: 0.1, y: 0.1, z: 0.2 },
  { id: "le-14", eventTitle: "MT vs BB — Afternoon Blitz", date: "2026-04-01", significance: 0.6, x: 0.25, y: 0.15, z: -0.25 },
  { id: "le-15", eventTitle: "MT vs RR — Thriller", date: "2026-04-15", significance: 0.82, x: 0.4, y: 0.1, z: 0.1 },
  { id: "le-16", eventTitle: "MT vs CK — Sold Out", date: "2026-05-01", significance: 0.78, x: 0.55, y: 0.15, z: -0.15 },
  { id: "le-17", eventTitle: "MT vs KR — Derby 2026", date: "2026-05-15", significance: 0.9, x: 0.65, y: 0.25, z: 0.1 },
  { id: "le-18", eventTitle: "MT vs DC — Today LIVE", date: "2026-07-14", significance: 0.65, x: 0.8, y: 0.15, z: 0.05 },
];

// --- Energy Telemetry ---
export const energySnapshot = {
  selfGeneratedKwh: 142.7,
  gridDrawnKwh: 89.3,
  totalKwh: 232.0,
  selfGeneratedPct: 61.5,
  piezoFloorKwh: 48.2,
  solarKwh: 72.1,
  windKwh: 22.4,
  history: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    selfGenerated: 3.5 + Math.sin(i / 3) * 2.5 + (i > 12 && i < 20 ? 4 : 0),
    gridDrawn: 4.2 + Math.cos(i / 4) * 1.5 + (i > 14 && i < 18 ? 3 : 0),
  })),
};

// --- System Health (Ops Console) ---
export const systemHealth = {
  nervousSystem: { status: "nominal", sensorCount: 847, activeAlerts: 2, latencyMs: 12 },
  circulatorySystem: { status: "elevated", congestionIndex: 0.68, routeUpdatesPerMin: 2, bottlenecks: 1 },
  muscles: { status: "nominal", selfGenPct: 61.5, gridLoad: "normal", piezoEfficiency: 0.82 },
  immuneSystem: { status: "ready", evacReadiness: "green", incidentCount: 0, lastDrill: "2026-07-10" },
  brain: { status: "active", decisionsPerMin: 4.2, overridesActive: 1, arbitrationQueue: 0 },
};

// --- Incident Log ---
export const recentIncidents = [
  { id: "inc-1", time: "14:32", system: "Circulatory", severity: "warning", detail: "Gate 3 throughput at 98% — rerouting recommended" },
  { id: "inc-2", time: "14:28", system: "Nervous", severity: "info", detail: "Acoustic spike detected — classified: celebration" },
  { id: "inc-3", time: "14:15", system: "Muscles", severity: "info", detail: "Piezo floor section B2 output +12% above baseline" },
  { id: "inc-4", time: "13:55", system: "Brain", severity: "info", detail: "Arbitration: engagement notification deferred — flow priority active" },
  { id: "inc-5", time: "13:40", system: "Immune", severity: "nominal", detail: "Pre-match evacuation graph validated — all exits green" },
];

// --- Momentum Data Generator ---
export function generateMomentumData(seconds: number = 90): { time: number; intensity: number; state: string }[] {
  const data = [];
  for (let t = 0; t < seconds; t++) {
    const base = 55 + Math.sin(t / 8) * 10;
    const noise = (Math.random() - 0.5) * 12;
    const spike = (t > 20 && t < 25) ? 30 : (t > 50 && t < 55) ? 25 : (t > 72 && t < 76) ? 35 : 0;
    const intensity = Math.min(100, Math.max(10, base + noise + spike));
    const state = intensity > 80 ? "celebration" : intensity > 65 ? "elevated" : "ambient";
    data.push({ time: t, intensity, state });
  }
  return data;
}

// --- Evac Node Data ---
export const evacNodes = concourseNodes.map((n) => ({
  ...n,
  recommendedExit: n.x < 400 ? "n-exit1" : "n-exit2",
  estimatedEvacSeconds: Math.round(30 + Math.random() * 120),
  capacityStatus: n.density > 0.8 ? "critical" : n.density > 0.6 ? "warning" : "normal",
}));
