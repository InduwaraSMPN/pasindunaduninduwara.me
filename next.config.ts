import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Any experimental features can be added here
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sgp.cloud.appwrite.io',
      },
    ],
  },
};

export default nextConfig;
