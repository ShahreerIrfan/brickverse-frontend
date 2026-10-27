import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import CategoryRail from "@/components/CategoryRail";
import Hero from "@/components/Hero";
import PromoColumns from "@/components/PromoColumns";
import HomepageSectionsFeed from "@/components/HomepageSectionsFeed";
import PromoBanner from "@/components/PromoBanner";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import {
  getProductSections,
  getHomepageSections,
  getCategories,
  getHeroSlides,
  getNewArrivals,
} from "@/lib/api";

export const revalidate = 30;

export default async function Home() {
  const [fixedSections, categorySections, categories, heroSlides, newArrivals] = await Promise.all([
    getProductSections(),
    getHomepageSections(),
    getCategories(),
    getHeroSlides(),
    getNewArrivals(10),
  ]);
  // Admin-chosen category sections win; with none chosen, keep the fixed ones.
  const sections = categorySections.length > 0 ? categorySections : fixedSections;

  const megaMenuCategories = categories
    .filter((c) => c.show_in_mega_menu !== false)
    .sort((a, b) => (a.mega_menu_order ?? 0) - (b.mega_menu_order ?? 0));

  return (
    <div className="flex flex-col flex-1 bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar categories={categories} />
      <NavLinks />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col gap-5 sm:gap-10">
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
          <CategoryRail initialCategories={megaMenuCategories} />
          <div className="flex-1 w-full min-w-0 flex flex-col gap-3 sm:gap-4">
            <Hero slides={heroSlides} />
            <PromoColumns />
          </div>
        </div>

        <HomepageSectionsFeed
          initialSections={sections}
          initialNewArrivals={newArrivals}
        />

        <PromoBanner />
        <Newsletter />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
