"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category } from "../productData";
import { CategoryGlyph } from "../CategoryRail";
import { getCategoryTree, reorderHomepageSections } from "@/lib/api";
import { IconCheck, IconChevronRight, IconClose, IconGripVertical, IconPlus, IconRefresh } from "../icons";

function CategoryIcon({ cat }: { cat: Category }) {
  const color = cat.color || "#FF4D6D";
  return (
    <span
      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${color}20` }}
    >
      <CategoryGlyph id={cat.id} color={color} icon={cat.category_icon || cat.categoryIcon || cat.icon_type} />
    </span>
  );
}

function CategoryMeta({ cat }: { cat: Category }) {
  const subs = cat.childrenCount ?? cat.subcategories?.length ?? 0;
  const products = cat.subtreeProductCount ?? 0;
  return (
    <p className="text-[10.5px] text-[#8A84A6]">
      {subs} {subs === 1 ? "subcategory" : "subcategories"} · {products} {products === 1 ? "product" : "products"}
    </p>
  );
}

export default function HomepageSectionsManager() {
  const [topLevel, setTopLevel] = useState<Category[]>([]);
  const [selection, setSelection] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const apply = (all: Category[]) => {
    const parents = all.filter((c) => !c.parent);
    setTopLevel(parents);
    setSelection(
      parents
        .filter((c) => c.show_on_homepage)
        .sort((a, b) => (a.homepage_order ?? 0) - (b.homepage_order ?? 0))
        .map((c) => c.id)
    );
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    getCategoryTree().then((all) => {
      if (active) apply(all);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(t);
  }, [message]);

  const byId = useMemo(() => new Map(topLevel.map((c) => [c.id, c])), [topLevel]);
  const available = useMemo(() => topLevel.filter((c) => !selection.includes(c.id)), [topLevel, selection]);

  const add = (id: string) => setSelection((prev) => (prev.includes(id) ? prev : [...prev, id]));
  const remove = (id: string) => setSelection((prev) => prev.filter((x) => x !== id));
  const move = (index: number, dir: -1 | 1) =>
    setSelection((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  const dragReorder = (from: number, to: number) =>
    setSelection((prev) => {
      if (from === to || from < 0 || to < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });

  const save = async () => {
    setSaving(true);
    try {
      const result = await reorderHomepageSections(selection);
      if (result.success) {
        setMessage({ ok: true, text: "Homepage sections updated!" });
        apply(await getCategoryTree());
      } else {
        setMessage({ ok: false, text: "Failed to save homepage sections" });
      }
    } catch {
      setMessage({ ok: false, text: "Failed to save homepage sections" });
    } finally {
      setSaving(false);
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
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
          Homepage Category Sections
        </h1>
        <p className="text-xs sm:text-sm text-[#736E9B]">
          Choose which top-level categories appear as product sections on the homepage and set their display order.
          Each section shows that category&apos;s newest products, including its subcategories.
        </p>
        <p className="text-[11px] text-[#8A84A6] mt-1">
          Categories with no products are skipped automatically. If nothing is selected, the default homepage sections are used.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-[#EAE3F7] shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2ECC8F]" />
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
              On Homepage ({selection.length})
            </h2>
          </div>

          {selection.length === 0 ? (
            <p className="text-xs text-[#8A84A6] py-6 text-center">
              No categories selected yet. Add categories from the right.
            </p>
          ) : (
            <div className="space-y-2">
              {selection.map((id, index) => {
                const cat = byId.get(id);
                if (!cat) return null;
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex !== null) dragReorder(dragIndex, index);
                      setDragIndex(null);
                    }}
                    onDragEnd={() => setDragIndex(null)}
                    className={`flex items-center gap-3 rounded-2xl border border-[#EAE3F7] px-3 py-2.5 bg-[#FAF8FE] transition-opacity cursor-grab active:cursor-grabbing ${
                      dragIndex === index ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <IconGripVertical className="w-4 h-4 text-[#C7C0E8] shrink-0" />
                    <span className="w-6 h-6 rounded-full bg-[#171136] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <CategoryIcon cat={cat} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#171136] truncate">{cat.label}</p>
                      <CategoryMeta cat={cat} />
                      {(cat.is_active === false || (cat.subtreeProductCount ?? 0) === 0) && (
                        <span className="text-[10px] font-bold text-[#E8590C]">
                          {cat.is_active === false ? "Inactive - hidden on homepage" : "No products - hidden on homepage"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        title="Move up"
                        className="w-7 h-7 rounded-lg bg-white border border-[#EAE3F7] hover:bg-[#F6F1FF] disabled:opacity-30 disabled:cursor-not-allowed text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                      >
                        <IconChevronRight className="w-3.5 h-3.5 -rotate-90" />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === selection.length - 1}
                        title="Move down"
                        className="w-7 h-7 rounded-lg bg-white border border-[#EAE3F7] hover:bg-[#F6F1FF] disabled:opacity-30 disabled:cursor-not-allowed text-[#7B5CFF] flex items-center justify-center cursor-pointer"
                      >
                        <IconChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </button>
                      <button
                        onClick={() => remove(id)}
                        title="Remove from homepage"
                        className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer"
                      >
                        <IconClose className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl border border-[#EAE3F7] shadow-xs p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#8A84A6]" />
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
              Available Categories ({available.length})
            </h2>
          </div>

          {available.length === 0 ? (
            <p className="text-xs text-[#8A84A6] py-6 text-center">Every top-level category is already on the homepage.</p>
          ) : (
            <div className="space-y-2">
              {available.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 rounded-2xl border border-[#EAE3F7] px-3 py-2.5">
                  <CategoryIcon cat={cat} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-[#171136] truncate">
                      {cat.label}
                      {cat.is_active === false && <span className="ml-2 text-[10px] font-bold text-[#FF4D6D]">Inactive</span>}
                    </p>
                    <CategoryMeta cat={cat} />
                  </div>
                  <button
                    onClick={() => add(cat.id)}
                    className="shrink-0 bg-[#FFF1F4] hover:bg-[#FFE3EA] text-[#FF4D6D] text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        {message && (
          <span className={`text-xs font-bold ${message.ok ? "text-[#1E9B6C]" : "text-red-600"}`}>
            {message.ok ? "✓" : "✗"} {message.text}
          </span>
        )}
        <button
          onClick={save}
          disabled={saving}
          className="bg-[#171136] hover:bg-[#251c4a] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <IconRefresh className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <IconCheck className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
