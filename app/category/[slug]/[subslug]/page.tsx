import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import {
  getCategorySeo,
  getSubcategorySeo,
  isValidCategorySlug,
  SUBCATEGORY_SEO_MAP,
  SITE_URL,
} from "@/lib/seoData";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subslug: string }>;
  searchParams?: Promise<{
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

async function verifySubcategoryExists(slug: string, subslug: string, apiBase: string): Promise<boolean> {
  if (!isValidCategorySlug(slug)) return false;
  const parentSeo = getCategorySeo(slug);
  const key = `${parentSeo.slug}/${subslug}`;
  if (SUBCATEGORY_SEO_MAP[key]) return true;

  try {
    const categories = await getCategories(apiBase);
    const parent = categories.find((c) => c.slug === slug || c.id === slug || c.slug === parentSeo.slug);
    if (!parent) return false;
    if (Array.isArray(parent.subcategories)) {
      return parent.subcategories.some(
        (s: any) =>
          s.slug === subslug ||
          s.id === subslug ||
          (s.label || s.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") === subslug
      );
    }
  } catch {
    // fallback
  }
  return false;
}

export async function generateMetadata({ params, searchParams }: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subslug } = await params;
  const resolvedParams = searchParams ? await searchParams : {};
  const apiBase = await getServerApiBaseUrl();
  const exists = await verifySubcategoryExists(slug, subslug, apiBase);
  if (!exists) {
    notFound();
  }

  const seo = getSubcategorySeo(slug, subslug);
  const pageNum = Math.max(1, Number(resolvedParams?.page) || 1);
  const baseCanonical = `${SITE_URL}/category/${seo.parentSlug}/${seo.subSlug}`;
  const canonicalUrl = pageNum > 1 ? `${baseCanonical}?page=${pageNum}` : baseCanonical;

  // PART E — Zero-product subcategory noindex protection
  const checkQs = new URLSearchParams({
    page: "1",
    page_size: "1",
    category: seo.parentSlug,
    subcategory: seo.apiSubSlugs[0] || seo.subSlug,
  });
  let isZeroProducts = false;
  try {
    const res = await fetch(`${apiBase}/products/?${checkQs.toString()}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const count = typeof data?.count === "number" ? data.count : Array.isArray(data?.results) ? data.results.length : Array.isArray(data) ? data.length : 0;
      if (count === 0) isZeroProducts = true;
    }
  } catch {
    // fallback
  }

  return {
    title: seo.title,
    description: seo.description,
    ...(isZeroProducts ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: "Kawaii Subete",
      locale: "en_BD",
      type: "website",
    },
  };
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { slug, subslug } = await params;
  const apiBase = await getServerApiBaseUrl();
  const exists = await verifySubcategoryExists(slug, subslug, apiBase);
  if (!exists) {
    notFound();
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const parentSeo = getCategorySeo(slug);
  const subSeo = getSubcategorySeo(slug, subslug);

  const currentPage = Math.max(1, Number(resolvedParams?.page) || 1);
  const pageSize = 24;
  const initialSort = resolvedParams?.sort || "newest";

  const qs = new URLSearchParams({
    page: String(currentPage),
    page_size: String(pageSize),
    sort: initialSort,
    category: parentSeo.apiSlugs[0] || parentSeo.slug,
    subcategory: subSeo.apiSubSlugs[0] || subSeo.subSlug,
  });

  if (resolvedParams?.search?.trim()) {
    qs.set("search", resolvedParams.search.trim());
  }

  const [firstPage, categories] = await Promise.all([
    fetch(`${apiBase}/products/?${qs.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    getCategories(apiBase),
  ]);

  const products: Product[] = Array.isArray(firstPage?.results) ? firstPage.results : [];
  const totalCount = typeof firstPage?.count === "number" ? firstPage.count : products.length;

  const itemElements = products.slice(0, 20).map((p, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/product/${p.slug || p.id}`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: parentSeo.h1,
            item: `${SITE_URL}/category/${parentSeo.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: subSeo.h1,
            item: `${SITE_URL}/category/${parentSeo.slug}/${subSeo.subSlug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: subSeo.h1,
        numberOfItems: itemElements.length,
        itemListElement: itemElements,
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      {/* Subcategory Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar categories={categories} />
      <NavLinks />

      <main className="flex-1">
        <ShopCatalog
          initialProducts={products}
          initialCount={totalCount}
          initialHasMore={Boolean(firstPage?.hasMore)}
          initialCategories={categories}
          initialSort={initialSort}
          forcedCategory={parentSeo.slug}
          forcedSubcategory={subSeo.subSlug}
          customH1={subSeo.h1}
          isCategoryArchive={true}
          basePath={`/category/${parentSeo.slug}/${subSeo.subSlug}`}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

