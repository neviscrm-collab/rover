/**
 * Zoho CRM OAuth helpers — India DC (accounts.zoho.in)
 *
 * Supports two auth modes:
 *   • PKCE  (no client_secret needed) — used when ZOHO_CLIENT_SECRET is absent
 *   • Client Secret — traditional server-side flow when secret is present
 */

const ZOHO_BASE = "https://accounts.zoho.in/oauth/v2";
const ZOHO_API  = "https://www.zohoapis.in/crm/v2";

export const ZOHO_SCOPE = "ZohoCRM.users.READ";

// ─── PKCE helpers ────────────────────────────────────────────────────────────

function base64urlEncode(buf: Uint8Array): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/** Generate a PKCE verifier + SHA-256 challenge pair (server-side only). */
export async function generatePKCE(): Promise<{ verifier: string; challenge: string }> {
  const { webcrypto } = await import("node:crypto");

  // 32 random bytes → base64url verifier
  const raw = new Uint8Array(32);
  webcrypto.getRandomValues(raw);
  const verifier = base64urlEncode(raw);

  // SHA-256(verifier) → base64url challenge
  const encoded = new TextEncoder().encode(verifier);
  const digest  = await webcrypto.subtle.digest("SHA-256", encoded);
  const challenge = base64urlEncode(new Uint8Array(digest));

  return { verifier, challenge };
}

// ─── Build the authorization URL ─────────────────────────────────────────────

export function getZohoAuthUrl(codeChallenge?: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id:     process.env.ZOHO_CLIENT_ID!,
    scope:         ZOHO_SCOPE,
    redirect_uri:  process.env.ZOHO_REDIRECT_URI!,
    access_type:   "offline",
    prompt:        "consent",
  });

  if (codeChallenge) {
    params.set("code_challenge",        codeChallenge);
    params.set("code_challenge_method", "S256");
  }

  return `${ZOHO_BASE}/auth?${params.toString()}`;
}

// ─── Exchange auth code for tokens ───────────────────────────────────────────

export interface ZohoTokens {
  access_token:  string;
  refresh_token: string;
  expires_in:    number;
  token_type:    string;
}

/**
 * Exchange an auth code for tokens.
 * Pass `codeVerifier` for PKCE (no client_secret needed).
 * If neither verifier nor secret is available the request will likely fail.
 */
export async function exchangeCodeForTokens(
  code: string,
  codeVerifier?: string,
): Promise<ZohoTokens> {
  const body = new URLSearchParams({
    grant_type:   "authorization_code",
    client_id:    process.env.ZOHO_CLIENT_ID!,
    redirect_uri: process.env.ZOHO_REDIRECT_URI!,
    code,
  });

  if (codeVerifier) {
    // PKCE flow — no client_secret needed
    body.set("code_verifier", codeVerifier);
  } else if (process.env.ZOHO_CLIENT_SECRET) {
    // Traditional server-side flow
    body.set("client_secret", process.env.ZOHO_CLIENT_SECRET);
  }

  const res = await fetch(`${ZOHO_BASE}/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Zoho token error: ${data.error}`);
  return data as ZohoTokens;
}

// ─── Refresh an expired access token ─────────────────────────────────────────

export async function refreshAccessToken(refreshToken: string): Promise<ZohoTokens> {
  const body = new URLSearchParams({
    grant_type:    "refresh_token",
    client_id:     process.env.ZOHO_CLIENT_ID!,
    refresh_token: refreshToken,
  });

  if (process.env.ZOHO_CLIENT_SECRET) {
    body.set("client_secret", process.env.ZOHO_CLIENT_SECRET);
  }

  const res = await fetch(`${ZOHO_BASE}/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Zoho refresh error: ${data.error}`);
  return data as ZohoTokens;
}

// ─── Fetch the logged-in user from Zoho CRM ──────────────────────────────────

export interface ZohoCRMUser {
  id:        string;
  full_name: string;
  email:     string;
  phone?:    string;
  profile?: {
    name:        string;
    image_link?: string;
  };
  role?: { name: string };
}

export async function getZohoCurrentUser(accessToken: string): Promise<ZohoCRMUser> {
  const res = await fetch(`${ZOHO_API}/users?type=CurrentUser`, {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });

  if (!res.ok) throw new Error(`Failed to fetch Zoho user: ${res.status}`);
  const data = await res.json();
  const user = data.users?.[0];
  if (!user) throw new Error("No user returned from Zoho CRM API");
  return user as ZohoCRMUser;
}
