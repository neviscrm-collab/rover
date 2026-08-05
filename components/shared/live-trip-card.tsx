"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, CalendarBlank, Ticket } from "@phosphor-icons/react";
import { formatDate, getDaysUntil, cn } from "@/lib/utils";
import type { Trip } from "@/lib/types";

interface LiveTripCardProps {
  trip: Trip;
  index?: number;
}

export default function LiveTripCard({ trip, index = 0 }: LiveTripCardProps) {
  const daysUntil = getDaysUntil(trip.departureDate);
  const isUpcoming = trip.status === "upcoming";
  const isOngoing = trip.status === "ongoing";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link href={`/trips/${trip.id}`} className="group block">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Top image strip */}
          <div className="relative h-28 overflow-hidden">
            <Image
              src={trip.experience.heroImage}
              alt={trip.experience.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="600px"
            />
            <div className="absolute inset-0 img-overlay-bottom" />

            {/* Status chip */}
            <div className="absolute top-3 left-3">
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full",
                  isOngoing && "bg-emerald-500/30 text-emerald-400 border border-emerald-500/30",
                  isUpcoming && "bg-violet-500/30 text-violet-400 border border-violet-500/30",
                  trip.status === "completed" && "bg-white/10 text-white/60 border border-white/10",
                  trip.status === "cancelled" && "bg-red-500/20 text-red-400 border border-red-500/20"
                )}
              >
                {isOngoing ? "● Live" : trip.status}
              </span>
            </div>

            {/* Days countdown */}
            {isUpcoming && daysUntil > 0 && (
              <div className="absolute top-3 right-3 glass-dark px-3 py-1.5 rounded-xl">
                <p className="text-[10px] text-white/50">Departs in</p>
                <p className="text-sm font-bold text-white">{daysUntil}d</p>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">
              {trip.experience.title}
            </h3>

            <div className="flex items-center gap-1 mb-3">
              <MapPin size={11} className="text-white/40 flex-shrink-0" />
              <span className="text-[11px] text-white/50 truncate">
                {trip.experience.destination.name}, {trip.experience.destination.country}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-white/40">
              <div className="flex items-center gap-1">
                <CalendarBlank size={11} />
                <span>
                  {formatDate(trip.departureDate)} → {formatDate(trip.returnDate)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Ticket size={11} />
                <span className="font-mono">{trip.bookingRef.split("-").slice(-1)[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
