import { NextResponse } from "next/server";
import { generatePKCE, getZohoAuthUrl } from "@/lib/zoho-oauth";

/**
 * GET /api/auth/zoho/start
 *
 * Generates a PKCE verifier+challenge, stores the verifier in an httpOnly
 * cookie, then redirects the browser to Zoho's authorization page.
 * Using PKCE means no client_secret is needed for the token exchange.
 */
export async function GET() {
  const { verifier, challenge } = await generatePKCE();
  const url = getZohoAuthUrl(challenge);

  const response = NextResponse.redirect(url);

  // Store the verifier securely — the callback will read it
  response.cookies.set("pkce_verifier", verifier, {
    httpOnly: true,                                        // not readable by JS
    secure:   process.env.NODE_ENV === "production",
    maxAge:   600,                                         // 10 min — matches Zoho auth timeout
    path:     "/",
    sameSite: "lax",
  });

  return response;
}
