"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, Bed, Mountains, Waves } from "@phosphor-icons/react";
import type { ItineraryDay } from "@/lib/types";

interface StoryTimelineProps {
  itinerary: ItineraryDay[];
}

const mealIcons: Record<string, string> = {
  Breakfast: "☀️",
  Lunch: "🍽",
  Dinner: "🌙",
  "Packed Lunch": "🎒",
  "Campfire Dinner": "🔥",
};

export default function StoryTimeline({ itinerary }: StoryTimelineProps) {
  return (
    <div className="space-y-0">
      {itinerary.map((day, idx) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: idx * 0.08, duration: 0.4 }}
          className="relative flex gap-5"
        >
          {/* Timeline line + dot */}
          <div className="flex flex-col items-center flex-shrink-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
              style={{
                background:
                  idx === 0
                    ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                    : "rgba(255,255,255,0.08)",
                border: idx === 0 ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: idx === 0 ? "white" : "rgba(255,255,255,0.5)" }}
              >
                {day.day}
              </span>
            </div>
            {idx < itinerary.length - 1 && (
              <div
                className="w-px flex-1 mt-2"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(124,58,237,0.3), rgba(255,255,255,0.05))",
                  minHeight: "40px",
                }}
              />
            )}
          </div>

          {/* Content */}
          <div className="pb-8 flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-violet-400/80 mb-1">
              Day {day.day}
            </p>
            <h3 className="text-base font-semibold text-white mb-2">
              {day.title}
            </h3>
            <p className="text-sm text-white/55 leading-relaxed mb-3">
              {day.description}
            </p>

            {/* Image */}
            {day.image && (
              <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                <Image
                  src={day.image}
                  alt={day.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
            )}

            {/* Activities */}
            <div className="flex flex-wrap gap-2 mb-2">
              {day.activities.map((activity) => (
                <span
                  key={activity}
                  className="text-[11px] text-white/60 glass px-2.5 py-1 rounded-full"
                >
                  {activity}
                </span>
              ))}
            </div>

            {/* Meals */}
            {day.meals.length > 0 && (
              <div className="flex items-center gap-2">
                {day.meals.map((meal) => (
                  <span key={meal} className="text-[11px] text-white/40">
                    {mealIcons[meal] ?? "🍴"} {meal}
                  </span>
                ))}
              </div>
            )}

            {/* Accommodation */}
            {day.accommodation && (
              <div className="flex items-center gap-1.5 mt-2">
                <Bed size={12} className="text-white/30" />
                <span className="text-[11px] text-white/40">
                  {day.accommodation}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
