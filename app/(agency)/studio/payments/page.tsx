"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, CurrencyInr, Bank } from "@phosphor-icons/react";

const PAYMENTS = [
  { id: "pay_001", traveler: "Arjun Sharma", trip: "Ladakh Road Trip", amount: 45000, date: "Aug 12", status: "received", avatar: "A" },
  { id: "pay_002", traveler: "Rahul Dev", trip: "Rajasthan Heritage", amount: 35000, date: "Jul 10", status: "received", avatar: "R" },
  { id: "pay_003", traveler: "Platform payout", trip: "July settlement", amount: 72000, date: "Jul 31", status: "paid_out", avatar: "₹" },
  { id: "pay_004", traveler: "Priya Nair", trip: "Kerala Backwaters", amount: 28000, date: "Pending", status: "pending", avatar: "P" },
];

export default function PaymentsPage() {
  const received = PAYMENTS.filter((p) => p.status === "received").reduce((s, p) => s + p.amount, 0);
  const pending = PAYMENTS.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Payments</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-7">
        {[
          { label: "Received", value: `₹${received.toLocaleString()}`, icon: ArrowDownLeft, color: "#10B981", bg: "rgba(16,185,129,0.12)" },
          { label: "Pending", value: `₹${pending.toLocaleString()}`, icon: ArrowUpRight, color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2" style={{ background: bg }}>
              <Icon size={16} weight="bold" style={{ color }} />
            </div>
            <p className="text-lg font-bold" style={{ color: "var(--text)" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Request payout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white mb-7"
        style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
      >
        <Bank size={16} weight="bold" />
        Request payout (₹{received.toLocaleString()})
      </motion.button>

      {/* Transaction list */}
      <h2 className="text-sm font-semibold mb-3" style={{ color: "var(--text)" }}>Transaction history</h2>
      <div className="space-y-2">
        {PAYMENTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED44, #06B6D444)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {p.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text)" }}>{p.traveler}</p>
              <p className="text-xs truncate" style={{ color: "var(--text-faint)" }}>{p.trip} · {p.date}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p
                className="text-sm font-bold"
                style={{ color: p.status === "pending" ? "#F59E0B" : p.status === "paid_out" ? "#7C3AED" : "#10B981" }}
              >
                {p.status === "paid_out" ? "-" : "+"}₹{p.amount.toLocaleString()}
              </p>
              <p className="text-[10px] capitalize mt-0.5" style={{ color: "var(--text-faint)" }}>
                {p.status.replace("_", " ")}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
