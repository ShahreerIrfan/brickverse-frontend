"use client";

import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function GenericPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
        <div className="space-y-8 animate-pulse">
          {/* Header Skeleton */}
          <div className="space-y-3 max-w-lg">
            <div className="w-24 h-4 rounded-full bg-[#FF4D6D]/20" />
            <div className="w-72 sm:w-96 h-9 sm:h-11 rounded-2xl bg-[#EAE3F7]" />
            <div className="w-48 sm:w-64 h-4 rounded-lg bg-[#F0EBF8]" />
          </div>

          {/* Body Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-[#EAE3F7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-[#F0EBF8] last:border-0">
                  <div className="w-16 h-16 rounded-2xl bg-[#F0EBF8] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/5 h-4 rounded-md bg-[#EAE3F7]" />
                    <div className="w-2/5 h-3 rounded-md bg-[#F0EBF8]" />
                  </div>
                  <div className="w-16 h-5 rounded-lg bg-[#EAE3F7]" />
                </div>
              ))}
            </div>

            <div className="bg-white border border-[#EAE3F7] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 h-fit">
              <div className="w-32 h-5 rounded-lg bg-[#EAE3F7]" />
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <div className="w-20 h-3.5 rounded bg-[#F0EBF8]" />
                  <div className="w-12 h-3.5 rounded bg-[#F0EBF8]" />
                </div>
                <div className="flex justify-between">
                  <div className="w-16 h-3.5 rounded bg-[#F0EBF8]" />
                  <div className="w-12 h-3.5 rounded bg-[#F0EBF8]" />
                </div>
              </div>
              <div className="h-11 rounded-full bg-[#FF4D6D]/30 mt-4" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
