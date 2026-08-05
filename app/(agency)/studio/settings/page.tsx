"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import {
  User, Bell, Globe, Lock, SignOut, CaretRight,
  EnvelopeSimple,
} from "@phosphor-icons/react";

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile", sub: "Edit your agency details" },
      { icon: EnvelopeSimple, label: "Email", sub: "Manage email address" },
      { icon: Lock, label: "Password & Security", sub: "Change password, 2FA" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", sub: "Booking alerts, messages" },
      { icon: Globe, label: "Language & Region", sub: "English (India)" },
    ],
  },
];

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    router.replace("/");
  };

  return (
    <div className="min-h-screen px-5 lg:px-8 py-8 pb-24 lg:pb-8" style={{ background: "var(--bg)" }}>
      <h1 className="text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Settings</h1>

      {/* Agency card */}
      <div
        className="flex items-center gap-4 p-4 rounded-2xl mb-7"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
        >
          {user?.name?.[0] ?? "A"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate" style={{ color: "var(--text)" }}>{user?.name ?? "Your Agency"}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-faint)" }}>{user?.email}</p>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
              Verified Agency
            </span>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {SETTINGS_SECTIONS.map(({ title, items }) => (
        <div key={title} className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-faint)" }}>{title}</p>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {items.map(({ icon: Icon, label, sub }, i) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.99 }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.12)" }}
                >
                  <Icon size={16} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>{sub}</p>
                </div>
                <CaretRight size={15} style={{ color: "var(--text-faint)" }} />
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        disabled={logoutLoading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm mt-4"
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          color: "#EF4444",
        }}
      >
        <SignOut size={16} weight="bold" />
        {logoutLoading ? "Signing out…" : "Sign out"}
      </motion.button>

      <p className="text-center text-xs mt-6" style={{ color: "var(--text-faint)" }}>
        ROVER Studio · v2.0.0 · &copy; 2026
      </p>
    </div>
  );
}
