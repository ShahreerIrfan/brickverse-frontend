"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconChevronRight, IconArrowLeft } from "../icons";
import type { Product } from "../productData";

interface ProductBreadcrumbProps {
  product: Product;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const router = useRouter();
  const path = product.categoryPath && product.categoryPath.length > 0
    ? product.categoryPath
    : product.category
      ? [{ id: product.category, label: product.category, slug: product.category }]
      : [];

  // Each ancestor links back to the shop filtered down to that level: the
  // top-level category as "category", everything under it as "subcategory".
  const hrefFor = (index: number) => {
    const top = path[0];
    if (index === 0) return `/shop?category=${encodeURIComponent(top.slug || top.id)}`;
    const node = path[index];
    return `/shop?category=${encodeURIComponent(top.slug || top.id)}&subcategory=${encodeURIComponent(node.slug || node.id)}`;
  };

  const lastLabel = path[path.length - 1]?.label;
  const backHref = path.length > 0 ? hrefFor(path.length - 1) : "/shop";

  // Browser back button already returns to wherever the visitor came from;
  // this link mirrors that for a mouse click, falling back to the shop
  // filtered to this product's category when there's no history to go back to.
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(backHref);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 text-xs sm:text-[13px] border-b border-[#EAE3F7]/80 flex-wrap gap-2">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-[#736E9B] overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-[#FF4D6D] transition-colors font-medium">
          Home
        </Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA] shrink-0" />
        <Link href="/shop" className="hover:text-[#FF4D6D] transition-colors font-medium">
          Shop
        </Link>
        {path.map((node, i) => (
          <span key={node.id} className="flex items-center gap-1.5 sm:gap-2">
            <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA] shrink-0" />
            <Link href={hrefFor(i)} className="hover:text-[#FF4D6D] transition-colors font-medium">
              {node.label}
            </Link>
          </span>
        ))}
        <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA] shrink-0" />
        <span className="font-extrabold text-[#171136] truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      <a
        href={backHref}
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736E9B] hover:text-[#FF4D6D] transition-colors shrink-0"
      >
        <IconArrowLeft className="w-3.5 h-3.5" />
        <span>Back to {(lastLabel || "shop").toLowerCase()}</span>
      </a>
    </div>
  );
}
