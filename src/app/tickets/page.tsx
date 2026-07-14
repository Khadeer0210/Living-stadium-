"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import { upcomingEvents, seatBlocks, venue } from "@/lib/mock-data";
import styles from "./page.module.css";

export default function TicketsPage() {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <Navigation />
      <div className={styles.content}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="label text-gold">Tickets</span>
          <h1 className={styles.title}>Book Your Seat at {venue.name}</h1>
          <p className={styles.subtitle}>Select an event, choose your view, and secure your match day experience.</p>
        </motion.div>

        {/* Events */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Upcoming Events</h2>
          <div className={styles.eventsGrid}>
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                className={`glass-card ${styles.eventCard}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <div className={styles.eventDate}>
                  {new Date(event.startsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventTime}>
                  {new Date(event.startsAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} · {event.venue}
                </p>
                <div className={styles.eventFooter}>
                  <span className="mono-data text-sm" style={{ color: "var(--chrome-60)" }}>
                    ₹{event.priceRange[0].toLocaleString()} – ₹{event.priceRange[1].toLocaleString()}
                  </span>
                  {event.ticketsAvailable > 0 ? (
                    <span className="chip chip-gold">{event.ticketsAvailable.toLocaleString()} left</span>
                  ) : (
                    <span className="chip chip-live">Sold Out</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Seat Blocks */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Choose Your View</h2>
          <p className="body-small" style={{ marginBottom: "var(--space-6)", maxWidth: 480 }}>
            Each block has a real sightline score captured from LIDAR geometry — not stock photos.
          </p>
          <div className={styles.seatsGrid}>
            {seatBlocks.map((block, i) => (
              <motion.div
                key={block.id}
                className={`${styles.seatCard} ${selectedBlock === block.id ? styles.seatSelected : ""}`}
                onClick={() => setSelectedBlock(selectedBlock === block.id ? null : block.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <div className={styles.seatTop}>
                  <h4 className={styles.seatLabel}>{block.label}</h4>
                  <span className={styles.seatPrice}>₹{block.price.toLocaleString()}</span>
                </div>
                <div className={styles.seatMeta}>
                  <div className={styles.seatMetaItem}>
                    <span className={styles.seatMetaValue}>{block.sightlineScore}</span>
                    <span className={styles.seatMetaLabel}>Sightline</span>
                  </div>
                  <div className={styles.seatMetaItem}>
                    <span className={styles.seatMetaValue}>{block.available}</span>
                    <span className={styles.seatMetaLabel}>Available</span>
                  </div>
                </div>
                {selectedBlock === block.id && (
                  <motion.div
                    className={styles.seatActions}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <Link href={`/tickets/e-002/seat-ar`} className="btn btn-secondary" style={{ fontSize: "var(--text-xs)" }}>
                      🔭 Preview Sightline
                    </Link>
                    <button className="btn btn-primary" style={{ fontSize: "var(--text-xs)" }}>
                      Book Now
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
