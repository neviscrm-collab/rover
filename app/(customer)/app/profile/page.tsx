"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin,
  InstagramLogo,
  Fire,
  Globe,
  Star,
  Heart,
  Users,
  Gear,
  Palette,
  ClipboardText,
} from "@phosphor-icons/react";
import ProfileBadge from "@/components/shared/profile-badge";
import ExperienceCard from "@/components/shared/experience-card";
import ThemeSwitcher from "@/components/shared/theme-switcher";
import { CURRENT_USER, EXPERIENCES } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const STATS = [
  { label: "Countries", value: CURRENT_USER.countriesVisited.length, icon: Globe },
  { label: "Trips", value: CURRENT_USER.tripsCompleted, icon: MapPin },
  { label: "Days", value: CURRENT_USER.totalDaysOnRoad, icon: Fire },
  { label: "Followers", value: `${(CURRENT_USER.followers / 1000).toFixed(1)}k`, icon: Users },
];

const COUNTRY_FLAGS: Record<string, string> = {
  IN: "🇮🇳", JP: "🇯🇵", ID: "🇮🇩", TH: "🇹🇭", NP: "🇳🇵",
  LK: "🇱🇰", MV: "🇲🇻", SG: "🇸🇬",
};

const wishlistedExperiences = EXPERIENCES.filter((e) =>
  CURRENT_USER.wishlist.includes(e.id)
);

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("stats");
  const [isThemeOpen, setThemeOpen] = useState(false);

  return (
    <div className="page-mobile min-h-screen">
      <ThemeSwitcher isOpen={isThemeOpen} onClose={() => setThemeOpen(false)} />

      {/* Cover + Avatar */}
      <div className="relative">
        <div className="relative h-52 overflow-hidden">
          <img
            src={CURRENT_USER.coverImage}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 img-overlay-bottom" />
        </div>

        {/* Settings buttons */}
        <div className="absolute top-12 right-4 flex gap-2">
          {/* Theme palette */}
          <button
            onClick={() => setThemeOpen(true)}
            className="w-9 h-9 rounded-full glass-dark flex items-center justify-center"
          >
            <Palette size={16} className="text-white/60" />
          </button>
          {/* Enquire */}
          <Link href="/enquire">
            <button className="w-9 h-9 rounded-full glass-dark flex items-center justify-center">
              <ClipboardText size={16} className="text-white/60" />
            </button>
          </Link>
          <button className="w-9 h-9 rounded-full glass-dark flex items-center justify-center">
            <Gear size={16} className="text-white/60" />
          </button>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-12 left-4">
          <div className="relative w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-black">
            <img
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="pt-16 px-4 lg:max-w-3xl lg:mx-auto">
        {/* Name + Info */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-white">{CURRENT_USER.name}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={12} className="text-white/40" />
              <span className="text-xs text-white/50">{CURRENT_USER.hometown}</span>
            </div>
            {CURRENT_USER.instagram && (
              <div className="flex items-center gap-1.5 mt-1">
                <InstagramLogo size={12} className="text-white/40" />
                <span className="text-xs text-violet-400/80">
                  {CURRENT_USER.instagram}
                </span>
              </div>
            )}
          </div>

          {/* Travel Streak */}
          <div
            className="flex flex-col items-center px-4 py-3 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(255,107,71,0.15))",
              border: "1px solid rgba(245,158,11,0.25)",
            }}
          >
            <Fire size={20} weight="fill" className="text-amber-400" />
            <p className="text-xl font-bold text-white">{CURRENT_USER.travelStreak}</p>
            <p className="text-[9px] text-amber-400/80 uppercase tracking-wider">
              Month streak
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-white/60 leading-relaxed mb-5">
          {CURRENT_USER.bio}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl p-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Icon size={14} className="text-white/40 mx-auto mb-1" />
                <p className="text-base font-bold text-white">{stat.value}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Countries Visited */}
        <div className="mb-6">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
            Countries visited
          </p>
          <div className="flex flex-wrap gap-2">
            {CURRENT_USER.countriesVisited.map((code) => (
              <span
                key={code}
                className="text-lg"
                title={code}
              >
                {COUNTRY_FLAGS[code] ?? "🌍"}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1 mb-6">
          {[
            { id: "stats", label: "Badges" },
            { id: "wishlist", label: "Wishlist" },
            { id: "reviews", label: "Reviews" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background:
                  activeTab === tab.id
                    ? "rgba(124,58,237,0.3)"
                    : "transparent",
                color:
                  activeTab === tab.id
                    ? "white"
                    : "rgba(255,255,255,0.4)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Badges */}
        {activeTab === "stats" && (
          <div>
            <p className="text-xs text-white/40 mb-4">
              {CURRENT_USER.badges.filter((b) => b.earned).length} of{" "}
              {CURRENT_USER.badges.length} badges earned
            </p>
            <div className="grid grid-cols-4 gap-4">
              {CURRENT_USER.badges.map((badge, idx) => (
                <ProfileBadge key={badge.id} badge={badge} index={idx} />
              ))}
            </div>
          </div>
        )}

        {/* Wishlist */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistedExperiences.length === 0 ? (
              <div className="text-center py-10">
                <Heart size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">Your wishlist is empty</p>
                <Link
                  href="/discover"
                  className="text-violet-400 text-xs mt-2 block"
                >
                  Start exploring
                </Link>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4">
                {wishlistedExperiences.map((exp, idx) => (
                  <ExperienceCard key={exp.id} experience={exp} index={idx} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {[
              {
                id: "r1",
                trip: "Bali Surf & Soul",
                agency: "WanderLust Experiences",
                rating: 5,
                date: "Aug 2025",
                img: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=80&q=70",
                review: "Honestly one of the best decisions of my life. The surf instructors were incredible, the villa was immaculate, and the whole vibe felt curated just for us. ROVER found this gem.",
              },
              {
                id: "r2",
                trip: "Tokyo Anime & Culture",
                agency: "Summit Seekers",
                rating: 5,
                date: "Mar 2025",
                img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=80&q=70",
                review: "7 days wasn't enough. The itinerary struck the perfect balance between tourist spots and local hidden gems. The Akihabara deep-dive was surreal. Already planning a return.",
              },
              {
                id: "r3",
                trip: "Spiti Valley Road Trip",
                agency: "WanderLust Experiences",
                rating: 4,
                date: "Sep 2024",
                img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=80&q=70",
                review: "Roads are brutal but the landscapes make it 100% worth it. Chandratal at sunrise was an out-of-body experience. Lost a star only because Day 3 accommodation could be better.",
              },
            ].map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={r.img} alt={r.trip} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{r.trip}</p>
                    <p className="text-[11px] text-white/45">{r.agency} · {r.date}</p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {Array.from({ length: 5 }).map((_, si) => (
                      <Star key={si} size={12} weight={si < r.rating ? "fill" : "regular"} className={si < r.rating ? "text-amber-400" : "text-white/20"} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-white/65 leading-relaxed">{r.review}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Member since */}
        <div className="mt-8 pb-4 text-center">
          <p className="text-[11px] text-white/25">
            ROVER member since {formatDate(CURRENT_USER.memberSince)}
          </p>
        </div>
      </div>
    </div>
  );
}
