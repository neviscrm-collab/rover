"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: "default" | "strong" | "dark";
  animate?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = false,
  onClick,
  variant = "default",
  animate = true,
}: GlassCardProps) {
  const variantClass = {
    default: "glass",
    strong: "glass-strong",
    dark: "glass-dark",
  }[variant];

  if (animate) {
    return (
      <motion.div
        className={cn(
          variantClass,
          "rounded-2xl overflow-hidden",
          hover &&
            "cursor-pointer transition-transform duration-300 hover:-translate-y-1",
          className
        )}
        whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        onClick={onClick}
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        variantClass,
        "rounded-2xl overflow-hidden",
        hover &&
          "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
      onClick={onClick}
      style={{ boxShadow: "var(--shadow-glass)" }}
    >
      {children}
    </div>
  );
}
