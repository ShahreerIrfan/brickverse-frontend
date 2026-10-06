import type { NextConfig } from "next";

// Dynamically generate allowed image host patterns from NEXT_PUBLIC_IMAGE_DOMAINS
function getImageRemotePatterns() {
  const rawDomains =
    process.env.NEXT_PUBLIC_IMAGE_DOMAINS ||
    "api.kawaiisubete.com,kawaiisubete.com,www.kawaiisubete.com,127.0.0.1,localhost";

  const domainList = rawDomains
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  return domainList.map((hostname) => ({
    protocol:
      hostname.includes("localhost") || hostname.includes("127.0.0.1")
        ? ("http" as const)
        : ("https" as const),
    hostname,
  }));
}

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: getImageRemotePatterns(),
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
