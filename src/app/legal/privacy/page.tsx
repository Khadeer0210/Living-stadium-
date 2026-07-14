import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--stadium-void)" }}>
      <Navigation />
      <div style={{ paddingTop: "calc(var(--nav-height) + 4rem)", paddingBottom: "6rem", maxWidth: "800px", margin: "0 auto", paddingLeft: "1.5rem", paddingRight: "1.5rem" }}>
        <span className="label text-gold">Legal & Trust</span>
        <h1 className="heading-section" style={{ marginTop: "1rem", marginBottom: "2rem" }}>Digital Personal Data Protection Act 2023 (DPDP) Compliance</h1>
        
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h3 className="heading-card">Our Core Philosophy</h3>
          <p className="body-large" style={{ marginTop: "1rem" }}>
            The SmartStadium Nervous System gathers billions of data points per match. 
            Under the DPDP Act 2023, we treat your data as a liability, not an asset. 
            We do not sell, broker, or leverage your telemetry outside of the immediate operational boundaries of the stadium.
          </p>
        </div>

        <h3 className="heading-card" style={{ marginTop: "3rem", marginBottom: "1rem" }}>1. Data Collection & Purpose</h3>
        <p className="body-small" style={{ marginBottom: "1rem", color: "var(--chrome-60)" }}>
          We collect acoustic, thermal, and location data solely for the following purposes:
          <br /><br />
          - <strong>Circulatory System:</strong> Crowd density routing (anonymized at the edge).<br />
          - <strong>Immune System:</strong> Dynamic evacuation planning.<br />
          - <strong>Nervous System:</strong> Live Momentum extraction (acoustic spikes are not recorded as raw audio).
        </p>

        <h3 className="heading-card" style={{ marginTop: "2rem", marginBottom: "1rem" }}>2. Right to Erasure</h3>
        <p className="body-small" style={{ marginBottom: "1rem", color: "var(--chrome-60)" }}>
          You may request the immediate deletion of your Loyalty Constellation profile and historical attendance data at any time via your Profile Settings. Due to safety regulations, anonymous telemetry used by the Immune System during a live event cannot be retroactively scrubbed until 48 hours post-event.
        </p>
      </div>
      <Footer />
    </main>
  );
}
