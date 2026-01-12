import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
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
    unoptimized: process.env.NODE_ENV === 'development',
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