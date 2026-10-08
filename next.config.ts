import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  cacheLife: {
    // Store data: serve from cache, refresh in the background every 3 hours,
    // and never serve anything older than a week.
    catalog: {
      stale: 300,
      revalidate: 60 * 60 * 3,
      expire: 60 * 60 * 24 * 7,
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
