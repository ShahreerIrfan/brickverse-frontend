"use client";

import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function HomeSkeleton() {
  return (
    <div className="flex flex-col flex-1 bg-[#FFF6EE] pb-16 lg:pb-0 min-h-screen">
      <Navbar />
      <NavLinks />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col gap-5 sm:gap-10">
        {/* Top Section: Category Rail + Hero & Promo Columns */}
        <div className="flex flex-col lg:flex-row items-start gap-4 sm:gap-6">
          {/* Left Category Rail Skeleton */}
          <div className="hidden lg:flex flex-col w-[280px] shrink-0 bg-white border border-[#EAE3F7] rounded-3xl p-4 shadow-xs space-y-3 animate-pulse">
            <div className="w-32 h-5 rounded-lg bg-[#EAE3F7] mb-2" />
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                <div className="w-8 h-8 rounded-xl bg-[#F0EBF8] shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="w-24 h-3.5 rounded-md bg-[#EAE3F7]" />
                  <div className="w-14 h-2.5 rounded-md bg-[#F0EBF8]" />
                </div>
              </div>
            ))}
          </div>

          {/* Right Hero & Promo Banner Skeleton */}
          <div className="flex-1 w-full min-w-0 flex flex-col gap-3 sm:gap-4">
            {/* Hero Banner Box Skeleton */}
            <div className="w-full h-[240px] sm:h-[340px] lg:h-[420px] rounded-3xl bg-gradient-to-br from-[#EAE3F7] via-[#F4F0FA] to-[#EAE3F7] relative overflow-hidden flex items-center p-6 sm:p-10 animate-pulse">
              <div className="space-y-3 sm:space-y-4 max-w-md">
                <div className="w-24 sm:w-32 h-4 sm:h-5 rounded-full bg-white/70" />
                <div className="w-48 sm:w-80 h-8 sm:h-12 rounded-2xl bg-white/80" />
                <div className="w-36 sm:w-56 h-4 sm:h-6 rounded-lg bg-white/60" />
                <div className="w-28 sm:w-36 h-9 sm:h-12 rounded-full bg-[#FF4D6D]/40 mt-2" />
              </div>
            </div>

            {/* Promo 2-Columns Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="h-28 sm:h-36 rounded-2xl bg-white border border-[#EAE3F7] p-4 flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-[#F0EBF8] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 rounded-md bg-[#EAE3F7]" />
                  <div className="w-1/2 h-3 rounded-md bg-[#F0EBF8]" />
                </div>
              </div>
              <div className="h-28 sm:h-36 rounded-2xl bg-white border border-[#EAE3F7] p-4 flex items-center gap-4 animate-pulse">
                <div className="w-16 h-16 rounded-xl bg-[#F0EBF8] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 rounded-md bg-[#EAE3F7]" />
                  <div className="w-1/2 h-3 rounded-md bg-[#F0EBF8]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 bg-white border border-[#EAE3F7] rounded-3xl animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0EBF8] shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="w-24 h-3.5 rounded-md bg-[#EAE3F7]" />
                <div className="w-16 h-2.5 rounded-md bg-[#F0EBF8]" />
              </div>
            </div>
          ))}
        </div>

        {/* Product Grid / Shelf 1 Skeleton */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between animate-pulse">
            <div className="space-y-1.5">
              <div className="w-28 h-3.5 rounded-full bg-[#FF4D6D]/30" />
              <div className="w-48 sm:w-64 h-6 sm:h-7 rounded-xl bg-[#EAE3F7]" />
            </div>
            <div className="w-20 h-8 rounded-full bg-[#EAE3F7]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Product Grid / Shelf 2 Skeleton */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between animate-pulse">
            <div className="space-y-1.5">
              <div className="w-28 h-3.5 rounded-full bg-[#7B5CFF]/30" />
              <div className="w-48 sm:w-64 h-6 sm:h-7 rounded-xl bg-[#EAE3F7]" />
            </div>
            <div className="w-20 h-8 rounded-full bg-[#EAE3F7]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
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
