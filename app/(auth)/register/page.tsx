"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, EnvelopeSimple, Lock, Eye, EyeSlash,
  GoogleLogo, ArrowLeft, ArrowRight, WarningCircle,
  Backpack, Buildings,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types/auth.types";

type Step = "role" | "form";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { register, loginWithGoogle, loading } = useAuthStore();
  const router = useRouter();

  const handleSelectRole = (r: UserRole) => {
    setRole(r);
    setStep("form");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setError("");
    try {
      await register(name, email, password, role);
      router.replace("/verify-email");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    }
  };

  const handleGoogle = async () => {
    if (!role) return;
    setError("");
    try {
      await loginWithGoogle(role);
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-up failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <Link href="/" className="absolute top-6 left-5 flex items-center gap-2 text-sm" style={{ color: "var(--text-dim)" }}>
        <ArrowLeft size={16} /> Back to ROVER
      </Link>

      <AnimatePresence mode="wait">
        {/* ── Step 1: Role Selector ──────────────────────────────────────── */}
        {step === "role" && (
          <motion.div
            key="role"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-10">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold text-white"
                style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
              >
                R
              </div>
              <span className="text-xl font-bold" style={{ color: "var(--text)" }}>ROVER</span>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--text)" }}>
              Who are you?
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-dim)" }}>
              Choose your role to get the experience made for you
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traveler Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectRole(UserRole.CUSTOMER)}
                className="relative overflow-hidden rounded-3xl p-6 text-left group"
                style={{
                  background: "linear-gradient(145deg, rgba(124,58,237,0.15), rgba(6,182,212,0.05))",
                  border: "1px solid rgba(124,58,237,0.25)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))" }}
                >
                  <Backpack size={28} weight="fill" className="text-violet-400" />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
                  Continue as Traveler
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-dim)" }}>
                  Discover experiences, book adventures, and connect with a community of explorers.
                </p>
                <div className="flex items-center gap-1.5 text-violet-400 text-xs font-semibold">
                  Get started <ArrowRight size={14} />
                </div>
                {/* Decorative gradient blob */}
                <div
                  className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
                />
              </motion.button>

              {/* Agency Card */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectRole(UserRole.AGENCY)}
                className="relative overflow-hidden rounded-3xl p-6 text-left group"
                style={{
                  background: "linear-gradient(145deg, rgba(6,182,212,0.12), rgba(59,130,246,0.05))",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(59,130,246,0.2))" }}
                >
                  <Buildings size={28} weight="fill" className="text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>
                  Continue as Agency
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-dim)" }}>
                  List experiences, manage bookings, and grow your travel business with ROVER Studio.
                </p>
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold">
                  Open Studio <ArrowRight size={14} />
                </div>
                <div
                  className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
                  style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }}
                />
              </motion.button>
            </div>

            <p className="text-center text-sm mt-8" style={{ color: "var(--text-faint)" }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color: "#7C3AED" }} className="font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}

        {/* ── Step 2: Registration Form ──────────────────────────────────── */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="w-full max-w-sm"
          >
            <button
              onClick={() => { setStep("role"); setError(""); }}
              className="flex items-center gap-2 text-sm mb-8"
              style={{ color: "var(--text-dim)" }}
            >
              <ArrowLeft size={16} /> Choose a different role
            </button>

            {/* Role badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: role === UserRole.AGENCY ? "rgba(6,182,212,0.15)" : "rgba(124,58,237,0.15)",
                color: role === UserRole.AGENCY ? "#06B6D4" : "#7C3AED",
                border: `1px solid ${role === UserRole.AGENCY ? "rgba(6,182,212,0.3)" : "rgba(124,58,237,0.3)"}`,
              }}
            >
              {role === UserRole.AGENCY ? <Buildings size={13} weight="fill" /> : <Backpack size={13} weight="fill" />}
              {role === UserRole.AGENCY ? "Travel Agency" : "Traveler"}
            </div>

            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>
              Create your account
            </h1>
            <p className="text-sm mb-7" style={{ color: "var(--text-dim)" }}>
              It's free to get started
            </p>

            {/* Google */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl mb-5 font-medium text-sm"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text)",
              }}
            >
              <GoogleLogo size={18} weight="bold" /> Continue with Google
            </motion.button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              <span className="text-xs" style={{ color: "var(--text-faint)" }}>or</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              {[
                { icon: User, type: "text", placeholder: role === UserRole.AGENCY ? "Agency name" : "Full name", value: name, onChange: setName },
                { icon: EnvelopeSimple, type: "email", placeholder: "Email address", value: email, onChange: setEmail },
              ].map(({ icon: Icon, type, placeholder, value, onChange }) => (
                <div
                  key={placeholder}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <Icon size={18} style={{ color: "var(--text-faint)" }} />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "var(--text)" }}
                  />
                </div>
              ))}

              {/* Password */}
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Lock size={18} style={{ color: "var(--text-faint)" }} />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text)" }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ color: "var(--text-faint)" }}>
                  {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <WarningCircle size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
                style={{
                  background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  boxShadow: loading ? "none" : "0 4px 24px rgba(124,58,237,0.35)",
                }}
              >
                {loading ? "Creating account…" : "Create account"}
              </motion.button>

              <p className="text-xs text-center" style={{ color: "var(--text-faint)" }}>
                By signing up you agree to our{" "}
                <span style={{ color: "#7C3AED" }}>Terms</span> &{" "}
                <span style={{ color: "#7C3AED" }}>Privacy Policy</span>
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
