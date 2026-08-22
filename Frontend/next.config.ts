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
    // The backend only listens on a Docker bridge network (e.g. 172.x.x.x),
    // so Next.js's SSRF protection blocks image optimization unless allowed.
    dangerouslyAllowLocalIP: true,
  },
  output: "standalone",
};

export default nextConfig;
