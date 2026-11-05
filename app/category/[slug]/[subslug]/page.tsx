import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import {
  getCategorySeo,
  getSubcategorySeo,
  SITE_URL,
} from "@/lib/seoData";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SubcategoryPageProps {
  params: Promise<{ slug: string; subslug: string }>;
  searchParams?: Promise<{
    search?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subslug } = await params;
  const seo = getSubcategorySeo(slug, subslug);
  const canonicalUrl = `${SITE_URL}/category/${seo.parentSlug}/${seo.subSlug}`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: "Kawaii Subete",
      locale: "en_BD",
      type: "website",
    },
  };
}

export default async function SubcategoryPage({ params, searchParams }: SubcategoryPageProps) {
  const { slug, subslug } = await params;
  const resolvedParams = searchParams ? await searchParams : {};
  const parentSeo = getCategorySeo(slug);
  const subSeo = getSubcategorySeo(slug, subslug);
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const apiBase = await getServerApiBaseUrl();

  const initialSort = resolvedParams?.sort || "newest";

  const qs = new URLSearchParams({
    page: "1",
    page_size: "20",
    sort: initialSort,
    seed: randomSeed,
    category: parentSeo.apiSlugs[0] || parentSeo.slug,
    subcategory: subSeo.apiSubSlugs[0] || subSeo.subSlug,
  });

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
  const totalCount = typeof firstPage?.count === "number" ? firstPage.count : products.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: parentSeo.h1,
            item: `${SITE_URL}/category/${parentSeo.slug}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: subSeo.h1,
            item: `${SITE_URL}/category/${parentSeo.slug}/${subSeo.subSlug}`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: subSeo.h1,
        numberOfItems: totalCount,
        itemListElement: products.slice(0, 20).map((p, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/product/${p.slug || p.id}`,
        })),
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      {/* Subcategory Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar categories={categories} />
      <NavLinks />

      <main className="flex-1">
        <ShopCatalog
          initialProducts={products}
          initialCount={totalCount}
          initialHasMore={Boolean(firstPage?.hasMore)}
          initialCategories={categories}
          initialSeed={randomSeed}
          initialSort={initialSort}
          forcedCategory={parentSeo.slug}
          forcedSubcategory={subSeo.subSlug}
          customH1={subSeo.h1}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

