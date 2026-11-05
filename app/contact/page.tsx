import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ContactClient from "@/components/contact/ContactClient";
import { CONTACT_SEO, buildContactFaqJsonLd } from "@/lib/seoData";

export const metadata: Metadata = {
  title: CONTACT_SEO.title,
  description: CONTACT_SEO.description,
  alternates: {
    canonical: CONTACT_SEO.canonical,
  },
  openGraph: {
    title: CONTACT_SEO.title,
    description: CONTACT_SEO.description,
    url: CONTACT_SEO.canonical,
    siteName: "Kawaii Subete",
    locale: "en_BD",
    type: "website",
  },
};

export default function ContactPage() {
  const faqJsonLd = buildContactFaqJsonLd();

  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      {/* FAQPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Navbar />
      <NavLinks />

      <main className="flex-1">
        <ContactClient />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
