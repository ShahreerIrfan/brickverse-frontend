import { CATEGORY_SEO_MAP } from "@/lib/seoData";
import { getApiBaseUrl } from "@/lib/api";

export const SITE_URL = "https://kawaiisubete.com";

// Hard-coded known safe static pages
export const STATIC_SITEMAP_PAGES = [
  `${SITE_URL}`,
  `${SITE_URL}/shop`,
  `${SITE_URL}/contact`,
  `${SITE_URL}/blog`,
];

// Clean ASCII slug validator
export const isCleanSlug = (s?: string | null): boolean =>
  typeof s === "string" && /^[a-z0-9-]+$/.test(s);

// Format ISO date string into W3C format with Asia/Dhaka (+06:00) offset
export function formatW3CDate(iso?: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    const off = 6 * 60; // Dhaka is UTC+6 year-round
    const local = new Date(d.getTime() + off * 60000);
    return local.toISOString().replace("Z", "+06:00");
  } catch {
    return null;
  }
}

export type SitemapProduct = {
  id: string | number;
  slug: string;
  is_active?: boolean;
  categoryPath?: Array<{ id: string; label: string; slug: string }>;
};

export type SitemapBlogPost = {
  id: number;
  slug: string;
  status: string;
  updatedAt?: string;
  publishedAt?: string;
};

// Common fetch headers to avoid Cloudflare/WAF block
const FETCH_HEADERS = {
  "User-Agent": "KawaiiSubete-SitemapGenerator/1.0 (+https://kawaiisubete.com)",
  Accept: "application/json",
};

export async function fetchSitemapProducts(): Promise<SitemapProduct[]> {
  try {
    // Prefer remote production API or local base URL
    const apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api.kawaiisubete.com/api";
    const res = await fetch(`${apiUrl.replace(/\/+$/, "")}/products/?pageSize=600`, {
      headers: FETCH_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[Sitemap] Products API returned status ${res.status}`);
      return [];
    }
    const data = await res.json();
    const rawList: SitemapProduct[] = Array.isArray(data)
      ? data
      : Array.isArray(data.results)
      ? data.results
      : [];

    return rawList.filter(
      (p) => p.is_active !== false && isCleanSlug(p.slug)
    );
  } catch (err) {
    console.error("[Sitemap] Failed to fetch products:", err);
    return [];
  }
}

export async function fetchSitemapBlogPosts(): Promise<SitemapBlogPost[]> {
  try {
    const apiUrl =
      process.env.INTERNAL_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://api.kawaiisubete.com/api";
    const res = await fetch(`${apiUrl.replace(/\/+$/, "")}/blog/posts/`, {
      headers: FETCH_HEADERS,
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.warn(`[Sitemap] Blog API returned status ${res.status}`);
      return [];
    }
    const data = await res.json();
    const rawList: SitemapBlogPost[] = Array.isArray(data.results) ? data.results : [];

    return rawList.filter(
      (p) =>
        p.status === "published" &&
        isCleanSlug(p.slug) &&
        !p.slug.includes("coding-kits")
    );
  } catch (err) {
    console.error("[Sitemap] Failed to fetch blog posts:", err);
    return [];
  }
}

export function getDerivedSubcategories(
  products: SitemapProduct[]
): Array<{ parent: string; child: string; fullPath: string }> {
  const subMap = new Map<string, { parent: string; child: string; fullPath: string }>();

  for (const p of products) {
    const path = p.categoryPath ?? [];
    if (path.length >= 2) {
      const rawParent = path[0]?.slug;
      const rawChild = path[1]?.slug;
      if (!rawParent || !rawChild) continue;

      // Clean child slug (trim any trailing hyphens, normalize slugs per Step 7 Part D)
      let cleanChild = rawChild.replace(/-+$/, "");
      if (rawParent === "character-bricks" && cleanChild === "anime") {
        cleanChild = "anime-character-figures";
      }
      if (rawParent === "accessories" && cleanChild === "bags-bags") {
        cleanChild = "bags";
      }
      const cleanKey = `${rawParent}/${cleanChild}`;

      if (!subMap.has(cleanKey) && isCleanSlug(rawParent) && isCleanSlug(cleanChild)) {
        subMap.set(cleanKey, {
          parent: rawParent,
          child: cleanChild,
          fullPath: `/category/${rawParent}/${cleanChild}`,
        });
      }
    }
  }

  return Array.from(subMap.values()).sort((a, b) => a.fullPath.localeCompare(b.fullPath));
}

export function buildUrlsetXml(
  entries: Array<{ loc: string; lastmod?: string | null }>
): string {
  const urlsXml = entries
    .map((e) => {
      const cleanLoc = e.loc
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      if (e.lastmod) {
        return `  <url>\n    <loc>${cleanLoc}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n  </url>`;
      }
      return `  <url>\n    <loc>${cleanLoc}</loc>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>`;
}
