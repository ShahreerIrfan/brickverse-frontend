"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  getBlogPostAdmin,
  createBlogPost,
  updateBlogPost,
  getBlogCategoriesAdmin,
  getBlogTagsAdmin,
  uploadBlogMedia,
  getMediaUrl,
  getAllProducts,
} from "@/lib/api";
import type { BlogBlockType, BlogCategoryRef, BlogTagRef } from "@/lib/blogTypes";
import type { Product } from "@/components/productData";
import {
  IconArrowLeft,
  IconCheck,
  IconPlus,
  IconTrash,
  IconCopy,
  IconGripVertical,
  IconPhoto,
  IconClose,
  IconSearch,
} from "../icons";

type EditorBlock = {
  clientId: string;
  id?: number | string;
  order: number;
  blockType: BlogBlockType | string;
  data: Record<string, any>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function newClientId() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const BLOCK_LABELS: Record<string, string> = {
  text: "Paragraph",
  heading: "Heading",
  quote: "Quote",
  code: "Code",
  image: "Image",
  gallery: "Gallery",
  embed: "Embed",
  button: "Button",
  divider: "Divider",
  product_grid: "Product Grid",
};

const BLOCK_GROUPS: { label: string; types: string[] }[] = [
  { label: "Text", types: ["heading", "text", "quote", "code"] },
  { label: "Media", types: ["image", "gallery", "embed"] },
  { label: "Layout", types: ["button", "divider"] },
  { label: "Dynamic", types: ["product_grid"] },
];

function defaultDataFor(type: string): Record<string, any> {
  switch (type) {
    case "heading":
      return { text: "", level: 2 };
    case "text":
      return { text: "" };
    case "quote":
      return { text: "", author: "" };
    case "code":
      return { code: "", language: "" };
    case "image":
      return { url: "", caption: "", alt: "" };
    case "gallery":
      return { images: [] };
    case "embed":
      return { url: "" };
    case "button":
      return { text: "", url: "", style: "primary" };
    case "divider":
      return { style: "line" };
    case "product_grid":
      return { title: "", productIds: [] };
    default:
      return {};
  }
}

function AdminImagePicker({
  url,
  onChange,
  label = "Upload image",
}: {
  url: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadBlogMedia(file);
    setUploading(false);
    if (res.success && res.url) {
      onChange(res.url);
    }
  };

  return url ? (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#EAE3F7] bg-[#F6F1FF]">
      <img src={getMediaUrl(url)} alt="" className="w-full h-full object-cover" />
      <label className="absolute bottom-2 right-2 px-2.5 py-1.5 rounded-xl bg-white/95 border border-[#EAE3F7] text-[11px] font-bold text-[#7B5CFF] hover:bg-white cursor-pointer">
        {uploading ? "Uploading..." : "Change"}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      </label>
    </div>
  ) : (
    <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border-2 border-dashed border-[#D9CEEE] hover:border-[#FF4D6D] bg-[#FAF8FE] hover:bg-[#FFF5F7] transition-all cursor-pointer">
      <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
      <IconPhoto className="w-4 h-4 text-[#7B5CFF]" />
      <span className="font-semibold text-[#171136]">{uploading ? "Uploading..." : label}</span>
    </label>
  );
}

function ProductPicker({
  productIds,
  onChange,
}: {
  productIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) return;
    (async () => {
      const products = await getAllProducts();
      setAllProducts(products || []);
      setLoaded(true);
    })();
  }, [loaded]);

  const selected = allProducts.filter((p) => productIds.includes(String(p.id)));
  const filtered = query.trim()
    ? allProducts.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F1FF] text-[#7B5CFF] text-[11px] font-bold"
            >
              {p.name}
              <button
                type="button"
                onClick={() => onChange(productIds.filter((id) => id !== String(p.id)))}
                className="cursor-pointer"
              >
                <IconClose className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#EAE3F7] bg-white">
          <IconSearch className="w-3.5 h-3.5 text-[#8A84A6] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products to add..."
            className="w-full bg-transparent text-xs focus:outline-none"
          />
        </div>
        {filtered.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-[#EAE3F7] rounded-xl shadow-lg max-h-52 overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  if (!productIds.includes(String(p.id))) onChange([...productIds, String(p.id)]);
                  setQuery("");
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#171136] hover:bg-[#FAF8FE] cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BlockEditorFields({ block, onUpdate }: { block: EditorBlock; onUpdate: (data: Record<string, any>) => void }) {
  const data = block.data || {};
  const set = (patch: Record<string, any>) => onUpdate({ ...data, ...patch });

  switch (block.blockType) {
    case "text":
      return (
        <textarea
          value={data.text || ""}
          onChange={(e) => set({ text: e.target.value })}
          placeholder="Write a paragraph..."
          rows={4}
          className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] resize-y"
        />
      );
    case "heading":
      return (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            value={data.text || ""}
            onChange={(e) => set({ text: e.target.value })}
            placeholder="Heading text"
            className="flex-1 p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          />
          <select
            value={data.level || 2}
            onChange={(e) => set({ level: Number(e.target.value) })}
            className="p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          >
            <option value={2}>H2</option>
            <option value={3}>H3</option>
            <option value={4}>H4</option>
          </select>
        </div>
      );
    case "quote":
      return (
        <div className="space-y-2.5">
          <textarea
            value={data.text || ""}
            onChange={(e) => set({ text: e.target.value })}
            placeholder="Quote text"
            rows={3}
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] resize-y"
          />
          <input
            value={data.author || ""}
            onChange={(e) => set({ author: e.target.value })}
            placeholder="Attribution (optional)"
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          />
        </div>
      );
    case "code":
      return (
        <div className="space-y-2.5">
          <input
            value={data.language || ""}
            onChange={(e) => set({ language: e.target.value })}
            placeholder="Language (optional, e.g. javascript)"
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] font-mono"
          />
          <textarea
            value={data.code || ""}
            onChange={(e) => set({ code: e.target.value })}
            placeholder="Paste code..."
            rows={6}
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] font-mono text-[11px] resize-y"
          />
        </div>
      );
    case "image":
      return (
        <div className="space-y-2.5">
          <AdminImagePicker url={data.url || ""} onChange={(url) => set({ url })} />
          <input
            value={data.caption || ""}
            onChange={(e) => set({ caption: e.target.value })}
            placeholder="Caption (optional)"
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          />
        </div>
      );
    case "gallery": {
      const images: { url: string; caption?: string }[] = Array.isArray(data.images) ? data.images : [];
      return (
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {images.map((img, i) => (
              <div key={i} className="space-y-1.5">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-[#EAE3F7] bg-[#F6F1FF]">
                  <img src={getMediaUrl(img.url)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => set({ images: images.filter((_, idx) => idx !== i) })}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white/95 flex items-center justify-center text-red-600 cursor-pointer"
                  >
                    <IconTrash className="w-3 h-3" />
                  </button>
                </div>
                <input
                  value={img.caption || ""}
                  onChange={(e) =>
                    set({ images: images.map((im, idx) => (idx === i ? { ...im, caption: e.target.value } : im)) })
                  }
                  placeholder="Caption"
                  className="w-full p-1.5 rounded-lg border border-[#EAE3F7] text-[10.5px] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>
            ))}
          </div>
          <AdminImagePicker
            url=""
            label="Add image to gallery"
            onChange={(url) => set({ images: [...images, { url, caption: "" }] })}
          />
        </div>
      );
    }
    case "embed":
      return (
        <input
          value={data.url || ""}
          onChange={(e) => set({ url: e.target.value })}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] font-mono"
        />
      );
    case "button":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input
            value={data.text || ""}
            onChange={(e) => set({ text: e.target.value })}
            placeholder="Button text"
            className="p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          />
          <input
            value={data.url || ""}
            onChange={(e) => set({ url: e.target.value })}
            placeholder="Link (e.g. /shop)"
            className="p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] font-mono"
          />
          <select
            value={data.style || "primary"}
            onChange={(e) => set({ style: e.target.value })}
            className="p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] sm:col-span-2"
          >
            <option value="primary">Primary (filled)</option>
            <option value="outline">Outline</option>
          </select>
        </div>
      );
    case "divider":
      return (
        <select
          value={data.style || "line"}
          onChange={(e) => set({ style: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
        >
          <option value="line">Line</option>
          <option value="dots">Dots</option>
        </select>
      );
    case "product_grid":
      return (
        <div className="space-y-2.5">
          <input
            value={data.title || ""}
            onChange={(e) => set({ title: e.target.value })}
            placeholder="Section title (optional)"
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          />
          <ProductPicker productIds={data.productIds || []} onChange={(ids) => set({ productIds: ids })} />
        </div>
      );
    default:
      return null;
  }
}

function SortableBlockCard({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  block: EditorBlock;
  onUpdate: (data: Record<string, any>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.clientId });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-2xl border border-[#EAE3F7] p-4 sm:p-5 shadow-xs"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            {...attributes}
            {...listeners}
            type="button"
            className="w-7 h-7 rounded-lg bg-[#F6F1FF] text-[#7B5CFF] flex items-center justify-center cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <IconGripVertical className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 py-1 rounded-full bg-[#171136] text-white text-[10.5px] font-extrabold">
            {BLOCK_LABELS[block.blockType] || block.blockType}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onDuplicate}
            title="Duplicate"
            className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center cursor-pointer"
          >
            <IconCopy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer"
          >
            <IconTrash className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <BlockEditorFields block={block} onUpdate={onUpdate} />
    </div>
  );
}

