"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FunnelSimple, MagnifyingGlass } from "@phosphor-icons/react";

const BOOKINGS = [
  { id: "bkg_001", traveler: "Arjun Sharma", avatar: "A", trip: "Ladakh Road Trip", date: "Aug 12 – Aug 18", amount: 45000, status: "confirmed", paid: true },
  { id: "bkg_002", traveler: "Priya Nair", avatar: "P", trip: "Kerala Backwaters", date: "Aug 20 – Aug 24", amount: 28000, status: "pending", paid: false },
  { id: "bkg_003", traveler: "Rahul Dev", avatar: "R", trip: "Rajasthan Heritage", date: "Jul 5 – Jul 10", amount: 35000, status: "completed", paid: true },
  { id: "bkg_004", traveler: "Sneha Reddy", avatar: "S", trip: "Ladakh Road Trip", date: "Sep 1 – Sep 7", amount: 45000, status: "pending", paid: false },
];

const TABS = ["All", "Pending", "Confirmed", "Completed"];

const statusColors: Record<string, { bg: string; text: string }> = {
  confirmed: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  pending: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  completed: { bg: "rgba(124,58,237,0.15)", text: "#7C3AED" },
};

export default function BookingsPage() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = BOOKINGS.filter((b) => {
    const matchTab = tab === "All" || b.status === tab.toLowerCase();
    const matchSearch = b.traveler.toLowerCase().includes(search.toLowerCase()) || b.trip.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Bookings</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-faint)" }}>{BOOKINGS.length} total bookings</p>

      {/* Search + filter */}
      <div className="flex gap-2 mb-4">
        <div
          className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <MagnifyingGlass size={15} style={{ color: "var(--text-faint)" }} />
          <input
            type="text"
            placeholder="Search bookings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
        </div>
        <button
          className="p-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <FunnelSimple size={17} style={{ color: "var(--text-faint)" }} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto no-scrollbar">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all"
            style={{
              background: tab === t ? "#7C3AED" : "rgba(255,255,255,0.05)",
              color: tab === t ? "white" : "var(--text-dim)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Booking cards */}
      <div className="space-y-2.5">
        {filtered.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
              >
                {b.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{b.traveler}</p>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>{b.trip}</p>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize"
                style={{ background: statusColors[b.status]?.bg, color: statusColors[b.status]?.text }}
              >
                {b.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: "var(--text-faint)" }}>{b.date}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: "var(--text)" }}>₹{b.amount.toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {b.status === "pending" && (
                  <>
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}
                    >
                      Reject
                    </button>
                    <button
                      className="text-xs px-3 py-1.5 rounded-lg font-medium"
                      style={{ background: "rgba(16,185,129,0.12)", color: "#10B981" }}
                    >
                      Confirm
                    </button>
                  </>
                )}
                {b.status !== "pending" && (
                  <span
                    className="text-[10px] px-2 py-1 rounded-lg font-medium"
                    style={{ background: b.paid ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: b.paid ? "#10B981" : "#EF4444" }}
                  >
                    {b.paid ? "Paid" : "Unpaid"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
