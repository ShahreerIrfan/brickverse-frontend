import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ShopPageProps {
  searchParams?: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    deals?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const isDeals = resolvedParams?.deals === "true" || resolvedParams?.deals === "1";
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const apiBase = await getServerApiBaseUrl();

  const qs = new URLSearchParams({
    page: "1",
    page_size: "20",
    sort: "random",
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
      <Navbar />
      <NavLinks />

      <main className="flex-1">
        <ShopCatalog
          initialProducts={products}
          initialCount={typeof firstPage?.count === "number" ? firstPage.count : products.length}
          initialHasMore={Boolean(firstPage?.hasMore)}
          initialCategories={categories}
          initialSeed={randomSeed}
        />
      </main>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrustStrip />
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}