export default function BlogPostEditor({
  postId,
  onDone,
}: {
  postId?: string | number;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(!!postId);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [categoryId, setCategoryId] = useState<string>("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<EditorBlock[]>([]);

  const [categories, setCategories] = useState<BlogCategoryRef[]>([]);
  const [tags, setTags] = useState<BlogTagRef[]>([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    (async () => {
      const [cats, tgs] = await Promise.all([getBlogCategoriesAdmin(), getBlogTagsAdmin()]);
      setCategories(cats);
      setTags(tgs);

      if (postId) {
        const post = await getBlogPostAdmin(postId);
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setSlugTouched(true);
          setExcerpt(post.excerpt || "");
          setFeaturedImage(post.featuredImage || "");
          setStatus(post.status);
          setCategoryId(post.category ? String(post.category.id) : "");
          setTagIds((post.tags || []).map((t) => String(t.id)));
          setBlocks(
            (post.blocks || [])
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((b) => ({ clientId: newClientId(), id: b.id, order: b.order, blockType: b.blockType, data: b.data || {} }))
          );
        }
        setLoading(false);
      }
    })();
  }, [postId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const addBlock = (type: string) => {
    setBlocks((prev) => [
      ...prev,
      { clientId: newClientId(), order: prev.length, blockType: type, data: defaultDataFor(type) },
    ]);
    setPickerOpen(false);
  };

  const updateBlock = (clientId: string, data: Record<string, any>) => {
    setBlocks((prev) => prev.map((b) => (b.clientId === clientId ? { ...b, data } : b)));
  };

  const deleteBlock = (clientId: string) => {
    setBlocks((prev) => prev.filter((b) => b.clientId !== clientId));
  };

  const duplicateBlock = (clientId: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.clientId === clientId);
      if (idx === -1) return prev;
      const copy: EditorBlock = { ...prev[idx], clientId: newClientId(), id: undefined };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.clientId === active.id);
      const newIndex = prev.findIndex((b) => b.clientId === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const toggleTag = (id: string) => {
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setToast("Title is required.");
      return;
    }
    setSaving(true);
    const draft = {
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      excerpt: excerpt.trim(),
      featuredImage,
      status,
      categoryId: categoryId || null,
      tagIds,
      blocks: blocks.map((b, index) => ({ id: b.id, order: index, blockType: b.blockType, data: b.data })),
    };

    const res = postId ? await updateBlogPost(postId, draft) : await createBlogPost(draft);
    setSaving(false);
    if (res.success) {
      setToast(postId ? "Post updated." : "Post created.");
      setTimeout(() => onDone(), 600);
    } else {
      setToast(res.error || "Something went wrong saving this post.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onDone}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#736E9B] hover:text-[#FF4D6D] transition-colors mb-2 cursor-pointer"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Back to Posts
          </button>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
            {postId ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60 self-start"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <IconCheck className="w-4 h-4" />
              <span>Save Post</span>
            </>
          )}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#EAE3F7] p-4 sm:p-6 space-y-4 text-xs">
        <div>
          <label className="font-bold text-[#171136] block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched) setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. 10 tips for collecting anime figures"
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#171136] block mb-1">Slug</label>
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="auto-generated from title"
              className="w-full p-2.5 rounded-xl border border-[#EAE3F7] font-mono focus:outline-none focus:border-[#FF4D6D]"
            />
          </div>
          <div>
            <label className="font-bold text-[#171136] block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-[#171136] block mb-1">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary shown on the blog index"
            rows={2}
            className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] resize-none"
          />
        </div>

        <div>
          <label className="font-bold text-[#171136] block mb-1.5">Featured Image</label>
          <AdminImagePicker url={featuredImage} onChange={setFeaturedImage} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-[#171136] block mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-bold text-[#171136] block mb-1.5">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {tags.length === 0 ? (
                <span className="text-[#8A84A6]">No tags yet.</span>
              ) : (
                tags.map((t) => {
                  const active = tagIds.includes(String(t.id));
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => toggleTag(String(t.id))}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                        active ? "bg-[#FF4D6D] text-white" : "bg-[#F6F1FF] text-[#7B5CFF] hover:bg-[#EFE9FF]"
                      }`}
                    >
                      #{t.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">Content Blocks</h2>
          <div className="relative">
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              <span>Add Block</span>
            </button>
            {pickerOpen && (
              <div className="absolute right-0 z-20 mt-2 w-64 bg-white border border-[#EAE3F7] rounded-2xl shadow-lg p-3 space-y-3">
                {BLOCK_GROUPS.map((group) => (
                  <div key={group.label}>
                    <p className="text-[10px] font-extrabold tracking-wide text-[#8A84A6] uppercase mb-1.5">{group.label}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {group.types.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => addBlock(type)}
                          className="px-2.5 py-2 rounded-xl bg-[#FAF8FE] hover:bg-[#F6F1FF] text-[#171136] text-[11px] font-bold text-left cursor-pointer"
                        >
                          {BLOCK_LABELS[type]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {blocks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-[#D9CEEE] py-16 text-center">
            <p className="text-sm font-semibold text-[#171136]">No content blocks yet.</p>
            <p className="text-xs text-[#8A84A6] mt-1">Use &ldquo;Add Block&rdquo; to start building this post.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map((b) => b.clientId)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {blocks.map((block) => (
                  <SortableBlockCard
                    key={block.clientId}
                    block={block}
                    onUpdate={(data) => updateBlock(block.clientId, data)}
                    onDelete={() => deleteBlock(block.clientId)}
                    onDuplicate={() => duplicateBlock(block.clientId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] bg-[#171136] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl max-w-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
