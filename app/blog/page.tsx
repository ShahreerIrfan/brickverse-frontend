import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import BlogIndexClient from "@/components/blog/BlogIndexClient";
import { getBlogPosts, getBlogCategories } from "@/lib/api";

export const revalidate = 30;

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
