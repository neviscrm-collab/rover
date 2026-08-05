"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import {
  MagnifyingGlass, Bell, MapPin, Star, ArrowRight, Heart,
} from "@phosphor-icons/react";

const FEATURED = [
  { id: "exp_001", slug: "ladakh-road-trip", title: "Ladakh Road Trip", tag: "7 days", price: "₹45,000", location: "Jammu & Kashmir", rating: 4.9, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", color: "#7C3AED" },
  { id: "exp_002", slug: "kerala-backwaters", title: "Kerala Backwaters", tag: "5 days", price: "₹28,000", location: "Kerala", rating: 4.8, img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80", color: "#06B6D4" },
  { id: "exp_003", slug: "rajasthan-heritage", title: "Rajasthan Heritage", tag: "6 days", price: "₹35,000", location: "Rajasthan", rating: 4.7, img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80", color: "#F59E0B" },
];

const CATEGORIES = [
  { label: "Trending 🔥" },
  { label: "Adventure" },
  { label: "Top Rated" },
  { label: "Popular" },
];

export default function CustomerHomePage() {
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("Trending 🔥");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs mb-0.5" style={{ color: "var(--text-faint)" }}>{greeting} 👋</p>
            <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>
              {user?.name?.split(" ")[0] ?? "Explorer"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Bell size={18} style={{ color: "var(--text-dim)" }} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-violet-500" />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
            >
              {user?.name?.[0] ?? "T"}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <Link href="/discover">
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <MagnifyingGlass size={18} style={{ color: "var(--text-faint)" }} />
            <span className="text-sm" style={{ color: "var(--text-faint)" }}>Search destinations, activities…</span>
          </div>
        </Link>
      </div>

      {/* Hero card */}
      <div className="px-5 mb-7">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl"
          style={{ height: 200 }}
        >
          <img
            src={FEATURED[0].img}
            alt={FEATURED[0].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-violet-400" />
              <span className="text-xs text-violet-400">{FEATURED[0].location}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{FEATURED[0].title}</h2>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-sm font-semibold text-white">{FEATURED[0].price}</span>
              <Link href={`/experience/${FEATURED[0].slug}`}>
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                  style={{ background: "rgba(124,58,237,0.9)" }}
                >
                  Explore <ArrowRight size={12} />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(({ label }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className="flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all"
              style={{
                background: activeCategory === label ? "#7C3AED" : "rgba(255,255,255,0.06)",
                color: activeCategory === label ? "white" : "var(--text-dim)",
                border: activeCategory === label ? "none" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Experience cards */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: "var(--text)" }}>Trending near you</h3>
          <Link href="/discover" className="text-xs" style={{ color: "#7C3AED" }}>View all</Link>
        </div>
        <div className="space-y-3">
          {FEATURED.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-3 p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="relative flex-shrink-0">
                <img src={exp.img} alt={exp.title} className="w-16 h-16 rounded-xl object-cover" />
                <button
                  onClick={() => toggleWishlist(exp.id)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  <Heart
                    size={11}
                    weight={wishlist.includes(exp.id) ? "fill" : "regular"}
                    className={wishlist.includes(exp.id) ? "text-red-400" : "text-white"}
                  />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{exp.title}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} style={{ color: "var(--text-faint)" }} />
                  <span className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{exp.location}</span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{exp.price}</span>
                  <div className="flex items-center gap-1">
                    <Star size={11} weight="fill" className="text-amber-400" />
                    <span className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>{exp.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Travel stats */}
      <div className="px-5 mt-6">
        <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Your travel story</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Countries", value: "3" },
            { label: "Trips", value: "7" },
            { label: "Badges", value: "12" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl p-3 text-center"
              style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.12)" }}
            >
              <p className="text-xl font-bold" style={{ color: "var(--text)" }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
