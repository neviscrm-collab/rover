/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Zoho Catalyst Slate — static export ──────────────────────────────────
  // Catalyst Slate serves static files from a CDN.
  // `output: 'export'` emits a fully-static `out/` directory; no Node server needed.
  output: "export",

  // Trailing slash ensures /experience/exp-bali → /experience/exp-bali/index.html
  // which Catalyst Slate (and most static CDNs) serve correctly.
  trailingSlash: true,

  // Next.js image optimisation requires a server; disable it for static export.
  // We use plain <img> tags or the `unoptimized` flag throughout.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com",   pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com",      pathname: "/**" },
    ],
  },
};

export default nextConfig;
