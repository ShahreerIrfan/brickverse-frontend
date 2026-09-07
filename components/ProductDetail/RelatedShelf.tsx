"use client";

import Link from "next/link";
import Image from "next/image";
import { IconArrowRight, IconHeart, IconBag, IconStar } from "../icons";
import type { Product } from "../productData";

interface RelatedShelfProps {
  products?: Product[];
}

export default function RelatedShelf({ products = [] }: RelatedShelfProps) {
  // Default fallback related companion products matching the SVG design
  const defaultItems: Product[] = [
    {
      id: "mecha-pilot",
      category: "Anime figures",
      categoryColor: "#FF4D6D",
      name: "Mecha Pilot",
      subtitle: "Zero deluxe box set",
      image: "/images/figure-mecha-teal.svg",
      cardBg: "#FFEAF0",
      badge: "HOT",
      badgeColor: "#FF4D6D",
      rating: 4.9,
      reviews: 94,
      price: "৳58.00",
      accent: "#FF4D6D",
    },
    {
      id: "sky-ninja",
      category: "Anime figures",
      categoryColor: "#13BFC9",
      name: "Sky Ninja",
      subtitle: "Kage limited colourway",
      image: "/images/figure-ninja-gold.svg",
      cardBg: "#E4F7F8",
      badge: "-25%",
      badgeColor: "#13BFC9",
      rating: 4.6,
      reviews: 212,
      price: "৳29.50",
      originalPrice: "৳39.00",
      accent: "#13BFC9",
    },
    {
      id: "ronin-base",
      category: "Accessories",
      categoryColor: "#E8A317",
      name: "Ronin Base",
      subtitle: "Display stand · walnut",
      image: "/images/bricks-stack-navy.svg",
      cardBg: "#FFF4DA",
      badge: "ADD-ON",
      badgeColor: "#E8A317",
      rating: 4.7,
      reviews: 58,
      price: "৳18.00",
      accent: "#E8A317",
    },
    {
      id: "star-mage",
      category: "Anime figures",
      categoryColor: "#7B5CFF",
      name: "Star Mage",
      subtitle: "Luna glow-in-the-dark",
      image: "/images/figure-mage-purple.svg",
      cardBg: "#EFE9FF",
      badge: "LIMITED",
      badgeColor: "#7B5CFF",
      rating: 4.7,
      reviews: 76,
      price: "৳42.00",
      accent: "#7B5CFF",
    },
  ];

  const displayList = products.length >= 2 ? products : defaultItems;

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
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl lg:text-[27px] text-[#171136] tracking-tight leading-tight">
              Pairs well with this figure
            </h2>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-[#FF4D6D] text-[#FF4D6D] hover:bg-[#FF4D6D] hover:text-white transition-all font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-xs active:scale-95"
        >
          <span>View all</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Companion Cards Grid */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-5">
        {displayList.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white border border-[#EAE3F7] rounded-2xl sm:rounded-3xl shadow-[0_16px_0_-6px_rgba(23,17,54,0.09)] overflow-hidden flex flex-col transition-transform hover:-translate-y-1"
          >
            {/* Image Box */}
            <Link
              href={`/product/${item.id}`}
              className="relative h-[130px] sm:h-[180px] lg:h-[200px] flex items-center justify-center p-3"
              style={{ backgroundColor: item.cardBg || "#FFEAF0" }}
            >
              {item.badge && (
                <span
                  className="absolute left-2.5 sm:left-4 top-2.5 sm:top-4 -rotate-6 text-white text-[9px] sm:text-[11px] font-extrabold tracking-wide rounded-full px-2 sm:px-3 py-0.5 sm:py-1 z-10"
                  style={{ backgroundColor: item.badgeColor || item.accent }}
                >
                  {item.badge}
                </span>
              )}

              <button
                type="button"
                aria-label="Add to wishlist"
                className="absolute right-2.5 sm:right-4 top-2.5 sm:top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#736E9B] hover:text-[#FF4D6D] transition-colors z-10"
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

                <Link
                  href={`/product/${item.id}`}
                  aria-label={`View ${item.name}`}
                  className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90"
                  style={{ backgroundColor: item.accent }}
                >
                  <IconBag className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
