/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  allowedDevOrigins: ['0.0.0.0'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Ubah limit menjadi 10MB (atau sesuaikan, contoh: '20mb')
    },
  },
};

export default nextConfig;
