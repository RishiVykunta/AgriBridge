import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin Turbopack root to this app (fixes multi-lockfile warning, can speed up dev)
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  // Faster dev: tree-shake Prisma so first load is lighter
  experimental: {
    optimizePackageImports: ["@prisma/client"],
  },
};

export default nextConfig;
