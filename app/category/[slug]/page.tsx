import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import ShopCatalog from "@/components/ShopCatalog";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { getCategories, getServerApiBaseUrl } from "@/lib/api";
import { getCategorySeo, buildCategoryJsonLd, SITE_URL } from "@/lib/seoData";
import type { Product } from "@/components/productData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    subcategory?: string;
    search?: string;
    sort?: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const seo = getCategorySeo(slug);
  const canonicalUrl = `${SITE_URL}/category/${seo.slug}`;

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

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedParams = searchParams ? await searchParams : {};
  const seo = getCategorySeo(slug);
  const randomSeed = Math.random().toString(36).substring(2, 10);
  const apiBase = await getServerApiBaseUrl();

  const isBundleDeals = seo.slug === "bundle-deals";
  const initialSort = resolvedParams?.sort || "newest";

  const qs = new URLSearchParams({
    page: "1",
    page_size: "20",
    sort: initialSort,
    seed: randomSeed,
  });

  if (isBundleDeals) {
    qs.set("deals", "true");
  } else {
    // Pass canonical slug or mapped api slug
    qs.set("category", seo.apiSlugs[0] || seo.slug);
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
  const totalCount = typeof firstPage?.count === "number" ? firstPage.count : products.length;

  const jsonLd = buildCategoryJsonLd(seo.h1, seo.slug, totalCount, products);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      {/* Category Structured Data (BreadcrumbList + ItemList) */}
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
          forcedCategory={seo.slug}
          customH1={seo.h1}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

