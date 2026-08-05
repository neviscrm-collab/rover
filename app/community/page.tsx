"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  ChatTeardrop,
  Share,
  Plus,
  Users,
  MapPin,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { useAppStore } from "@/store/app-store";
import { COMMUNITY_POSTS, TRAVELERS, DESTINATIONS } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

const DESTINATION_COMMUNITIES = [
  { dest: DESTINATIONS[0], members: 4782, posts: 239 },
  { dest: DESTINATIONS[1], members: 12341, posts: 891 },
  { dest: DESTINATIONS[3], members: 6231, posts: 412 },
  { dest: DESTINATIONS[6], members: 3891, posts: 201 },
];

const TRAVEL_BUDDIES = TRAVELERS.slice(1, 5);

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");
  const [posts, setPosts] = useState(COMMUNITY_POSTS);

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  return (
    <div className="page-mobile min-h-screen">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 lg:max-w-3xl lg:mx-auto">
        <h1 className="text-2xl font-bold text-white mb-4">Community</h1>

        {/* Tabs */}
        <div className="flex gap-1 glass rounded-xl p-1">
          {["feed", "destinations", "buddies"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background:
                  activeTab === tab ? "rgba(124,58,237,0.3)" : "transparent",
                color: activeTab === tab ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Feed ──────────────────────────────────────────────────── */}
      {activeTab === "feed" && (
        <div className="px-4 space-y-4 lg:max-w-3xl lg:mx-auto">
          {/* Post CTA */}
          <div
            className="flex items-center gap-3 rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={TRAVELERS[0].avatar}
                alt="You"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/35">Share a travel moment...</p>
            </div>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
              }}
            >
              <Plus size={16} weight="bold" className="text-white" />
            </button>
          </div>

          {/* Posts */}
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Author */}
              <div className="flex items-center gap-3 p-4 pb-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {post.author.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40">
                    <span>{formatRelativeTime(post.timestamp)}</span>
                    {post.destination && (
                      <>
                        <span>·</span>
                        <MapPin size={10} />
                        <span>{post.destination.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="px-4 pb-3 text-sm text-white/80 leading-relaxed">
                {post.content}
              </p>

              {/* Images */}
              {post.images.length > 0 && (
                <div
                  className={`grid gap-1 ${
                    post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"
                  }`}
                >
                  {post.images.map((img, i) => (
                    <div key={i} className="relative aspect-video">
                      <Image
                        src={img}
                        alt="Post"
                        fill
                        className="object-cover"
                        sizes="600px"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 px-4 pt-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] text-violet-400/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center px-4 py-3 mt-1 gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => toggleLike(post.id)}
                  className="flex items-center gap-1.5 text-[12px] transition-all"
                  style={{ color: post.isLiked ? "#F87171" : "rgba(255,255,255,0.45)" }}
                >
                  <Heart
                    size={16}
                    weight={post.isLiked ? "fill" : "regular"}
                  />
                  {post.likes.toLocaleString()}
                </button>
                <button className="flex items-center gap-1.5 text-[12px] text-white/45">
                  <ChatTeardrop size={16} />
                  {post.comments}
                </button>
                <button className="ml-auto text-white/30 hover:text-white/60 transition-colors">
                  <Share size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Destination Communities ───────────────────────────────── */}
      {activeTab === "destinations" && (
        <div className="px-4 space-y-3 lg:max-w-3xl lg:mx-auto">
          <p className="text-sm text-white/50 mb-2">
            Join communities by destination
          </p>
          {DESTINATION_COMMUNITIES.map((comm, idx) => (
            <motion.div
              key={comm.dest.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="flex items-center gap-4 rounded-2xl p-4 cursor-pointer hover:bg-white/5 transition-colors"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={comm.dest.image}
                  alt={comm.dest.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {comm.dest.name}
                </p>
                <p className="text-[11px] text-white/50">
                  {comm.dest.country}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-white/35">
                  <span>
                    <Users size={10} className="inline mr-1" />
                    {comm.members.toLocaleString()} members
                  </span>
                  <span>{comm.posts} posts</span>
                </div>
              </div>
              <button
                className="text-[11px] font-semibold px-4 py-2 rounded-full transition-all"
                style={{
                  background: "rgba(124,58,237,0.2)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#A78BFA",
                }}
              >
                Join
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Travel Buddies ───────────────────────────────────────── */}
      {activeTab === "buddies" && (
        <div className="px-4 lg:max-w-3xl lg:mx-auto">
          <p className="text-sm text-white/50 mb-4">
            People who travel like you
          </p>

          <div className="space-y-3">
            {TRAVEL_BUDDIES.map((traveler, idx) => (
              <motion.div
                key={traveler.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-4 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={traveler.avatar}
                    alt={traveler.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {traveler.name}
                  </p>
                  <p className="text-[11px] text-white/50">
                    {traveler.hometown} · {traveler.tripsCount} trips
                  </p>
                  <p className="text-[10px] text-violet-400/70 mt-0.5">
                    {[2, 3, 1, 2][idx % 4]} mutual trips
                  </p>
                </div>
                <button
                  className="text-[11px] font-semibold px-4 py-2 rounded-full"
                  style={{
                    background: "rgba(124,58,237,0.2)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    color: "#A78BFA",
                  }}
                >
                  Connect
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
