"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="relative bg-white border border-[#EAE3F7] rounded-2xl sm:rounded-3xl shadow-[0_16px_0_-6px_rgba(23,17,54,0.09)] overflow-hidden flex flex-col animate-pulse">
      {/* Image Skeleton Box */}
      <div className="relative w-full aspect-square bg-[#FAF5FE] flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 rounded-2xl bg-[#EAE3F7]/60" />
        {/* Top-left discount badge placeholder */}
        <div className="absolute left-2.5 sm:left-4 top-2.5 sm:top-4 w-12 h-5 rounded-full bg-[#FF4D6D]/20" />
        {/* Top-right heart button placeholder */}
        <div className="absolute right-2.5 sm:right-4 top-2.5 sm:top-4 w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full bg-[#EAE3F7]/80" />
      </div>

      {/* Info Body */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-2">
          {/* Category Pill */}
          <div className="w-20 h-3 rounded-full bg-[#EAE3F7]" />
          {/* Product Title */}
          <div className="w-full h-4 rounded-md bg-[#EAE3F7]" />
          <div className="w-3/4 h-3.5 rounded-md bg-[#F0EBF8]" />
        </div>

        {/* Price & Action Button Row */}
        <div className="border-t border-[#EAE3F7] pt-2.5 flex items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="w-16 h-5 rounded-lg bg-[#EAE3F7]" />
            <div className="w-10 h-3 rounded-md bg-[#F0EBF8]" />
          </div>
          <div className="w-20 h-8 sm:h-9 rounded-full bg-[#FF4D6D]/25" />
        </div>
      </div>
    </div>
  );
}
