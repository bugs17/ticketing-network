/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  allowedDevOrigins: ['192.168.1.4'],
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Ubah limit menjadi 10MB (atau sesuaikan, contoh: '20mb')
    },
  },
};

export default nextConfig;
