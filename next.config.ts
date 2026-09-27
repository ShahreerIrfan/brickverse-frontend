import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.kawaiisubete.com",
      },
      {
        protocol: "https",
        hostname: "kawaiisubete.com",
      },
      {
        protocol: "https",
        hostname: "www.kawaiisubete.com",
      },
      {
        protocol: "https",
        hostname: "brickbackend.eezzymart.tech",
      },
      {
        protocol: "https",
        hostname: "brickverse.eezzymart.tech",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;



