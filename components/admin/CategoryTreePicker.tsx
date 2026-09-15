"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { Category } from "../productData";
import { IconChevronDown, IconSearch } from "../icons";

type TreeRow = Category & { depth: number };

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

// Walks a node's parent chain up to its top-level ancestor. Used to keep
// Product.category (the legacy free-text top-level bucket, still relied on
// by shop filters/section colors) in sync when a nested category is picked.
export function findRootCategoryId(categories: Category[], id: string): string {
  const byId = new Map(categories.map((c) => [c.id, c]));
  let node = byId.get(id);
  if (!node) return id;
  const seen = new Set<string>();
  while (node.parent && !seen.has(node.id)) {
    seen.add(node.id);
    const parent = byId.get(node.parent);
    if (!parent) break;
    node = parent;
  }
  return node.id;
}

interface CategoryTreePickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
}

export default function CategoryTreePicker({ categories, value, onChange, placeholder = "Select Category" }: CategoryTreePickerProps) {
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

  const tree = useMemo(() => buildOrderedTree(categories), [categories]);
  const filtered = useMemo(() => {
    if (!query.trim()) return tree;
    const q = query.trim().toLowerCase();
    return tree.filter((c) => c.label.toLowerCase().includes(q));
  }, [tree, query]);

  const selected = categories.find((c) => c.id === value);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-left text-xs font-semibold focus:outline-none focus:border-[#FF4D6D] transition-all cursor-pointer"
      >
        <span className={selected ? "text-[#171136]" : "text-[#8A84A6] font-medium"}>
          {selected ? selected.label : placeholder}
        </span>
        <IconChevronDown className={`w-3.5 h-3.5 text-[#8A84A6] transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full bg-white border border-[#EAE3F7] rounded-2xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-[#F0EBF8]">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#EAE3F7]">
              <IconSearch className="w-3.5 h-3.5 text-[#8A84A6] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-xs focus:outline-none"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
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
                    value === c.id ? "bg-[#FFF1F4] text-[#FF4D6D] font-bold" : "text-[#171136] hover:bg-[#FAF8FE] font-medium"
                  }`}
                  style={{ paddingLeft: `${12 + c.depth * 14}px` }}
                >
                  {c.depth > 0 && <span className="text-[#8A84A6] mr-1">{"—".repeat(c.depth)}</span>}
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
