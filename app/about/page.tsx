import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { IconMapPin, IconPhone, IconCheck, IconExternalLink } from "@/components/icons";
import { SITE_URL } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "About Us | Kawaii Subete — Anime Figures & Collectibles in Bangladesh",
  description:
    "Learn about Kawaii Subete: Dhaka-based destination for authentic anime figures, building brick sets, and cartoon collectibles. Cash on delivery across Bangladesh.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About Us | Kawaii Subete Bangladesh",
    description:
      "Dhaka-based destination for authentic anime figures, building brick sets, and collectibles. Cash on delivery across Bangladesh.",
    url: `${SITE_URL}/about`,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Breadcrumb & Title */}
        <div className="max-w-3xl mb-10">
          <nav className="flex items-center gap-2 text-xs text-[#8880B5] mb-3">
            <Link href="/" className="hover:text-[#FF4D6D] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#171136] font-medium">About Us</span>
          </nav>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl text-[#171136] tracking-tight">
            About Kawaii Subete
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5D5775] leading-relaxed">
            Bringing authentic anime figures, building brick sets, and premium pop-culture
            collectibles directly to fans and hobbyists across Bangladesh — without import markups or surprise shipping fees.
          </p>
        </div>

        {/* Story & Mission Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DC] shadow-sm space-y-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#171136]">
              Our Story &amp; Purpose
            </h2>
            <p className="text-[15px] text-[#4C4566] leading-relaxed">
              Kawaii Subete started with a simple observation: Bangladeshi anime and collectible enthusiasts
              often faced exorbitant pre-order markups, months of uncertain customs wait times, or low-grade
              imitations from unregulated sellers.
            </p>
            <p className="text-[15px] text-[#4C4566] leading-relaxed">
              We changed that by creating a direct, reliable local inventory based right in Dhaka. Everything
              you see on Kawaii Subete is already in stock in our warehouse. When you place an order, it ships
              within 48 hours with full cash on delivery anywhere in Bangladesh.
            </p>

            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136] pt-4">
              What We Stand For
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F5ECE5]">
                <div className="w-8 h-8 rounded-full bg-[#FFEAEF] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                  <IconCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#171136]">Genuine Products</h4>
                  <p className="text-xs text-[#66607E] mt-1">
                    Every piece is quality-checked before dispatch.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F5ECE5]">
                <div className="w-8 h-8 rounded-full bg-[#FFEAEF] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                  <IconCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#171136]">Clear Taka Pricing</h4>
                  <p className="text-xs text-[#66607E] mt-1">
                    The price you see is what you pay. No hidden customs charges.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F5ECE5]">
                <div className="w-8 h-8 rounded-full bg-[#FFEAEF] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                  <IconCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#171136]">7-Day Replacement</h4>
                  <p className="text-xs text-[#66607E] mt-1">
                    Hassle-free replacement for any transit damage or defects.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF9F5] border border-[#F5ECE5]">
                <div className="w-8 h-8 rounded-full bg-[#FFEAEF] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                  <IconCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#171136]">Nationwide COD</h4>
                  <p className="text-xs text-[#66607E] mt-1">
                    Inspect your parcel before paying the delivery agent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Details Sidebar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136] mb-6">
                Warehouse &amp; Office
              </h3>
              <div className="space-y-4 text-sm text-[#5D5775]">
                <div className="flex items-start gap-3">
                  <IconMapPin className="w-5 h-5 text-[#FF4D6D] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B, Road No-29, Dhaka, Bangladesh
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <IconPhone className="w-5 h-5 text-[#FF4D6D] shrink-0" />
                  <a href="tel:01402494401" className="hover:text-[#FF4D6D] font-medium transition-colors">
                    01402494401
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F2E8E0] space-y-3">
                <p className="text-xs font-semibold text-[#8880B5] uppercase tracking-wider">
                  Customer Support
                </p>
                <p className="text-sm text-[#3E3955]">
                  Saturday to Thursday: 10:00 AM – 8:00 PM
                </p>
                <p className="text-sm text-[#3E3955]">
                  Friday: Closed (Orders processed next morning)
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#F2E8E0]">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full px-5 py-3 rounded-full bg-[#171136] hover:bg-[#FF4D6D] text-white text-sm font-bold transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
