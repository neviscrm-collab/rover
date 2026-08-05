"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, X, Sparkle } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const QUICK_SEARCHES = [
  "Himalayas trek",
  "Bali surf",
  "Japan anime",
  "Weekend Coorg",
  "Iceland aurora",
  "Morocco Sahara",
];

interface FloatingSearchProps {
  placeholder?: string;
  className?: string;
}

export default function FloatingSearch({
  placeholder = "Where are you going next?",
  className,
}: FloatingSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSearch = (q?: string) => {
    const term = q ?? query;
    if (!term.trim()) return;
    router.push(`/discover?q=${encodeURIComponent(term.trim())}`);
    setIsFocused(false);
    setQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search bar */}
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 2px rgba(124,58,237,0.5), 0 8px 32px rgba(0,0,0,0.5)"
            : "0 4px 24px rgba(0,0,0,0.4)",
        }}
        className="flex items-center gap-3 glass rounded-2xl px-4 py-3"
      >
        <MagnifyingGlass
          size={18}
          className={`flex-shrink-0 transition-colors ${
            isFocused ? "text-violet-400" : "text-white/40"
          }`}
        />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder-white/35 outline-none min-w-0"
        />
        {query && (
          <button onClick={() => setQuery("")}>
            <X size={16} className="text-white/40 hover:text-white/70 transition-colors" />
          </button>
        )}
        {!query && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Sparkle size={14} className="text-violet-400" />
            <span className="text-[11px] text-white/40">AI search</span>
          </div>
        )}
      </motion.div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-0 right-0 z-50 glass rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-widest text-white/30 px-3 py-2">
                Try searching
              </p>
              {QUICK_SEARCHES.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => handleSearch(s)}
                  className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <MagnifyingGlass size={14} className="text-white/30 group-hover:text-white/60 transition-colors" />
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    {s}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
