"use client";

import { useMemo, useState } from "react";
import type { Product } from "../productData";
import { IconClose, IconPlus, IconSearch } from "../icons";

export type BundleLine = { childId: string; quantity: number };

const MAX_LINES = 50;

export function parsePrice(text?: string | null): number {
  const n = parseFloat((text || "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const money = (n: number) => `৳${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export default function ProductBundleBuilder({
  products,
  lines,
  onChange,
  excludeId,
  bundlePrice,
  onUseTotalAsRegularPrice,
}: {
  products: Product[];
  lines: BundleLine[];
  onChange: (lines: BundleLine[]) => void;
  excludeId?: string;
  bundlePrice: number;
  onUseTotalAsRegularPrice: (total: number) => void;
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const candidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    const used = new Set(lines.map((l) => l.childId));
    return products
      .filter((p) => p.productType !== "grouped" && p.id !== excludeId && !used.has(p.id))
      .filter((p) => !q || p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q))
      .slice(0, 8);
  }, [products, lines, query, excludeId]);

  const rows = lines.map((line) => ({ line, product: byId.get(line.childId) }));
  const itemsValue = rows.reduce(
    (sum, { line, product }) => sum + parsePrice(product?.discountedPrice || product?.price) * line.quantity,
    0
  );
  const bundlesAvailable = rows.length
    ? Math.min(...rows.map(({ line, product }) => Math.floor((product?.stock ?? 0) / line.quantity)))
    : 0;
  const savings = itemsValue - bundlePrice;

  const add = (id: string) => {
    if (lines.length >= MAX_LINES) return;
    onChange([...lines, { childId: id, quantity: 1 }]);
    setQuery("");
  };
  const setQty = (id: string, quantity: number) =>
    onChange(lines.map((l) => (l.childId === id ? { ...l, quantity: Math.max(1, Math.floor(quantity) || 1) } : l)));
  const remove = (id: string) => onChange(lines.filter((l) => l.childId !== id));

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#736E9B]">
        Pick existing simple products and how many of each go into one bundle. When a customer buys the bundle, that
        quantity is taken from each product&apos;s own stock.
      </p>

      <div className="relative">
        <label className="font-bold text-xs text-[#171136] mb-1.5 block">Add a product to the bundle</label>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus-within:bg-white focus-within:border-[#FF4D6D] transition-all">
          <IconSearch className="w-4 h-4 text-[#8A84A6] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search by name or SKU..."
            className="w-full bg-transparent text-xs font-semibold text-[#171136] focus:outline-none"
          />
        </div>

        {focused && (
          <div className="absolute z-20 left-0 right-0 mt-1.5 bg-white border border-[#EAE3F7] rounded-2xl shadow-lg overflow-hidden max-h-72 overflow-y-auto">
            {candidates.length === 0 ? (
              <p className="text-xs text-[#8A84A6] px-4 py-4 text-center">
                {query ? "No matching simple products." : "No more simple products to add."}
              </p>
            ) : (
              candidates.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(p.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-[#F6F1FF] text-left cursor-pointer transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover bg-[#F6F1FF] shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-[#171136] truncate">{p.name}</span>
                    <span className="block text-[10.5px] text-[#8A84A6]">
                      {p.sku || p.id} · {p.stock ?? 0} in stock
                    </span>
                  </span>
                  <span className="text-xs font-extrabold text-[#FF4D6D] shrink-0">{p.discountedPrice || p.price}</span>
                  <IconPlus className="w-4 h-4 text-[#7B5CFF] shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#D9CEEE] py-8 text-center">
          <p className="text-xs font-bold text-[#171136]">No products in this bundle yet</p>
          <p className="text-[11px] text-[#8A84A6] mt-1">Search above and add at least one product.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rows.map(({ line, product }) => {
            const stock = product?.stock ?? 0;
            const unit = parsePrice(product?.discountedPrice || product?.price);
            const short = line.quantity > stock;
            return (
              <div key={line.childId} className="flex items-center gap-3 rounded-2xl border border-[#EAE3F7] px-3 py-2.5 bg-[#FAF8FE]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product?.image} alt="" className="w-11 h-11 rounded-xl object-cover bg-[#F6F1FF] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#171136] truncate">{product?.name || line.childId}</p>
                  <p className="text-[10.5px] text-[#8A84A6]">
                    {money(unit)} each · {stock} in stock
                  </p>
                  {short && (
                    <p className="text-[10.5px] font-bold text-[#E8590C]">
                      Only {stock} in stock - this bundle can&apos;t be sold until you restock.
                    </p>
                  )}
                </div>
                <div className="inline-flex items-center rounded-xl bg-white border border-[#EAE3F7] shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(line.childId, line.quantity - 1)}
                    disabled={line.quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 text-[#171136] hover:bg-[#F6F1FF] disabled:opacity-30 rounded-l-xl cursor-pointer disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) => setQty(line.childId, Number(e.target.value))}
                    className="w-10 h-8 text-center text-xs font-extrabold text-[#171136] bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQty(line.childId, line.quantity + 1)}
                    aria-label="Increase quantity"
                    className="w-8 h-8 text-[#171136] hover:bg-[#F6F1FF] rounded-r-xl cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="w-20 text-right text-xs font-extrabold text-[#171136] shrink-0">
                  {money(unit * line.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(line.childId)}
                  title="Remove from bundle"
                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <IconClose className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          <div className="rounded-2xl bg-[#F6F1FF] px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#736E9B]">Items value</p>
              <p className="text-base font-extrabold text-[#171136]">{money(itemsValue)}</p>
              <button
                type="button"
                onClick={() => onUseTotalAsRegularPrice(itemsValue)}
                className="text-[11px] font-bold text-[#7B5CFF] hover:underline cursor-pointer"
              >
                Use as regular price
              </button>
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#736E9B]">Customer saves</p>
              <p className={`text-base font-extrabold ${savings > 0 ? "text-[#1E9B6C]" : "text-[#8A84A6]"}`}>
                {savings > 0 ? money(savings) : "—"}
              </p>
              <p className="text-[11px] text-[#8A84A6]">vs. buying the items separately</p>
            </div>
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wide text-[#736E9B]">Bundles available</p>
              <p className={`text-base font-extrabold ${bundlesAvailable > 0 ? "text-[#171136]" : "text-[#E8590C]"}`}>
                {bundlesAvailable}
              </p>
              <p className="text-[11px] text-[#8A84A6]">limited by the scarcest item</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
