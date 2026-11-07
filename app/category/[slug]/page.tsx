import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import { getCategorySeo, buildCategoryJsonLd, isValidCategorySlug, SITE_URL } from "@/lib/seoData";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    subcategory?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

async function verifyCategoryExists(slug: string, apiBase: string): Promise<boolean> {
  if (isValidCategorySlug(slug)) return true;
  try {
    const categories = await getCategories(apiBase);
    return categories.some(
      (c) =>
        c.slug === slug ||
        c.id === slug ||
        (c.label || "").toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
    );
  } catch {
    return false;
  }
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedParams = searchParams ? await searchParams : {};
  const apiBase = await getServerApiBaseUrl();
  const exists = await verifyCategoryExists(slug, apiBase);
  if (!exists) {
    notFound();
  }

  const seo = getCategorySeo(slug);
  const pageNum = Math.max(1, Number(resolvedParams?.page) || 1);
  const baseCanonical = `${SITE_URL}/category/${seo.slug}`;
  const canonicalUrl = pageNum > 1 ? `${baseCanonical}?page=${pageNum}` : baseCanonical;

  return {
    title: seo.title,
    description: seo.description,
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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const apiBase = await getServerApiBaseUrl();
  const exists = await verifyCategoryExists(slug, apiBase);
  if (!exists) {
    notFound();
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const seo = getCategorySeo(slug);

  const currentPage = Math.max(1, Number(resolvedParams?.page) || 1);
  const pageSize = 24;

  const isBundleDeals = seo.slug === "bundle-deals";
  const initialSort = resolvedParams?.sort || "newest";

  const qs = new URLSearchParams({
    page: String(currentPage),
    page_size: String(pageSize),
    sort: initialSort,
  });

  if (isBundleDeals) {
    qs.set("deals", "true");
  } else {
    // Pass canonical slug or mapped api slug
    qs.set("category", seo.apiSlugs[0] || seo.slug);
  }

  if (resolvedParams?.subcategory && resolvedParams.subcategory !== "all") {
    qs.set("subcategory", resolvedParams.subcategory);
  }
  if (resolvedParams?.search?.trim()) {
    qs.set("search", resolvedParams.search.trim());
  }

  const [pageData, categories] = await Promise.all([
    fetch(`${apiBase}/products/?${qs.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    getCategories(apiBase),
  ]);

  const products: Product[] = Array.isArray(pageData?.results) ? pageData.results : [];
  const totalCount = typeof pageData?.count === "number" ? pageData.count : products.length;

  const jsonLd = buildCategoryJsonLd(seo.h1, seo.slug, totalCount, products);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      {/* Category Structured Data (BreadcrumbList + ItemList) */}
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
          initialHasMore={Boolean(pageData?.hasMore)}
          initialCategories={categories}
          initialSort={initialSort}
          forcedCategory={isBundleDeals ? "bundle-deals" : seo.slug}
          customH1={seo.h1}
          basePath={`/category/${seo.slug}`}
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

