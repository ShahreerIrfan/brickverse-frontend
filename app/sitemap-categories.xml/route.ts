import {
  SITE_URL,
  fetchSitemapProducts,
  getDerivedSubcategories,
  buildUrlsetXml,
} from "@/lib/sitemapData";
import { CATEGORY_SEO_MAP } from "@/lib/seoData";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const products = await fetchSitemapProducts();
  const subcategories = getDerivedSubcategories(products);

  // 10 Canonical top-level categories (excluding empty bundle-deals per Step 7 Part E)
  const categoryEntries = Object.keys(CATEGORY_SEO_MAP)
    .filter((slug) => slug !== "bundle-deals")
    .map((slug) => ({
      loc: `${SITE_URL}/category/${slug}`,
      lastmod: "2026-11-09",
    }));

  // 44 Derived subcategories
  const subcategoryEntries = subcategories.map((sub) => ({
    loc: `${SITE_URL}${sub.fullPath}`,
    lastmod: "2026-11-09",
  }));

  const allEntries = [...categoryEntries, ...subcategoryEntries];
  const xml = buildUrlsetXml(allEntries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}

