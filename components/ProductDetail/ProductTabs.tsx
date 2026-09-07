"use client";

import { useState } from "react";
import { IconCheck, IconStar } from "../icons";
import type { Product } from "../productData";

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");

  const reviewsList = product.reviews_list || [
    {
      id: 1,
      author: "Alex M.",
      rating: 5,
      comment: "Incredible quality and fast shipping. Highly recommended product!",
      date: "August 2026",
    },
    {
      id: 2,
      author: "Sarah T.",
      rating: 5,
      comment: "Arrived in 48 hours in pristine condition. Exactly as described.",
      date: "July 2026",
    },
    {
      id: 3,
      author: "Kenji R.",
      rating: 4,
      comment: "Great quality materials and packaging. Very satisfied with this purchase.",
      date: "July 2026",
    },
  ];

  return (
    <div className="mt-10 sm:mt-14">
      {/* ------------------------------------------------------------- */}
      {/* Tab Header Controls */}
      {/* ------------------------------------------------------------- */}
      <div className="flex border-b border-[#EAE3F7] gap-4 sm:gap-8 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("description")}
          className={`pb-3.5 font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base transition-all relative cursor-pointer ${
            activeTab === "description" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
          }`}
        >
          Description
          {activeTab === "description" && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF4D6D] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3.5 font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base transition-all relative cursor-pointer ${
            activeTab === "reviews" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
          }`}
        >
          Reviews ({product.reviews || 128})
          {activeTab === "reviews" && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF4D6D] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={`pb-3.5 font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base transition-all relative cursor-pointer ${
            activeTab === "shipping" ? "text-[#171136]" : "text-[#736E9B] hover:text-[#171136]"
          }`}
        >
          Shipping & Returns
          {activeTab === "shipping" && (
            <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF4D6D] rounded-full" />
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: DESCRIPTION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "description" && (
        <div className="pt-6 sm:pt-8 space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136] tracking-tight mb-3">
              About this product
            </h2>
            <div className="text-xs sm:text-sm text-[#3B3468] leading-relaxed space-y-3 max-w-4xl font-normal">
              <p>
                {product.description ||
                  `${product.name} is crafted with precision and premium quality materials. Each piece is thoroughly inspected to ensure top-notch finish and durability before delivery.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: REVIEWS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "reviews" && (
        <div className="pt-6 sm:pt-8 animate-in fade-in space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                Verified Collector Reviews
              </h2>
              <p className="text-xs text-[#736E9B]">Rated {product.rating || 4.8} / 5 by verified buyers</p>
            </div>
            <button className="bg-[#171136] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#251c4a] transition-all">
              Write a Review
            </button>
          </div>

          <div className="space-y-3">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-[#F8F6FD]/60 border border-[#EAE3F7]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-[#171136]">{rev.author}</span>
                  <span className="text-[11px] text-[#736E9B]">{rev.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className="w-3.5 h-3.5" filled={i < rev.rating} />
                  ))}
                </div>
                <p className="text-xs text-[#3B3468]">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: SHIPPING & RETURNS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "shipping" && (
        <div className="pt-6 sm:pt-8 animate-in fade-in space-y-4 max-w-3xl text-xs sm:text-sm text-[#3B3468]">
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
            Shipping & Return Guarantee
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC]">
              <h3 className="font-bold text-sm text-[#171136] mb-1">🚀 Fast 48-Hour Dispatch</h3>
              <p className="text-xs text-[#736E9B]">
                All in-stock collector items ship within 48 hours with signature on delivery and custom bubble corner protection.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC]">
              <h3 className="font-bold text-sm text-[#171136] mb-1">🛡️ 7-Day Collector Guarantee</h3>
              <p className="text-xs text-[#736E9B]">
                Unopened mint condition box returns accepted within 7 days. Full refunds or replacements guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
