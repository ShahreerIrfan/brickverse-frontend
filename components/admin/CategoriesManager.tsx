"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { getCategoryTree, createCategory, updateCategory, deleteCategory } from "@/lib/api";
import type { Category } from "../productData";
import { CategoryGlyph } from "../CategoryRail";
import {
  IconSearch,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconChevronDown,
  IconPhoto,
  IconFolder,
} from "../icons";

interface CategoriesManagerProps {
  onChanged?: () => void;
}

type TreeRow = Category & { depth: number };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Depth-first ordering so a category's children always render directly
// beneath it, rather than interleaved by a flat order/label sort.
function buildOrderedTree(categories: Category[]): TreeRow[] {
  const byParent = new Map<string | null, Category[]>();
  for (const cat of categories) {
    const key = cat.parent ?? null;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key)!.push(cat);
  }
  for (const list of byParent.values()) {
    list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.label.localeCompare(b.label));
  }

  const rows: TreeRow[] = [];
  const walk = (parentId: string | null, depth: number) => {
    for (const cat of byParent.get(parentId) || []) {
      rows.push({ ...cat, depth });
      walk(cat.id, depth + 1);
    }
  };
  walk(null, 0);
  return rows;
}

function isDescendant(categories: Category[], ancestorId: string, candidateId: string): boolean {
  const byId = new Map(categories.map((c) => [c.id, c]));
  let node = byId.get(candidateId);
  while (node?.parent) {
    if (node.parent === ancestorId) return true;
    node = byId.get(node.parent);
  }
  return false;
}

