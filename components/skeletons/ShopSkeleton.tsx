"use client";

import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ShopSkeleton({ hideNav = false }: { hideNav?: boolean }) {
  const content = (
    <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-6">
      {/* Top Shop Banner / Header */}
      <div className="bg-white border border-[#EAE3F7] rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="w-24 h-3.5 rounded-full bg-[#F0EBF8]" />
          <div className="w-48 sm:w-64 h-7 sm:h-8 rounded-xl bg-[#EAE3F7]" />
          <div className="w-36 h-3.5 rounded-md bg-[#F0EBF8]" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-9 rounded-2xl bg-[#F4F0FA]" />
          <div className="w-32 h-9 rounded-2xl bg-[#F4F0FA]" />
        </div>
      </div>

      {/* Main Catalog 2-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Filter Sidebar Skeleton (Desktop) */}
        <div className="hidden lg:flex flex-col w-[260px] shrink-0 bg-white border border-[#EAE3F7] rounded-3xl p-5 shadow-xs space-y-6 animate-pulse">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBF8]">
            <div className="w-20 h-5 rounded-lg bg-[#EAE3F7]" />
            <div className="w-12 h-3.5 rounded-md bg-[#F0EBF8]" />
          </div>

          {/* Categories List Skeleton */}
          <div className="space-y-2.5">
            <div className="w-24 h-3.5 rounded-md bg-[#EAE3F7] mb-2" />
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="w-28 h-3.5 rounded-md bg-[#F0EBF8]" />
                <div className="w-6 h-3.5 rounded-md bg-[#F0EBF8]" />
              </div>
            ))}
          </div>

          {/* Price Filter Skeleton */}
          <div className="space-y-3 pt-4 border-t border-[#F0EBF8]">
            <div className="w-20 h-3.5 rounded-md bg-[#EAE3F7]" />
            <div className="w-full h-2 rounded-full bg-[#EAE3F7]" />
            <div className="flex items-center justify-between">
              <div className="w-14 h-6 rounded-lg bg-[#F0EBF8]" />
              <div className="w-14 h-6 rounded-lg bg-[#F0EBF8]" />
            </div>
          </div>
        </div>

        {/* Right Catalog Grid */}
        <div className="flex-1 w-full min-w-0 space-y-5">
          {/* Top Filter & Sort Bar */}
          <div className="bg-white border border-[#EAE3F7] rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 animate-pulse">
            <div className="w-32 h-4 rounded-md bg-[#EAE3F7]" />
            <div className="w-36 h-8 rounded-xl bg-[#F0EBF8]" />
          </div>

          {/* 10 Product Cards Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4.5">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  if (hideNav) {
    return content;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />
      <div className="flex-1">{content}</div>
      <Footer />
      <BottomNav />
    </div>
  );
}
