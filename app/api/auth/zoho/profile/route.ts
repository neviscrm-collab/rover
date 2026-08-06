import { NextRequest, NextResponse } from "next/server";
import { getZohoCurrentUser } from "@/lib/zoho-oauth";
import { UserRole } from "@/lib/types/auth.types";

/**
 * GET /api/auth/zoho/profile
 *
 * Called client-side from the OAuth callback page.
 * Reads the Zoho access token from the Authorization header,
 * fetches the CRM user, and returns a ROVER-shaped user object.
 */
export async function GET(request: NextRequest) {
  const auth  = request.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  try {
    const zohoUser = await getZohoCurrentUser(token);

    const user = {
      id:                zohoUser.id,
      name:              zohoUser.full_name,
      email:             zohoUser.email,
      avatar:
        zohoUser.profile?.image_link ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(zohoUser.full_name)}&background=7C3AED&color=fff`,
      role:              UserRole.CUSTOMER,   // default; can be updated in profile
      profileCompletion: 60,
      createdAt:         new Date().toISOString(),
    };

    return NextResponse.json({ user });
  } catch (err) {
    console.error("[Zoho profile]", err);
    const msg = err instanceof Error ? err.message : "unknown_error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
