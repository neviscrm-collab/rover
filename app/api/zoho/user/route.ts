/**
 * /api/zoho/user
 *
 * Server-side proxy for the Zoho CRM CurrentUser endpoint.
 * Calling Zoho from the browser is blocked by CORS unless the domain is
 * registered as a "JavaScript Domain" in Zoho API Console.
 * Proxying through this route avoids CORS entirely (server → Zoho = no CORS).
 *
 * Called by: app/(auth)/auth/zoho/callback/page.tsx
 */

import { NextRequest, NextResponse } from "next/server";

const ZOHO_CRM_USER_URL = "https://www.zohoapis.in/crm/v2/users?type=CurrentUser";

export async function GET(req: NextRequest) {
  const token = req.headers.get("x-zoho-token");

  if (!token) {
    return NextResponse.json({ error: "Missing x-zoho-token header" }, { status: 400 });
  }

  try {
    const zohoRes = await fetch(ZOHO_CRM_USER_URL, {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await zohoRes.json();

    if (!zohoRes.ok) {
      return NextResponse.json(
        { error: `Zoho API error: ${zohoRes.status}`, detail: data },
        { status: zohoRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/zoho/user]", err);
    return NextResponse.json({ error: "Failed to reach Zoho CRM" }, { status: 502 });
  }
}
