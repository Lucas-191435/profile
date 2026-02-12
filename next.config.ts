import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    mode: process.env.MODE,
    baseUrl: process.env.BASE_URL,
  },
};

export default nextConfig;
