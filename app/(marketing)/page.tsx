"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkle, Lightning, Users, EnvelopeSimple, Lock, Eye, EyeSlash, Backpack, Buildings, GoogleLogo, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types/auth.types";

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

// ── Inline Login Widget ──────────────────────────────────────────────────────
function HomeLoginWidget() {
  const [mode, setMode] = useState<"choose" | "login">("choose");
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle, loading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const { role: r } = useAuthStore.getState();
      router.push(r === UserRole.AGENCY ? "/studio" : "/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle(role);
      const { role: r } = useAuthStore.getState();
      router.push(r === UserRole.AGENCY ? "/studio" : "/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
    }
  };

  const inputCls = "flex items-center gap-3 px-4 py-3 rounded-2xl";
  const inputStyle = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" };

  return (
    <section className="px-4 lg:px-0" id="join">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(10,5,30,0.95) 0%, rgba(20,10,50,0.9) 100%)",
          border: "1px solid rgba(124,58,237,0.25)",
        }}
      >
        {/* Blurred glow blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }} />

        <div className="relative grid lg:grid-cols-2 gap-0">
          {/* Left — copy */}
          <div className="p-8 lg:p-10 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 w-fit"
              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#A78BFA" }}
            >
              <Sparkle size={12} weight="fill" /> Start your journey
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              One account.<br />Every adventure.
            </h2>
            <p className="text-sm text-white/55 leading-relaxed mb-6">
              Sign in as a traveler to discover and book. Switch to Agency Studio to list your experiences and manage bookings — all from the same account.
            </p>

            {/* Role pills */}
            <div className="flex gap-2 flex-wrap">
              {([
                { r: UserRole.CUSTOMER, icon: Backpack, label: "Traveler", color: "#7C3AED" },
                { r: UserRole.AGENCY, icon: Buildings, label: "Agency", color: "#06B6D4" },
              ] as const).map(({ r, icon: Icon, label, color }) => (
                <button
                  key={r}
                  onClick={() => { setRole(r); setMode("login"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: role === r && mode === "login" ? `${color}22` : "rgba(255,255,255,0.05)",
                    border: `1px solid ${role === r && mode === "login" ? color + "55" : "rgba(255,255,255,0.1)"}`,
                    color: role === r && mode === "login" ? color : "rgba(255,255,255,0.6)",
                  }}
                >
                  <Icon size={14} weight="fill" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div className="p-8 lg:p-10 border-t lg:border-t-0 lg:border-l" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              Sign in to ROVER
            </p>

            {/* Google */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl mb-4 text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
            >
              <GoogleLogo size={16} weight="bold" /> Continue with Google
            </motion.button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className={inputCls} style={inputStyle}>
                <EnvelopeSimple size={16} style={{ color: "rgba(255,255,255,0.35)" }} />
                <input
                  type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30"
                />
              </div>
              <div className={inputCls} style={inputStyle}>
                <Lock size={16} style={{ color: "rgba(255,255,255,0.35)" }} />
                <input
                  type={showPw ? "text" : "password"} placeholder="Password" value={password}
                  onChange={(e) => setPassword(e.target.value)} required
                  className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ color: "rgba(255,255,255,0.35)" }}>
                  {showPw ? <EyeSlash size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <WarningCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-semibold text-sm text-white"
                style={{
                  background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.35)",
                }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </motion.button>
            </form>

            <div className="flex items-center justify-between mt-4">
              <Link href="/register" className="text-xs" style={{ color: "#A78BFA" }}>Create account</Link>
              <Link href="/forgot-password" className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Forgot password?</Link>
            </div>

            {/* Demo hint */}
            <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
              <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
                Demo → <button onClick={() => { setEmail("arjun@example.com"); setPassword("password123"); }} className="text-violet-400">Traveler</button>
                {" · "}
                <button onClick={() => { setEmail("hello@wanderlust.com"); setPassword("agency123"); }} className="text-cyan-400">Agency</button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
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

        {/* ── Join ROVER — inline login ─────────────────────────── */}
        <HomeLoginWidget />

        {/* ── Agency CTA ───────────────────────────────────────────── */}
        <section className="px-4 lg:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-7 text-center"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(124,58,237,0.1) 100%)",
              border: "1px solid rgba(6,182,212,0.2)",
            }}
          >
            <Lightning size={24} weight="fill" className="text-cyan-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-2">Are you a travel agency?</h2>
            <p className="text-sm text-white/55 mb-5 max-w-xs mx-auto">
              Publish experiences, manage bookings, and reach Gen Z travelers on ROVER Studio.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #06B6D4, #7C3AED)" }}
            >
              Open Agency Studio <ArrowRight size={14} />
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
