import { NextResponse } from "next/server";
import { getZohoAuthUrl } from "@/lib/zoho-oauth";

/**
 * GET /api/auth/zoho/start
 *
 * Redirects the browser to Zoho's authorization page.
 * Uses implicit flow (response_type=token) — no PKCE or client_secret needed.
 */
export async function GET() {
  return NextResponse.redirect(getZohoAuthUrl());
}
