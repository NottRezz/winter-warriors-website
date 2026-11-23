import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hosted on Vercel: the pages are still built ahead of time, and /api runs the live
  // scores and the scorekeeper login.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
