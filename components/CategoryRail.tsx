"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { IconChevronRight, IconGrid, IconArrowRight } from "./icons";
import { categories as defaultCategories, Category } from "./productData";

export function CategoryGlyph({
  id,
  color,
  icon,
}: {
  id: string;
  color: string;
  icon?: string;
}) {
  const iconSrc = icon || id;

  // 1. If it's an image or SVG file path / URL
  if (
    typeof iconSrc === "string" &&
    (iconSrc.startsWith("/") ||
      iconSrc.startsWith("http://") ||
      iconSrc.startsWith("https://") ||
      iconSrc.startsWith("data:"))
  ) {
    return (
      <img
        src={iconSrc}
        alt=""
        className="w-4 h-4 object-contain shrink-0"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  const common = { fill: color };
  switch (iconSrc) {
    case "figure":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="10" r="4.6" {...common} />
          <rect x="11" y="15" width="10" height="11" rx="4" {...common} />
        </svg>
      );
    case "toon":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="10" cy="10" r="3.6" {...common} />
          <circle cx="22" cy="10" r="3.6" {...common} />
          <circle cx="16" cy="18" r="7.5" {...common} />
        </svg>
      );
    case "brick":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="7" y="14" width="18" height="10" rx="3" {...common} />
          <rect x="10" y="10" width="5" height="4" rx="2" {...common} />
          <rect x="17" y="10" width="5" height="4" rx="2" {...common} />
        </svg>
      );
    case "code":
      return (
        <span className="text-[11px] font-extrabold" style={{ color }}>
          {"</>"}
        </span>
      );
    case "robot":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="8" y="12" width="16" height="13" rx="4" {...common} />
          <circle cx="16" cy="7" r="2.4" {...common} />
          <line x1="16" y1="9" x2="16" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "model":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <path d="M16 6l6 13H10z" {...common} />
          <rect x="12" y="20" width="8" height="5" rx="2" {...common} />
        </svg>
      );
    case "plush":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="17" r="7.5" {...common} />
          <circle cx="9" cy="8" r="3.4" {...common} />
          <circle cx="23" cy="8" r="3.4" {...common} />
        </svg>
      );
    case "statue":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="9" r="4" {...common} />
          <path d="M11 14h10l3 10H8z" {...common} />
        </svg>
      );
    case "puzzle":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="7" y="9" width="18" height="14" rx="3" {...common} />
          <circle cx="16" cy="9" r="3.4" fill="#FFF6EE" />
          <circle cx="25" cy="16" r="3.4" fill="#FFF6EE" />
        </svg>
      );
    case "game":
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <rect x="7" y="9" width="18" height="14" rx="4" {...common} />
          <circle cx="12" cy="14" r="2" fill="#FFF6EE" />
          <circle cx="20" cy="18" r="2" fill="#FFF6EE" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" className="w-4 h-4">
          <circle cx="16" cy="16" r="7.5" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="16" cy="16" r="2.4" {...common} />
        </svg>
      );
  }
}

