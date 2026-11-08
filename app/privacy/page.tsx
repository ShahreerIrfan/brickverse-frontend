import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { SITE_URL } from "@/lib/seoData";

export const metadata: Metadata = {
  title: "Privacy Policy | Kawaii Subete Bangladesh",
  description:
    "Privacy and data protection policy of Kawaii Subete. Learn how we handle your order information, delivery details, and cookies safely.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | Kawaii Subete",
    description:
      "Privacy and data protection policy of Kawaii Subete Bangladesh.",
    url: `${SITE_URL}/privacy`,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default function PrivacyPage() {
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
            <span className="text-[#171136] font-medium">Privacy Policy</span>
          </nav>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl text-[#171136] tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-[#736E9B]">
            Last updated: November 8, 2026
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EFE5DC] shadow-sm space-y-8 text-[15px] text-[#4C4566] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              1. Information We Collect
            </h2>
            <p>
              When you browse Kawaii Subete, place an order, or reach out to our support team, we collect the necessary information to fulfill your requests safely:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Contact Information:</strong> Your full name, phone number, email address, and physical shipping address in Bangladesh.</li>
              <li><strong>Order Details:</strong> Items purchased, order reference IDs, delivery notes, and payment mode (e.g. Cash on Delivery).</li>
              <li><strong>Technical Data:</strong> Device browser type, IP address, and anonymized diagnostic data to prevent fraudulent traffic and optimize website loading speed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              2. How We Use Your Data
            </h2>
            <p>
              Your personal data is strictly used for order processing and storefront operation:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Dispatching parcels through our authorized domestic logistics and courier partners.</li>
              <li>Sending order confirmation SMS and status updates regarding delivery.</li>
              <li>Providing customer support and facilitating 7-day product replacement requests.</li>
            </ul>
            <p className="font-medium text-[#171136]">
              We never sell, rent, or trade your personal information to third-party advertisers or data brokers.
            </p>
          </section>

          <section id="cookies" className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              3. Cookie &amp; Storage Policy
            </h2>
            <p>
              Kawaii Subete uses minimal, functional cookies and browser storage strictly necessary for our e-commerce platform:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Shopping Cart &amp; Session:</strong> Remembering your cart items, wishlists, and logged-in account status across page navigations.</li>
              <li><strong>Security &amp; Performance:</strong> Cloudflare edge security cookies to safeguard against bot attacks and DDoS threats.</li>
            </ul>
            <p className="text-sm">
              You may manage or disable cookies via your browser settings at any time without losing the ability to view our catalog.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              4. Data Retention &amp; Security
            </h2>
            <p>
              We implement industry-standard HTTPS encryption (TLS 1.3) and strict origin access controls to keep your contact and order history secure. Customer records are maintained only for the statutory period required for tax, accounting, and warranty verification in Bangladesh.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#F2E8E0]">
            <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              5. Contact Us Regarding Privacy
            </h2>
            <p>
              If you have questions about your personal data or wish to request data correction/removal, contact our privacy officer:
            </p>
            <p className="text-sm">
              Email: <strong>kawaiisubete1@gmail.com</strong> · Phone: <strong>01402494401</strong>
              <br />
              Address: Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka, Bangladesh.
            </p>
          </section>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

