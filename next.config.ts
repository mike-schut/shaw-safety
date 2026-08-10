import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shop.shawsafety.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
