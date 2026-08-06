"use client";

/**
 * /auth/zoho/handoff
 *
 * Client-side bridge: reads the `rover_zoho_session` cookie set by the server
 * callback, stores the user + token in localStorage (matching AuthService keys),
 * then hydrates Zustand and redirects to /app.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/`;
}

export default function ZohoHandoffPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    try {
      const raw = getCookie("rover_zoho_session");
      if (!raw) throw new Error("Session cookie missing. Please try signing in again.");

      const { user, token, refreshToken } = JSON.parse(raw);
      if (!user || !token) throw new Error("Invalid session data.");

      // Write to localStorage — same keys AuthService uses
      localStorage.setItem("rover_auth_token",   token);
      localStorage.setItem("rover_auth_user",    JSON.stringify(user));

      // Also write Zustand persist key so the store hydrates correctly
      const zustandState = {
        state: {
          user,
          role:            user.role,
          isAuthenticated: true,
          token,
          refreshToken,
        },
        version: 0,
      };
      localStorage.setItem("rover_auth", JSON.stringify(zustandState));

      // Hydrate the live Zustand store
      setUser(user);

      // Clean up the short-lived cookie
      deleteCookie("rover_zoho_session");

      // Redirect based on role
      router.replace(user.role === "AGENCY" ? "/studio" : "/app");
    } catch (err) {
      console.error("[Zoho Handoff]", err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }, [router, setUser]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--bg)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
          ⚠️
        </div>
        <h1 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Sign-in failed</h1>
        <p className="text-sm text-center mb-6" style={{ color: "var(--text-faint)" }}>{errorMsg}</p>
        <button
          onClick={() => router.replace("/login")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg)" }}>
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg"
        style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}
      >
        R
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      <p className="text-sm" style={{ color: "var(--text-faint)" }}>Completing sign-in…</p>
    </div>
  );
}
