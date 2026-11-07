import {
  SITE_URL,
  fetchSitemapProducts,
  buildUrlsetXml,
} from "@/lib/sitemapData";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const products = await fetchSitemapProducts();
  const chunk = products.slice(0, 300);

  // Per Section 6: omit lastmod for products until API exposes a real updated_at
  const entries = chunk.map((p) => ({
    loc: `${SITE_URL}/product/${p.slug}`,
  }));

  const xml = buildUrlsetXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

