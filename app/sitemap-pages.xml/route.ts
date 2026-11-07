import { STATIC_SITEMAP_PAGES, buildUrlsetXml } from "@/lib/sitemapData";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const entries = STATIC_SITEMAP_PAGES.map((url) => ({
    loc: url,
    lastmod: "2026-11-05",
  }));

  const xml = buildUrlsetXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

