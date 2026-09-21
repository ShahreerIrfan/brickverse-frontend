import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import type { Product } from "@/components/productData";

export const revalidate = 30;

export default async function ProductsPage() {
  const apiBase = await getServerApiBaseUrl();
  const [firstPage, categories] = await Promise.all([
    fetch(`${apiBase}/products/?page=1&page_size=20`, { next: { revalidate: 30 } })
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