export default function CategoryRail({ initialCategories }: { initialCategories?: Category[] }) {
  const displayCategories = initialCategories && initialCategories.length > 0 ? initialCategories : defaultCategories;
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (catId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredCatId(catId);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredCatId(null);
    }, 120);
  };

  const activeCategory = displayCategories.find((c) => c.id === hoveredCatId);
  const activeSubcategories = activeCategory?.subcategories || [];

  return (
    <aside
      className="hidden lg:block w-[280px] relative shrink-0 z-30"
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white border border-[#EAE3F7] rounded-[22px] shadow-[0_16px_0_-4px_rgba(23,17,54,0.06)] overflow-hidden">
        {/* Header */}
        <div className="bg-grad-menuhead px-6 py-4 flex items-center gap-3">
          <IconGrid className="w-5 h-5 text-white" />
          <h3 className="font-[family-name:var(--font-display)] font-bold text-white text-[14.5px]">
            Browse categories
          </h3>
        </div>

        {/* Categories List */}
        <ul className="p-2.5">
          {displayCategories.length === 0 ? (
            <li className="py-8 px-4 text-center text-xs text-[#736E9B]">
              Categories will appear here once products are created.
            </li>
          ) : (
            displayCategories.map((cat) => {
              const isHovered = hoveredCatId === cat.id;
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;

              return (
                <li
                  key={cat.id}
                  onMouseEnter={() => handleMouseEnter(cat.id)}
                  className="relative"
                >
                  <a
                    href={`/products?category=${encodeURIComponent(cat.id)}`}
                    className={`group flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition-all ${
                      isHovered
                        ? "bg-[#F3EEFF] text-[#171136]"
                        : "hover:bg-[#FAF7FF] text-[#3B3468]"
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-transform ${
                        isHovered ? "scale-110" : ""
                      }`}
                      style={{ backgroundColor: `${cat.color}24` }}
                    >
                      <CategoryGlyph id={cat.id} color={cat.color} icon={cat.category_icon || cat.categoryIcon || cat.icon_type} />
                    </span>
                    <span
                      className={`text-[13.5px] flex-1 ${
                        isHovered ? "font-bold text-[#171136]" : "font-medium"
                      }`}
                    >
                      {cat.label}
                    </span>
                    <IconChevronRight
                      className={`w-3.5 h-3.5 transition-all ${
                        isHovered
                          ? "text-[#7B5CFF] translate-x-1 opacity-100"
                          : "text-[#736E9B] opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </a>
                </li>
              );
            })
          )}
        </ul>

        {/* Footer Link */}
        {displayCategories.length > 0 && (
          <div className="border-t border-[#EAE3F7] px-6 py-4">
            <a
              href="/products"
              className="inline-flex items-center gap-2 text-[13px] font-bold text-[#FF4D6D] hover:underline"
            >
              See all categories
              <IconArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Flyout Subcategories Mega Menu */}
      {activeCategory && activeSubcategories.length > 0 && (
        <div
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
          className="absolute left-[calc(100%+12px)] top-0 z-50 w-[340px] xl:w-[380px] bg-white/98 backdrop-blur-xl border border-[#EAE3F7] rounded-[24px] shadow-[0_20px_50px_-10px_rgba(23,17,54,0.18)] p-5 animate-in fade-in zoom-in-95 duration-150 before:absolute before:-left-4 before:top-0 before:bottom-0 before:w-4 before:content-['']"
        >
          {/* Flyout Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#F0EBF9]">
            <div className="flex items-center gap-2.5">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{ backgroundColor: `${activeCategory.color}24` }}
              >
                <CategoryGlyph id={activeCategory.id} color={activeCategory.color} icon={activeCategory.category_icon || activeCategory.categoryIcon || activeCategory.icon_type} />
              </span>
              <div>
                <h4 className="font-[family-name:var(--font-display)] font-extrabold text-[15.5px] text-[#171136] leading-tight">
                  {activeCategory.label}
                </h4>
                <p className="text-[11px] text-[#736E9B] font-medium mt-0.5">
                  Explore child collections
                </p>
              </div>
            </div>

            <span className="bg-[#FAF7FF] border border-[#EAE3F7] text-[#7B5CFF] text-[11px] font-extrabold px-2.5 py-1 rounded-full">
              {activeSubcategories.length} Subcategories
            </span>
          </div>

          {/* Subcategories List */}
          <div className="mt-3.5 flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1">
            {activeSubcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products?category=${encodeURIComponent(activeCategory.id)}&subcategory=${encodeURIComponent(sub.id)}`}
                className="group/item flex items-center justify-between px-3.5 py-2.5 rounded-[14px] bg-[#FAF7FF] hover:bg-[#F3EEFF] border border-transparent hover:border-[#7B5CFF]/25 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#7B5CFF]/60 group-hover/item:bg-[#FF4D6D] group-hover/item:scale-125 transition-all" />
                  <span className="text-[13px] font-bold text-[#171136] group-hover/item:text-[#7B5CFF] transition-colors">
                    {sub.label}
                  </span>
                </div>

                <span className="text-[11.5px] font-semibold text-[#736E9B] group-hover/item:text-[#FF4D6D] flex items-center gap-1 opacity-80 group-hover/item:opacity-100 transition-all">
                  Shop <IconChevronRight className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>

          {/* Bottom Explore Category Banner */}
          <div className="mt-4 pt-3.5 border-t border-[#F0EBF9]">
            <Link
              href={`/products?category=${encodeURIComponent(activeCategory.id)}`}
              className="flex items-center justify-between px-4 py-2.5 rounded-[14px] bg-grad-hero text-white text-xs font-bold shadow-sm hover:opacity-95 transition-opacity"
            >
              <span>View all {activeCategory.label} products</span>
              <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </aside>
  );
}
