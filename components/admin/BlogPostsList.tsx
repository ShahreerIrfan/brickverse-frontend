"use client";

import React, { useEffect, useState } from "react";
import { getBlogPostsAdmin, deleteBlogPost, getMediaUrl } from "@/lib/api";
import type { BlogPost } from "@/lib/blogTypes";
import { IconPlus, IconEdit, IconTrash, IconSearch, IconPhoto, IconChevronLeft, IconChevronRight } from "../icons";

export default function BlogPostsList({
  onCreate,
  onEdit,
}: {
  onCreate: () => void;
  onEdit: (id: string | number) => void;
}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));

  const load = async () => {
    setLoading(true);
    const res = await getBlogPostsAdmin({ status: status || undefined, search: search || undefined, page });
    setPosts(res.results);
    setCount(res.count);
    setLoading(false);
  };

  useEffect(() => {
    const handle = setTimeout(() => {
      void load();
    }, 300);
    return () => clearTimeout(handle);
  }, [search, status, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteBlogPost(deleteTarget.id);
    if (res.success) {
      setToast(`"${deleteTarget.title}" deleted.`);
      setDeleteTarget(null);
      await load();
    } else {
      setToast("Couldn't delete this post.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
            Blog Posts
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B]">
            {count} {count === 1 ? "post" : "posts"} total
          </p>
        </div>
        <button
          onClick={onCreate}
          className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start"
        >
          <IconPlus className="w-4 h-4" />
          <span>New Post</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE3F7] flex-1 max-w-sm">
          <IconSearch className="w-4 h-4 text-[#8A84A6] shrink-0" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search posts..."
            className="w-full bg-transparent text-xs focus:outline-none"
          />
        </div>
        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE3F7] text-xs text-[#171136] focus:outline-none focus:border-[#FF4D6D]"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3F7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#EAE3F7] text-[#8A84A6] text-[10.5px] uppercase tracking-wide">
                <th className="text-left font-bold px-5 py-3">Post</th>
                <th className="text-left font-bold px-3 py-3 hidden md:table-cell">Category</th>
                <th className="text-left font-bold px-3 py-3 hidden lg:table-cell">Author</th>
                <th className="text-left font-bold px-3 py-3">Status</th>
                <th className="text-left font-bold px-3 py-3 hidden lg:table-cell">Updated</th>
                <th className="text-right font-bold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#8A84A6]">
                    Loading posts...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#8A84A6]">
                    {search || status ? "No posts match your filters." : "No blog posts yet. Create your first one above."}
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-[#F5F1FB] last:border-b-0 hover:bg-[#FAF8FE] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-[#F6F1FF] flex items-center justify-center border border-[#EAE3F7]/70">
                          {post.featuredImage ? (
                            <img src={getMediaUrl(post.featuredImage)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <IconPhoto className="w-4 h-4 text-[#C7C0E8]" />
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-[#171136] truncate max-w-[220px]">{post.title}</p>
                          <p className="text-[10.5px] text-[#8A84A6] font-mono truncate max-w-[220px]">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-[#736E9B]">
                      {post.category?.name || <span className="text-[#C7C0E8]">Uncategorized</span>}
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-[#736E9B]">
                      {post.author?.first_name || post.author?.name || post.author?.email || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          post.status === "published" ? "bg-[#E9FBF3] text-[#0FA968]" : "bg-[#F6F1FF] text-[#8A84A6]"
                        }`}
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-[#736E9B]">
                      {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(post.id)}
                          title="Edit"
                          className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                        >
                          <IconEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          title="Delete"
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete post?
            </h3>
            <p className="text-xs text-[#736E9B] mb-5">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
            </p>
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#171136] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
