"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, CaretRight, User, IdentificationCard, Phone, CalendarBlank } from "@phosphor-icons/react";
import { useAppStore } from "@/store/app-store";
import { formatPrice, formatShortDate } from "@/lib/utils";

const STEPS = [
  { id: "traveler", label: "Traveler" },
  { id: "emergency", label: "Emergency" },
  { id: "preferences", label: "Preferences" },
  { id: "payment", label: "Payment" },
];

export default function BookingSheet() {
  const { isBookingOpen, setBookingOpen, selectedExperience } = useAppStore();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    dietary: "",
    roomPreference: "no-preference",
    selectedDate: selectedExperience?.dates[0]?.id ?? "",
  });

  const update = (key: string, value: string) =>
    setFormData((p) => ({ ...p, [key]: value }));

  if (!selectedExperience) return null;

  return (
    <AnimatePresence>
      {isBookingOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: "blur(8px)" }}
            onClick={() => setBookingOpen(false)}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] flex flex-col rounded-t-3xl lg:max-w-lg lg:mx-auto"
            style={{
              background: "rgba(8,8,20,0.98)",
              backdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderBottom: "none",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 pb-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <h2 className="text-base font-bold text-white">Book Your Spot</h2>
                <p className="text-[11px] text-white/50 mt-0.5">
                  {selectedExperience.title}
                </p>
              </div>
              <button
                onClick={() => setBookingOpen(false)}
                className="w-8 h-8 rounded-full glass flex items-center justify-center"
              >
                <X size={16} className="text-white/60" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex items-center px-5 py-4 gap-1">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1 flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all"
                    style={{
                      background:
                        i < step
                          ? "#10B981"
                          : i === step
                          ? "linear-gradient(135deg, #7C3AED, #06B6D4)"
                          : "rgba(255,255,255,0.08)",
                      color: i <= step ? "white" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {i < step ? <Check size={12} weight="bold" /> : i + 1}
                  </div>
                  <span
                    className="text-[10px] hidden sm:block transition-colors"
                    style={{ color: i === step ? "white" : "rgba(255,255,255,0.3)" }}
                  >
                    {s.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div
                      className="flex-1 h-px mx-1"
                      style={{
                        background: i < step ? "#10B981" : "rgba(255,255,255,0.08)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
              {step === 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Traveler Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={formData.firstName}
                      onChange={(e) => update("firstName", e.target.value)}
                      placeholder="First name"
                      className="col-span-1 glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                    <input
                      value={formData.lastName}
                      onChange={(e) => update("lastName", e.target.value)}
                      placeholder="Last name"
                      className="col-span-1 glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                  <input
                    value={formData.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="Email address"
                    type="email"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                  />
                  <input
                    value={formData.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 Phone number"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                  />
                  <input
                    value={formData.passportNumber}
                    onChange={(e) => update("passportNumber", e.target.value)}
                    placeholder="Passport number"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                  />

                  {/* Date selection */}
                  <div>
                    <p className="text-xs text-white/50 mb-2">Select Date</p>
                    <div className="space-y-2">
                      {selectedExperience.dates.map((date) => (
                        <label
                          key={date.id}
                          className="flex items-center justify-between glass rounded-xl px-4 py-3 cursor-pointer"
                          style={{
                            border:
                              formData.selectedDate === date.id
                                ? "1px solid rgba(124,58,237,0.5)"
                                : "1px solid transparent",
                          }}
                        >
                          <div>
                            <p className="text-sm text-white">
                              {formatShortDate(date.startDate)} → {formatShortDate(date.endDate)}
                            </p>
                            <p className="text-[11px] text-white/40">
                              {date.seatsLeft} seats left
                            </p>
                          </div>
                          <input
                            type="radio"
                            name="date"
                            value={date.id}
                            checked={formData.selectedDate === date.id}
                            onChange={() => update("selectedDate", date.id)}
                            className="accent-violet-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Emergency Contact</h3>
                  <input
                    value={formData.emergencyName}
                    onChange={(e) => update("emergencyName", e.target.value)}
                    placeholder="Contact name"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                  />
                  <input
                    value={formData.emergencyPhone}
                    onChange={(e) => update("emergencyPhone", e.target.value)}
                    placeholder="Contact phone"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                  />
                  <input
                    value={formData.emergencyRelation}
                    onChange={(e) => update("emergencyRelation", e.target.value)}
                    placeholder="Relation (e.g. Parent, Friend)"
                    className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                  />
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-white">Preferences</h3>
                  <div>
                    <p className="text-xs text-white/50 mb-2">Dietary requirements</p>
                    <input
                      value={formData.dietary}
                      onChange={(e) => update("dietary", e.target.value)}
                      placeholder="e.g. Vegetarian, no nuts, halal..."
                      className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-2">Room preference</p>
                    {["single", "shared", "no-preference"].map((pref) => (
                      <label
                        key={pref}
                        className="flex items-center justify-between glass rounded-xl px-4 py-3 cursor-pointer mb-2"
                        style={{
                          border:
                            formData.roomPreference === pref
                              ? "1px solid rgba(124,58,237,0.5)"
                              : "1px solid transparent",
                        }}
                      >
                        <span className="text-sm text-white capitalize">
                          {pref === "no-preference" ? "No preference" : pref}
                        </span>
                        <input
                          type="radio"
                          name="room"
                          value={pref}
                          checked={formData.roomPreference === pref}
                          onChange={() => update("roomPreference", pref)}
                          className="accent-violet-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Confirm & Pay</h3>

                  {/* Summary */}
                  <div className="glass rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Experience</span>
                      <span className="text-white font-medium">1 traveler</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Base price</span>
                      <span className="text-white">{formatPrice(selectedExperience.price, selectedExperience.currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Platform fee</span>
                      <span className="text-white">{formatPrice(Math.round(selectedExperience.price * 0.02), selectedExperience.currency)}</span>
                    </div>
                    <div
                      className="flex justify-between font-bold pt-3"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <span className="text-white">Total</span>
                      <span className="text-white text-lg">
                        {formatPrice(Math.round(selectedExperience.price * 1.02), selectedExperience.currency)}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/40 text-center leading-relaxed">
                    By completing this booking, you agree to ROVER's Terms of Service
                    and the agency's cancellation policy.
                  </p>
                </div>
              )}
            </div>

            {/* Footer CTA */}
            <div
              className="px-5 py-4"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                  style={{
                    background: "linear-gradient(135deg, #7C3AED, #06B6D4)",
                  }}
                >
                  Continue
                  <CaretRight size={16} weight="bold" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setBookingOpen(false);
                    alert("Booking confirmed! 🎉 Check your email for details.");
                  }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                  style={{
                    background: "linear-gradient(135deg, #10B981, #059669)",
                  }}
                >
                  <Check size={18} weight="bold" />
                  Confirm Booking
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
