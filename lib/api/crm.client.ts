/**
 * CRM Client — Zoho CRM Integration Layer
 *
 * This file is the single point of contact with the backend CRM.
 * Currently uses mock data. Replace `mockFetch` with real Zoho API
 * calls here when ready — all service files remain unchanged.
 */

// ─── Config ───────────────────────────────────────────────────────────────────

const CRM_BASE_URL = process.env.NEXT_PUBLIC_ZOHO_CRM_URL ?? "https://www.zohoapis.in/crm/v7";
const IS_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" || true; // always mock for now

// ─── Request Helpers ──────────────────────────────────────────────────────────

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
  token?: string;
}

interface CRMResponse<T> {
  data: T;
  status: number;
  ok: boolean;
}

/**
 * Makes an authenticated request to Zoho CRM.
 * Swap `mockFetch` for `realFetch` when integrating.
 */
export async function crmRequest<T>(
  path: string,
  options: RequestOptions = {}
): Promise<CRMResponse<T>> {
  if (IS_MOCK) {
    return mockFetch<T>(path, options);
  }
  return realFetch<T>(path, options);
}

// ─── Real Fetch (Zoho CRM) ────────────────────────────────────────────────────

async function realFetch<T>(
  path: string,
  options: RequestOptions
): Promise<CRMResponse<T>> {
  const res = await fetch(`${CRM_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Zoho-oauthtoken ${options.token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  const data = await res.json();
  return { data: data as T, status: res.status, ok: res.ok };
}

// ─── Mock Fetch ───────────────────────────────────────────────────────────────

async function mockFetch<T>(
  path: string,
  _options: RequestOptions
): Promise<CRMResponse<T>> {
  // Simulate network latency
  await delay(200);

  // Route to appropriate mock data
  const mockData = await resolveMockPath(path);
  return { data: mockData as T, status: 200, ok: true };
}

async function resolveMockPath(path: string): Promise<unknown> {
  if (path.startsWith("/auth/users")) {
    return (await import("@/mock/users.json")).default;
  }
  if (path.startsWith("/agencies")) {
    return (await import("@/mock/agencies.json")).default;
  }
  if (path.startsWith("/experiences")) {
    return (await import("@/mock/experiences.json")).default;
  }
  if (path.startsWith("/bookings")) {
    return (await import("@/mock/bookings.json")).default;
  }
  if (path.startsWith("/payments")) {
    return (await import("@/mock/payments.json")).default;
  }
  if (path.startsWith("/messages")) {
    return (await import("@/mock/messages.json")).default;
  }
  if (path.startsWith("/documents")) {
    return (await import("@/mock/documents.json")).default;
  }
  return null;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
