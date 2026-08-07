/**
 * Zoho CRM OAuth helpers — India DC (accounts.zoho.in)
 * Uses implicit flow (response_type=token) for Client-based Applications.
 * The access_token is returned directly in the redirect URI fragment.
 */

const ZOHO_BASE = "https://accounts.zoho.in/oauth/v2";
const ZOHO_API  = "https://www.zohoapis.in/crm/v2";

// Full scope required for ROVER:
//   ZohoCRM.users.READ       — fetch logged-in user profile
//   ZohoCRM.modules.ALL      — CRUD on CRM module records (leads, contacts, bookings, experiences)
//   ZohoCRM.settings.ALL     — create custom modules, fields, and workflow rules
export const ZOHO_SCOPE = "ZohoCRM.users.READ ZohoCRM.modules.ALL ZohoCRM.settings.ALL";

/** Token lifetime Zoho grants (seconds). Store locally for auto-logout. */
export const ZOHO_TOKEN_TTL_SECONDS = 3600; // 1 hour

// ─── Build the authorization URL (implicit flow) ──────────────────────────────

export function getZohoAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: "token",                           // implicit — token in fragment
    client_id:     process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID!,
    scope:         ZOHO_SCOPE,
    redirect_uri:  process.env.NEXT_PUBLIC_ZOHO_REDIRECT_URI!,
  });
  return `${ZOHO_BASE}/auth?${params.toString()}`;
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
