"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkle,
  X,
  PaperPlaneTilt,
  Robot,
} from "@phosphor-icons/react";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const AI_SUGGESTIONS = [
  "Plan a ₹50k Japan trip",
  "Best treks in India under 10k",
  "Solo travel tips for women",
  "Weekend escapes from Bangalore",
];

const AI_RESPONSES: Record<string, string> = {
  default: `Hey! I'm your ROVER travel companion. I can help you:

✦ **Find experiences** matching your budget and vibe
✦ **Plan itineraries** for any destination
✦ **Pack smart** with custom packing lists
✦ **Visa info** for any country
✦ **Answer anything** travel-related

What are you dreaming about? 🌏`,

  japan: `Japan on ₹50,000 is very doable! Here's a quick breakdown:

**Flights** (budget): ~₹25,000 return (Delhi-Tokyo)
**Accommodation** (7 nights hostel/capsule): ~₹10,000
**JR Pass** (7 days): ~₹7,000
**Food & transport**: ~₹6,000
**Experiences & misc**: ~₹2,000

**Top picks on ROVER:**
→ Anime & Culture Deep Dive — Tokyo & Kyoto (₹1,20,000 all-inclusive)
→ Or go DIY with just flights + JR Pass

Want me to suggest specific experiences in your budget?`,

  trek: `**Top treks in India under ₹10,000:**

1. **Kedarkantha** — Snow trek, Uttarakhand (5 days, ~₹8,000)
2. **Kasol-Kheerganga** — Himachal, easy, ~₹4,000
3. **Coorg Coffee & Trek Weekend** — via ROVER (₹8,500 all-in!)
4. **Tungnath-Chandrashila** — Highest Shiva temple, ~₹7,000
5. **Brahmatal Lake** — Winter snow trek, ~₹9,500

The **Coorg** trip is available right now on ROVER and has zero logistics on your end.

Which region are you interested in?`,

  solo: `**Solo travel for women — my honest advice:**

**Safest solo-friendly destinations:**
→ Japan 🇯🇵 — Most solo-female-friendly country on Earth
→ Bali 🇮🇩 — Huge solo travel community
→ Iceland 🇮🇸 — Extremely safe, stunning nature

**In India:**
→ Coorg, Spiti, Rishikesh — well-established, safe routes
→ ROVER groups always have 40%+ women travelers

**Practical tips:**
✦ Always share location with someone trusted
✦ Book ROVER group trips — instant crew, vetted agencies
✦ Hostel common areas > hotel rooms for meeting people

Want to see our upcoming solo-friendly group departures?`,
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("japan") || lower.includes("₹50k") || lower.includes("50000")) {
    return AI_RESPONSES.japan;
  }
  if (lower.includes("trek") || lower.includes("hike") || lower.includes("10k")) {
    return AI_RESPONSES.trek;
  }
  if (lower.includes("solo") || lower.includes("women") || lower.includes("safe")) {
    return AI_RESPONSES.solo;
  }
  return AI_RESPONSES.default;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/→ /g, '<span style="color:rgba(124,58,237,0.9)">→</span> ')
    .replace(/✦ /g, '<span style="color:rgba(245,158,11,0.9)">✦</span> ')
    .replace(/\n/g, '<br/>');
}

export default function AIOrb() {
  const { isAIOpen, setAIOpen, aiMessages, addAIMessage, clearAIMessages } =
    useAppStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages]);

  useEffect(() => {
    if (isAIOpen && aiMessages.length === 0) {
      setTimeout(() => {
        addAIMessage({ role: "assistant", content: AI_RESPONSES.default });
      }, 300);
    }
  }, [isAIOpen, aiMessages.length, addAIMessage]);

  const handleSend = async (message?: string) => {
    const text = message ?? input.trim();
    if (!text) return;

    setInput("");
    addAIMessage({ role: "user", content: text });
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));
    setIsTyping(false);
    addAIMessage({ role: "assistant", content: getAIResponse(text) });
  };

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        className={cn(
          "fixed z-50 bottom-24 right-4 lg:bottom-8 lg:right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl",
          "glow-accent"
        )}
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setAIOpen(!isAIOpen)}
        animate={{ rotate: isAIOpen ? 45 : 0 }}
      >
        <motion.div animate={{ scale: isAIOpen ? 0 : 1 }} className="absolute">
          <Sparkle size={24} weight="fill" className="text-white" />
        </motion.div>
        <motion.div animate={{ scale: isAIOpen ? 1 : 0 }} className="absolute">
          <X size={22} weight="bold" className="text-white" />
        </motion.div>
      </motion.button>

      {/* Pulse ring */}
      {!isAIOpen && (
        <div
          className="fixed z-40 bottom-24 right-4 lg:bottom-8 lg:right-6 w-14 h-14 rounded-full animate-pulse-glow pointer-events-none"
          style={{ background: "rgba(124,58,237,0.2)" }}
        />
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isAIOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="fixed z-50 bottom-40 right-4 lg:bottom-24 lg:right-6 w-[340px] max-h-[60vh] flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "rgba(8, 8, 20, 0.95)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(124,58,237,0.3)",
              boxShadow:
                "0 0 60px rgba(124,58,237,0.2), 0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 p-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                }}
              >
                <Robot size={16} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">ROVER AI</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[11px] text-white/50">Always on</p>
                </div>
              </div>
              <button
                onClick={() => clearAIMessages()}
                className="ml-auto text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                      }}
                    >
                      <Sparkle size={12} weight="fill" className="text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3 py-2.5 text-[13px] leading-relaxed",
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "text-white/85 rounded-tl-sm"
                    )}
                    style={
                      msg.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #7C3AED, #5B21B6)",
                          }
                        : { background: "rgba(255,255,255,0.06)" }
                    }
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(msg.content),
                    }}
                  />
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-2 items-center">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                    }}
                  >
                    <Sparkle size={12} weight="fill" className="text-white" />
                  </div>
                  <div
                    className="px-3 py-2.5 rounded-2xl rounded-tl-sm"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-white/40"
                          animate={{ y: [0, -4, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions (only when few messages) */}
            {aiMessages.length <= 1 && (
              <div className="px-3 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
                {AI_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="flex-shrink-0 text-[11px] text-white/60 glass px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div
              className="p-3 flex items-center gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 rounded-xl px-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:bg-white/8 transition-colors"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: input.trim()
                    ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                    : "rgba(255,255,255,0.08)",
                }}
              >
                <PaperPlaneTilt
                  size={15}
                  weight="fill"
                  className={input.trim() ? "text-white" : "text-white/30"}
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
