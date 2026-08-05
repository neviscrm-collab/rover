"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EnvelopeSimple, ArrowLeft, CheckCircle } from "@phosphor-icons/react";
import { AuthService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await AuthService.forgotPassword({ email });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <Link href="/login" className="absolute top-6 left-5 flex items-center gap-2 text-sm" style={{ color: "var(--text-dim)" }}>
        <ArrowLeft size={16} /> Back to login
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        {!sent ? (
          <>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 mx-auto"
              style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}
            >
              <EnvelopeSimple size={26} weight="fill" className="text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-center mb-2" style={{ color: "var(--text)" }}>
              Forgot password?
            </h1>
            <p className="text-sm text-center mb-8" style={{ color: "var(--text-dim)" }}>
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <EnvelopeSimple size={18} style={{ color: "var(--text-faint)" }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text)" }}
                />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white"
                style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)", boxShadow: "0 4px 24px rgba(124,58,237,0.35)" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(34,197,94,0.15)" }}>
              <CheckCircle size={32} weight="fill" className="text-green-400" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Check your inbox</h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-dim)" }}>
              We sent a reset link to <strong className="text-white">{email}</strong>
            </p>
            <Link href="/login" className="text-sm font-medium" style={{ color: "#7C3AED" }}>
              Back to sign in
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
