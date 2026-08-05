"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PaperPlaneTilt, MagnifyingGlass } from "@phosphor-icons/react";

const CONVERSATIONS = [
  { id: "c1", name: "Arjun Sharma", last: "When will the itinerary be confirmed?", time: "2m ago", unread: 2, avatar: "A", color: "#7C3AED" },
  { id: "c2", name: "Priya Nair", last: "Is vegetarian food available?", time: "1h ago", unread: 0, avatar: "P", color: "#06B6D4" },
  { id: "c3", name: "Rahul Dev", last: "Loved the trip! Thanks 🙏", time: "2d ago", unread: 0, avatar: "R", color: "#10B981" },
];

const MOCK_MESSAGES: Record<string, { from: "me" | "them"; text: string; time: string }[]> = {
  c1: [
    { from: "them", text: "Hi! I've booked the Ladakh trip.", time: "10:00" },
    { from: "me", text: "Welcome Arjun! Excited to have you on board 🎒", time: "10:05" },
    { from: "them", text: "When will the itinerary be confirmed?", time: "10:10" },
  ],
  c2: [
    { from: "them", text: "Hello, is vegetarian food available on the Kerala trip?", time: "9:00" },
    { from: "me", text: "Yes, absolutely! All meals can be made vegetarian.", time: "9:30" },
  ],
  c3: [
    { from: "them", text: "Just got back from Rajasthan. Loved the trip! Thanks 🙏", time: "2d" },
    { from: "me", text: "So glad you enjoyed it! Leave us a review 😊", time: "2d" },
  ],
};

export default function ChatPage() {
  const [active, setActive] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const send = () => {
    if (!input.trim() || !active) return;
    setMessages((prev) => ({
      ...prev,
      [active]: [...(prev[active] ?? []), { from: "me", text: input.trim(), time: "now" }],
    }));
    setInput("");
  };

  return (
    <div className="h-screen flex" style={{ background: "var(--bg)" }}>
      {/* Sidebar list */}
      <div
        className={`${active ? "hidden lg:flex" : "flex"} flex-col w-full lg:w-72 border-r flex-shrink-0`}
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="px-4 pt-8 pb-3">
          <h1 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>Messages</h1>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <MagnifyingGlass size={14} style={{ color: "var(--text-faint)" }} />
            <input placeholder="Search…" className="flex-1 bg-transparent text-sm outline-none" style={{ color: "var(--text)" }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-20 lg:pb-2">
          {CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="w-full flex items-center gap-3 p-3 rounded-xl mb-1 text-left transition-all"
              style={{
                background: active === c.id ? "rgba(124,58,237,0.12)" : "transparent",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}
              >
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{c.name}</p>
                  <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-faint)" }}>{c.time}</span>
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-faint)" }}>{c.last}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0" style={{ background: "#7C3AED" }}>
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat pane */}
      {active ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          {(() => {
            const conv = CONVERSATIONS.find((c) => c.id === active)!;
            return (
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <button
                  onClick={() => setActive(null)}
                  className="lg:hidden text-sm mr-1"
                  style={{ color: "var(--text-dim)" }}
                >
                  ←
                </button>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${conv.color}, ${conv.color}99)` }}
                >
                  {conv.avatar}
                </div>
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{conv.name}</p>
              </div>
            );
          })()}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {(messages[active] ?? []).map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[75%] px-3.5 py-2 rounded-2xl text-sm"
                  style={{
                    background: m.from === "me" ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(255,255,255,0.07)",
                    color: "var(--text)",
                    borderRadius: m.from === "me" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  }}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-4 py-3 border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 bg-transparent text-sm outline-none py-2"
              style={{ color: "var(--text)" }}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={send}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: input.trim() ? "#7C3AED" : "rgba(255,255,255,0.06)" }}
            >
              <PaperPlaneTilt size={16} weight="fill" className="text-white" />
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center flex-col gap-3" style={{ color: "var(--text-faint)" }}>
          <span className="text-5xl">💬</span>
          <p className="text-sm">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
