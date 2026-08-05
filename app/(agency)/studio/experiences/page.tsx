"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MagnifyingGlass, DotsThree, MapPin, Star, Eye, PencilSimple, Trash } from "@phosphor-icons/react";

const MOCK_EXPERIENCES = [
  { id: "exp_001", title: "Ladakh Road Trip", location: "Jammu & Kashmir", duration: "7 days", price: 45000, rating: 4.9, bookings: 12, status: "published", img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70" },
  { id: "exp_002", title: "Kerala Backwaters", location: "Kerala", duration: "5 days", price: 28000, rating: 4.8, bookings: 8, status: "published", img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=400&q=70" },
  { id: "exp_003", title: "Rajasthan Heritage", location: "Rajasthan", duration: "6 days", price: 35000, rating: 4.7, bookings: 5, status: "draft", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=70" },
];

const statusColors: Record<string, { bg: string; text: string }> = {
  published: { bg: "rgba(16,185,129,0.15)", text: "#10B981" },
  draft: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
};

export default function ExperiencesPage() {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);

  const filtered = MOCK_EXPERIENCES.filter(
    (e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Experiences</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-faint)" }}>{MOCK_EXPERIENCES.length} total · 2 published</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
        >
          <Plus size={15} weight="bold" /> New
        </motion.button>
      </div>

      {/* Search */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <MagnifyingGlass size={16} style={{ color: "var(--text-faint)" }} />
        <input
          type="text"
          placeholder="Search experiences…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text)" }}
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex gap-3 p-3 rounded-2xl relative"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <img src={exp.img} alt={exp.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>{exp.title}</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} style={{ color: "var(--text-faint)" }} />
                    <span className="text-xs" style={{ color: "var(--text-faint)" }}>{exp.location} · {exp.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(menuOpen === exp.id ? null : exp.id)}
                  className="p-1 rounded-lg flex-shrink-0"
                  style={{ color: "var(--text-faint)" }}
                >
                  <DotsThree size={18} weight="bold" />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-bold" style={{ color: "var(--text)" }}>₹{exp.price.toLocaleString()}</span>
                <div className="flex items-center gap-1">
                  <Star size={11} weight="fill" className="text-amber-400" />
                  <span className="text-xs" style={{ color: "var(--text-dim)" }}>{exp.rating}</span>
                </div>
                <span className="text-xs" style={{ color: "var(--text-faint)" }}>{exp.bookings} bookings</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ml-auto"
                  style={{ background: statusColors[exp.status]?.bg, color: statusColors[exp.status]?.text }}
                >
                  {exp.status}
                </span>
              </div>
            </div>

            {/* Dropdown menu */}
            <AnimatePresence>
              {menuOpen === exp.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  className="absolute right-4 top-10 z-10 rounded-xl overflow-hidden py-1 min-w-[140px]"
                  style={{ background: "rgba(30,20,50,0.98)", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
                >
                  {[
                    { label: "Preview", icon: Eye },
                    { label: "Edit", icon: PencilSimple },
                    { label: "Delete", icon: Trash, danger: true },
                  ].map(({ label, icon: Icon, danger }) => (
                    <button
                      key={label}
                      onClick={() => setMenuOpen(null)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm"
                      style={{ color: danger ? "#EF4444" : "var(--text-dim)" }}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="font-semibold" style={{ color: "var(--text)" }}>No experiences found</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-faint)" }}>Try a different search or create a new one</p>
        </div>
      )}
    </div>
  );
}
