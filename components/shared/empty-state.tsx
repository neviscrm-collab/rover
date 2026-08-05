"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { type Icon as PhosphorIcon } from "@phosphor-icons/react";

interface EmptyStateProps {
  icon: PhosphorIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      {/* Icon container */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background: "rgba(124,58,237,0.1)",
          border: "1px solid rgba(124,58,237,0.2)",
        }}
      >
        <Icon size={36} className="text-violet-400" weight="duotone" />
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed max-w-xs mb-8">
        {description}
      </p>

      {actionLabel && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              }}
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              }}
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}
