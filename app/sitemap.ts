import type { MetadataRoute } from "next";
import { CATEGORY_SEO_MAP, SUBCATEGORY_SEO_MAP } from "@/lib/seoData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kawaiisubete.com";

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 11 Clean Category Pages (Part 2)
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORY_SEO_MAP).map((slug) => ({
    url: `${baseUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.85,
  }));

  // 10 Clean Subcategory Pages (Part 3)
  const subcategoryRoutes: MetadataRoute.Sitemap = Object.values(SUBCATEGORY_SEO_MAP).map((sub) => ({
    url: `${baseUrl}/category/${sub.parentSlug}/${sub.subSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...categoryRoutes, ...subcategoryRoutes];
}
