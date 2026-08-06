"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Suitcase,
  CalendarBlank,
  Ticket,
  FileText,
  PenNib,
  MapPin,
} from "@phosphor-icons/react";
import LiveTripCard from "@/components/shared/live-trip-card";
import EmptyState from "@/components/shared/empty-state";
import { MY_TRIPS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const TABS = [
  { id: "upcoming", label: "Upcoming", icon: CalendarBlank },
  { id: "past", label: "Past", icon: Suitcase },
  { id: "documents", label: "Docs", icon: FileText },
];

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingTrips = MY_TRIPS.filter((t) => t.status === "upcoming" || t.status === "ongoing");
  const pastTrips = MY_TRIPS.filter((t) => t.status === "completed" || t.status === "cancelled");
  const allDocs = MY_TRIPS.flatMap((t) => t.documents.map((d) => ({ ...d, trip: t })));

  return (
    <div className="page-mobile min-h-screen">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 lg:max-w-3xl lg:mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">My Trips</h1>
        <p className="text-sm text-white/50">
          {MY_TRIPS.length} trip{MY_TRIPS.length !== 1 ? "s" : ""} and counting
        </p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-6 lg:max-w-3xl lg:mx-auto">
        <div className="flex gap-1 glass rounded-xl p-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition-all"
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
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4 lg:max-w-3xl lg:mx-auto">
        {activeTab === "upcoming" && (
          <>
            {upcomingTrips.length === 0 ? (
              <EmptyState
                icon={CalendarBlank}
                title="No upcoming trips"
                description="Your next adventure is just a search away. Find something that excites you."
                actionLabel="Discover experiences"
                actionHref="/discover"
              />
            ) : (
              upcomingTrips.map((trip, idx) => (
                <LiveTripCard key={trip.id} trip={trip} index={idx} />
              ))
            )}
          </>
        )}

        {activeTab === "past" && (
          <>
            {pastTrips.length === 0 ? (
              <EmptyState
                icon={Suitcase}
                title="No past trips yet"
                description="Your travel history will live here. Time to start building it."
                actionLabel="Find your first trip"
                actionHref="/discover"
              />
            ) : (
              pastTrips.map((trip, idx) => (
                <LiveTripCard key={trip.id} trip={trip} index={idx} />
              ))
            )}
          </>
        )}

        {activeTab === "documents" && (
          <>
            {allDocs.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No documents yet"
                description="Your tickets, vouchers, and visa documents will appear here once you book."
                actionLabel="Start browsing"
                actionHref="/discover"
              />
            ) : (
              <div className="space-y-3">
                {allDocs.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center gap-4 rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(124,58,237,0.15)" }}
                    >
                      {doc.type === "ticket" ? (
                        <Ticket size={18} className="text-violet-400" />
                      ) : doc.type === "voucher" ? (
                        <FileText size={18} className="text-violet-400" />
                      ) : (
                        <FileText size={18} className="text-violet-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                      <p className="text-[11px] text-white/40 truncate">
                        {doc.trip.experience.title}
                      </p>
                    </div>
                    <button className="text-[11px] text-violet-400 glass px-3 py-1.5 rounded-full">
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Travel Journal teaser */}
      {activeTab === "past" && pastTrips.length > 0 && (
        <div className="px-4 mt-8 lg:max-w-3xl lg:mx-auto">
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(255,107,71,0.08))",
              border: "1px solid rgba(245,158,11,0.2)",
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <PenNib size={20} className="text-amber-400" />
              <p className="text-sm font-semibold text-white">Travel Journal</p>
            </div>
            <p className="text-xs text-white/55 leading-relaxed mb-4">
              Capture your memories, moods, and moments from every trip. Build your story, one entry at a time.
            </p>
            <button
              className="text-xs font-semibold text-amber-400 glass px-4 py-2 rounded-full"
              style={{ border: "1px solid rgba(245,158,11,0.2)" }}
            >
              Start writing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
