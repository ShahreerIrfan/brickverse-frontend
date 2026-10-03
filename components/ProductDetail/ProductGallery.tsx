"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IconHeart } from "../icons";
import type { Product } from "../productData";
import { useWishlist } from "@/context/WishlistContext";
import { getMediaUrl } from "@/lib/api";

interface ProductGalleryProps {
  product: Product;
}

export default function ProductGallery({ product }: ProductGalleryProps) {
  const [activeThumb, setActiveThumb] = useState(0);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id || product.slug);

  // High-performance hardware-accelerated Hover Zoom State (Direct DOM refs + RAF, 0 re-render lag)
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const zoomImgRef = useRef<HTMLImageElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const rectRef = useRef<DOMRect | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const LENS_WIDTH = 180;
  const LENS_HEIGHT = 180;

  const updateRect = () => {
    if (imageContainerRef.current) {
      rectRef.current = imageContainerRef.current.getBoundingClientRect();
    }
  };

  const applyZoomTransform = (clientX: number, clientY: number) => {
    if (!rectRef.current) updateRect();
    const rect = rectRef.current;
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const halfW = LENS_WIDTH / 2;
    const halfH = LENS_HEIGHT / 2;
    const maxLensX = Math.max(0, rect.width - LENS_WIDTH);
    const maxLensY = Math.max(0, rect.height - LENS_HEIGHT);

    const clampedX = Math.max(0, Math.min(x - halfW, maxLensX));
    const clampedY = Math.max(0, Math.min(y - halfH, maxLensY));

    const scaleX = rect.width / LENS_WIDTH;
    const scaleY = rect.height / LENS_HEIGHT;

    const zoomX = clampedX * scaleX;
    const zoomY = clampedY * scaleY;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (lensRef.current) {
        lensRef.current.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0)`;
      }
      if (zoomImgRef.current) {
        zoomImgRef.current.style.transform = `translate3d(-${zoomX}px, -${zoomY}px, 0)`;
      }
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    updateRect();
    setIsHovering(true);
    applyZoomTransform(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) {
      updateRect();
      setIsHovering(true);
    }
    applyZoomTransform(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
  };

  // Immediate detection if mouse is already inside upon navigation + resize/scroll bounds caching
  useEffect(() => {
    updateRect();

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!imageContainerRef.current) return;
      const rect = rectRef.current || imageContainerRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        if (!isHovering) setIsHovering(true);
        applyZoomTransform(e.clientX, e.clientY);
      } else if (isHovering) {
        setIsHovering(false);
      }
    };

    const handleScrollOrResize = () => updateRect();

    window.addEventListener("mousemove", handleGlobalMouseMove, { passive: true });
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isHovering]);

  // Deduplicate and resolve primary + gallery images
  const rawPrimary = getMediaUrl(product.image || product.image_file);
  const isPlaceholder = !rawPrimary || rawPrimary.includes("figure-samurai-red.svg");

  const galleryItems = (product.gallery_images || [])
    .map((g, idx) => ({
      type: "image" as const,
      src: getMediaUrl(g.imageUrl || g.image_url),
      label: `Gallery ${idx + 1}`,
      bg: "#F4F1FD",
    }))
    .filter((g) => g.src && g.src !== "");

  // Build clean thumbs list without duplicates
  const allImages: { type: string; src: string; label: string; bg: string }[] = [];

  if (!isPlaceholder && rawPrimary) {
    allImages.push({
      type: "image",
      src: rawPrimary,
      label: "Primary View",
      bg: product.cardBg || "#FFEAF0",
    });
  }

  galleryItems.forEach((item) => {
    if (!allImages.some((existing) => existing.src === item.src)) {
      allImages.push({
        ...item,
        label: allImages.length === 0 ? "Primary View" : `View ${allImages.length + 1}`,
      });
    }
  });

  // Fallback if no images exist at all
  if (allImages.length === 0) {
    allImages.push({
      type: "image",
      src: rawPrimary || "/images/figure-samurai-red.svg",
      label: "Primary View",
      bg: product.cardBg || "#FFEAF0",
    });
  }

  const thumbs = allImages;
  const currentImageSrc = thumbs[activeThumb]?.src || thumbs[0]?.src;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start relative">
      {/* ------------------------------------------------------------- */}
      {/* Left Vertical Thumbnail Rail */}
      {/* ------------------------------------------------------------- */}
      <div className="flex md:flex-col gap-2.5 sm:gap-3 overflow-x-auto md:overflow-visible w-full md:w-[88px] pb-2 md:pb-0 shrink-0">
        {thumbs.map((thumb, idx) => (
          <button
            key={idx}
            onClick={() => setActiveThumb(idx)}
            aria-label={`Select product preview ${idx + 1}: ${thumb.label}`}
            className={`w-[70px] h-[70px] sm:w-[84px] sm:h-[84px] lg:w-[88px] lg:h-[88px] rounded-[18px] flex items-center justify-center relative overflow-hidden transition-all shrink-0 cursor-pointer p-1.5 ${
              activeThumb === idx
                ? "border-[2.4px] border-[#FF4D6D] shadow-md scale-[1.02]"
                : "border border-[#EAE3F7] hover:border-[#736E9B]/50"
            } bg-white`}
          >
            <div className="relative w-full h-full">
              <Image
                src={thumb.src}
                alt={thumb.label}
                fill
                sizes="88px"
                className="object-contain transition-transform group-hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Main Showcase Hero Display Card with Hover Zoom */}
      {/* ------------------------------------------------------------- */}
      <div className="relative w-full max-w-[560px] aspect-square select-none">
        <div
          ref={imageContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="relative w-full h-full rounded-[26px] overflow-hidden flex items-center justify-center shadow-[0_8px_24px_rgba(23,17,54,0.04)] border border-[#EAE3F7] bg-white cursor-crosshair"
        >
          {/* Top-Left Discount Badge */}
          {product.discountPercent ? (
            <div className="absolute left-4 sm:left-6 top-4 sm:top-6 -rotate-8 z-20 pointer-events-none">
              <span className="bg-[#FF4D6D] text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-md inline-block">
                {product.discountPercent}% OFF
              </span>
            </div>
          ) : product.badge ? (
            <div className="absolute left-4 sm:left-6 top-4 sm:top-6 -rotate-8 z-20 pointer-events-none">
              <span className="bg-[#FF4D6D] text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-full shadow-md inline-block">
                {product.badge.replace(/^-(\d+%)$/, "$1 OFF")}
              </span>
            </div>
          ) : null}

          {/* Top-Right Action Floating Buttons */}
          <div className="absolute right-4 sm:right-6 top-4 sm:top-6 flex flex-col gap-2 z-30">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product.id || product.slug, product.name);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#736E9B] hover:text-[#FF4D6D] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#EAE3F7]"
            >
              <IconHeart className={`w-5 h-5 ${isWishlisted ? "text-[#FF4D6D] fill-[#FF4D6D]" : ""}`} />
            </button>
          </div>

          {/* Active Product Artwork Preview */}
          <div className="relative w-full h-full p-2 sm:p-4 z-0 flex items-center justify-center pointer-events-none">
            <Image
              src={currentImageSrc}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-contain"
            />
          </div>

          {/* Hover Zoom Lens (Hardware-accelerated transform) */}
          <div
            ref={lensRef}
            className={`hidden lg:block absolute left-0 top-0 pointer-events-none border-2 border-[#FF4D6D] bg-[#FF4D6D]/15 rounded-xl z-20 shadow-xs transition-opacity duration-150 ${
              isHovering ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              width: `${LENS_WIDTH}px`,
              height: `${LENS_HEIGHT}px`,
              willChange: "transform",
            }}
          />
        </div>

        {/* Zoomed-in High-Res Preview Window on Desktop (Hardware-accelerated GPU translate) */}
        <div
          className={`hidden lg:block absolute left-[calc(100%+20px)] top-0 w-[480px] h-[480px] xl:w-[560px] xl:h-[560px] z-50 bg-white border border-[#EAE3F7] rounded-[26px] shadow-[0_20px_50px_-10px_rgba(23,17,54,0.18)] overflow-hidden pointer-events-none transition-opacity duration-150 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={zoomImgRef}
            src={currentImageSrc}
            alt={product.name}
            className="absolute left-0 top-0 max-w-none pointer-events-none"
            style={{
              width: "311.11%",
              height: "311.11%",
              objectFit: "contain",
              willChange: "transform",
            }}
          />
          <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-xs text-[#736E9B] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#EAE3F7] shadow-xs z-10">
            High-Res Zoom
          </div>
        </div>
      </div>
    </div>
  );
}
