import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "/docs",
  images: {
    unoptimized: true,
  },
  assetPrefix: "/acceptance/out",
}

export default nextConfig
