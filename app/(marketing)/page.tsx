"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkle, Lightning, Users } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";

import HeroCarousel from "@/components/shared/hero-carousel";
import ExperienceCard from "@/components/shared/experience-card";
import DestinationCard from "@/components/shared/destination-card";
import TravelerStack from "@/components/shared/traveler-stack";
import FloatingSearch from "@/components/shared/floating-search";
import { useAppStore } from "@/store/app-store";

import {
  EXPERIENCES,
  DESTINATIONS,
  TRAVELERS,
  COMMUNITY_POSTS,
} from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

const HERO_EXPERIENCES = EXPERIENCES.filter((e) => e.isFeatured).slice(0, 3);
const TRENDING = EXPERIENCES.filter((e) => e.trending);
const WEEKEND = EXPERIENCES.filter((e) => e.isWeekendEscape);
const AI_PICKS = EXPERIENCES.filter((e) => e.aiPick).slice(0, 3);

const CATEGORIES = [
  { id: "Backpacking", icon: "🎒" },
  { id: "Trekking", icon: "⛰️" },
  { id: "Surfing", icon: "🏄" },
  { id: "Camping", icon: "🏕️" },
  { id: "Road Trips", icon: "🚗" },
  { id: "Wellness", icon: "🧘" },
  { id: "Festivals", icon: "🎪" },
  { id: "Anime & Pop Culture", icon: "✨" },
];

function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
      className="flex items-end justify-between mb-4 px-4 lg:px-0"
    >
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && (
          <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          See all
          <ArrowRight size={12} />
        </Link>
      )}
    </motion.div>
  );
}

export default function HomePage() {
  const { setActiveCategory } = useAppStore();

  return (
    <div className="page-mobile">
      {/* ── Hero Carousel ──────────────────────────────────────────────── */}
      <HeroCarousel experiences={HERO_EXPERIENCES} />

      {/* ── Floating Search ────────────────────────────────────────────── */}
      <div className="px-4 -mt-6 relative z-10 lg:max-w-2xl lg:mx-auto lg:px-0">
        <FloatingSearch />
      </div>

      {/* ── Content area ───────────────────────────────────────────────── */}
      <div className="mt-10 space-y-12 pb-8 lg:max-w-7xl lg:mx-auto lg:px-12">

        {/* ── Trending This Week ─────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Trending this week"
            subtitle="Everyone's talking about these"
            href="/discover?sort=trending"
          />
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 lg:px-0">
            {TRENDING.map((exp, idx) => (
              <ExperienceCard key={exp.id} experience={exp} index={idx} />
            ))}
          </div>
        </section>

        {/* ── Weekend Escapes ───────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Weekend escapes"
            subtitle="Leave Friday, back by Sunday"
            href="/discover?filter=weekend"
          />
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 lg:px-0">
            {WEEKEND.map((exp, idx) => (
              <ExperienceCard
                key={exp.id}
                experience={exp}
                index={idx}
                variant="compact"
              />
            ))}
            {WEEKEND.length === 0 &&
              EXPERIENCES.slice(4, 7).map((exp, idx) => (
                <ExperienceCard key={exp.id} experience={exp} index={idx} />
              ))}
          </div>
        </section>

        {/* ── Explore by Vibe ───────────────────────────────────────── */}
        <section>
          <SectionHeader title="Explore by vibe" href="/discover" />
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide px-4 lg:px-0">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link
                  href={`/discover?category=${encodeURIComponent(cat.id)}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 group"
                >
                  <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-2xl transition-all duration-200 group-hover:bg-white/10 group-hover:scale-105">
                    {cat.icon}
                  </div>
                  <span className="text-[10px] text-white/55 group-hover:text-white/80 transition-colors text-center w-16 leading-tight">
                    {cat.id.split(" & ")[0]}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Destinations ─────────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Top destinations"
            subtitle="Where the world is going"
            href="/discover"
          />
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 lg:px-0">
            {DESTINATIONS.map((dest, idx) => (
              <DestinationCard key={dest.id} destination={dest} index={idx} />
            ))}
          </div>
        </section>

        {/* ── Friends Are Going ─────────────────────────────────────── */}
        <section>
          <SectionHeader
            title="Friends are going"
            subtitle="Join your crew on these trips"
          />
          <div className="space-y-3 px-4 lg:px-0">
            {EXPERIENCES.slice(0, 3).map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link href={`/experience/${exp.id}`}>
                  <div
                    className="flex items-center gap-3 rounded-2xl p-3 transition-all hover:bg-white/5"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={exp.heroImage}
                        alt={exp.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">
                        {exp.title}
                      </h3>
                      <p className="text-[11px] text-white/50 truncate">
                        {exp.destination.name} · {exp.duration}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <TravelerStack
                        travelers={TRAVELERS.slice(0, 2)}
                        max={2}
                        showCount={false}
                      />
                      <p className="text-[10px] text-white/40 mt-1 text-right">
                        {[2, 1, 3][idx % 3]} friends going
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── AI Picks ──────────────────────────────────────────────── */}
        <section>
          <div className="px-4 lg:px-0">
            {/* AI section header */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="relative rounded-3xl overflow-hidden mb-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(6,182,212,0.1) 100%)",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: "#7C3AED" }} />
              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
                  >
                    <Sparkle size={14} weight="fill" className="text-white" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-violet-400">
                    AI Picks for You
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">
                  Curated by ROVER AI
                </h2>
                <p className="text-xs text-white/50">
                  Based on your vibe — adventure-seeker, budget traveler, Himalayas lover
                </p>
              </div>
            </motion.div>

            {/* AI pick cards */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {AI_PICKS.map((exp, idx) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  variant="wide"
                  index={idx}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── From the Community ───────────────────────────────────── */}
        <section>
          <SectionHeader
            title="From the community"
            subtitle="Real moments, real travelers"
            href="/community"
          />
          <div className="space-y-3 px-4 lg:px-0">
            {COMMUNITY_POSTS.slice(0, 3).map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {post.author.name}
                    </p>
                    <p className="text-[10px] text-white/40">
                      {formatRelativeTime(post.timestamp)}
                      {post.destination && ` · ${post.destination.name}`}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-white/75 leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                {post.images.length > 0 && (
                  <div className="relative h-40 rounded-xl overflow-hidden mt-3">
                    <Image
                      src={post.images[0]}
                      alt="Post image"
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4 mt-3 text-[11px] text-white/40">
                  <span>❤️ {post.likes.toLocaleString()}</span>
                  <span>💬 {post.comments}</span>
                  <div className="flex gap-1.5 ml-auto flex-wrap">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-violet-400/70">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            <Link
              href="/community"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors glass mt-2"
            >
              <Users size={16} />
              See all community posts
            </Link>
          </div>
        </section>

        {/* ── CTA Banner ───────────────────────────────────────────── */}
        <section className="px-4 lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-8 text-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(245,158,11,0.15) 100%)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 30% 50%, rgba(124,58,237,0.4), transparent 60%), radial-gradient(circle at 70% 50%, rgba(245,158,11,0.3), transparent 60%)",
              }}
            />
            <div className="relative">
              <Lightning size={28} weight="fill" className="text-amber-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-2">
                Are you a travel agency?
              </h2>
              <p className="text-sm text-white/60 mb-5 max-w-xs mx-auto">
                Publish your experiences, manage bookings, and reach thousands of Gen Z travelers on ROVER.
              </p>
              <Link
                href="/agency"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-transform hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                }}
              >
                Open Agency Studio
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
