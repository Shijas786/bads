import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding', '@coinbase/cdp-sdk', '@solana/kit', '@base-org/account'],
  webpack: (config) => {
    config.externals.push({
      'pino-pretty': 'commonjs pino-pretty',
      'lokijs': 'commonjs lokijs',
      'encoding': 'commonjs encoding',
    });
    return config;
  },
};

export default nextConfig;
