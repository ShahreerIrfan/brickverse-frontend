"use client";

import { useState } from "react";
import Image from "next/image";
import { IconHeart, IconSpark, IconZoomIn, IconClose } from "../icons";
import type { Product } from "../productData";
import { getMediaUrl } from "@/lib/api";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Available thumbnail images / angles from product data and gallery
  const primaryImg = getMediaUrl(product.image || product.image_file) || "/images/figure-samurai-red.svg";
  const galleryItems = (product.gallery_images || []).map((g, idx) => ({
    type: "image",
    src: getMediaUrl(g.imageUrl || g.image_url),
    label: `Gallery ${idx + 1}`,
    bg: "#F4F1FD",
  }));

  const thumbs = [
    { type: "image", src: primaryImg, label: "Primary View", bg: "#FFEAF0" },
    ...galleryItems,
  ];


  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setSharedToast(true);
      setTimeout(() => setSharedToast(false), 2500);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start">
      {/* ------------------------------------------------------------- */}
      {/* Left Vertical Thumbnail Rail */}
      {/* ------------------------------------------------------------- */}
      <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-visible w-full md:w-[88px] pb-2 md:pb-0 shrink-0">
        {thumbs.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setActiveThumb(idx)}
            aria-label={`Select product preview ${idx + 1}: ${thumb.label}`}
            className={`w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] lg:w-[88px] lg:h-[88px] rounded-[18px] flex flex-col items-center justify-center relative overflow-hidden transition-all shrink-0 cursor-pointer ${
              activeThumb === idx
                ? "border-[2.4px] border-[#FF4D6D] shadow-md scale-[1.02]"
                : "border border-[#EAE3F7] hover:border-[#736E9B]/50 bg-white"
            }`}
            style={{ backgroundColor: activeThumb === idx ? thumb.bg : "#FFFFFF" }}
          >
            <Image
              src={thumb.src}
              alt={thumb.label}
              width={56}
              height={56}
              className="w-[44px] sm:w-[54px] h-auto object-contain transition-transform group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Main Showcase Hero Display Card */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-[560px] h-[380px] sm:h-[480px] lg:h-[580px] rounded-[26px] overflow-hidden flex items-center justify-center select-none shadow-[0_12px_36px_rgba(23,17,54,0.06)] border border-[#EAE3F7]/80 bg-gradient-to-br from-[#FFE7EE] to-[#F3E6FF]">
        {/* Glow circles & decorative backdrop */}
        <div className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full bg-white/40 pointer-events-none" />
        <div className="absolute w-[320px] sm:w-[440px] h-[320px] sm:h-[440px] rounded-full border-2 border-white/50 pointer-events-none" />
        
        {/* Decorative sparkle stars */}
        <span className="absolute left-8 top-16 text-white/80 text-xl select-none pointer-events-none">✦</span>
        <span className="absolute right-12 bottom-20 text-white/80 text-lg select-none pointer-events-none">✦</span>

        {/* Top-Left Discount Badge */}
        <div className="absolute left-4 sm:left-6 top-4 sm:top-6 -rotate-8 z-10">
          <span className="bg-[#FF4D6D] text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-md inline-block">
            {product.discountPercent ? `-${product.discountPercent}%` : (product.badge || "-24%")}
          </span>
        </div>

        {/* Top-Right Action Floating Buttons */}
        <div className="absolute right-4 sm:right-6 top-4 sm:top-6 flex flex-col gap-2 z-10">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            aria-label="Add to wishlist"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#736E9B] hover:text-[#FF4D6D] hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <IconHeart className={`w-5 h-5 ${isWishlisted ? "text-[#FF4D6D] fill-[#FF4D6D]" : ""}`} />
          </button>
          <button
            onClick={handleShare}
            aria-label="Share product"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#736E9B] hover:text-[#7B5CFF] hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
          >
            <IconSpark className="w-5 h-5" />
          </button>
          {sharedToast && (
            <div className="absolute right-13 top-10 bg-[#171136] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in">
              Link Copied! ✓
            </div>
          )}
        </div>

        {/* Active Product Artwork Preview */}
        <div className="relative w-[180px] sm:w-[260px] lg:w-[310px] h-[220px] sm:h-[320px] lg:h-[380px] z-10 transition-transform duration-300 hover:scale-105">
          <Image
            src={thumbs[activeThumb].src}
            alt={product.name}
            fill
            priority
            className="object-contain drop-shadow-[0_20px_24px_rgba(23,17,54,0.18)]"
          />
        </div>

        {/* Bottom Interactive Toolbar (Zoom) */}
        <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-10">
          <button
            onClick={() => setZoomOpen(true)}
            className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-[#171136] font-bold text-xs sm:text-[13px] px-3.5 sm:px-4 py-2 rounded-full shadow-md backdrop-blur-sm transition-all active:scale-95 cursor-pointer"
          >
            <IconZoomIn className="w-4 h-4 text-[#171136]" />
            <span>Zoom</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Lightbox / Zoom Modal */}
      {/* ------------------------------------------------------------- */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#171136]/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div
            className="relative bg-white rounded-3xl p-6 max-w-2xl w-full flex flex-col items-center justify-center shadow-2xl animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute right-4 top-4 w-9 h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#171136] transition-colors"
            >
              <IconClose className="w-4 h-4" />
            </button>
            <h3 className="font-extrabold text-base text-[#171136] mb-1">{product.name} — High Res Gallery</h3>
            <p className="text-xs text-[#736E9B] mb-4">Hand-painted details & 1/7 collector scale</p>
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl bg-[#FFF6EE] flex items-center justify-center p-4">
              <Image
                src={thumbs[activeThumb].src}
                alt={product.name}
                fill
                className="object-contain p-4 drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
