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

  // 1. Extract clean numeric price
  const rawPrice = product.discountedPrice || product.price || "0";
  const priceNum = String(rawPrice).replace(/[^\d]/g, "") || "0";
  const priceSuffix = priceNum && priceNum !== "0" ? ` — ৳${priceNum}` : "";

  // 2. Title formula: {Product Name} — ৳{Price} | Kawaii Subete
  // Hard Rule: Title must strictly be <= 60 characters
  const nameOnly = product.name.trim();
  const titleWithBrand = `${nameOnly}${priceSuffix} | Kawaii Subete`;

  let title = titleWithBrand;
  if (titleWithBrand.length > 60) {
    const titleWithoutBrand = `${nameOnly}${priceSuffix}`;
    if (titleWithoutBrand.length <= 60) {
      title = titleWithoutBrand;
    } else {
      // Truncate name at word boundary to guarantee total length <= 60 chars
      const maxNameLen = 60 - priceSuffix.length - 1; // 1 char for ellipsis
      const slicedName = nameOnly.slice(0, maxNameLen);
      const lastSpace = slicedName.lastIndexOf(" ");
      const truncatedName = (lastSpace > 15 ? slicedName.slice(0, lastSpace) : slicedName).trim() + "…";
      title = `${truncatedName}${priceSuffix}`;
    }
  }

  // 3. Strip ALL HTML and remove boilerplate headings (Product Description / Key Features)
  let plain = (product.description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  plain = plain.replace(/^Product Description\s*[:\-–—]?\s*/i, "");
  plain = plain.replace(/^Key Features\s*[:\-–—]?\s*/i, "");
  plain = plain.replace(/^Overview\s*[:\-–—]?\s*/i, "").trim();

  // If description is short, pad it so final meta description reaches the 140–160 char target
  if (plain.length < 80) {
    plain = plain
      ? `${plain.replace(/\.+$/, "")}. In stock now at Kawaii Subete Dhaka.`
      : `Authentic ${nameOnly} collectible in stock at Kawaii Subete Dhaka.`;
  }

  // 4. Cut description at word boundary and append authoritative closing
  const descSuffix = priceNum && priceNum !== "0"
    ? ` ৳${priceNum}. Cash on delivery across Bangladesh.`
    : ` Cash on delivery across Bangladesh.`;

  const maxPlainLen = 155 - descSuffix.length;
  let cutPlain = plain;
  if (plain.length > maxPlainLen) {
    const sliced = plain.slice(0, maxPlainLen);
    const lastSpace = sliced.lastIndexOf(" ");
    cutPlain = (lastSpace > 20 ? sliced.slice(0, lastSpace) : sliced).trim() + "…";
  }

  const finalDescription = `${cutPlain}${descSuffix}`;
  const productUrl = `${SITE_URL}/product/${product.slug || product.id}`;
  const imageUrl = product.image ? getMediaUrl(product.image) : `${SITE_URL}/logo.png`;

  return {
    title,
    description: finalDescription,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description: finalDescription,
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
