import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  basePath: "/arena-insight",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
