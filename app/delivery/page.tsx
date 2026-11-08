import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { IconClock, IconCheck, IconPhone, IconMapPin } from "@/components/icons";
import { SITE_URL } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Delivery & Shipping Information | Kawaii Subete Bangladesh",
  description:
    "Kawaii Subete delivery details: 24–48 hours inside Dhaka, 48–72 hours nationwide across Bangladesh. Cash on delivery (COD) available with parcel inspection.",
  alternates: {
    canonical: `${SITE_URL}/delivery`,
  },
  openGraph: {
    title: "Delivery & Shipping Information | Kawaii Subete",
    description:
      "24–48h inside Dhaka, 48–72h nationwide across Bangladesh. Cash on delivery available with parcel inspection.",
    url: `${SITE_URL}/delivery`,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default function DeliveryPage() {
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
            <span className="text-[#171136] font-medium">Delivery Information</span>
          </nav>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl text-[#171136] tracking-tight">
            Delivery &amp; Shipping Policy
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#5D5775] leading-relaxed">
            All orders are processed and dispatched directly from our Mohakhali DOHS, Dhaka warehouse.
            We deliver to all 64 districts in Bangladesh with reliable Cash on Delivery (COD).
          </p>
        </div>

        {/* Delivery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Dhaka City Delivery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#FFEAEF] text-[#FF4D6D] text-xs font-bold uppercase tracking-wider">
                Inside Dhaka
              </span>
              <span className="text-xl font-extrabold text-[#171136]">৳70</span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136] mb-3">
              Dhaka City Delivery
            </h2>
            <div className="space-y-3 text-sm text-[#5D5775]">
              <div className="flex items-start gap-2.5">
                <IconClock className="w-4 h-4 text-[#FF4D6D] shrink-0 mt-0.5" />
                <span>
                  <strong>24 to 48 Hours:</strong> Orders placed before 2:00 PM are usually dispatched the same afternoon.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCheck className="w-4 h-4 text-[#06D6A0] shrink-0 mt-0.5" />
                <span>Full Cash on Delivery (COD) supported without upfront advance.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCheck className="w-4 h-4 text-[#06D6A0] shrink-0 mt-0.5" />
                <span>Direct doorstep handover by our partner delivery riders.</span>
              </div>
            </div>
          </div>

          {/* Nationwide Delivery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold uppercase tracking-wider">
                Outside Dhaka
              </span>
              <span className="text-xl font-extrabold text-[#171136]">৳120</span>
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136] mb-3">
              Nationwide Courier Delivery
            </h2>
            <div className="space-y-3 text-sm text-[#5D5775]">
              <div className="flex items-start gap-2.5">
                <IconClock className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                <span>
                  <strong>48 to 72 Hours:</strong> Delivered via trusted courier partners across all 64 districts.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCheck className="w-4 h-4 text-[#06D6A0] shrink-0 mt-0.5" />
                <span>Cash on Delivery (COD) available in all district and upazila hubs.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <IconCheck className="w-4 h-4 text-[#06D6A0] shrink-0 mt-0.5" />
                <span>SMS and phone tracking notification once the parcel is handed over.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inspection & Packaging Guidelines */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DC] shadow-sm space-y-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#171136]">
            Parcel Inspection &amp; Safe Packaging
          </h2>
          <div className="prose text-[#4C4566] text-[15px] space-y-4">
            <p>
              Every collectible, figure, and brick set is protected with high-density bubble wrap and sturdy
              outer packaging to ensure fragile parts and collector boxes arrive in pristine condition.
            </p>
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#F5ECE5] text-sm text-[#5D5775]">
              <strong className="text-[#171136] block mb-1">Parcel Inspection at Handover:</strong>
              When the delivery agent arrives, you are entitled to inspect the exterior condition of the parcel.
              If the package has been severely damaged during transit, you may reject the parcel immediately without payment,
              or contact our customer service hotline at <strong>01402494401</strong> while the delivery agent is present.
            </div>
          </div>

          <div className="pt-6 border-t border-[#F2E8E0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-[#171136]">Have questions about an existing order?</h3>
              <p className="text-xs text-[#66607E] mt-0.5">
                Check our FAQ or call our support team.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-full bg-[#171136] hover:bg-[#FF4D6D] text-white text-xs font-bold transition-colors"
              >
                Track &amp; Support
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

