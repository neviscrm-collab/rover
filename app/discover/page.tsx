"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Sparkle } from "@phosphor-icons/react";
import ExperienceCard from "@/components/shared/experience-card";
import FloatingSearch from "@/components/shared/floating-search";
import EmptyState from "@/components/shared/empty-state";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { EXPERIENCES } from "@/lib/mock-data";
import { CATEGORY_COLORS } from "@/lib/utils";
import type { Category } from "@/lib/types";

const ALL_CATEGORIES: Category[] = [
  "Backpacking",
  "Solo",
  "Trekking",
  "Camping",
  "Road Trips",
  "Surfing",
  "Festivals",
  "Photography",
  "Food & Culture",
  "Wellness",
  "Digital Nomad",
  "Anime & Pop Culture",
];

const DIFFICULTIES = ["Easy", "Moderate", "Challenging"];
const SORT_OPTIONS = [
  { id: "trending", label: "Trending" },
  { id: "price-asc", label: "Price: Low" },
  { id: "price-desc", label: "Price: High" },
  { id: "rating", label: "Top Rated" },
];

function DiscoverContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const initialCat = searchParams.get("category") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [activeCategories, setActiveCategories] = useState<string[]>(
    initialCat ? [initialCat] : []
  );
  const [activeDifficulties, setActiveDifficulties] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("trending");
  const [showFilters, setShowFilters] = useState(false);

  // Filter logic
  const filtered = EXPERIENCES.filter((exp) => {
    if (
      query &&
      !exp.title.toLowerCase().includes(query.toLowerCase()) &&
      !exp.destination.name.toLowerCase().includes(query.toLowerCase()) &&
      !exp.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    ) {
      return false;
    }
    if (
      activeCategories.length > 0 &&
      !activeCategories.includes(exp.category)
    ) {
      return false;
    }
    if (
      activeDifficulties.length > 0 &&
      !activeDifficulties.includes(exp.difficulty)
    ) {
      return false;
    }
    return true;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return b.trending === a.trending ? 0 : b.trending ? 1 : -1;
    }
  });

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleDifficulty = (d: string) => {
    setActiveDifficulties((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setActiveDifficulties([]);
    setQuery("");
    setSortBy("trending");
  };

  const hasFilters =
    activeCategories.length > 0 ||
    activeDifficulties.length > 0 ||
    query !== "";

  return (
    <div className="page-mobile min-h-screen">
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-4 pt-12 pb-4 lg:pt-6"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,10,0.95) 80%, transparent)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center justify-between mb-4 lg:max-w-7xl lg:mx-auto">
          <h1 className="text-2xl font-bold text-white">Discover</h1>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearFilters}
                className="text-[11px] text-white/60 glass px-3 py-1.5 rounded-full"
              >
                Clear
              </motion.button>
            )}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className="relative w-9 h-9 rounded-xl glass flex items-center justify-center"
            >
              <SlidersHorizontal size={16} className="text-white/60" />
              {hasFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500" />
              )}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="lg:max-w-7xl lg:mx-auto">
          <FloatingSearch placeholder="Search destinations, vibes, experiences..." />
        </div>

        {/* Category pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide lg:max-w-7xl lg:mx-auto">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all duration-200"
                style={{
                  background: isActive
                    ? "rgba(124,58,237,0.3)"
                    : "rgba(255,255,255,0.05)",
                  borderColor: isActive
                    ? "rgba(124,58,237,0.5)"
                    : "rgba(255,255,255,0.08)",
                  color: isActive ? "white" : "rgba(255,255,255,0.5)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filters Panel ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 lg:max-w-7xl lg:mx-auto">
              {/* Difficulty */}
              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Difficulty
                </p>
                <div className="flex gap-2">
                  {DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDifficulty(d)}
                      className="text-xs px-4 py-2 rounded-full border transition-all"
                      style={{
                        background: activeDifficulties.includes(d)
                          ? "rgba(124,58,237,0.3)"
                          : "rgba(255,255,255,0.05)",
                        borderColor: activeDifficulties.includes(d)
                          ? "rgba(124,58,237,0.5)"
                          : "rgba(255,255,255,0.08)",
                        color: activeDifficulties.includes(d)
                          ? "white"
                          : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Sort by
                </p>
                <div className="flex gap-2 flex-wrap">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setSortBy(opt.id)}
                      className="text-xs px-4 py-2 rounded-full border transition-all"
                      style={{
                        background:
                          sortBy === opt.id
                            ? "rgba(124,58,237,0.3)"
                            : "rgba(255,255,255,0.05)",
                        borderColor:
                          sortBy === opt.id
                            ? "rgba(124,58,237,0.5)"
                            : "rgba(255,255,255,0.08)",
                        color:
                          sortBy === opt.id
                            ? "white"
                            : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results ───────────────────────────────────────────────── */}
      <div className="px-4 lg:max-w-7xl lg:mx-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/50">
            <span className="text-white font-semibold">{sorted.length}</span>{" "}
            experiences
          </p>
          {query && (
            <p className="text-sm text-white/40">
              Results for &quot;<span className="text-white">{query}</span>&quot;
            </p>
          )}
        </div>

        {sorted.length === 0 ? (
          <EmptyState
            icon={MagnifyingGlass}
            title="Nothing found"
            description="Try different keywords or clear your filters to see all experiences."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {sorted.map((exp, idx) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  index={idx}
                  variant="compact"
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* ── AI discover banner ────────────────────────────────────── */}
      {!hasFilters && (
        <div className="px-4 mt-8 lg:max-w-7xl lg:mx-auto">
          <div
            className="rounded-2xl p-4 flex items-center gap-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.08))",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
            >
              <Sparkle size={18} weight="fill" className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Can&apos;t find what you want?
              </p>
              <p className="text-xs text-white/50">
                Ask ROVER AI — &quot;Plan Japan for ₹50k&quot; or &quot;Best solo trek&quot;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="page-mobile min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
