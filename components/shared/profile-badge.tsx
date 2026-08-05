"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Mountains,
  Waves,
  Campfire,
  User,
  Globe,
  Trophy,
  Star,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { Badge } from "@/lib/types";

const ICON_MAP: Record<string, PhosphorIcon> = {
  MapPin,
  Mountains,
  Waves,
  Campfire,
  User,
  Globe,
  Trophy,
  Star,
};

interface ProfileBadgeProps {
  badge: Badge;
  size?: "sm" | "md" | "lg";
  index?: number;
}

export default function ProfileBadge({ badge, size = "md", index = 0 }: ProfileBadgeProps) {
  const Icon = ICON_MAP[badge.iconName] ?? Trophy;

  const dims = {
    sm: { container: "w-12 h-12", icon: 16, text: "text-[9px]" },
    md: { container: "w-16 h-16", icon: 22, text: "text-[10px]" },
    lg: { container: "w-20 h-20", icon: 28, text: "text-xs" },
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", bounce: 0.3 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={cn(
          dims.container,
          "rounded-2xl flex items-center justify-center relative",
          !badge.earned && "opacity-30"
        )}
        style={{
          background: badge.earned
            ? `radial-gradient(circle at 30% 30%, ${badge.color}30, ${badge.color}10)`
            : "rgba(255,255,255,0.05)",
          border: badge.earned
            ? `1px solid ${badge.color}40`
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: badge.earned ? `0 0 20px ${badge.color}20` : "none",
        }}
        title={badge.description}
      >
        <Icon
          size={dims.icon}
          weight={badge.earned ? "fill" : "regular"}
          style={{ color: badge.earned ? badge.color : "rgba(255,255,255,0.3)" }}
        />
        {!badge.earned && (
          <div
            className="absolute inset-0 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <span className="text-white/20 text-lg">🔒</span>
          </div>
        )}
      </div>
      <span
        className={cn(
          dims.text,
          "text-white/60 text-center max-w-[64px] leading-tight"
        )}
      >
        {badge.name}
      </span>
    </motion.div>
  );
}
