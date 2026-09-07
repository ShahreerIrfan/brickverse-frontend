import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import CategoryRail from "@/components/CategoryRail";
import Hero from "@/components/Hero";
import PromoColumns from "@/components/PromoColumns";
import TrustStrip from "@/components/TrustStrip";
import ProductGrid from "@/components/ProductGrid";
import PromoBanner from "@/components/PromoBanner";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getProductSections, getCategories } from "@/lib/api";

export default async function Home() {
  const [sections, categories] = await Promise.all([
    getProductSections(),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col flex-1 bg-[#FFF6EE] pb-16 lg:pb-0">
      <AnnouncementBar />
      <Navbar />
      <NavLinks />

      <main className="max-w-[1580px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col gap-5 sm:gap-10">
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
          <CategoryRail initialCategories={categories} />
          <div className="flex-1 w-full min-w-0 flex flex-col gap-3 sm:gap-4">
            <Hero />
            <PromoColumns />
          </div>
        </div>

        <TrustStrip />

        {sections.map((section) => (
          <ProductGrid key={section.id} section={section} />
        ))}

        <PromoBanner />
        <Newsletter />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
