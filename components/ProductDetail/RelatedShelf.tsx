"use client";

import Link from "next/link";
import Image from "next/image";
import { IconArrowRight, IconHeart, IconBag, IconStar } from "../icons";
import type { Product } from "../productData";
import { useCart } from "@/context/CartContext";

interface RelatedShelfProps {
  products?: Product[];
}

export default function RelatedShelf({ products = [] }: RelatedShelfProps) {
  const { addToCart } = useCart();

  if (!products || products.length === 0) {
    return null;
  }

  const displayList = products;

  return (
    <div className="mt-12 sm:mt-16">
      {/* ------------------------------------------------------------- */}
      {/* Section Header */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1 h-8 sm:h-9 rounded-full bg-[#FF4D6D] shrink-0" />
          <div>
            <span className="text-[11.5px] font-bold text-[#FF4D6D] uppercase tracking-wider block">
              Same shelf
            </span>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136] tracking-tight">
              You May Also Like
            </h3>
          </div>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#FF4D6D] hover:text-[#ff3358] transition-colors"
        >
          <span>View all items</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4-Column Responsive Grid */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {displayList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#EAE3F7] rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between group transition-all hover:-translate-y-1 hover:shadow-md"
          >
            {/* Image Wrap */}
            <Link
              href={`/product/${item.id}`}
              className="relative h-[130px] sm:h-[180px] flex items-center justify-center p-3"
              style={{ backgroundColor: item.cardBg || "#FAF8FE" }}
            >
              {item.badge && (
                <span
                  className="absolute left-3 top-3 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs"
                  style={{ backgroundColor: item.badgeColor || item.accent }}
                >
                  {item.badge}
                </span>
              )}

              <button
                type="button"
                aria-label="Add to wishlist"
                className="absolute right-3 top-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#736E9B] hover:text-[#FF4D6D] transition-colors shadow-xs cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <IconHeart className="w-3.5 h-3.5" />
              </button>

              <Image
                src={item.image}
                alt={item.name}
                width={110}
                height={130}
                className="w-[68px] sm:w-[100px] h-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Info Body */}
            <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
              <div>
                <span
                  className="text-[8.5px] sm:text-[10.5px] font-bold tracking-wide uppercase block"
                  style={{ color: item.categoryColor || item.accent }}
                >
                  {item.category}
                </span>
                <Link
                  href={`/product/${item.id}`}
                  className="font-[family-name:var(--font-display)] font-extrabold text-[13px] sm:text-base text-[#171136] mt-0.5 sm:mt-1 hover:text-[#FF4D6D] transition-colors line-clamp-1 block"
                >
                  {item.name}
                </Link>
                <p className="text-[11px] sm:text-xs text-[#736E9B] mt-0.5 line-clamp-1">
                  {item.subtitle}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStar key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" filled={i < Math.floor(item.rating ?? 5.0)} />
                    ))}
                  </div>
                  <span className="text-[9.5px] sm:text-[11px] font-medium text-[#736E9B]">
                    {(item.rating ?? 5.0).toFixed(1)} ({item.reviews ?? 0})
                  </span>
                </div>
              </div>

              {/* Price & Cart */}
              <div className="border-t border-[#EAE3F7] mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 flex items-center justify-between gap-1">
                <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-lg text-[#171136] truncate">
                    {item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="hidden sm:inline text-[11px] text-[#736E9B] line-through">
                      {item.originalPrice}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(item, 1, true)}
                  aria-label={`Add ${item.name} to bag`}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 shadow-xs hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: item.accent || "#FF4D6D" }}
                >
                  <IconBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
