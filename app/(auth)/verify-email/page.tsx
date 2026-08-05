"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

const CODE_LENGTH = 6;

export default function VerifyEmailPage() {
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const { user } = useAuthStore();
  const router = useRouter();

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length < CODE_LENGTH) return;
    setLoading(true);
    setError("");
    try {
      await AuthService.verifyEmail({ email: user?.email ?? "", code: fullCode });
      router.replace("/complete-profile");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <span className="text-3xl">📬</span>
        </div>

        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Verify your email</h1>
        <p className="text-sm mb-2" style={{ color: "var(--text-dim)" }}>
          We sent a 6-digit code to
        </p>
        <p className="text-sm font-semibold mb-8 text-white">{user?.email ?? "your email"}</p>

        {/* OTP inputs */}
        <div className="flex items-center justify-center gap-2.5 mb-6">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 rounded-xl text-center text-lg font-bold outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `2px solid ${digit ? "rgba(124,58,237,0.7)" : "rgba(255,255,255,0.1)"}`,
                color: "var(--text)",
              }}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-2 mb-4 p-3 rounded-xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <WarningCircle size={16} className="text-red-400" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleVerify}
          disabled={loading || code.join("").length < CODE_LENGTH}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white mb-4"
          style={{
            background: code.join("").length === CODE_LENGTH ? "linear-gradient(135deg, #7C3AED, #6D28D9)" : "rgba(124,58,237,0.3)",
            boxShadow: code.join("").length === CODE_LENGTH ? "0 4px 24px rgba(124,58,237,0.35)" : "none",
          }}
        >
          {loading ? "Verifying…" : "Verify email"}
        </motion.button>

        <p className="text-xs" style={{ color: "var(--text-faint)" }}>
          Didn't receive the code?{" "}
          <button className="font-medium" style={{ color: "#7C3AED" }}>Resend</button>
        </p>

        <p className="text-xs mt-3" style={{ color: "var(--text-faint)" }}>
          Demo: use code <span className="text-violet-400 font-mono">123456</span>
        </p>
      </motion.div>
    </div>
  );
}
