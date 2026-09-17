"use client";

import React, { useEffect, useState } from "react";
import {
  getBlogCategoriesAdmin,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
  getBlogTagsAdmin,
  createBlogTag,
  updateBlogTag,
  deleteBlogTag,
} from "@/lib/api";
import type { BlogCategoryRef, BlogTagRef } from "@/lib/blogTypes";
import { IconPlus, IconEdit, IconTrash, IconClose } from "../icons";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Item = BlogCategoryRef | BlogTagRef;

export default function BlogTaxonomyManager() {
  const [tab, setTab] = useState<"categories" | "tags">("categories");
  const [categories, setCategories] = useState<BlogCategoryRef[]>([]);
  const [tags, setTags] = useState<BlogTagRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [modal, setModal] = useState<{ mode: "create" | "edit"; item?: Item } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  const load = async () => {
    setLoading(true);
    const [cats, tgs] = await Promise.all([getBlogCategoriesAdmin(), getBlogTagsAdmin()]);
    setCategories(cats);
    setTags(tgs);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const items = tab === "categories" ? categories : tags;

  const openCreate = () => {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setModal({ mode: "create" });
  };

  const openEdit = (item: Item) => {
    setName(item.name);
    setSlug(item.slug || "");
    setSlugTouched(true);
    setModal({ mode: "edit", item });
  };

  const closeModal = () => setModal(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    const payload = { name: name.trim(), slug: slug.trim() || slugify(name) };
    const isCategory = tab === "categories";
    let res;
    if (modal?.mode === "edit" && modal.item) {
      res = isCategory ? await updateBlogCategory(modal.item.id, payload) : await updateBlogTag(modal.item.id, payload);
    } else {
      res = isCategory ? await createBlogCategory(payload) : await createBlogTag(payload);
    }

    setSaving(false);
    if (res.success) {
      setToast(modal?.mode === "edit" ? `"${name}" updated.` : `"${name}" created.`);
      closeModal();
      await load();
    } else {
      setToast(res.error || "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const isCategory = tab === "categories";
    const res = isCategory ? await deleteBlogCategory(deleteTarget.id) : await deleteBlogTag(deleteTarget.id);
    if (res.success) {
      setToast(`"${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
      await load();
    } else {
      setToast("Couldn't delete this item.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
            Blog Taxonomy
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B]">Manage blog categories and tags.</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add {tab === "categories" ? "Category" : "Tag"}</span>
        </button>
      </div>

      <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-white border border-[#EAE3F7]">
        {(["categories", "tags"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              tab === t ? "bg-[#171136] text-white" : "text-[#736E9B] hover:bg-[#FAF8FE]"
            }`}
          >
            {t === "categories" ? "Categories" : "Tags"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3F7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#EAE3F7] text-[#8A84A6] text-[10.5px] uppercase tracking-wide">
                <th className="text-left font-bold px-5 py-3">Name</th>
                <th className="text-left font-bold px-3 py-3">Slug</th>
                <th className="text-right font-bold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-[#8A84A6]">
                    Loading...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-10 text-center text-[#8A84A6]">
                    No {tab} yet. Add your first one above.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-[#F5F1FB] last:border-b-0 hover:bg-[#FAF8FE] transition-colors">
                    <td className="px-5 py-3 font-bold text-[#171136]">{item.name}</td>
                    <td className="px-3 py-3 text-[#736E9B] font-mono">{item.slug}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                        >
                          <IconEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
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

      {modal && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                {modal.mode === "edit" ? "Edit" : "Add"} {tab === "categories" ? "Category" : "Tag"}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171136] block mb-1">Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Announcements"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Slug</label>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugTouched(true);
                  }}
                  placeholder="auto-generated from name"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] font-mono focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBF8]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#171136] text-white font-bold hover:bg-[#251c4a] shadow-md cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : modal.mode === "edit" ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete {tab === "categories" ? "category" : "tag"}?
            </h3>
            <p className="text-xs text-[#736E9B] mb-5">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
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
