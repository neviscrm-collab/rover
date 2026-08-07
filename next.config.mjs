/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",          // Static export → tiny artifact, no server runtime
  images: {
    unoptimized: true,       // Required for static export (no image server)
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "plus.unsplash.com",   pathname: "/**" },
      { protocol: "https", hostname: "ui-avatars.com",      pathname: "/**" },
    ],
  },
};

export default nextConfig;
