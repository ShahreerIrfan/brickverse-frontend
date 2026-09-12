"use client";

import Link from "next/link";
import Image from "next/image";
import { IconHeart, IconBag, IconStar } from "./icons";
import type { Product } from "./productData";
import { useCart } from "@/context/CartContext";
import { getMediaUrl } from "@/lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const ratingVal = product.rating ?? 5.0;
  const fullStars = Math.round(ratingVal);
  const regularPrice = product.regularPrice || product.originalPrice;
  const discountedPrice = product.discountedPrice || product.price;
  const discountPercent = product.discountPercent || (() => {
    if (!regularPrice || !discountedPrice) return null;
    const reg = parseFloat(regularPrice.replace(/[^\d.]/g, ""));
    const disc = parseFloat(discountedPrice.replace(/[^\d.]/g, ""));
    if (reg > disc && disc > 0) return Math.round(((reg - disc) / reg) * 100);
    return null;
  })();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, true);
  };

  const imageSrc = getMediaUrl(product.image || product.image_file);

  return (
    <div className="relative bg-white border border-[#EAE3F7] rounded-2xl sm:rounded-3xl shadow-[0_16px_0_-6px_rgba(23,17,54,0.09)] overflow-hidden flex flex-col group transition-transform hover:-translate-y-1">
      <Link
        href={`/product/${product.slug || product.id}`}
        className="relative h-[130px] sm:h-[220px] flex items-center justify-center p-3"
        style={{ backgroundColor: product.cardBg || "#FFEAF0" }}
      >
        {discountPercent ? (
          <span
            className="absolute left-2.5 sm:left-5 top-2.5 sm:top-4 -rotate-6 text-white text-[9px] sm:text-[11px] font-extrabold tracking-wide rounded-full px-2 sm:px-3 py-1 sm:py-1.5 z-10 bg-[#FF4D6D] shadow-xs"
          >
            -{discountPercent}%
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Add to wishlist"
          className="absolute right-2.5 sm:left-auto right-2.5 sm:right-5 top-2.5 sm:top-4 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white flex items-center justify-center z-10 text-[#736E9B] hover:text-[#FF4D6D] transition-colors shadow-xs cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <IconHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <Image
          src={imageSrc}
          alt={product.name}
          width={140}
          height={170}
          className="w-auto h-auto max-h-[110px] sm:max-h-[180px] max-w-[85%] object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
        />
      </Link>

      <div className="p-2.5 sm:p-6 flex flex-col flex-1 justify-between">
        <div>
          <span
            className="text-[8.5px] sm:text-[10.5px] font-bold tracking-wide"
            style={{ color: product.categoryColor || "#FF4D6D" }}
          >
            {product.category.toUpperCase()}
          </span>
          <Link
            href={`/product/${product.slug || product.id}`}
            className="font-[family-name:var(--font-display)] font-extrabold text-[12.5px] sm:text-[17px] text-[#171136] mt-1 sm:mt-1.5 block hover:text-[#FF4D6D] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 sm:mt-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" filled={i < fullStars} />
          ))}
          <span className="text-[9px] sm:text-[11.5px] font-medium text-[#736E9B] ml-0.5 sm:ml-1">
            {ratingVal.toFixed(1)}
          </span>
        </div>

        <div className="border-t border-[#EAE3F7] mt-2 sm:mt-4 pt-2 sm:pt-4 flex items-center justify-between gap-1">
          <div className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-[14px] sm:text-[21px] text-[#171136] truncate">
              {discountedPrice}
            </span>
            {regularPrice && regularPrice !== discountedPrice && (
              <span className="hidden sm:inline text-[12.5px] font-medium text-[#736E9B] line-through">
                {regularPrice}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to bag`}
            className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            style={{ backgroundColor: product.accent || "#FF4D6D" }}
          >
            <IconBag className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
