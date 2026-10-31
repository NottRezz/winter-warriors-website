import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plain static files, so the site can live on any host.
  output: "export",
  // Set by the GitHub Pages workflow when the site lives at /repo-name/.
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
