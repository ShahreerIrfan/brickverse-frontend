"use client";

import { useEffect, useState } from "react";
import { getBlogPosts } from "@/lib/api";
import type { BlogPost, BlogCategoryRef, BlogTagRef } from "@/lib/blogTypes";
import BlogPostCard from "./BlogPostCard";
import { IconSearch, IconChevronLeft, IconChevronRight } from "@/components/icons";

export default function BlogIndexClient({
  initialPosts,
  initialCount,
  categories,
  tags,
}: {
  initialPosts: BlogPost[];
  initialCount: number;
  categories: BlogCategoryRef[];
  tags: BlogTagRef[];
}) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = initialPosts.length || 12;
  const totalPages = Math.max(1, Math.ceil(count / (pageSize || 1)));

  useEffect(() => {
    const isFirstLoad = page === 1 && !search && !category && !tag;
    if (isFirstLoad) return;

    let active = true;
    setLoading(true);
    const handle = setTimeout(async () => {
      const res = await getBlogPosts({ category, tag, search, page });
      if (!active) return;
      setPosts(res.results);
      setCount(res.count);
      setLoading(false);
    }, 300);
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [search, category, tag, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setPage(1);
  };

  const handleTagChange = (value: string) => {
    setTag(value);
    setPage(1);
  };

  return (
    <div className="max-w-[1200px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="mb-6 sm:mb-10">
        <p className="text-[10.5px] sm:text-xs font-bold tracking-wide text-[#FF4D6D]">BRICKVERSE JOURNAL</p>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-4xl text-[#171136] tracking-tight mt-1">
          Blog
        </h1>
        <p className="text-xs sm:text-sm text-[#736E9B] mt-1.5 sm:mt-2 max-w-xl">
          News, guides, and stories from the Brickverse team.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-8">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE3F7] flex-1">
          <IconSearch className="w-4 h-4 text-[#8A84A6] shrink-0" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
          />
        </div>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE3F7] text-xs sm:text-sm text-[#171136] focus:outline-none focus:border-[#FF4D6D]"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={tag}
          onChange={(e) => handleTagChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE3F7] text-xs sm:text-sm text-[#171136] focus:outline-none focus:border-[#FF4D6D]"
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.slug}>
              #{t.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-[#D9CEEE] py-16 sm:py-24 text-center">
          <p className="text-sm font-semibold text-[#171136]">No posts found.</p>
          <p className="text-xs text-[#8A84A6] mt-1">Try a different search or filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 sm:mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-9 h-9 rounded-full bg-white border border-[#EAE3F7] flex items-center justify-center text-[#171136] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <IconChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-[#736E9B] px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-9 h-9 rounded-full bg-white border border-[#EAE3F7] flex items-center justify-center text-[#171136] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <IconChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
