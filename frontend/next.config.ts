import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
