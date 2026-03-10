import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['knex', 'pg'],
};

export default nextConfig;
