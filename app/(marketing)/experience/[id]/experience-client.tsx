"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowLeft,
  Heart,
  Share,
  Star,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  CaretDown,
  CaretUp,
  ShieldCheck,
} from "@phosphor-icons/react";
import TravelerStack from "@/components/shared/traveler-stack";
import StoryTimeline from "@/components/shared/story-timeline";
import { useAppStore } from "@/store/app-store";
import { EXPERIENCES } from "@/lib/mock-data";
import {
  formatPrice,
  formatShortDate,
  getSeatsLabel,
  CATEGORY_COLORS,
  DIFFICULTY_COLORS,
  cn,
} from "@/lib/utils";

// Required for static export — pre-renders a page for every experience ID
export function generateStaticParams() {
  return EXPERIENCES.map((exp) => ({ id: exp.id }));
}

export default function ExperiencePageClient({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const experience = EXPERIENCES.find((e) => e.id === id);

  const { toggleWishlist, isWishlisted, setSelectedExperience, setBookingOpen } =
    useAppStore();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<
    "itinerary" | "included" | "reviews"
  >("itinerary");
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.08]);

  if (!experience) {
    return (
      <div className="page-mobile flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-white/50 mb-4">Experience not found</p>
          <Link
            href="/discover"
            className="text-violet-400 hover:text-violet-300"
          >
            Browse all experiences
          </Link>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(experience.id);

  const handleBook = () => {
    setSelectedExperience(experience);
    setBookingOpen(true);
  };

  return (
    <div className="page-mobile min-h-screen">
      {/* ── Cinematic Hero ─────────────────────────────────────────── */}
      <div ref={heroRef} className="relative h-[70vh] overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0"
        >
          <img
            src={experience.heroImage}
            alt={experience.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 img-overlay-bottom" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,10,0.5), transparent 70%)",
          }}
        />

        {/* Nav buttons */}
        <div className="absolute top-12 left-4 right-4 flex items-center justify-between">
          <Link href="/discover">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass-dark flex items-center justify-center"
            >
              <ArrowLeft size={18} className="text-white" />
            </motion.div>
          </Link>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass-dark flex items-center justify-center"
            >
              <Share size={16} className="text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleWishlist(experience.id)}
              className="w-10 h-10 rounded-full glass-dark flex items-center justify-center"
            >
              <Heart
                size={18}
                weight={wishlisted ? "fill" : "regular"}
                className={wishlisted ? "text-red-400" : "text-white"}
              />
            </motion.button>
          </div>
        </div>

        {/* Hero bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-3">
            {experience.badge && (
              <span className="text-[10px] font-semibold uppercase tracking-widest glass-dark text-amber-400 px-3 py-1 rounded-full">
                {experience.badge}
              </span>
            )}
            <span
              className={cn(
                "text-[10px] font-medium px-2.5 py-1 rounded-full border",
                CATEGORY_COLORS[experience.category] ??
                  "bg-white/10 text-white/60 border-white/10"
              )}
            >
              {experience.category}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white leading-tight mb-2">
            {experience.title}
          </h1>
          <p className="text-sm text-white/70 mb-4">{experience.tagline}</p>

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full">
              <MapPin size={12} weight="fill" className="text-white/60" />
              <span className="text-xs text-white/80">
                {experience.destination.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full">
              <Clock size={12} className="text-white/60" />
              <span className="text-xs text-white/80">{experience.duration}</span>
            </div>
            <div className="flex items-center gap-1.5 glass-dark px-3 py-1.5 rounded-full">
              <span
                className={cn(
                  "text-xs font-medium",
                  DIFFICULTY_COLORS[experience.difficulty]
                )}
              >
                {experience.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className="px-4 lg:max-w-3xl lg:mx-auto space-y-8 mt-6 pb-32">

        {/* Rating + Travelers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={16} weight="fill" className="text-amber-400" />
            <span className="text-base font-bold text-white">
              {experience.rating.toFixed(1)}
            </span>
            <span className="text-sm text-white/50">
              ({experience.reviewCount} reviews)
            </span>
          </div>
          <TravelerStack
            travelers={experience.travelers}
            max={4}
            totalCount={experience.seatsTotal - experience.seatsLeft}
            size="md"
          />
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-white/70 leading-relaxed">
            {experience.description}
          </p>
        </div>

        {/* Highlights */}
        <div>
          <h2 className="text-base font-bold text-white mb-3">Highlights</h2>
          <div className="space-y-2">
            {experience.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(124,58,237,0.2)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                </div>
                <span className="text-sm text-white/75">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        {experience.gallery.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-white mb-3">Gallery</h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-2">
              <img
                src={experience.gallery[selectedGalleryIdx]}
                alt="Gallery"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {experience.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedGalleryIdx(idx)}
                  className="flex-shrink-0 relative w-16 h-16 rounded-xl overflow-hidden"
                  style={{
                    border:
                      selectedGalleryIdx === idx
                        ? "2px solid rgba(124,58,237,0.8)"
                        : "2px solid transparent",
                  }}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs: Itinerary / Included / Reviews */}
        <div>
          <div className="flex gap-1 glass rounded-xl p-1 mb-6">
            {(["itinerary", "included", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
                style={{
                  background:
                    activeTab === tab
                      ? "rgba(124,58,237,0.3)"
                      : "transparent",
                  color:
                    activeTab === tab
                      ? "white"
                      : "rgba(255,255,255,0.4)",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Itinerary */}
          {activeTab === "itinerary" && (
            <StoryTimeline itinerary={experience.itinerary} />
          )}

          {/* Included / Excluded */}
          {activeTab === "included" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-400" />
                  What&apos;s included
                </h3>
                <div className="space-y-2.5">
                  {experience.included.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle
                        size={14}
                        weight="fill"
                        className="text-emerald-400 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-white/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <XCircle size={16} className="text-red-400" />
                  Not included
                </h3>
                <div className="space-y-2.5">
                  {experience.excluded.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <XCircle
                        size={14}
                        weight="fill"
                        className="text-red-400/70 flex-shrink-0 mt-0.5"
                      />
                      <span className="text-sm text-white/50">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {experience.reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={review.author.avatar}
                        alt={review.author.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-white">
                          {review.author.name}
                        </p>
                        {review.verified && (
                          <ShieldCheck
                            size={12}
                            weight="fill"
                            className="text-emerald-400"
                          />
                        )}
                      </div>
                      <p className="text-[10px] text-white/40">
                        {review.tripDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} weight="fill" className="text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        {review.rating}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {review.text}
                  </p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded-xl overflow-hidden"
                        >
                          <img
                            src={img}
                            alt="Review"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-base font-bold text-white mb-3">
            Frequently asked
          </h2>
          <div className="space-y-2">
            {experience.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-medium text-white/85">
                    {faq.question}
                  </span>
                  {openFaq === idx ? (
                    <CaretUp size={14} className="text-white/40 flex-shrink-0" />
                  ) : (
                    <CaretDown
                      size={14}
                      className="text-white/40 flex-shrink-0"
                    />
                  )}
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-white/55 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Agency */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
            Hosted by
          </p>
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <img
                src={experience.agency.logo}
                alt={experience.agency.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-white">
                  {experience.agency.name}
                </p>
                {experience.agency.verified && (
                  <ShieldCheck
                    size={14}
                    weight="fill"
                    className="text-blue-400"
                  />
                )}
              </div>
              <p className="text-[11px] text-white/50">
                {experience.agency.tripsCompleted} trips ·{" "}
                {experience.agency.rating} ★ · {experience.agency.location}
              </p>
            </div>
          </div>
          <p className="text-xs text-white/50 leading-relaxed mt-3">
            {experience.agency.bio}
          </p>
        </div>
      </div>

      {/* ── Sticky Booking Bar ─────────────────────────────────────── */}
      <div
        className="fixed bottom-20 left-0 right-0 z-40 px-4 lg:bottom-0 lg:border-t lg:px-0"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <div className="lg:max-w-3xl lg:mx-auto">
        <div
          className="glass-dark rounded-2xl px-5 py-4 flex items-center justify-between lg:rounded-none lg:border-0 lg:bg-transparent lg:backdrop-blur-none lg:py-3"
          style={{ boxShadow: "0 -10px 40px rgba(0,0,0,0.5)" }}
        >
          <div>
            <span className="text-xl font-bold text-white">
              {formatPrice(experience.price, experience.currency)}
            </span>
            <span className="text-xs text-white/50 ml-1">/ person</span>
            <p
              className={cn(
                "text-xs mt-0.5",
                experience.seatsLeft <= 3
                  ? "text-amber-400"
                  : "text-white/40"
              )}
            >
              {getSeatsLabel(experience.seatsLeft)}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleBook}
            className="px-8 py-3 rounded-xl font-semibold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
            }}
          >
            Book Now
          </motion.button>
        </div>
        </div>
      </div>
    </div>
  );
}
