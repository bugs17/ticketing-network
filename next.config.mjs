/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  allowedDevOrigins: ['0.0.0.0'],
};

export default nextConfig;
