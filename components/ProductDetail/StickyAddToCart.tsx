"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { IconBag, IconStar, IconCheck } from "../icons";
import type { Product } from "../productData";

interface StickyAddToCartProps {
  product: Product;
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past ~480px
      if (window.scrollY > 480) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdd = () => {
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE3F7] shadow-lg transition-transform duration-300 animate-in slide-in-from-top">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[100px] h-20 flex items-center justify-between gap-4">
        {/* Product Brief (Thumb + Name + Rating) */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border border-[#EAE3F7]/80"
            style={{ backgroundColor: product.cardBg || "#FFEAF0" }}
          >
            <Image
              src={product.image}
              alt={product.name}
              width={40}
              height={40}
              className="w-8 sm:w-10 h-auto object-contain"
            />
          </div>

          <div className="min-w-0">
            <h4 className="font-[family-name:var(--font-display)] font-extrabold text-xs sm:text-sm lg:text-base text-[#171136] truncate leading-tight">
              {product.name}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="hidden sm:inline text-[11.5px] font-mono text-[#736E9B] font-bold truncate">
                {product.sku || product.id}
              </span>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3" filled={i < Math.floor(product.rating || 5)} />
                ))}
                <span className="text-[10px] text-[#736E9B] font-semibold ml-0.5">
                  {(product.rating || 4.8).toFixed(1)} ({product.reviews || 128})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Action CTA Stepper */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="text-right">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-xl text-[#171136] block leading-none">
              {product.discountedPrice || product.price}
            </span>
            {(product.regularPrice || product.originalPrice) && (
              <span className="hidden md:inline text-[11px] text-[#736E9B] font-medium line-through">
                {product.regularPrice || product.originalPrice}
              </span>
            )}
          </div>

          {/* Compact Stepper */}
          <div className="hidden lg:inline-flex items-center justify-between w-28 h-10 rounded-full bg-white border border-[#EAE3F7] px-2 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#171136] hover:bg-[#F6F1FF] disabled:opacity-30"
            >
              —
            </button>
            <span className="font-extrabold text-xs text-[#171136]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[#171136] hover:bg-[#F6F1FF] font-bold"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAdd}
            className="h-10 sm:h-11 px-4 sm:px-6 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            {addedToast ? (
              <>
                <IconCheck className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <IconBag className="w-3.5 h-3.5" />
                <span>Add to cart</span>
              </>
            )}
          </button>

          {/* Buy Now */}
          <button
            onClick={handleAdd}
            className="hidden sm:inline-flex h-10 sm:h-11 px-4 sm:px-5 rounded-full bg-[#171136] hover:bg-[#251c4a] text-white font-bold text-xs sm:text-sm items-center justify-center shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}
