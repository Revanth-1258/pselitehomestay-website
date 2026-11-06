import type { NextConfig } from "next";

// Files in /public keep their names when replaced, so they can't be cached as "immutable".
// 30 days in the browser, then revalidate in the background, is a safe middle ground.
const MEDIA_CACHE = "public, max-age=2592000, stale-while-revalidate=86400";

const nextConfig: NextConfig = {
  async headers() {
    return [
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: MEDIA_CACHE }] },
      { source: "/videos/:path*", headers: [{ key: "Cache-Control", value: MEDIA_CACHE }] },
    ];
  },
};

export default nextConfig;
