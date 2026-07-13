import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
    ],
    deviceSizes: [375, 640, 828, 1080, 1200, 1920],
    imageSizes: [48, 96, 128, 256, 384],
    minimumCacheTTL: 604800,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
