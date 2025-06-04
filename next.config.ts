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
        hostname: 'ufnvbcgenocuydzzoxja.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
