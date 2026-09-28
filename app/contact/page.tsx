import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Kawaii Subete - Support, Phone & Store Location",
  description:
    "Get in touch with Kawaii Subete. Visit our Mohakhali DOHS Dhaka office, call our hotline 01402494401, or message us on WhatsApp for fast customer support.",
  openGraph: {
    title: "Contact Us | Kawaii Subete",
    description:
      "Get in touch with Kawaii Subete. Visit our Mohakhali DOHS Dhaka office, call our hotline 01402494401, or message us on WhatsApp.",
    url: "https://kawaiisubete.com/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
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