function ParentPicker({
  categories,
  tree,
  value,
  excludeId,
  onChange,
}: {
  categories: Category[];
  tree: TreeRow[];
  value: string;
  excludeId?: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectable = tree.filter((c) => {
    if (excludeId && c.id === excludeId) return false;
    if (excludeId && isDescendant(categories, excludeId, c.id)) return false;
    return true;
  });

  const filtered = query.trim()
    ? selectable.filter((c) => c.label.toLowerCase().includes(query.trim().toLowerCase()))
    : selectable;

  const selectedLabel = value ? categories.find((c) => c.id === value)?.label : "None (Top Level)";

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#EAE3F7] bg-white text-left focus:outline-none focus:border-[#FF4D6D] cursor-pointer"
      >
        <span className={value ? "text-[#171136] font-medium" : "text-[#8A84A6]"}>{selectedLabel}</span>
        <IconChevronDown className={`w-3.5 h-3.5 text-[#8A84A6] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full bg-white border border-[#EAE3F7] rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-[#F0EBF8]">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#FAF8FE] border border-[#EAE3F7]">
              <IconSearch className="w-3.5 h-3.5 text-[#8A84A6] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter parent options..."
                className="w-full bg-transparent text-xs focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
                setQuery("");
              }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold cursor-pointer ${
                !value ? "bg-[#FFF1F4] text-[#FF4D6D]" : "text-[#171136] hover:bg-[#FAF8FE]"
              }`}
            >
              None (Top Level)
            </button>
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-xs text-[#8A84A6]">No matches.</p>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onChange(c.id);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`w-full text-left px-3 py-2 text-xs cursor-pointer ${
                    value === c.id ? "bg-[#FFF1F4] text-[#FF4D6D] font-semibold" : "text-[#171136] hover:bg-[#FAF8FE]"
                  }`}
                  style={{ paddingLeft: `${12 + c.depth * 16}px` }}
                >
                  {c.depth > 0 && <span className="text-[#C7C0E8] mr-1">{"—".repeat(c.depth)}</span>}
                  {c.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoriesManager({ onChanged }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [modal, setModal] = useState<{ mode: "create" | "edit"; category?: Category } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [parentId, setParentId] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const load = async () => {
    const data = await getCategoryTree();
    setCategories(data);
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

  const tree = useMemo(() => buildOrderedTree(categories), [categories]);

  const visibleRows = useMemo(() => {
    if (!search.trim()) return tree;
    const q = search.trim().toLowerCase();
    return tree.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || (c.slug || "").toLowerCase().includes(q)
    );
  }, [tree, search]);

  const openCreate = (parent?: string) => {
    setLabel("");
    setSlug("");
    setSlugTouched(false);
    setParentId(parent || "");
    setOrder(0);
    setIsActive(true);
    setFeatured(false);
    setIconFile(null);
    setIconPreview(null);
    setModal({ mode: "create" });
  };

  const openEdit = (cat: Category) => {
    setLabel(cat.label);
    setSlug(cat.slug || "");
    setSlugTouched(true);
    setParentId(cat.parent || "");
    setOrder(cat.order ?? 0);
    setIsActive(cat.is_active !== false);
    setFeatured(!!cat.featured);
    setIconFile(null);
    setIconPreview(cat.category_icon || cat.categoryIcon || null);
    setModal({ mode: "edit", category: cat });
  };

  const closeModal = () => setModal(null);

  const handleIconFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    setSaving(true);

    const data = new FormData();
    data.append("label", label.trim());
    data.append("slug", (slug.trim() || slugify(label)));
    data.append("parent", parentId || "");
    data.append("order", String(order));
    data.append("is_active", String(isActive));
    data.append("featured", String(featured));
    if (iconFile) data.append("category_icon_file", iconFile);

    let res;
    if (modal?.mode === "edit" && modal.category) {
      res = await updateCategory(modal.category.id, data);
    } else {
      data.append("id", `${slugify(label)}-${Date.now().toString(36).slice(-4)}`);
      res = await createCategory(data);
    }

    setSaving(false);
    if (res.success) {
      setToast(modal?.mode === "edit" ? `"${label}" updated.` : `"${label}" created.`);
      closeModal();
      await load();
      onChanged?.();
    } else {
      setToast(res.error || "Something went wrong saving this category.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteCategory(deleteTarget.id);
    if (res.success) {
      const childCount = categories.filter((c) => c.parent === deleteTarget.id).length;
      setToast(
        childCount > 0
          ? `"${deleteTarget.label}" deleted. ${childCount} child ${childCount === 1 ? "category" : "categories"} moved to Top Level.`
          : `"${deleteTarget.label}" deleted.`
      );
      setDeleteTarget(null);
      await load();
      onChanged?.();
    } else {
      setToast("Couldn't delete this category.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B]">
            {categories.length} {categories.length === 1 ? "category" : "categories"} total
          </p>
        </div>
        <button
          onClick={() => openCreate()}
          className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer self-start"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-[#EAE3F7] max-w-sm">
        <IconSearch className="w-4 h-4 text-[#8A84A6] shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="w-full bg-transparent text-xs focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3F7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#EAE3F7] text-[#8A84A6] text-[10.5px] uppercase tracking-wide">
                <th className="text-left font-bold px-5 py-3">Category</th>
                <th className="text-left font-bold px-3 py-3 hidden md:table-cell">Parent</th>
                <th className="text-left font-bold px-3 py-3 hidden lg:table-cell">Children</th>
                <th className="text-left font-bold px-3 py-3 hidden lg:table-cell">Order</th>
                <th className="text-left font-bold px-3 py-3">Status</th>
                <th className="text-right font-bold px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#8A84A6]">
                    Loading categories...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-[#8A84A6]">
                    {search ? "No categories match your search." : "No categories yet. Add your first one above."}
                  </td>
                </tr>
              ) : (
                visibleRows.map((cat) => (
                  <tr key={cat.id} className="border-b border-[#F5F1FB] last:border-b-0 hover:bg-[#FAF8FE] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5" style={{ paddingLeft: `${cat.depth * 20}px` }}>
                        {cat.depth > 0 && <span className="text-[#D9CEEE] shrink-0">{"—".repeat(cat.depth)}</span>}
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#EAE3F7]/70"
                          style={{ backgroundColor: `${cat.color || "#FF4D6D"}1c` }}
                        >
                          <CategoryGlyph id={cat.id} color={cat.color || "#FF4D6D"} icon={cat.category_icon || cat.categoryIcon || cat.icon_type} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-bold text-[#171136] truncate">{cat.label}</p>
                          <p className="text-[10.5px] text-[#8A84A6] font-mono truncate">{cat.slug || cat.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell text-[#736E9B]">
                      {cat.parentLabel || <span className="text-[#C7C0E8]">Top Level</span>}
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell text-[#736E9B]">{cat.childrenCount ?? 0}</td>
                    <td className="px-3 py-3 hidden lg:table-cell text-[#736E9B]">{cat.order ?? 0}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          cat.is_active !== false ? "bg-[#E9FBF3] text-[#0FA968]" : "bg-[#F6F1FF] text-[#8A84A6]"
                        }`}
                      >
                        {cat.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openCreate(cat.id)}
                          title="Add subcategory under this"
                          className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                        >
                          <IconPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(cat)}
                          title="Edit"
                          className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                        >
                          <IconEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(cat)}
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

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                {modal.mode === "edit" ? "Edit Category" : "Add Category"}
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
                  value={label}
                  onChange={(e) => {
                    setLabel(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                  placeholder="e.g. Anime Figures"
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

              <div>
                <label className="font-bold text-[#171136] block mb-1">Parent Category</label>
                <ParentPicker
                  categories={categories}
                  tree={tree}
                  value={parentId}
                  excludeId={modal.category?.id}
                  onChange={setParentId}
                />
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1.5">Icon</label>
                {iconPreview ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7]">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE3F7] p-2 flex items-center justify-center shrink-0">
                      <img src={iconPreview} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0 text-[10.5px] text-[#736E9B] truncate">
                      {iconFile ? iconFile.name : "Current icon"}
                    </div>
                    <label className="px-2.5 py-1.5 rounded-xl bg-white border border-[#EAE3F7] text-[11px] font-bold text-[#7B5CFF] hover:bg-[#F6F1FF] cursor-pointer">
                      Change
                      <input type="file" accept="image/*,.svg" onChange={handleIconFile} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border-2 border-dashed border-[#D9CEEE] hover:border-[#FF4D6D] bg-[#FAF8FE] hover:bg-[#FFF5F7] transition-all cursor-pointer">
                    <input type="file" accept="image/*,.svg" onChange={handleIconFile} className="hidden" />
                    <IconPhoto className="w-4 h-4 text-[#7B5CFF]" />
                    <span className="font-semibold text-[#171136]">Upload an icon (optional)</span>
                  </label>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
                <div className="flex items-end gap-4 pb-2.5">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#FF4D6D]" />
                    <span className="font-semibold text-[#171136]">Active</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="accent-[#FF4D6D]" />
                    <span className="font-semibold text-[#171136]">Featured</span>
                  </label>
                </div>
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
                  {saving ? "Saving..." : modal.mode === "edit" ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete category?
            </h3>
            <p className="text-xs text-[#736E9B] mb-2">
              Are you sure you want to delete <strong>{deleteTarget.label}</strong>?
            </p>
            {categories.some((c) => c.parent === deleteTarget.id) && (
              <p className="text-xs text-[#FF4D6D] bg-[#FFF1F4] rounded-xl px-3 py-2 mb-3 flex items-start gap-1.5 text-left">
                <IconFolder className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>This category has subcategories. They&apos;ll move to Top Level instead of being deleted.</span>
              </p>
            )}
            <div className="flex justify-center gap-2 text-xs font-bold mt-4">
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

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#171136] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
