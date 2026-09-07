import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ProductBreadcrumb from "@/components/ProductDetail/ProductBreadcrumb";
import ProductGallery from "@/components/ProductDetail/ProductGallery";
import ProductBuyBox from "@/components/ProductDetail/ProductBuyBox";
import ProductTabs from "@/components/ProductDetail/ProductTabs";
import RelatedShelf from "@/components/ProductDetail/RelatedShelf";
import StickyAddToCart from "@/components/ProductDetail/StickyAddToCart";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getProductById, getRelatedProducts } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.category, product.id);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-20 lg:pb-0">
      {/* Sticky Top Action Bar when scrolled */}
      <StickyAddToCart product={product} />

      {/* Top Header Bars */}
      <AnnouncementBar />
      <Navbar />
      <NavLinks />

      {/* Main Container */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-[100px] py-4 sm:py-6 flex flex-col">
        {/* Breadcrumb Navigation */}
        <ProductBreadcrumb product={product} />

        {/* 2-Column Product Hero (Gallery + Buy Box) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-6 items-start">
          <ProductGallery product={product} />
          <ProductBuyBox product={product} />
        </div>

        {/* Tabbed Product Details, Specs & Reviews */}
        <ProductTabs product={product} />

        {/* Related / Same Shelf Products */}
        <RelatedShelf products={related} />

        {/* Restock Alerts Newsletter Banner */}
        <div className="mt-14 sm:mt-20">
          <Newsletter />
        </div>
      </main>

      {/* Footers */}
      <Footer />
      <BottomNav />
    </div>
  );
}
