import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import {
  IconMapPin,
  IconPhone,
  IconCheck,
  IconClock,
  IconFacebook,
  IconInstagram,
  IconArrowRight,
  IconShield,
  IconTruck,
  IconSparkles,
} from "@/components/icons";
import { SITE_URL } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "About Us | Kawaii Subete — Anime Figures & Collectibles in Bangladesh",
  description:
    "Learn about Kawaii Subete: Dhaka-based premier destination for authentic anime figures, building brick sets, and cartoon collectibles. Cash on delivery across Bangladesh.",
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

const stats = [
  { value: "48h", label: "Fast Dhaka Dispatch", sub: "Doorstep delivery in 24-48 hrs" },
  { value: "100%", label: "Dhaka Local Stock", sub: "No pre-order wait times" },
  { value: "470+", label: "Curated Items", sub: "Figures, bricks & collectibles" },
  { value: "7-Day", label: "Replacement Warranty", sub: "Hassle-free damage coverage" },
  { value: "64", label: "Districts Covered", sub: "Nationwide Cash on Delivery" },
];

const coreValues = [
  {
    icon: IconShield,
    title: "100% Authentic Quality",
    desc: "Every anime figure and brick set is thoroughly inspected for paint accuracy, joint integrity, and complete parts before packing.",
    tag: "Quality Assured",
  },
  {
    icon: IconTruck,
    title: "Zero Customs or Pre-order Wait",
    desc: "Everything you see on our site is already inside our Dhaka warehouse. No 4–8 week overseas shipping delays or surprise customs bills.",
    tag: "In-Stock Local Inventory",
  },
  {
    icon: IconSparkles,
    title: "Transparent Taka Pricing",
    desc: "Clear prices in Bangladeshi Taka (৳). What you see is what you pay — no hidden international shipping fee or foreign exchange surcharge.",
    tag: "Fair & Honest",
  },
  {
    icon: IconCheck,
    title: "Safe Cash on Delivery (COD)",
    desc: "Inspect your package condition at handover before making payment. If any item is damaged in transit, we replace it at zero cost.",
    tag: "Risk-Free Shopping",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#8880B5] mb-6">
          <Link href="/" className="hover:text-[#FF4D6D] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#171136] font-semibold">About Us</span>
        </nav>

        {/* Hero Section Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1646] via-[#171136] to-[#2B1B54] text-white p-7 sm:p-12 lg:p-16 mb-10 shadow-sm border border-[#2F2660]">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FF4D6D]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#7C3AED]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-wide uppercase text-[#FFA8BA]">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                Bangladesh&apos;s Premier Collectibles Store
              </div>

              <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
                Built by Collectors, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF758F] via-[#FFB800] to-[#FFE066]">
                  Dedicated to Bangladeshi Fans.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#CFC6EE] max-w-2xl leading-relaxed">
                Kawaii Subete is Bangladesh&apos;s trusted hub for authentic anime figures, building block sets,
                and cartoon collectibles. Every single piece is warehoused in Dhaka, ready for nationwide Cash on Delivery within 48 hours.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03353] text-white text-sm font-bold shadow-lg shadow-[#FF4D6D]/25 transition-all hover:scale-105 active:scale-95"
                >
                  Explore Collection
                  <IconArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold backdrop-blur-md border border-white/15 transition-colors"
                >
                  Contact Our Team
                </Link>
              </div>
            </div>

            {/* Mascot / Vector Illustration */}
            <div className="lg:col-span-4 hidden lg:flex justify-end items-center relative">
              <div className="relative w-[280px] h-[280px] flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF4D6D]/20 to-[#6366F1]/20 blur-xl" />
                <Image
                  src="/images/figure-samurai-red.svg"
                  alt="Anime samurai figure mascot"
                  width={240}
                  height={300}
                  className="relative z-10 w-auto h-[260px] drop-shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-12">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 border border-[#EFE5DC] shadow-xs flex flex-col justify-center"
            >
              <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#FF4D6D]">
                {s.value}
              </span>
              <span className="font-bold text-xs sm:text-sm text-[#171136] mt-1">
                {s.label}
              </span>
              <span className="text-[11.5px] text-[#736E9B] mt-0.5">
                {s.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Main Content Grid: Story + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
          {/* Story & Detailed Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Story Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DC] shadow-xs space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#171136]">
                  Our Story &amp; Purpose
                </h2>
              </div>

              <div className="prose text-[#4C4566] text-[15px] sm:text-base leading-relaxed space-y-4">
                <p>
                  Until recently, passionate anime and pop-culture fans across Bangladesh faced frustrating hurdles:
                  ordering figures meant navigating complicated international shipping, waiting 4 to 8 weeks for uncertain customs clearance,
                  or risking hard-earned money on unverified social media pages selling low-grade bootlegs.
                </p>
                <p>
                  We founded <strong>Kawaii Subete</strong> to build a modern, transparent home for hobbyists.
                  We operate a real physical warehouse in Mohakhali DOHS, Dhaka, pre-stocking authentic scale figures,
                  articulated action figures, character brick sets, botanical flowers, and collectibles.
                </p>
                <p>
                  When you place an order on Kawaii Subete, you receive exactly what is pictured, at the exact price listed in Taka,
                  with rapid doorstep delivery and payment at your door.
                </p>
              </div>
            </div>

            {/* Core Values 2x2 Grid */}
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[#171136]">
                Why Hobbyists Choose Kawaii Subete
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {coreValues.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.title}
                      className="bg-white rounded-2xl p-6 border border-[#EFE5DC] shadow-xs hover:border-[#FF4D6D]/40 transition-colors group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#FF4D6D] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#736E9B] px-2.5 py-1 rounded-full bg-[#F6F1FF]">
                            {v.tag}
                          </span>
                        </div>
                        <h4 className="font-[family-name:var(--font-display)] font-bold text-base text-[#171136] mb-2">
                          {v.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] text-[#5D5775] leading-relaxed">
                          {v.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar: Office, Timings, Hotline, Social (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Headquarters Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-1">
                  Dhaka Headquarters
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
                  Warehouse &amp; Operations
                </h3>
              </div>

              <div className="space-y-4 text-sm text-[#5D5775]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                    <IconMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171136] block mb-0.5">Physical Address:</strong>
                    <span className="leading-relaxed">
                      Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B, Road No-29, Dhaka, Bangladesh
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                    <IconPhone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171136] block mb-0.5">Customer Support Hotline:</strong>
                    <a
                      href="tel:01402494401"
                      className="text-[#FF4D6D] font-bold hover:underline transition-all"
                    >
                      01402494401
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#FFF0F3] text-[#FF4D6D] flex items-center justify-center shrink-0 mt-0.5">
                    <IconClock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#171136] block mb-0.5">Operating Hours:</strong>
                    <p className="text-xs text-[#5D5775]">
                      Saturday to Thursday: 10:00 AM – 8:00 PM
                    </p>
                    <p className="text-xs text-[#8880B5]">
                      Friday: Closed (Online orders dispatched next morning)
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F2E8E0]">
                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full py-3 rounded-full bg-[#171136] hover:bg-[#FF4D6D] text-white text-xs font-bold transition-colors"
                >
                  Send Inquiry / Support Request
                </Link>
              </div>
            </div>

            {/* Social Community Card */}
            <div className="bg-gradient-to-br from-[#2A2159] to-[#171136] rounded-3xl p-6 sm:p-7 text-white shadow-xs space-y-4">
              <h4 className="font-[family-name:var(--font-display)] font-bold text-lg">
                Join Our Collector Community
              </h4>
              <p className="text-xs text-[#CFC6EE] leading-relaxed">
                Follow our official social pages for unboxing videos, restock drops, and exclusive community discounts!
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61575469209698"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kawaii Subete on Facebook"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/10 hover:bg-[#1877F2] text-xs font-bold transition-colors border border-white/15"
                >
                  <IconFacebook className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/kawaii.subete/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kawaii Subete on Instagram"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-white/10 hover:bg-[#E4405F] text-xs font-bold transition-colors border border-white/15"
                >
                  <IconInstagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="rounded-3xl bg-white border border-[#EFE5DC] p-8 sm:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="space-y-2 max-w-xl">
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136]">
              Ready to find your favorite figure?
            </h3>
            <p className="text-sm sm:text-base text-[#5D5775]">
              Explore Demon Slayer, Naruto, Pokémon, character brick sets, and flower botanicals in stock today.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/shop"
              className="px-7 py-3 rounded-full bg-[#FF4D6D] hover:bg-[#E03353] text-white text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
            >
              Browse All Products
            </Link>
            <Link
              href="/shop?deals=true"
              className="px-6 py-3 rounded-full bg-[#FFF0F3] hover:bg-[#FFE0E6] text-[#FF4D6D] text-xs sm:text-sm font-bold transition-colors"
            >
              View Hot Deals
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
