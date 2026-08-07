"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { EnvelopeSimple, Lock, Eye, EyeSlash, GoogleLogo, ArrowLeft, WarningCircle } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/lib/types/auth.types";
import { ZOHO_SCOPE } from "@/lib/zoho-oauth";

// Built client-side from NEXT_PUBLIC vars — no server route needed
const ZOHO_AUTH_URL = (() => {
  const clientId    = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECT_URI;
  if (!clientId || !redirectUri) return "#";
  const p = new URLSearchParams({
    response_type: "token",
    client_id:     clientId,
    scope:         ZOHO_SCOPE,          // ZohoCRM.users.READ + modules.ALL + settings.ALL
    redirect_uri:  redirectUri,
  });
  return `https://accounts.zoho.in/oauth/v2/auth?${p.toString()}`;
})();

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { login, loginWithGoogle, loading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oauthError = searchParams.get("error");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const { role } = useAuthStore.getState();
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      const { role } = useAuthStore.getState();
      router.replace(role === UserRole.AGENCY ? "/studio" : "/app");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      {/* Back */}
      <Link href="/" className="absolute top-6 left-5 flex items-center gap-2 text-sm" style={{ color: "var(--text-dim)" }}>
        <ArrowLeft size={16} />
        Back to ROVER
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-bold text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
          >
            R
          </div>
          <span className="text-xl font-bold" style={{ color: "var(--text)" }}>ROVER</span>
        </div>

        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--text)" }}>
          Welcome back
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "var(--text-dim)" }}>
          Sign in to continue your journey
        </p>

        {/* OAuth error from Zoho callback */}
        {oauthError && (
          <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <WarningCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400">Zoho sign-in failed: {oauthError}</p>
          </div>
        )}

        {/* Sign in with Zoho CRM */}
        <motion.a
          whileTap={{ scale: 0.97 }}
          href={ZOHO_AUTH_URL}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl mb-3 font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #E84C3D, #C0392B)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(232,76,61,0.3)",
          }}
        >
          {/* Zoho logo mark */}
          <svg width="18" height="18" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" fill="white" fillOpacity="0.2"/>
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontSize="20" fontWeight="bold" fill="white">Z</text>
          </svg>
          Continue with Zoho CRM
        </motion.a>

        {/* Google */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleGoogle}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl mb-5 font-medium text-sm transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text)",
          }}
        >
          <GoogleLogo size={18} weight="bold" />
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          <span className="text-xs" style={{ color: "var(--text-faint)" }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
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

          {/* Password */}
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Lock size={18} style={{ color: "var(--text-faint)" }} />
            <input
              type={showPw ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--text)" }}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ color: "var(--text-faint)" }}>
              {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs" style={{ color: "#7C3AED" }}>
              Forgot password?
            </Link>
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
            className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-all"
            style={{
              background: loading ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
              boxShadow: loading ? "none" : "0 4px 24px rgba(124,58,237,0.35)",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-faint)" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#7C3AED" }} className="font-medium">
            Create one
          </Link>
        </p>

        {/* Demo quick-login buttons */}
        <div className="mt-6" style={{ border: "1px solid rgba(124,58,237,0.2)", borderRadius: 16, overflow: "hidden" }}>
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ background: "rgba(124,58,237,0.1)", borderBottom: "1px solid rgba(124,58,237,0.15)" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#7C3AED" }}>
              🧪 Demo accounts — tap to fill
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { label: "Traveler", emoji: "🎒", email: "arjun@example.com", password: "password123" },
              { label: "Agency", emoji: "🏢", email: "hello@wanderlust.com", password: "agency123" },
            ].map(({ label, emoji, email: demoEmail, password: demoPw }) => (
              <motion.button
                key={label}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => { setEmail(demoEmail); setPassword(demoPw); setError(""); }}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left transition-all"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{emoji}</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{label}</p>
                    <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{demoEmail}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.15)", color: "#7C3AED" }}>
                  Fill
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams() requires it in Next.js 14
export default function LoginPageWithSuspense() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
