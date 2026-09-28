"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconPhone,
  IconMapPin,
  IconFacebook,
  IconInstagram,
  IconClock,
  IconMessageSquare,
  IconSend,
  IconWhatsApp,
  IconChevronRight,
  IconShield,
  IconTruck,
} from "@/components/icons";
import { getApiBaseUrl } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  orderNumber: string;
  message: string;
};

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "Order Inquiry",
  orderNumber: "",
  message: "",
};

const faqs = [
  {
    q: "How fast will my order be delivered?",
    a: "Within Dhaka city, deliveries usually arrive within 24 to 48 hours. For locations outside Dhaka across Bangladesh, standard courier shipping takes 48 to 72 hours.",
  },
  {
    q: "Is Cash on Delivery (COD) available?",
    a: "Yes! We offer nationwide Cash on Delivery. You can inspect your parcel condition upon receipt before completing the payment.",
  },
  {
    q: "Are all anime figures and brick sets authentic?",
    a: "Absolutely. All Kawaii Subete figures, building bricks, and collectibles are 100% authentic, premium quality, and safely packaged for collectors.",
  },
  {
    q: "What is your return and replacement policy?",
    a: "We provide a 7-day hassle-free replacement guarantee if any item arrives damaged, defective, or missing components during shipping.",
  },
  {
    q: "Can I visit your Mohakhali DOHS location in person?",
    a: "Yes! You are welcome to visit our office/collection point in Mohakhali DOHS (House 412, Road 29, Dhaka). Please give us a quick call at 01402494401 before visiting.",
  },
];

