import {
  SITE_URL,
  fetchSitemapBlogPosts,
  formatW3CDate,
  buildUrlsetXml,
} from "@/lib/sitemapData";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const posts = await fetchSitemapBlogPosts();

  const entries = posts.map((p) => ({
    loc: `${SITE_URL}/blog/${p.slug}`,
    lastmod: formatW3CDate(p.updatedAt || p.publishedAt),
  }));

  const xml = buildUrlsetXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

