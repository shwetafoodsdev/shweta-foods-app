import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Default image optimization writes under .next; Lambda’s /var/task is read-only (EROFS).
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
