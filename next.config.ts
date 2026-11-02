import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The prototype is served under /demo so it can be mounted on the landing site
  // (chilla-azure.vercel.app/demo) with a single rewrite. See README.md.
  basePath: "/demo",
  async redirects() {
    return [{ source: "/", destination: "/demo", basePath: false, permanent: false }];
  },
  cacheComponents: true,
  partialPrefetching: true,
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
