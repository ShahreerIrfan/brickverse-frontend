import type { Metadata } from "next";
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
import { HOMEPAGE_SEO, buildHomepageJsonLd } from "@/lib/seoData";

export const revalidate = 30;

export const metadata: Metadata = {
  title: HOMEPAGE_SEO.title,
  description: HOMEPAGE_SEO.description,
  alternates: {
    canonical: HOMEPAGE_SEO.canonical,
  },
  openGraph: {
    title: HOMEPAGE_SEO.title,
    description: HOMEPAGE_SEO.description,
    url: HOMEPAGE_SEO.canonical,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default async function Home() {
  const [categorySections, categories, heroSlides, newArrivals] = await Promise.all([
    getHomepageSections(),
    getCategories(),
    getHeroSlides(),
    getNewArrivals(10),
  ]);
  // Admin-chosen category sections win; with none chosen, fall back to fixed sections.
  const sections =
    categorySections && categorySections.length > 0
      ? categorySections
      : await getProductSections();

  const megaMenuCategories = categories
    .filter((c) => c.show_in_mega_menu !== false)
    .sort((a, b) => (a.mega_menu_order ?? 0) - (b.mega_menu_order ?? 0));

  const jsonLd = buildHomepageJsonLd();

  return (
    <div className="flex flex-col flex-1 bg-[#FFF6EE] pb-16 lg:pb-0">
      {/* Homepage Structured Data (Organization + WebSite) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar categories={categories} />
      <NavLinks />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col gap-5 sm:gap-10">
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
          <CategoryRail initialCategories={megaMenuCategories} />
          <div className="flex-1 w-full min-w-0 flex flex-col gap-3 sm:gap-4">
            {/* Primary SEO H1 & Intro Paragraph */}
            <header className="flex flex-col gap-1.5 pt-1 pb-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-[family-name:var(--font-display)] font-extrabold text-[#171136] tracking-tight leading-tight">
                {HOMEPAGE_SEO.h1}
              </h1>
              <p className="text-xs sm:text-sm text-[#5D5589] leading-relaxed max-w-3xl">
                {HOMEPAGE_SEO.introParagraph}
              </p>
            </header>

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
