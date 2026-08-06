"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Star, Clock } from "@phosphor-icons/react";
import TravelerStack from "./traveler-stack";
import { formatPrice } from "@/lib/utils";
import type { Experience } from "@/lib/types";

interface HeroCarouselProps {
  experiences: Experience[];
  autoPlay?: boolean;
  interval?: number;
}

export default function HeroCarousel({
  experiences,
  autoPlay = true,
  interval = 5000,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % experiences.length);
  }, [experiences.length]);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, isPaused, next]);

  const exp = experiences[current];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", maxHeight: "900px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={exp.heroImage}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 img-overlay-bottom" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(5,5,10,0.7) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-32 lg:pb-16 lg:px-12 lg:justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-lg"
          >
            {/* Badge */}
            {exp.badge && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 glass-dark text-xs font-semibold uppercase tracking-widest text-amber-400 px-3 py-1.5 rounded-full mb-4"
              >
                {exp.badge}
              </motion.span>
            )}

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-3">
              {exp.title}
            </h1>
            <p className="text-sm lg:text-base text-white/70 leading-relaxed mb-5 line-clamp-2">
              {exp.tagline}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full">
                <MapPin size={13} weight="fill" className="text-white/60" />
                <span className="text-xs text-white/80">
                  {exp.destination.name}, {exp.destination.country}
                </span>
              </div>
              <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full">
                <Clock size={13} className="text-white/60" />
                <span className="text-xs text-white/80">{exp.duration}</span>
              </div>
              <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full">
                <Star size={13} weight="fill" className="text-amber-400" />
                <span className="text-xs text-white/80">
                  {exp.rating.toFixed(1)} ({exp.reviewCount})
                </span>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(exp.price, exp.currency)}
                </span>
                <span className="text-sm text-white/50 ml-1">/ person</span>
              </div>

              <TravelerStack travelers={exp.travelers} max={3} size="md" />

              <Link
                href={`/experience/${exp.id}`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm text-white transition-all duration-300 hover:gap-3"
                style={{
                  background:
                    "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
                }}
              >
                Explore
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="absolute bottom-24 lg:bottom-8 right-5 lg:right-12 flex flex-col lg:flex-row items-center gap-2">
        {experiences.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className="transition-all duration-300"
          >
            <div
              className={`rounded-full transition-all duration-300 ${
                idx === current
                  ? "w-6 lg:w-6 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {autoPlay && !isPaused && (
        <motion.div
          key={`progress-${current}`}
          className="absolute bottom-0 left-0 h-0.5 origin-left"
          style={{
            background: "linear-gradient(90deg, #7C3AED, #06B6D4)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: interval / 1000, ease: "linear" }}
        />
      )}
    </div>
  );
}
