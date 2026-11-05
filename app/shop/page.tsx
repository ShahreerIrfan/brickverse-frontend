import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import { SHOP_SEO } from "@/lib/seoData";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: SHOP_SEO.title,
  description: SHOP_SEO.description,
  alternates: {
    canonical: SHOP_SEO.canonical,
  },
  openGraph: {
    title: SHOP_SEO.title,
    description: SHOP_SEO.description,
    url: SHOP_SEO.canonical,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

interface ShopPageProps {
  searchParams?: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    deals?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isDeals = resolvedParams?.deals === "true" || resolvedParams?.deals === "1";
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const apiBase = await getServerApiBaseUrl();

  const hasCategoryFilter = Boolean(
    (resolvedParams?.category && resolvedParams.category !== "all") ||
    (resolvedParams?.subcategory && resolvedParams.subcategory !== "all")
  );
  const initialSort = resolvedParams?.sort || (hasCategoryFilter ? "newest" : "random");

  const qs = new URLSearchParams({
    page: "1",
    page_size: "20",
    sort: initialSort,
    seed: randomSeed,
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

  const [firstPage, categories] = await Promise.all([
    fetch(`${apiBase}/products/?${qs.toString()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    getCategories(apiBase),
  ]);
  const products: Product[] = Array.isArray(firstPage?.results) ? firstPage.results : [];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar categories={categories} />
      <NavLinks />

      <main className="flex-1">
        <ShopCatalog
          initialProducts={products}
          initialCount={typeof firstPage?.count === "number" ? firstPage.count : products.length}
          initialHasMore={Boolean(firstPage?.hasMore)}
          initialCategories={categories}
          initialSeed={randomSeed}
          initialSort={initialSort}
          customH1={SHOP_SEO.h1}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
