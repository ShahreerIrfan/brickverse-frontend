"use client";

import { useEffect, useState } from "react";
import type { BlogBlock } from "@/lib/blogTypes";
import type { Product } from "@/components/productData";
import ProductCard from "@/components/ProductCard";
import { getAllProducts } from "@/lib/api";

export default function ProductGridBlock({ block }: { block: BlogBlock }) {
  const title: string = block.data?.title || "";
  const productIds: string[] = Array.isArray(block.data?.productIds) ? block.data.productIds : [];
  const productIdsKey = productIds.join(",");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(productIds.length > 0);

  useEffect(() => {
    if (!productIdsKey) return;
    let active = true;
    (async () => {
      const ids = productIdsKey.split(",");
      const all: Product[] = await getAllProducts();
      if (!active) return;
      const idSet = new Set(ids.map(String));
      const matched = (all || []).filter((p) => idSet.has(String(p.id)) || idSet.has(String(p.slug)));
      matched.sort((a, b) => ids.indexOf(String(a.id)) - ids.indexOf(String(b.id)));
      setProducts(matched);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [productIdsKey]);

  if (!loading && products.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-0">
      {title && (
        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-2xl text-[#171136] mb-3 sm:mb-5 tracking-tight">
          {title}
        </h3>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