export default function ContactClient() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("Mohakhali DOHS, House No-412, Flat-3/A & 3/B Road No-29, Dhaka");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in your name, email, and message.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.orderNumber
          ? `[Order #${form.orderNumber}] ${form.subject}`
          : form.subject,
        message: form.phone
          ? `Phone/WhatsApp: ${form.phone}\n\n${form.message.trim()}`
          : form.message.trim(),
      };

      const res = await fetch(`${getApiBaseUrl()}/marketing/contact/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        if (data && typeof data === "object") {
          const firstErr = Object.values(data)[0];
          throw new Error(Array.isArray(firstErr) ? String(firstErr[0]) : "Failed to send message.");
        }
        throw new Error("Unable to submit message at this moment.");
      }

      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again or reach out on WhatsApp/Call.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#171136] to-[#20184A] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Background ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#FF4D6D]/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 right-10 w-[400px] h-[200px] bg-[#7B5CFF]/20 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative max-w-[1280px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFB3C1] text-xs sm:text-sm font-semibold mb-5 shadow-sm">
            <IconMessageSquare className="w-4 h-4 text-[#FF4D6D]" />
            <span>We are always here to help you</span>
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.15]">
            Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D6D] to-[#FFA07A]">Kawaii Subete</span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#D0C9E8] max-w-2xl mx-auto leading-relaxed">
            Have questions about an order, brick set, or anime figure? Need assistance with delivery? Connect with our dedicated support team directly.
          </p>

          {/* Quick Stats / Highlights */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#FF4D6D]/20 flex items-center justify-center text-[#FF4D6D] mb-2">
                <IconPhone className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#B9B2DA]">Direct Hotline</p>
              <p className="text-sm font-bold text-white mt-0.5">01402494401</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#7B5CFF]/20 flex items-center justify-center text-[#B9A3FF] mb-2">
                <IconClock className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#B9B2DA]">Support Hours</p>
              <p className="text-sm font-bold text-white mt-0.5">10 AM – 9 PM</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#00C48C]/20 flex items-center justify-center text-[#4EEDB8] mb-2">
                <IconTruck className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#B9B2DA]">Nationwide Shipping</p>
              <p className="text-sm font-bold text-white mt-0.5">24 - 48 Hours</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#FFA07A]/20 flex items-center justify-center text-[#FFA07A] mb-2">
                <IconShield className="w-4 h-4" />
              </div>
              <p className="text-xs text-[#B9B2DA]">Authenticity</p>
              <p className="text-sm font-bold text-white mt-0.5">100% Genuine</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Contact Cards & Info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Address & Store Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE3F7] relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#FF4D6D] to-[#FFA07A]" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F4] flex items-center justify-center text-[#FF4D6D] shrink-0">
                  <IconMapPin className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[#171136] text-lg">
                    Store &amp; Office Location
                  </h3>
                  <p className="mt-2 text-sm text-[#5D5589] leading-relaxed">
                    Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka
                  </p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopyAddress}
                      type="button"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#171136] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copiedAddress ? "✓ Copied to clipboard!" : "📋 Copy Address"}
                    </button>
                    
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF1F4] hover:bg-[#FFE4E9] text-[#FF4D6D] text-xs font-semibold transition-colors"
                    >
                      🗺️ Open in Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Phone & WhatsApp Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE3F7] relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#25D366] to-[#128C7E]" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E8FBF0] flex items-center justify-center text-[#25D366] shrink-0">
                  <IconPhone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[#171136] text-lg">
                    Phone &amp; WhatsApp
                  </h3>
                  <p className="mt-1 text-sm text-[#5D5589]">
                    Call us directly or message us for instant support.
                  </p>
                  
                  <p className="mt-3 text-xl font-extrabold text-[#171136] tracking-tight">
                    01402494401
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <a
                      href="tel:01402494401"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171136] hover:bg-[#2A2159] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <IconPhone className="w-3.5 h-3.5 text-[#FF4D6D]" />
                      Call Hotline
                    </a>

                    <a
                      href="https://wa.me/8801402494401"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                      <IconWhatsApp className="w-3.5 h-3.5" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Email & Support Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE3F7] relative overflow-hidden group hover:shadow-lg transition-all duration-300">
              <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#7B5CFF] to-[#3B82F6]" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EFE9FF] flex items-center justify-center text-[#7B5CFF] shrink-0">
                  <IconMessageSquare className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-[family-name:var(--font-display)] font-bold text-[#171136] text-lg">
                    Email Inquiries
                  </h3>
                  <p className="mt-1 text-sm text-[#5D5589]">
                    For bulk orders, business queries, or order tracking:
                  </p>
                  
                  <a
                    href="mailto:support@kawaiisubete.com"
                    className="inline-block mt-3 text-base font-bold text-[#7B5CFF] hover:underline"
                  >
                    support@kawaiisubete.com
                  </a>

                  <p className="mt-2 text-xs text-[#8A84B0] flex items-center gap-1.5">
                    <IconClock className="w-3.5 h-3.5 text-[#7B5CFF]" />
                    Response time: Usually within 2–6 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Official Social Channels Card */}
            <div className="bg-gradient-to-br from-[#171136] to-[#251B52] rounded-3xl p-6 sm:p-7 text-white shadow-xl">
              <h3 className="font-[family-name:var(--font-display)] font-bold text-lg text-white">
                Follow Kawaii Subete
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-[#C4BDE0]">
                Stay updated with fresh anime figures, limited brick drops, and giveaway announcements.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href="https://www.facebook.com/profile.php?id=61575469209698"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#2A2159] hover:bg-[#392E73] border border-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <IconFacebook className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Facebook</p>
                    <p className="text-[11px] text-[#A8A1CC] truncate">@kawaiisubete</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/kawaii.subete/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#2A2159] hover:bg-[#392E73] border border-white/10 transition-all group"
                >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                    <IconInstagram className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">Instagram</p>
                    <p className="text-[11px] text-[#A8A1CC] truncate">@kawaii.subete</p>
                  </div>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-[#EAE3F7]">
              
              <div className="mb-8">
                <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#FF4D6D] bg-[#FFF1F4] px-3 py-1 rounded-full mb-2">
                  Send a Message
                </span>
                <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#171136]">
                  How can we help you today?
                </h2>
                <p className="text-sm text-[#5D5589] mt-1.5">
                  Fill out the form below and our customer support team will get back to you promptly.
                </p>
              </div>

              {success ? (
                <div className="rounded-2xl bg-[#E8FBF0] border border-[#A7F3D0] p-8 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto text-2xl mb-4 shadow-lg shadow-emerald-500/20">
                    ✓
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#065F46]">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-[#047857] mt-2 max-w-md mx-auto">
                    Thank you for reaching out to Kawaii Subete. Our support team has received your message and will reply to your email shortly.
                  </p>
                  
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => setSuccess(false)}
                      className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/shop"
                      className="px-5 py-2.5 rounded-xl bg-white border border-[#A7F3D0] text-[#065F46] text-xs font-bold hover:bg-[#D1FAE5] transition-all"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-[#FFF1F4] border border-[#FFCCD5] text-[#D90429] text-xs font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#171136] mb-1.5">
                        Your Full Name <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Tanvir Ahmed"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CEEB] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-[#171136] mb-1.5">
                        Email Address <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CEEB] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-[#171136] mb-1.5">
                        Phone / WhatsApp <span className="text-xs text-[#8A84B0] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CEEB] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-[#171136] mb-1.5">
                        Topic / Subject <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CEEB] bg-[#FAF8FF] text-sm text-[#171136] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="Order Inquiry">Order Inquiry &amp; Status</option>
                        <option value="Product Availability">Product Availability &amp; Restock</option>
                        <option value="Shipping & Delivery">Shipping &amp; Delivery Question</option>
                        <option value="Wholesale & Bulk Order">Wholesale / Custom Figures</option>
                        <option value="Feedback & Suggestion">Feedback &amp; Suggestion</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Number */}
                  <div>
                    <label className="block text-xs font-bold text-[#171136] mb-1.5">
                      Order ID / Number <span className="text-xs text-[#8A84B0] font-normal">(If inquiring about an existing order)</span>
                    </label>
                    <input
                      type="text"
                      value={form.orderNumber}
                      onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                      placeholder="e.g. KS-84920"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEEB] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-[#171136] mb-1.5">
                      Your Message <span className="text-[#FF4D6D]">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please write your questions or details here..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D5CEEB] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full sm:w-auto self-start inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8B] hover:from-[#E63958] hover:to-[#FF4D6D] text-white text-sm font-bold shadow-lg shadow-red-500/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <IconSend className="w-4 h-4" />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Embedded Location Map Section */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#EAE3F7] overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] animate-pulse" />
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
                  Find Us on the Map
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5D5589] mt-1">
                Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka, Bangladesh
              </p>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171136] hover:bg-[#2A2159] text-white text-xs font-bold transition-all shadow-sm shrink-0"
            >
              <span>Get Directions</span>
              <IconChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Responsive Map Embed */}
          <div className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden border border-[#EAE3F7] relative">
            <iframe
              title="Kawaii Subete Office Location"
              src="https://maps.google.com/maps?q=Mohakhali%20DOHS,%20House%20No-412,%20Road%20No-29,%20Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="bg-[#FAF7FF] py-14 sm:py-20 border-t border-[#EAE3F7]">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-[#7B5CFF] bg-[#EFE9FF] px-3 py-1 rounded-full mb-2">
              Common Questions
            </span>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#171136]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#5D5589] mt-2 max-w-xl mx-auto">
              Quick answers about shipping, payment modes, figure authenticity, and return policies.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl border border-[#EAE3F7] overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 sm:px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#171136] hover:text-[#FF4D6D] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`w-7 h-7 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#7B5CFF] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-90 bg-[#FFF1F4] text-[#FF4D6D]" : ""
                      }`}
                    >
                      <IconChevronRight className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5D5589] leading-relaxed border-t border-[#F6F1FF]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Need More Help Box */}
          <div className="mt-10 rounded-2xl bg-white border border-[#EAE3F7] p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="font-bold text-[#171136] text-sm">Still have questions?</p>
              <p className="text-xs text-[#5D5589] mt-0.5">We are ready to assist you on WhatsApp or direct phone call.</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://wa.me/8801402494401"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <IconWhatsApp className="w-3.5 h-3.5" />
                WhatsApp Us
              </a>
              <a
                href="tel:01402494401"
                className="px-4 py-2 rounded-xl bg-[#171136] hover:bg-[#2A2159] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <IconPhone className="w-3.5 h-3.5 text-[#FF4D6D]" />
                Call Now
              </a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
