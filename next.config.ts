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
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: getImageRemotePatterns(),
  },
  async redirects() {
    return [
      // 301 Redirects from query-param URLs to clean category paths (Task 07 / Part 2)
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "action-figures" }],
        destination: "/category/action-figures",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "building-bricks" }],
        destination: "/category/building-bricks",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "character-bricks" }],
        destination: "/category/character-bricks",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "flower-bricks" }],
        destination: "/category/flower-bricks",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "cards-stickers-9ai7" }],
        destination: "/category/cards-stickers",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "cards-stickers" }],
        destination: "/category/cards-stickers",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "accessories" }],
        destination: "/category/accessories",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "animal-bricks" }],
        destination: "/category/animal-bricks",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "vehicle-bricks" }],
        destination: "/category/vehicle",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "vehicle" }],
        destination: "/category/vehicle",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "premium-building-bricks-bh03" }],
        destination: "/category/premium-building-bricks",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "premium-building-bricks" }],
        destination: "/category/premium-building-bricks",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "plushies" }],
        destination: "/category/plushies",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "bundle-deals" }],
        destination: "/category/bundle-deals",
        permanent: true,
      },
      {
        source: "/shop",
        has: [{ type: "query", key: "deals", value: "true" }],
        destination: "/category/bundle-deals",
        permanent: true,
      },
      // Slug mismatch redirects for direct URLs
      {
        source: "/category/coding-kits",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/category/cards-stickers-9ai7",
        destination: "/category/cards-stickers",
        permanent: true,
      },
      {
        source: "/category/vehicle-bricks",
        destination: "/category/vehicle",
        permanent: true,
      },
      {
        source: "/category/premium-building-bricks-bh03",
        destination: "/category/premium-building-bricks",
        permanent: true,
      },
      // Broken blog post unicode ellipsis redirect (Part 5)
      {
        source: "/blog/:slug((?:5-coding-kits|five-coding-kits).*)",
        destination: "/blog",
        permanent: true,
      },
      // STEP 4 FIX 3: 301 redirect zombie /products to /shop
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      {
        source: "/products/:id",
        destination: "/product/:id",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // F-08: Security headers for all storefront routes
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
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
