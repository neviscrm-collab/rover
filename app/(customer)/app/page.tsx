"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/auth.store";
import { MagnifyingGlass, Bell, MapPin, Star, ArrowRight, Heart } from "@phosphor-icons/react";
import { EXPERIENCES, CURRENT_USER } from "@/lib/mock-data";

const FEATURED = EXPERIENCES.filter((e) => e.isFeatured || e.trending).slice(0, 3);
const CATEGORIES = ["Trending 🔥", "Adventure", "Top Rated", "Popular"];

export default function CustomerHomePage() {
  const { user } = useAuthStore();
  const [activeCategory, setActiveCategory] = useState("Trending 🔥");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const hero = FEATURED[0];

  const toggleWishlist = (id: string) =>
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

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

        {/* Search */}
        <Link href="/discover">
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <MagnifyingGlass size={18} style={{ color: "var(--text-faint)" }} />
            <span className="text-sm" style={{ color: "var(--text-faint)" }}>
              Search destinations, activities…
            </span>
          </div>
        </Link>
      </div>

      {/* Hero card */}
      {hero && (
        <div className="px-5 mb-7">
          <Link href={`/experience/${hero.id}`}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl"
              style={{ height: 210 }}
            >
              <Image
                src={hero.heroImage}
                alt={hero.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%)" }}
              />
              {/* Featured badge */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                  style={{ background: "rgba(124,58,237,0.85)" }}>
                  ✦ Featured
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={11} className="text-violet-400" />
                  <span className="text-xs text-violet-400">
                    {hero.destination.name}, {hero.destination.country}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">{hero.title}</h2>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-xs text-white/50">{hero.duration}</p>
                    <p className="text-sm font-bold text-white">₹{hero.price.toLocaleString("en-IN")}</p>
                  </div>
                  <span
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                    style={{ background: "rgba(124,58,237,0.9)" }}
                  >
                    Explore <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      )}

      {/* Category tabs */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((label) => (
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
                <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                  <Image
                    src={exp.heroImage}
                    alt={exp.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <button
                  onClick={() => toggleWishlist(exp.id)}
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.65)" }}
                >
                  <Heart
                    size={11}
                    weight={wishlist.includes(exp.id) ? "fill" : "regular"}
                    className={wishlist.includes(exp.id) ? "text-red-400" : "text-white"}
                  />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/experience/${exp.id}`}>
                  <h4 className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{exp.title}</h4>
                </Link>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={11} style={{ color: "var(--text-faint)" }} />
                  <span className="text-xs truncate" style={{ color: "var(--text-faint)" }}>
                    {exp.destination.name}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                    ₹{exp.price.toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={11} weight="fill" className="text-amber-400" />
                    <span className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
                      {exp.rating}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Travel stats from real user data */}
      <div className="px-5 mt-6">
        <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Your travel story</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Countries", value: CURRENT_USER.countriesVisited.length },
            { label: "Trips", value: CURRENT_USER.tripsCompleted },
            { label: "Days on road", value: CURRENT_USER.totalDaysOnRoad },
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

      {/* Quick links */}
      <div className="px-5 mt-6 pb-4">
        <h3 className="font-semibold text-sm mb-3" style={{ color: "var(--text)" }}>Quick links</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "My Trips", href: "/app/trips", emoji: "🎒" },
            { label: "Community", href: "/app/community", emoji: "🌍" },
            { label: "Profile", href: "/app/profile", emoji: "✨" },
            { label: "Discover", href: "/discover", emoji: "🔍" },
          ].map(({ label, href, emoji }) => (
            <Link key={label} href={href}>
              <div
                className="flex items-center gap-2.5 p-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-lg">{emoji}</span>
                <span className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
