import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reliable online/offline detection for the AI 해석 요청 (next/offline's
  // useOffline hook), better than relying on navigator.onLine alone.
  experimental: {
    useOffline: true,
  },
  async headers() {
    return [
      {
        // Service worker script must never be served from the browser HTTP
        // cache, or clients could get stuck on a stale offline-cache version.
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
