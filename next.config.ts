import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        pathname: '/**',
      },
      {
          protocol: 'https',
          hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'logos-world.net',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      // Настройки если нужны
    },
  },
  // Добавить для отключения статической генерации проблемных страниц
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
