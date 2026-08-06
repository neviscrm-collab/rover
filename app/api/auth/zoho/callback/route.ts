import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getZohoCurrentUser } from "@/lib/zoho-oauth";

/**
 * GET /api/auth/zoho/callback
 *
 * Zoho redirects here after the user authorizes ROVER.
 * Steps:
 *  1. Exchange the auth code for access + refresh tokens
 *  2. Fetch the current user from Zoho CRM API
 *  3. Store a short-lived session cookie with user data
 *  4. Redirect to the client-side handoff page which writes to localStorage
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3013";

  if (error || !code) {
    const msg = error ?? "no_code";
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(msg)}`);
  }

  try {
    // 1. Exchange code → tokens
    const tokens = await exchangeCodeForTokens(code);

    // 2. Get user profile from Zoho CRM
    const zohoUser = await getZohoCurrentUser(tokens.access_token);

    // 3. Build the ROVER user object (mirrors AuthUser type)
    const roverUser = {
      id:                zohoUser.id,
      name:              zohoUser.full_name,
      email:             zohoUser.email,
      avatar:            zohoUser.profile?.image_link ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(zohoUser.full_name)}&background=7C3AED&color=fff`,
      role:              "CUSTOMER",   // default — can be changed in profile
      profileCompletion: 60,
      createdAt:         new Date().toISOString(),
    };

    // 4. Pack session into a short-lived cookie (10 min — just long enough for the handoff)
    //    Not httpOnly so the client-side handoff page can read and store to localStorage.
    const sessionPayload = JSON.stringify({
      user:         roverUser,
      token:        tokens.access_token,
      refreshToken: tokens.refresh_token ?? "",
    });

    const response = NextResponse.redirect(`${appUrl}/auth/zoho/handoff`);
    response.cookies.set("rover_zoho_session", sessionPayload, {
      httpOnly: false,        // must be readable by client JS
      secure:   process.env.NODE_ENV === "production",
      maxAge:   600,          // 10 minutes
      path:     "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("[Zoho OAuth] callback error:", err);
    const msg = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.redirect(`${appUrl}/login?error=${encodeURIComponent(msg)}`);
  }
}
