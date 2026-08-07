"use client";

/**
 * /auth/zoho/callback
 *
 * Handles the Zoho implicit-flow redirect.
 * Zoho sends: /auth/zoho/callback#access_token=xxx&expires_in=3600
 *
 * This page (fully client-side, works with static export):
 *  1. Reads access_token from URL fragment
 *  2. Fetches the Zoho CRM user directly from the browser
 *     (requires rover-vusuhtjq.onslate.in in Zoho API Console → JavaScript Domain)
 *  3. Stores token + user + expiry in localStorage / Zustand key
 *  4. Auto-logout after token expiry
 *  5. Redirects to /app (or /studio for agencies)
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";

export default function ZohoCallbackPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [status, setStatus] = useState("Completing sign-in…");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        // ── 1. Read token from URL fragment ──────────────────────────────────
        const frag  = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const query = new URLSearchParams(window.location.search);

        const oauthError = frag.get("error") || query.get("error");
        if (oauthError) throw new Error(oauthError);

        const accessToken = frag.get("access_token") || query.get("access_token");
        const expiresIn   = parseInt(frag.get("expires_in") || query.get("expires_in") || "3600", 10);

        if (!accessToken) throw new Error("No access token received from Zoho");

        // ── 2. Fetch Zoho CRM user via server-side proxy (avoids CORS) ──────────
        // Direct browser → zohoapis.in calls are blocked unless the domain is
        // registered as a JavaScript Domain in Zoho API Console.
        // /api/zoho/user proxies the request server-side — no CORS issues.
        setStatus("Fetching your profile…");
        const res = await fetch(`/api/zoho/user`, {
          headers: { "x-zoho-token": accessToken },
        });
        if (!res.ok) throw new Error(`Zoho API error: ${res.status}`);
        const data = await res.json();
        const zohoUser = data.users?.[0];
        if (!zohoUser) throw new Error("No user returned from Zoho CRM");

        // ── 3. Build ROVER user ───────────────────────────────────────────────
        const user = {
          id:                zohoUser.id,
          name:              zohoUser.full_name,
          email:             zohoUser.email,
          avatar:
            zohoUser.profile?.image_link ??
            `https://ui-avatars.com/api/?name=${encodeURIComponent(zohoUser.full_name)}&background=7C3AED&color=fff`,
          // Zoho CRM is a business tool — all OAuth logins are agency/admin users
          role:              "AGENCY",
          profileCompletion: 60,
          createdAt:         new Date().toISOString(),
        };

        const tokenExpiry = Date.now() + expiresIn * 1000;

        // ── 4. Persist to localStorage ────────────────────────────────────────
        localStorage.setItem("rover_auth_token", accessToken);
        localStorage.setItem("rover_auth_user",  JSON.stringify(user));
        localStorage.setItem("rover_auth", JSON.stringify({
          state: { user, role: user.role, isAuthenticated: true, token: accessToken, refreshToken: null, tokenExpiry },
          version: 0,
        }));

        // Hydrate live Zustand store
        setUser(user as Parameters<typeof setUser>[0]);

        // ── 5. Auto-logout after token lifetime ───────────────────────────────
        const msLeft = tokenExpiry - Date.now();
        if (msLeft > 0) {
          setTimeout(() => {
            localStorage.removeItem("rover_auth_token");
            localStorage.removeItem("rover_auth_user");
            localStorage.removeItem("rover_auth");
            window.location.href = "/login?error=session_expired";
          }, msLeft);
        }

        setStatus("Redirecting…");
        router.replace(user.role === "AGENCY" ? "/studio" : "/app");
      } catch (err) {
        console.error("[Zoho Callback]", err);
        setError(err instanceof Error ? err.message : "Sign-in failed");
      }
    })();
  }, [router, setUser]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: "var(--bg)" }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
          ⚠️
        </div>
        <h1 className="text-lg font-bold mb-2" style={{ color: "var(--text)" }}>Sign-in failed</h1>
        <p className="text-sm text-center mb-6" style={{ color: "var(--text-faint)" }}>{error}</p>
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
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg"
        style={{ background: "linear-gradient(135deg, #7C3AED, #06B6D4)" }}>
        R
      </div>
      <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      <p className="text-sm" style={{ color: "var(--text-faint)" }}>{status}</p>
    </div>
  );
}
