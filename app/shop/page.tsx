import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import { SHOP_SEO, SITE_URL } from "@/lib/seoData";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ShopPageProps {
  searchParams?: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    deals?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const resolvedParams = searchParams ? await searchParams : {};
  const pageNum = Math.max(1, Number(resolvedParams?.page) || 1);

  // STEP 4 FIX 2: Self-referencing canonical on paginated pages
  // If category is provided, canonical points to /category/{category}
  let baseCanonical = `${SITE_URL}/shop`;
  if (resolvedParams?.category && resolvedParams.category !== "all") {
    baseCanonical = `${SITE_URL}/category/${resolvedParams.category}`;
  }
  const canonical = pageNum > 1 ? `${baseCanonical}?page=${pageNum}` : baseCanonical;

  return {
    title: SHOP_SEO.title,
    description: SHOP_SEO.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: SHOP_SEO.title,
      description: SHOP_SEO.description,
      url: canonical,
      siteName: "Kawaii Subete",
      locale: "en_BD",
      type: "website",
    },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isDeals = resolvedParams?.deals === "true" || resolvedParams?.deals === "1";
  const apiBase = await getServerApiBaseUrl();

  const currentPage = Math.max(1, Number(resolvedParams?.page) || 1);
  const pageSize = 24;

  const hasCategoryFilter = Boolean(
    (resolvedParams?.category && resolvedParams.category !== "all") ||
    (resolvedParams?.subcategory && resolvedParams.subcategory !== "all")
  );
  const initialSort = resolvedParams?.sort || (hasCategoryFilter ? "newest" : "newest");

  const qs = new URLSearchParams({
    page: String(currentPage),
    page_size: String(pageSize),
    sort: initialSort,
  });
  if (isDeals) {
    qs.set("deals", "true");
  }
  if (resolvedParams?.category && resolvedParams.category !== "all") {
    qs.set("category", resolvedParams.category);
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

  // STEP 6 FIX 3: Out-of-range pagination clamp / redirect to last valid page
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  if (currentPage > totalPages && totalCount > 0) {
    const redirectQs = new URLSearchParams();
    if (resolvedParams?.category && resolvedParams.category !== "all") {
      redirectQs.set("category", resolvedParams.category);
    }
    if (resolvedParams?.subcategory && resolvedParams.subcategory !== "all") {
      redirectQs.set("subcategory", resolvedParams.subcategory);
    }
    if (resolvedParams?.search?.trim()) {
      redirectQs.set("search", resolvedParams.search.trim());
    }
    if (isDeals) {
      redirectQs.set("deals", "true");
    }
    if (resolvedParams?.sort) {
      redirectQs.set("sort", resolvedParams.sort);
    }
    if (totalPages > 1) {
      redirectQs.set("page", String(totalPages));
    }
    const queryStr = redirectQs.toString();
    redirect(queryStr ? `/shop?${queryStr}` : "/shop");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar categories={categories} />
      <NavLinks />

      <main className="flex-1">
        <ShopCatalog
          initialProducts={products}
          initialCount={totalCount}
          initialHasMore={Boolean(pageData?.hasMore)}
          initialCategories={categories}
          initialSort={initialSort}
          customH1={SHOP_SEO.h1}
          basePath="/shop"
          currentPage={currentPage}
          pageSize={pageSize}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
