import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    URL: process.env.URL,
  },
};

export default nextConfig;
