import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  env: {
    mode: process.env.MODE,
    baseUrl: process.env.BASE_URL,
  },
  images: {
    domains: ["raw.githubusercontent.com"], // Adicione o domínio da URL da imagem
  },
};

export default nextConfig;
