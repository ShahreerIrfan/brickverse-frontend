import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { getBlogPosts, getBlogCategories } from "@/lib/api";
import { BLOG_SEO } from "@/lib/seoData";

export const revalidate = 30;

export const metadata: Metadata = {
  title: BLOG_SEO.title,
  description: BLOG_SEO.description,
  alternates: {
    canonical: BLOG_SEO.canonical,
  },
  openGraph: {
    title: BLOG_SEO.title,
    description: BLOG_SEO.description,
    url: BLOG_SEO.canonical,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const [postsRes, categories] = await Promise.all([
    getBlogPosts({ page: 1 }),
    getBlogCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1">
        <BlogIndexClient
          initialPosts={postsRes.results}
          initialCount={postsRes.count}
          categories={categories}
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
