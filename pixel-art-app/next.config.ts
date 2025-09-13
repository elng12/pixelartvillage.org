import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 确保静态资源路径正确
  assetPrefix: ''
};

export default nextConfig;
