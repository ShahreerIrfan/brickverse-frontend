import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { IconCheck, IconPhone, IconClock, IconMail } from "@/components/icons";
import { SITE_URL } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Returns & Replacement Policy | Kawaii Subete Bangladesh",
  description:
    "Kawaii Subete 7-day replacement guarantee: Hassle-free replacement for damaged or defective anime figures and brick sets across Bangladesh.",
  alternates: {
    canonical: `${SITE_URL}/returns`,
  },
  openGraph: {
    title: "Returns & Replacement Policy | Kawaii Subete",
    description:
      "7-day replacement guarantee for damaged or defective anime figures and brick sets across Bangladesh.",
    url: `${SITE_URL}/returns`,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default function ReturnsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Breadcrumb & Title */}
        <div className="max-w-3xl mb-10">
          <nav className="flex items-center gap-2 text-xs text-[#8880B5] mb-3">
            <Link href="/" className="hover:text-[#FF4D6D] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#171136] font-medium">Returns &amp; Replacements</span>
          </nav>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl text-[#171136] tracking-tight">
            7-Day Replacement Guarantee
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5D5775] leading-relaxed">
            We inspect every item before packaging, but in the rare event an item is damaged during transit
            or contains missing components, we guarantee a swift, hassle-free replacement.
          </p>
        </div>

        {/* 3 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm">
            <span className="w-9 h-9 rounded-full bg-[#FFEAEF] text-[#FF4D6D] text-sm font-bold flex items-center justify-center mb-4">
              1
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171136] mb-2">
              Notify Us Within 7 Days
            </h2>
            <p className="text-sm text-[#5D5775] leading-relaxed">
              Contact our support team within 7 days of delivery. Share your Order ID and clear photos or a brief video showing the defect.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm">
            <span className="w-9 h-9 rounded-full bg-[#FFEAEF] text-[#FF4D6D] text-sm font-bold flex items-center justify-center mb-4">
              2
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171136] mb-2">
              Instant Verification
            </h2>
            <p className="text-sm text-[#5D5775] leading-relaxed">
              Our team verifies the claim within 4 to 12 hours. We do not require complicated paperwork or bureaucratic delays.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm">
            <span className="w-9 h-9 rounded-full bg-[#FFEAEF] text-[#FF4D6D] text-sm font-bold flex items-center justify-center mb-4">
              3
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171136] mb-2">
              Doorstep Replacement
            </h2>
            <p className="text-sm text-[#5D5775] leading-relaxed">
              We dispatch a brand-new replacement unit. The courier hands over the new item and picks up the defective piece simultaneously.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DC] shadow-sm space-y-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#171136]">
            Eligibility &amp; Coverage
          </h2>
          <div className="space-y-4 text-[15px] text-[#4C4566] leading-relaxed">
            <div className="flex items-start gap-3">
              <IconCheck className="w-5 h-5 text-[#06D6A0] shrink-0 mt-0.5" />
              <span>
                <strong>Transit Damage:</strong> Broken limbs, chipped paint, or crushed collector boxes caused by courier handling.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <IconCheck className="w-5 h-5 text-[#06D6A0] shrink-0 mt-0.5" />
              <span>
                <strong>Missing Bricks / Parts:</strong> Missing pouches or crucial building elements from factory sealed sets.
              </span>
            </div>
            <div className="flex items-start gap-3">
              <IconCheck className="w-5 h-5 text-[#06D6A0] shrink-0 mt-0.5" />
              <span>
                <strong>Wrong Item Sent:</strong> Received a different figure, model, or variant than ordered.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F5ECE5] text-sm text-[#5D5775]">
            <strong className="text-[#171136] block mb-1">Items Not Covered:</strong>
            Damage resulting from intentional misuse, customer-inflicted drops after delivery, or change of mind after the product packaging has been unsealed.
          </div>

          <div className="pt-6 border-t border-[#F2E8E0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <IconPhone className="w-5 h-5 text-[#FF4D6D]" />
              <span className="text-sm text-[#171136]">
                Helpline: <strong>01402494401</strong> (10 AM – 8 PM)
              </span>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-full bg-[#171136] hover:bg-[#FF4D6D] text-white text-xs font-bold transition-colors"
            >
              Start a Replacement Request
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
