import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16+ only supports `position` or `false`; granular flags were removed.
  devIndicators: false,
  async rewrites() {
    // Default to localhost if BACKEND_URL is not provided
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `${backendUrl}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
