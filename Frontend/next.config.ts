import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'instagram.*.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3003',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '3003',
        pathname: '/**',
      }
    ],
  },
  output: "standalone",
};

export default nextConfig;
