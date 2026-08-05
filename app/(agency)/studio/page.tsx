"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import {
  TrendUp, Ticket, Users, CurrencyInr, ArrowUpRight,
  Compass, CalendarCheck, Star,
} from "@phosphor-icons/react";

const STATS = [
  { label: "This month", value: "₹2.4L", sub: "+18% vs last month", icon: CurrencyInr, color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
  { label: "Active bookings", value: "23", sub: "8 pending approval", icon: CalendarCheck, color: "#06B6D4", bg: "rgba(6,182,212,0.12)" },
  { label: "Travelers", value: "142", sub: "Total all-time", icon: Users, color: "#10B981", bg: "rgba(16,185,129,0.12)" },
  { label: "Avg rating", value: "4.8 ★", sub: "Based on 94 reviews", icon: Star, color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
];

const QUICK_LINKS = [
  { label: "New Experience", href: "/studio/experiences", emoji: "✨" },
  { label: "Bookings", href: "/studio/bookings", emoji: "📋" },
  { label: "Payments", href: "/studio/payments", emoji: "💳" },
  { label: "Messages", href: "/studio/chat", emoji: "💬" },
];

const RECENT_BOOKINGS = [
  { name: "Arjun Sharma", trip: "Ladakh Road Trip", amount: "₹45,000", status: "confirmed", avatar: "A" },
  { name: "Priya Nair", trip: "Kerala Backwaters", amount: "₹28,000", status: "pending", avatar: "P" },
  { name: "Rahul Dev", trip: "Rajasthan Heritage", amount: "₹35,000", status: "completed", avatar: "R" },
];

const statusColors: Record<string, string> = {
  confirmed: "#10B981",
  pending: "#F59E0B",
  completed: "#7C3AED",
};

export default function StudioOverviewPage() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs mb-0.5" style={{ color: "var(--text-faint)" }}>ROVER Studio</p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {user?.name ?? "Your Agency"}
          </h1>
        </div>
        <Link href="/studio/experiences">
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
          >
            + New Experience
          </motion.button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {STATS.map(({ label, value, sub, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
              style={{ background: bg }}
            >
              <Icon size={18} weight="fill" style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color: "var(--text)" }}>{value}</p>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-faint)" }}>{label}</p>
            <p className="text-[10px] mt-1 font-medium" style={{ color }}>{sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Quick actions</h2>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_LINKS.map(({ label, href, emoji }) => (
            <Link key={label} href={href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex flex-col items-center gap-2 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-[10px] font-medium text-center" style={{ color: "var(--text-dim)" }}>{label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Recent bookings</h2>
          <Link href="/studio/bookings" className="flex items-center gap-1 text-xs" style={{ color: "#7C3AED" }}>
            View all <ArrowUpRight size={13} />
          </Link>
        </div>
        <div className="space-y-2.5">
          {RECENT_BOOKINGS.map(({ name, trip, amount, status, avatar }) => (
            <div
              key={name}
              className="flex items-center gap-3 p-3 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
              >
                {avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{name}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{trip}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>{amount}</p>
                <p className="text-[10px] font-medium capitalize" style={{ color: statusColors[status] }}>{status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance chart placeholder */}
      <div
        className="p-5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>Revenue trend</h2>
          <span className="text-xs flex items-center gap-1 text-green-400 font-medium">
            <TrendUp size={13} weight="bold" /> +18% this month
          </span>
        </div>
        {/* Simple bar chart */}
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 55, 80, 70, 90, 75, 100, 85, 95, 88, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{
                height: `${h}%`,
                background: i === 11 ? "#7C3AED" : "rgba(124,58,237,0.25)",
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>Jul</span>
          <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>Aug</span>
        </div>
      </div>
    </div>
  );
}
