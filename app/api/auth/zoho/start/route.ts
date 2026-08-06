import { NextResponse } from "next/server";
import { getZohoAuthUrl } from "@/lib/zoho-oauth";

/**
 * GET /api/auth/zoho/start
 *
 * Redirects the browser to Zoho's OAuth authorization page.
 * Using a server route keeps the client_id out of client-side JS bundles.
 */
export async function GET() {
  const url = getZohoAuthUrl();
  return NextResponse.redirect(url);
}
