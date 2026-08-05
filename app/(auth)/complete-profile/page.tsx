"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types/auth.types";
import { AuthService } from "@/services/auth.service";
import { MapPin, Phone, Globe, Buildings, IdentificationCard } from "@phosphor-icons/react";

export default function CompleteProfilePage() {
  const { user, setUser, role } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Customer fields
  const [nationality, setNationality] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [travelInterests, setTravelInterests] = useState<string[]>([]);

  // Agency fields
  const [agencyName, setAgencyName] = useState(user?.name ?? "");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [description, setDescription] = useState("");

  const INTERESTS = ["Trekking", "Backpacking", "Road Trips", "Surfing", "Camping", "Photography", "Wellness", "Festivals"];

  const toggleInterest = (i: string) => {
    setTravelInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const updated = await AuthService.completeProfile({
        userId: user.id,
        ...(role === UserRole.CUSTOMER ? { nationality, emergencyContact, travelInterests } : { agencyName, city, country, gstNumber, description }),
      });
      setUser(updated);
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    } catch {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "var(--text)",
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {["Account", "Verify", "Profile"].map((s, i) => (
            <div key={s} className="flex-1">
              <div
                className="h-1 rounded-full"
                style={{ background: i <= 2 ? "#7C3AED" : "rgba(255,255,255,0.1)" }}
              />
              <p className="text-[10px] mt-1 text-center" style={{ color: i <= 2 ? "#7C3AED" : "var(--text-faint)" }}>{s}</p>
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
          Complete your profile
        </h1>
        <p className="text-sm mb-7" style={{ color: "var(--text-dim)" }}>
          {role === UserRole.AGENCY ? "Tell travelers about your agency" : "Help us personalise your experience"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {role === UserRole.CUSTOMER ? (
            <>
              {/* Nationality */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={inputStyle}>
                <Globe size={18} style={{ color: "var(--text-faint)" }} />
                <input
                  type="text"
                  placeholder="Nationality (e.g. Indian)"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text)" }}
                />
              </div>
              {/* Emergency contact */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={inputStyle}>
                <Phone size={18} style={{ color: "var(--text-faint)" }} />
                <input
                  type="text"
                  placeholder="Emergency contact (name + phone)"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text)" }}
                />
              </div>
              {/* Travel interests */}
              <div>
                <p className="text-xs mb-2.5" style={{ color: "var(--text-dim)" }}>Travel interests (pick a few)</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleInterest(i)}
                      className="text-xs px-3 py-1.5 rounded-full border transition-all"
                      style={{
                        background: travelInterests.includes(i) ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.05)",
                        borderColor: travelInterests.includes(i) ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)",
                        color: travelInterests.includes(i) ? "white" : "var(--text-dim)",
                      }}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {[
                { icon: Buildings, placeholder: "Agency name", value: agencyName, set: setAgencyName },
                { icon: MapPin, placeholder: "City", value: city, set: setCity },
                { icon: Globe, placeholder: "Country", value: country, set: setCountry },
                { icon: IdentificationCard, placeholder: "GST Number (optional)", value: gstNumber, set: setGstNumber },
              ].map(({ icon: Icon, placeholder, value, set }) => (
                <div key={placeholder} className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={inputStyle}>
                  <Icon size={18} style={{ color: "var(--text-faint)" }} />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "var(--text)" }}
                  />
                </div>
              ))}
              <textarea
                placeholder="Tell travelers what makes your agency special…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
                style={{ ...inputStyle }}
              />
            </>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white mt-2"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
              boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
            }}
          >
            {loading ? "Saving…" : role === UserRole.AGENCY ? "Enter Studio →" : "Start exploring →"}
          </motion.button>

          <button
            type="button"
            onClick={() => router.replace(role === UserRole.AGENCY ? "/studio" : "/app")}
            className="w-full py-2 text-sm"
            style={{ color: "var(--text-faint)" }}
          >
            Skip for now
          </button>
        </form>
      </motion.div>
    </div>
  );
}
