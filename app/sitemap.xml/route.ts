import { SITE_URL } from "@/lib/sitemapData";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const files = [
    "sitemap-pages.xml",
    "sitemap-categories.xml",
    "sitemap-products-1.xml",
    "sitemap-products-2.xml",
    "sitemap-blog.xml",
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${files
  .map(
    (f) => `  <sitemap>
    <loc>${SITE_URL}/${f}</loc>
    <lastmod>2026-11-05</lastmod>
  </sitemap>`
  )
  .join("\n")}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

