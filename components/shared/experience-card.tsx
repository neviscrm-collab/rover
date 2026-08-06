"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Clock, Heart } from "@phosphor-icons/react";
import TravelerStack from "./traveler-stack";
import { useAppStore } from "@/store/app-store";
import { formatPrice, getSeatsLabel, cn, CATEGORY_COLORS } from "@/lib/utils";
import type { Experience } from "@/lib/types";

interface ExperienceCardProps {
  experience: Experience;
  variant?: "default" | "wide" | "compact";
  index?: number;
}

export default function ExperienceCard({
  experience,
  variant = "default",
  index = 0,
}: ExperienceCardProps) {
  const { toggleWishlist, isWishlisted } = useAppStore();
  const wishlisted = isWishlisted(experience.id);

  const cardClasses = {
    default: "w-64 flex-shrink-0",
    wide: "w-72 flex-shrink-0",
    compact: "w-full",
  };

  const imageHeight = {
    default: "h-44",
    wide: "h-52",
    compact: "h-48",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className={cardClasses[variant]}
    >
      <Link href={`/experience/${experience.id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-glass)" }}>
          {/* Image */}
          <div className={`relative ${imageHeight[variant]} overflow-hidden`}>
            <img
              src={experience.heroImage}
              alt={experience.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 img-overlay-bottom" />

            {/* Top Row */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              {/* Badge */}
              {experience.badge && (
                <span className="glass-dark text-[10px] font-semibold uppercase tracking-wider text-amber-400 px-2 py-1 rounded-lg">
                  {experience.badge}
                </span>
              )}
              <div className="ml-auto">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(experience.id);
                  }}
                  className="w-8 h-8 rounded-full glass-dark flex items-center justify-center"
                >
                  <Heart
                    size={16}
                    weight={wishlisted ? "fill" : "regular"}
                    className={wishlisted ? "text-red-400" : "text-white/70"}
                  />
                </motion.button>
              </div>
            </div>

            {/* Bottom content over image */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center gap-1 mb-1">
                <MapPin size={11} weight="fill" className="text-white/60 flex-shrink-0" />
                <span className="text-[11px] text-white/60 truncate">
                  {experience.destination.name}, {experience.destination.country}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
                {experience.title}
              </h3>
            </div>
          </div>

          {/* Card body */}
          <div
            className="p-3 rounded-b-2xl"
            style={{ background: "var(--glass-bg-strong)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--glass-border)" }}
          >
            {/* Category + Duration */}
            <div className="flex items-center justify-between mb-2.5">
              <span
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full border",
                  CATEGORY_COLORS[experience.category] ?? "bg-white/10 text-white/60 border-white/10"
                )}
              >
                {experience.category}
              </span>
              <div className="flex items-center gap-1">
                <Clock size={11} className="text-white/40" />
                <span className="text-[11px] text-white/50">{experience.duration}</span>
              </div>
            </div>

            {/* Price + Rating Row */}
            <div className="flex items-end justify-between">
              <div>
                <span className="text-base font-bold text-white">
                  {formatPrice(experience.price, experience.currency)}
                </span>
                <span className="text-[10px] text-white/40 ml-1">/ person</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} weight="fill" className="text-amber-400" />
                <span className="text-xs font-medium text-white">
                  {experience.rating.toFixed(1)}
                </span>
                <span className="text-[10px] text-white/40">
                  ({experience.reviewCount})
                </span>
              </div>
            </div>

            {/* Travelers + Seats */}
            <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-white/5">
              <TravelerStack travelers={experience.travelers} max={3} />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  experience.seatsLeft <= 3 ? "text-amber-400" : "text-white/40"
                )}
              >
                {getSeatsLabel(experience.seatsLeft)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
