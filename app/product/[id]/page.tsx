import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { getProductById, getRelatedProducts, getMediaUrl } from "@/lib/api";
import { buildProductJsonLd, SITE_URL } from "@/lib/seoData";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Kawaii Subete",
    };
  }

  // Hard rule: Do not put brand name first in product titles — put product name first
  const title = `${product.name} | Kawaii Subete`;
  const plainDesc = (product.description || `${product.name} available at Kawaii Subete Bangladesh. Ships from Dhaka within 48 hours. Cash on delivery nationwide.`)
    .replace(/<[^>]*>/g, "")
    .slice(0, 160)
    .trim();

  const productUrl = `${SITE_URL}/product/${product.slug || product.id}`;
  const imageUrl = product.image ? getMediaUrl(product.image) : `${SITE_URL}/logo.png`;

  return {
    title,
    description: plainDesc,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description: plainDesc,
      url: productUrl,
      siteName: "Kawaii Subete",
      locale: "en_BD",
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.category, product.id);
  const jsonLd = buildProductJsonLd(product);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-20 lg:pb-0">
      {/* Product & Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Sticky Top Action Bar when scrolled */}
      <StickyAddToCart product={product} />

      {/* Top Header Bars */}
      <Navbar />
      <NavLinks />

      {/* Main Container */}
      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col">
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
