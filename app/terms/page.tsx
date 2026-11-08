import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { SITE_URL } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Terms of Service | Kawaii Subete Bangladesh",
  description:
    "Terms and conditions for purchasing anime figures, building brick sets, and collectibles from Kawaii Subete in Bangladesh.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    title: "Terms of Service | Kawaii Subete",
    description:
      "Terms and conditions for purchasing from Kawaii Subete Bangladesh.",
    url: `${SITE_URL}/terms`,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mb-8">
          <nav className="flex items-center gap-2 text-xs text-[#8880B5] mb-3">
            <Link href="/" className="hover:text-[#FF4D6D] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#171136] font-medium">Terms of Service</span>
          </nav>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl text-[#171136] tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-[#736E9B]">
            Effective Date: November 8, 2026
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DC] shadow-sm space-y-8 text-[15px] text-[#4C4566] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing Kawaii Subete (`https://kawaiisubete.com`) or placing an order through our website or customer service channels, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              2. Products &amp; Pricing
            </h2>
            <p>
              All prices displayed on Kawaii Subete are denominated in Bangladeshi Taka (৳). While we take diligent measures to maintain exact inventory counts and pricing accuracy, unintended clerical errors may occasionally occur. In such cases, we will inform you before dispatching the parcel.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              3. Ordering &amp; Cash on Delivery (COD) Commitments
            </h2>
            <p>
              We proudly offer nationwide Cash on Delivery across Bangladesh. By confirming an order, you confirm that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>The provided delivery address and mobile contact number are active, accurate, and reachable by our delivery rider.</li>
              <li>You intend in good faith to accept and pay for the parcel upon delivery.</li>
              <li>Frivolous refusal of delivered items without inspection or justifiable damage reasons causes significant logistics expense and may result in restriction of future COD orders.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              4. Replacement Warranty
            </h2>
            <p>
              All eligible orders are covered under our <strong>1-Day Replacement Guarantee</strong>. Claims for items damaged during transit or with missing parts must be communicated to our support within 7 days of receiving the package.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              5. Governing Law
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of the People&apos;s Republic of Bangladesh. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              6. Contact Information
            </h2>
            <p className="text-sm">
              For any legal or service inquiries:
              <br />
              Kawaii Subete · Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka, Bangladesh.
              <br />
              Phone: 01402494401 · Email: kawaiisubete1@gmail.com
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

