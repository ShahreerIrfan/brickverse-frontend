"use client";

import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-20 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6 animate-pulse">
          <div className="w-12 h-3 rounded bg-[#EAE3F7]" />
          <div className="w-3 h-3 text-[#C8BFDF]">/</div>
          <div className="w-16 h-3 rounded bg-[#EAE3F7]" />
          <div className="w-3 h-3 text-[#C8BFDF]">/</div>
          <div className="w-24 h-3 rounded bg-[#EAE3F7]" />
        </div>

        {/* 2-Column Hero: Gallery (Left) + Buy Box (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Gallery Skeleton */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 animate-pulse">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-[#EAE3F7] p-1 flex items-center justify-center">
                  <div className="w-full h-full rounded-xl bg-[#F0EBF8]" />
                </div>
              ))}
            </div>

            {/* Main Showcase Image Card */}
            <div className="flex-1 aspect-square rounded-[26px] bg-white border border-[#EAE3F7] p-6 flex items-center justify-center relative overflow-hidden shadow-xs">
              <div className="w-48 h-48 rounded-3xl bg-[#F4F0FA]" />
              <div className="absolute left-6 top-6 w-16 h-6 rounded-full bg-[#FF4D6D]/20" />
              <div className="absolute right-6 top-6 w-10 h-10 rounded-full bg-[#EAE3F7]" />
            </div>
          </div>

          {/* Buy Box Skeleton */}
          <div className="bg-white border border-[#EAE3F7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-5 animate-pulse">
            <div className="space-y-3">
              <div className="w-24 h-4 rounded-full bg-[#FF4D6D]/20" />
              <div className="w-4/5 h-8 rounded-xl bg-[#EAE3F7]" />
              <div className="w-32 h-3.5 rounded-md bg-[#F0EBF8]" />
              <div className="flex items-center gap-2">
                <div className="w-24 h-4 rounded-full bg-[#F0EBF8]" />
                <div className="w-16 h-4 rounded-full bg-[#F0EBF8]" />
              </div>
            </div>

            <hr className="border-[#F0EBF8]" />

            {/* Price Row */}
            <div className="flex items-baseline gap-3">
              <div className="w-32 h-10 rounded-2xl bg-[#EAE3F7]" />
              <div className="w-20 h-6 rounded-xl bg-[#F0EBF8]" />
              <div className="w-20 h-6 rounded-full bg-[#FF4D6D]/20" />
            </div>

            {/* Quantity Selector & Buttons */}
            <div className="space-y-3 pt-2">
              <div className="w-28 h-10 rounded-2xl bg-[#F4F0FA]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="h-12 rounded-2xl bg-[#FF4D6D]/40" />
                <div className="h-12 rounded-2xl bg-[#171136]/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Shelf Skeleton */}
        <div className="mt-14 sm:mt-20 space-y-6">
          <div className="space-y-1.5 animate-pulse">
            <div className="w-28 h-3.5 rounded-full bg-[#FF4D6D]/20" />
            <div className="w-48 h-7 rounded-xl bg-[#EAE3F7]" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
