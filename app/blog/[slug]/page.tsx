import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import BlockRenderer from "@/components/blog/BlockRenderer";
import { getBlogPostBySlug, getMediaUrl } from "@/lib/api";
import { IconArrowLeft } from "@/components/icons";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(value?: string | null) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return "";
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const authorName =
    [post.author?.first_name, post.author?.last_name].filter(Boolean).join(" ").trim() ||
    post.author?.name ||
    post.author?.email ||
    "Brickverse Team";

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1">
        <article className="max-w-[900px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[11.5px] sm:text-xs font-bold text-[#736E9B] hover:text-[#FF4D6D] transition-colors mb-4 sm:mb-6"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Back to Blog
          </Link>

          <header className="mb-6 sm:mb-10">
            {post.category && (
              <span className="inline-block bg-[#FFF1F4] text-[#FF4D6D] text-[10px] sm:text-[11px] font-extrabold tracking-wide rounded-full px-2.5 py-1 mb-3">
                {post.category.name.toUpperCase()}
              </span>
            )}
            <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-4xl lg:text-5xl text-[#171136] tracking-tight leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-sm sm:text-lg text-[#736E9B] mt-3 sm:mt-4">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-2 mt-4 sm:mt-5 text-[11.5px] sm:text-xs font-semibold text-[#8A84A6]">
              <span>{authorName}</span>
              <span>&middot;</span>
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
          </header>

          {post.featuredImage && (
            <div className="relative w-full aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6F1FF] mb-6 sm:mb-10">
              <img src={getMediaUrl(post.featuredImage)} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <BlockRenderer blocks={post.blocks || []} />

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-[#EAE3F7]">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2.5 py-1 rounded-full bg-[#F6F1FF] text-[#7B5CFF] text-[11px] font-bold"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
