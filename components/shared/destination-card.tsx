"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import type { Destination } from "@/lib/types";

interface DestinationCardProps {
  destination: Destination;
  index?: number;
  variant?: "square" | "tall";
}

export default function DestinationCard({
  destination,
  index = 0,
  variant = "square",
}: DestinationCardProps) {
  const heightClass = variant === "tall" ? "h-64" : "h-44";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="flex-shrink-0 w-40"
    >
      <Link
        href={`/discover?destination=${destination.id}`}
        className="group block relative rounded-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-glass)" }}
      >
        <div className={`relative ${heightClass}`}>
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="160px"
          />
          <div className="absolute inset-0 img-overlay-bottom" />

          {/* Country flag via emoji logic using countryCode */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            {destination.trending && (
              <span className="glass-dark text-[10px] uppercase tracking-wider font-semibold text-amber-400 px-2 py-0.5 rounded-md">
                Trending
              </span>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-[10px] text-white/60 mb-0.5">{destination.country}</p>
            <h3 className="text-sm font-bold text-white leading-tight">
              {destination.name}
            </h3>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div className="glass-dark rounded-full p-2">
            <ArrowRight size={16} className="text-white" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
