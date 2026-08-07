/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Zoho Catalyst Slate — serverless via @zcatalyst/nextjs-plugin ────────
  // Catalyst Slate does NOT serve raw static files; it uses @opennextjs/aws
  // (OpenNext) under the hood to deploy Next.js as serverless functions.
  // That adapter runs `next build` and then wraps the output — it needs a
  // standard build (no `output: 'export'`).
  //
  // Do NOT add `output: 'export'` or `trailingSlash: true` here — both
  // prevent the standalone build that zcatalyst-nextjs expects.

  // ── ESLint ────────────────────────────────────────────────────────────────
  // Catalyst Slate's build environment uses ESLint 8 APIs that conflict with
  // eslint-config-next@15's internal calls ('useEslintrc' / 'extensions' were
  // removed in ESLint 9).  Skip linting during `next build` to unblock the
  // Slate CI pipeline — lint locally with `npm run lint` instead.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com",   pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com",      pathname: "/**" },
    ],
  },
};

export default nextConfig;
