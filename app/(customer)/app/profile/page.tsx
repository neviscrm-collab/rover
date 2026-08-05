"use client";

import { useState } from "react";
import Image from "next/image";
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
          <Image
            src={CURRENT_USER.coverImage}
            alt="Cover"
            fill
            className="object-cover"
            sizes="100vw"
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
            <Image
              src={CURRENT_USER.avatar}
              alt={CURRENT_USER.name}
              fill
              className="object-cover"
              sizes="96px"
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
          <div className="text-center py-10">
            <Star size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-sm text-white/40">No reviews yet</p>
            <p className="text-xs text-white/25 mt-1">
              Complete a trip to leave your first review
            </p>
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
