import type { NextConfig } from "next";
import path from "node:path";

const lanDevOrigins = Array.from({ length: 100 }, (_, index) => `http://192.168.1.${index + 1}:3000`);

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "../.."),
  turbopack: {
    root: path.join(__dirname, "../.."),
  },
  allowedDevOrigins: [
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    ...lanDevOrigins,
  ],
};

export default nextConfig;
