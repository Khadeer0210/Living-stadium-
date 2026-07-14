import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";

export default function HapticConsentPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--stadium-void)" }}>
      <Navigation />
      <div style={{ paddingTop: "calc(var(--nav-height) + 4rem)", paddingBottom: "6rem", maxWidth: "800px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <span className="label text-gold">Legal & Trust</span>
        <h1 className="heading-section" style={{ marginTop: "1rem", marginBottom: "2rem" }}>Haptic Fandom Sync</h1>
        
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h3 className="heading-card">Feel the Game. Literally.</h3>
          <p className="body-large" style={{ marginTop: "1rem" }}>
            When Haptic Fandom Sync is enabled, the SmartStadium app uses your device's internal vibration motors (Taptic Engine) to mirror the live Momentum Waveform. When the stadium roars, your phone rumbles in perfect synchronization.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", background: "rgba(255,183,3,0.05)", border: "1px solid rgba(255,183,3,0.2)", borderRadius: "var(--radius-lg)" }}>
          <div>
            <h4 style={{ fontSize: "var(--text-base)", color: "var(--chrome-100)", fontWeight: 600 }}>Enable Haptic Sync</h4>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--chrome-60)", marginTop: "0.25rem" }}>Requires battery optimization exceptions.</p>
          </div>
          {/* Mock Toggle */}
          <div style={{ width: 48, height: 24, background: "var(--turf-success)", borderRadius: 12, position: "relative", cursor: "pointer" }}>
            <div style={{ width: 20, height: 20, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, right: 2 }} />
          </div>
        </div>

        <p className="body-small" style={{ marginTop: "2rem", color: "var(--chrome-60)" }}>
          By enabling this feature, you acknowledge that continuous haptic feedback will consume additional battery power. You can toggle this setting off at any time without affecting the rest of your app experience.
        </p>
      </div>
      <Footer />
    </main>
  );
}
