"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  ChartBar,
  Users,
  Suitcase,
  ChatTeardrop,
  Sparkle,
  NavigationArrow,
  TrendUp,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { AGENCIES, EXPERIENCES } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";

const AGENCY = AGENCIES[0];
const AGENCY_EXPERIENCES = EXPERIENCES.slice(0, 3);

const STATS = [
  { label: "Active Listings", value: "8", change: "+2 this month", icon: Suitcase, color: "#7C3AED" },
  { label: "Total Bookings", value: "147", change: "+23 this week", icon: Users, color: "#10B981" },
  { label: "Revenue", value: "₹24.3L", change: "+18% vs last month", icon: TrendUp, color: "#F59E0B" },
  { label: "Avg Rating", value: "4.9", change: "127 reviews", icon: ChartBar, color: "#06B6D4" },
];

const RECENT_BOOKINGS = [
  { name: "Arjun M.", exp: "Spiti Valley", date: "Sep 5", amount: 45000 },
  { name: "Priya K.", exp: "Spiti Valley", date: "Sep 5", amount: 45000 },
  { name: "Rahul S.", exp: "Iceland Aurora", date: "Dec 10", amount: 175000 },
  { name: "Aisha N.", exp: "Coorg Weekend", date: "Aug 22", amount: 8500 },
];

export default function AgencyPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page-mobile min-h-screen">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(124,58,237,0.12), transparent)",
        }}
      >
        <div className="flex items-center gap-3 mb-6 lg:max-w-5xl lg:mx-auto">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
          >
            <NavigationArrow size={18} weight="fill" className="text-white" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-violet-400/80">
              Agency Studio
            </p>
            <h1 className="text-lg font-bold text-white leading-tight">
              {AGENCY.name}
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 lg:max-w-5xl lg:mx-auto">
          {["overview", "experiences", "bookings", "ai"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-lg text-[11px] font-semibold capitalize transition-all"
              style={{
                background:
                  activeTab === tab ? "rgba(124,58,237,0.3)" : "transparent",
                color: activeTab === tab ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-6 lg:max-w-5xl lg:mx-auto">
        {/* ── Overview ───────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: `${stat.color}20` }}
                    >
                      <Icon size={16} style={{ color: stat.color }} />
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
                    <p className="text-[10px] mt-1" style={{ color: stat.color }}>
                      {stat.change}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent bookings */}
            <div>
              <h2 className="text-sm font-semibold text-white mb-3">
                Recent Bookings
              </h2>
              <div className="space-y-2">
                {RECENT_BOOKINGS.map((booking, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between rounded-xl px-4 py-3"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {booking.name}
                      </p>
                      <p className="text-[11px] text-white/45">
                        {booking.exp} · Departs {booking.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {formatPrice(booking.amount, "INR")}
                      </p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <CheckCircle
                          size={10}
                          weight="fill"
                          className="text-emerald-400"
                        />
                        <span className="text-[10px] text-emerald-400">Paid</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Experiences ─────────────────────────────────────────── */}
        {activeTab === "experiences" && (
          <>
            <button
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              }}
            >
              <Plus size={18} weight="bold" />
              Create New Experience
            </button>

            <div className="space-y-4">
              {AGENCY_EXPERIENCES.map((exp, idx) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex gap-3 rounded-2xl p-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={exp.heroImage}
                      alt={exp.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-1">
                      {exp.title}
                    </p>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      {exp.duration} · {formatPrice(exp.price, exp.currency)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-emerald-400 glass px-2 py-0.5 rounded-full">
                        Live
                      </span>
                      <span className="text-[10px] text-white/40">
                        {exp.seatsLeft} seats left
                      </span>
                    </div>
                  </div>
                  <button className="text-[11px] text-violet-400 glass px-3 py-1.5 rounded-xl self-start">
                    Edit
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* ── Bookings ─────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-3">
            <p className="text-sm text-white/50">
              {RECENT_BOOKINGS.length} bookings this month
            </p>
            {RECENT_BOOKINGS.map((booking, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-white">{booking.name}</p>
                    <p className="text-[11px] text-white/45 mt-0.5">{booking.exp}</p>
                  </div>
                  <span className="text-sm font-bold text-white">
                    {formatPrice(booking.amount, "INR")}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/30">Departs {booking.date}</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={10} weight="fill" className="text-emerald-400" />
                    <span className="text-[10px] text-emerald-400">Confirmed</span>
                  </div>
                  <button className="ml-auto text-[11px] text-violet-400">
                    Message <ArrowRight size={10} className="inline" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── AI Tools ─────────────────────────────────────────────── */}
        {activeTab === "ai" && (
          <div className="space-y-4">
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))",
                border: "1px solid rgba(124,58,237,0.25)",
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20"
                style={{ background: "#7C3AED" }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkle size={20} weight="fill" className="text-violet-400" />
                  <p className="text-sm font-bold text-white">ROVER AI for Agencies</p>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">
                  Supercharge your agency workflow with AI-powered tools designed for travel creators.
                </p>
              </div>
            </div>

            {[
              {
                icon: Sparkle,
                title: "AI Itinerary Builder",
                desc: "Generate a complete day-by-day itinerary from a destination and duration",
                cta: "Generate",
                color: "#7C3AED",
              },
              {
                icon: ChatTeardrop,
                title: "AI Copywriter",
                desc: "Write compelling experience descriptions that convert browsers to bookers",
                cta: "Write copy",
                color: "#06B6D4",
              },
              {
                icon: ChartBar,
                title: "Pricing Intelligence",
                desc: "Get AI-suggested pricing based on similar experiences and market data",
                cta: "Analyze",
                color: "#F59E0B",
              },
            ].map((tool, idx) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex items-start gap-4 rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${tool.color}20` }}
                  >
                    <Icon size={18} weight="fill" style={{ color: tool.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{tool.title}</p>
                    <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{tool.desc}</p>
                  </div>
                  <button
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 self-center"
                    style={{
                      background: `${tool.color}25`,
                      border: `1px solid ${tool.color}40`,
                      color: tool.color,
                    }}
                  >
                    {tool.cta}
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
