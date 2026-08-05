"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, MapPin, Ticket, Star } from "@phosphor-icons/react";

const TRAVELERS = [
  { id: "t1", name: "Arjun Sharma", email: "arjun@example.com", trips: 3, spent: 108000, rating: 5.0, badge: "Explorer", location: "Mumbai", avatar: "A", color: "#7C3AED" },
  { id: "t2", name: "Priya Nair", email: "priya@example.com", trips: 1, spent: 28000, rating: 4.5, badge: "Wanderer", location: "Bangalore", avatar: "P", color: "#06B6D4" },
  { id: "t3", name: "Rahul Dev", email: "rahul@example.com", trips: 2, spent: 80000, rating: 4.8, badge: "Trekker", location: "Delhi", avatar: "R", color: "#10B981" },
  { id: "t4", name: "Sneha Reddy", email: "sneha@example.com", trips: 1, spent: 45000, rating: 4.7, badge: "Wanderer", location: "Hyderabad", avatar: "S", color: "#F59E0B" },
];

export default function TravelersPage() {
  const [search, setSearch] = useState("");

  const filtered = TRAVELERS.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Travelers</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-faint)" }}>{TRAVELERS.length} travelers have booked with you</p>

      <div
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <MagnifyingGlass size={15} style={{ color: "var(--text-faint)" }} />
        <input
          type="text"
          placeholder="Search travelers…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text)" }}
        />
      </div>

      <div className="space-y-2.5">
        {filtered.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}88)` }}
            >
              {t.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{t.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} style={{ color: "var(--text-faint)" }} />
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>{t.location}</span>
                <span className="text-xs px-1.5 py-0.5 rounded-full ml-1" style={{ background: "rgba(124,58,237,0.15)", color: "#7C3AED", fontSize: "10px" }}>{t.badge}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 justify-end mb-0.5">
                <Ticket size={11} style={{ color: "var(--text-faint)" }} />
                <span className="text-xs" style={{ color: "var(--text-dim)" }}>{t.trips} trips</span>
              </div>
              <p className="text-sm font-bold" style={{ color: "var(--text)" }}>₹{t.spent.toLocaleString()}</p>
              <div className="flex items-center gap-0.5 justify-end mt-0.5">
                <Star size={10} weight="fill" className="text-amber-400" />
                <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>{t.rating}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
