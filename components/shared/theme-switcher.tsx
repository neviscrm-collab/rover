"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "@phosphor-icons/react";
import { useAppStore, type AppTheme } from "@/store/app-store";

const THEMES: {
  id: AppTheme;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  ring: string;
  label: string;
}[] = [
  {
    id: "dark",
    name: "Midnight",
    emoji: "🌑",
    bg: "#05050A",
    accent: "#7C3AED",
    ring: "#7C3AED",
    label: "Deep space dark",
  },
  {
    id: "light",
    name: "Light",
    emoji: "☀️",
    bg: "#EDE8FF",
    accent: "#7C3AED",
    ring: "#7C3AED",
    label: "Soft lavender white",
  },
  {
    id: "aurora",
    name: "Aurora",
    emoji: "🌌",
    bg: "#07041A",
    accent: "#A050FF",
    ring: "#A050FF",
    label: "Holographic violet",
  },
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    bg: "#0A0507",
    accent: "#FF4D64",
    ring: "#FF4D64",
    label: "Coral & amber",
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    bg: "#020D12",
    accent: "#06B6D4",
    ring: "#06B6D4",
    label: "Cyan deep sea",
  },
];

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThemeSwitcher({ isOpen, onClose }: ThemeSwitcherProps) {
  const { theme, setTheme } = useAppStore();

  const handleSelect = (t: AppTheme) => {
    setTheme(t);
    // small delay so the theme animation is visible before closing
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[90]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[91] rounded-t-3xl overflow-hidden"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--glass-border)",
              paddingBottom: "env(safe-area-inset-bottom, 16px)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "var(--border-bright)" }} />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-3 pb-4">
              <div>
                <h3 className="text-base font-bold" style={{ color: "var(--text)" }}>
                  Choose Theme
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
                  Personalise your ROVER experience
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "var(--surface)", color: "var(--text-dim)" }}
              >
                <X size={15} weight="bold" />
              </button>
            </div>

            {/* Theme grid */}
            <div className="grid grid-cols-5 gap-3 px-5 pb-6">
              {THEMES.map((t, i) => {
                const isActive = theme === t.id;
                return (
                  <motion.button
                    key={t.id}
                    onClick={() => handleSelect(t.id)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="flex flex-col items-center gap-2"
                  >
                    {/* Swatch */}
                    <div
                      className="relative w-14 h-14 rounded-2xl overflow-hidden"
                      style={{
                        background: t.bg,
                        boxShadow: isActive
                          ? `0 0 0 3px ${t.ring}, 0 0 16px ${t.ring}66`
                          : "none",
                        border: isActive
                          ? `2px solid ${t.ring}`
                          : "2px solid transparent",
                        transition: "box-shadow 0.2s, border 0.2s",
                      }}
                    >
                      {/* Mini preview gradient */}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${t.accent}44 0%, transparent 70%)`,
                        }}
                      />
                      {/* Accent dot */}
                      <div
                        className="absolute bottom-2 right-2 w-4 h-4 rounded-full"
                        style={{ background: t.accent }}
                      />
                      {/* Check mark */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", damping: 14 }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ background: t.accent }}
                          >
                            <Check size={12} weight="bold" className="text-white" />
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <span
                      className="text-[10px] font-semibold text-center leading-tight"
                      style={{ color: isActive ? t.accent : "var(--text-dim)" }}
                    >
                      {t.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Current theme label */}
            <div
              className="mx-5 mb-4 px-4 py-3 rounded-2xl text-center"
              style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
            >
              {(() => {
                const active = THEMES.find((t) => t.id === theme)!;
                return (
                  <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                    <span style={{ color: active.accent }} className="font-semibold">
                      {active.emoji} {active.name}
                    </span>{" "}
                    — {active.label}
                  </p>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
