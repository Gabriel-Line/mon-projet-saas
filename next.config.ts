import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Autorise tous les domaines en HTTPS
      },
    ],
  },
};

export default nextConfig;