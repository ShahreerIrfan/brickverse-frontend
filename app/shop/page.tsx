import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import TrustStrip from "@/components/TrustStrip";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getAllProducts, getCategories } from "@/lib/api";

export const revalidate = 30;

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <AnnouncementBar />
      <Navbar />
      <NavLinks />

      <main className="flex-1">
        <ShopCatalog initialProducts={products} initialCategories={categories} />
      </main>

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TrustStrip />
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
