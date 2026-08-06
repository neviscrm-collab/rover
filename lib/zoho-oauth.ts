/**
 * Zoho CRM OAuth helpers — India DC (accounts.zoho.in)
 */

const ZOHO_BASE = "https://accounts.zoho.in/oauth/v2";
const ZOHO_API  = "https://www.zohoapis.in/crm/v2";

// Scopes needed to read the current user's profile
export const ZOHO_SCOPE = "ZohoCRM.users.READ";

// ─── Build the authorization URL ─────────────────────────────────────────────

export function getZohoAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id:     process.env.ZOHO_CLIENT_ID!,
    scope:         ZOHO_SCOPE,
    redirect_uri:  process.env.ZOHO_REDIRECT_URI!,
    access_type:   "offline",   // get refresh token too
    prompt:        "consent",
  });
  return `${ZOHO_BASE}/auth?${params.toString()}`;
}

// ─── Exchange auth code for tokens ───────────────────────────────────────────

export interface ZohoTokens {
  access_token:  string;
  refresh_token: string;
  expires_in:    number;
  token_type:    string;
}

export async function exchangeCodeForTokens(code: string): Promise<ZohoTokens> {
  const res = await fetch(`${ZOHO_BASE}/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type:    "authorization_code",
      client_id:     process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      redirect_uri:  process.env.ZOHO_REDIRECT_URI!,
      code,
    }),
  });

  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Zoho token error: ${data.error}`);
  return data as ZohoTokens;
}

// ─── Refresh an expired access token ─────────────────────────────────────────

export async function refreshAccessToken(refreshToken: string): Promise<ZohoTokens> {
  const res = await fetch(`${ZOHO_BASE}/token`, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type:    "refresh_token",
      client_id:     process.env.ZOHO_CLIENT_ID!,
      client_secret: process.env.ZOHO_CLIENT_SECRET!,
      refresh_token: refreshToken,
    }),
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
    name:         string;
    image_link?:  string;
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
