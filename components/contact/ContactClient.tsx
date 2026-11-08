"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconPhone,
  IconMapPin,
  IconFacebook,
  IconInstagram,
  IconClock,
  IconSend,
  IconWhatsApp,
  IconChevronRight,
  IconMail,
  IconCopy,
  IconExternalLink,
  IconCheck,
  IconArrowRight,
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
  subject: "Order Inquiry & Status",
  orderNumber: "",
  message: "",
};

const quickChannels = [
  {
    icon: IconPhone,
    title: "Phone Helpline",
    value: "01402494401",
    sub: "Sat–Thu: 10:00 AM – 8:00 PM",
    href: "tel:01402494401",
    action: "Call Now",
    color: "from-[#FF4D6D] to-[#FF758F]",
  },
  {
    icon: IconWhatsApp,
    title: "WhatsApp Chat",
    value: "01402494401",
    sub: "Fast support & unboxing help",
    href: "https://wa.me/8801402494401",
    action: "Chat Online",
    color: "from-[#00C48C] to-[#25D366]",
  },
  {
    icon: IconMail,
    title: "Email Support",
    value: "kawaiisubete1@gmail.com",
    sub: "Replies usually within 2–6 hours",
    href: "mailto:kawaiisubete1@gmail.com",
    action: "Send Email",
    color: "from-[#7B5CFF] to-[#6366F1]",
  },
  {
    icon: IconMapPin,
    title: "Dhaka Warehouse",
    value: "Mohakhali DOHS",
    sub: "House 412, Road 29, Dhaka",
    href: "https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka",
    action: "View Map",
    color: "from-[#FF9F1C] to-[#FFBF69]",
  },
];

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Inside Dhaka city, deliveries are completed within 24 hours. For all other districts across Bangladesh, standard courier shipping takes 48 hours.",
  },
  {
    q: "Is Cash on Delivery (COD) supported?",
    a: "Yes. Cash on Delivery is available nationwide. You are welcome to inspect your package exterior condition before completing payment.",
  },
  {
    q: "Are the anime figures and brick sets authentic?",
    a: "Yes. Every item at Kawaii Subete is 100% authentic, high quality, and securely packaged for safe delivery across Bangladesh.",
  },
  {
    q: "What is your return and replacement policy?",
    a: "We offer a 1-day (24-hour) hassle-free replacement if any product is received damaged or with missing parts during transit. Please notify us within 24 hours of delivery.",
  },
  {
    q: "Can I visit your office or warehouse in person?",
    a: "Yes, you can visit our Mohakhali DOHS office (House 412, Road 29, Dhaka). Please call us ahead at 01402494401 before visiting.",
  },
];

export default function ContactClient() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      "Mohakhali DOHS, House No-412, Flat-3/A & 3/B Road No-29, Dhaka"
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Please fill in your name, email address, and message.");
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
          ? `Phone: ${form.phone}\n\n${form.message.trim()}`
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
          throw new Error(
            Array.isArray(firstErr) ? String(firstErr[0]) : "Failed to send message."
          );
        }
        throw new Error("Unable to send message at this time.");
      }

      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please reach out directly by phone or WhatsApp.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#8880B5] mb-6">
        <Link href="/" className="hover:text-[#FF4D6D] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#171136] font-semibold">Contact Us</span>
      </nav>

      {/* Hero Section Banner matching About Us typography & design */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1646] via-[#171136] to-[#2B1B54] text-white p-7 sm:p-12 lg:p-16 mb-10 shadow-sm border border-[#2F2660]">
        {/* Decorative Background Elements */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FF4D6D]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#7C3AED]/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold tracking-wide uppercase text-[#FFA8BA]">
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
              We&apos;re Here to Help
            </div>

            <h1 className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]">
              Get in Touch with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF758F] via-[#FFB800] to-[#FFE066]">
                Our Dhaka Team.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#CFC6EE] max-w-2xl leading-relaxed">
              Have questions about an upcoming anime figure release, need help with your order status,
              or want to discuss wholesale orders? Reach out via hotline, WhatsApp, or drop a message below.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="tel:01402494401"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03353] text-white text-sm font-bold shadow-lg shadow-[#FF4D6D]/25 transition-all hover:scale-105 active:scale-95"
              >
                <IconPhone className="w-4 h-4" />
                Call 01402494401
              </a>
              <a
                href="https://wa.me/8801402494401"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 active:scale-95"
              >
                <IconWhatsApp className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Right Mascot Vector */}
          <div className="lg:col-span-4 hidden lg:flex justify-end items-center relative">
            <div className="relative w-[280px] h-[280px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF4D6D]/20 to-[#6366F1]/20 blur-xl" />
              <Image
                src="/images/figure-ninja-gold.svg"
                alt="Kawaii mascot"
                width={240}
                height={280}
                className="relative z-10 w-auto h-[250px] drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Channels Bar (4 Cards matching About Us stats style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {quickChannels.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="bg-white rounded-2xl p-6 border border-[#EFE5DC] shadow-xs hover:border-[#FF4D6D]/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] text-[#FF4D6D] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#736E9B] px-2.5 py-1 rounded-full bg-[#F6F1FF]">
                    {c.action}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[#8880B5] block">
                  {c.title}
                </span>
                <p className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mt-1 break-all">
                  {c.value}
                </p>
                <p className="text-xs text-[#5D5775] mt-1">
                  {c.sub}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#F2E8E0]">
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] hover:underline"
                >
                  <span>Connect</span>
                  <IconArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Section: Information & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
        
        {/* Left Column: Office Details, Community & FAQs (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card 1: Warehouse & Store Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-1">
                Dhaka Headquarters
              </span>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
                Warehouse &amp; Pickups
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
                  <IconClock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-[#171136] block mb-0.5">Visiting &amp; Support Hours:</strong>
                  <p className="text-xs text-[#5D5775]">
                    Saturday to Thursday: 10:00 AM – 8:00 PM
                  </p>
                  <p className="text-xs text-[#8880B5]">
                    Friday: Closed (Deliveries dispatched next morning)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF8FF] hover:bg-[#F0EBFA] border border-[#EAE3F7] text-xs font-semibold text-[#171136] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <IconCheck className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-green-600 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <IconCopy className="w-3.5 h-3.5 text-[#736E9B]" />
                    <span>Copy Address</span>
                  </>
                )}
              </button>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFF1F4] hover:bg-[#FFE4E9] text-[#FF4D6D] text-xs font-semibold transition-colors"
              >
                <span>Google Maps</span>
                <IconExternalLink className="w-3 h-3 text-[#FF4D6D]" />
              </a>
            </div>
          </div>

          {/* Card 2: Collector Community (Matching About Us) */}
          <div className="bg-gradient-to-br from-[#2A2159] to-[#171136] rounded-3xl p-6 sm:p-7 text-white shadow-xs space-y-4">
            <h4 className="font-[family-name:var(--font-display)] font-bold text-lg">
              Official Social Channels
            </h4>
            <p className="text-xs text-[#CFC6EE] leading-relaxed">
              Follow our official social pages for unboxing videos, restock drops, and flash discounts!
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

        {/* Right Column: Send a Message Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#EFE5DC] p-7 sm:p-10 shadow-xs">
            
            <div className="mb-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] text-xs font-bold uppercase tracking-wider text-[#FF4D6D]">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
                Direct Inquiry
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#171136]">
                Send us a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#5D5775] leading-relaxed">
                Fill out the form below. We usually reply to inquiries within 2 to 6 hours during working days.
              </p>
            </div>

            {success ? (
              <div className="rounded-2xl bg-[#E8FBF0] border border-[#A7F3D0] p-8 text-center max-w-lg mx-auto my-6">
                <div className="w-14 h-14 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#065F46]">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-[#047857] mt-2 leading-relaxed">
                  Thank you for contacting Kawaii Subete. Our support team will review your message and reply to your email shortly.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <Link
                    href="/shop"
                    className="px-5 py-2.5 rounded-full bg-white border border-[#A7F3D0] text-[#065F46] text-xs font-bold hover:bg-[#D1FAE5] transition-all"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                
                {errorMsg && (
                  <div className="p-4 rounded-2xl bg-[#FFF1F4] border border-[#FFCCD5] text-[#D90429] text-xs font-semibold">
                    {errorMsg}
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
                      className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="Order Inquiry & Status">Order Inquiry &amp; Status</option>
                      <option value="Product Availability & Restock">Product Availability &amp; Restock</option>
                      <option value="Shipping & Delivery Question">Shipping &amp; Delivery Question</option>
                      <option value="Wholesale & Custom Figures">Wholesale &amp; Custom Figures</option>
                      <option value="Feedback & Suggestion">Feedback &amp; Suggestion</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Order ID */}
                <div>
                  <label className="block text-xs font-bold text-[#171136] mb-1.5">
                    Order ID / Number <span className="text-xs text-[#8A84B0] font-normal">(If inquiring about an existing order)</span>
                  </label>
                  <input
                    type="text"
                    value={form.orderNumber}
                    onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                    placeholder="e.g. KS-84920"
                    className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-[#171136] mb-1.5">
                    Your Message <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please write your questions or details here..."
                    className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all resize-y leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E03353] text-white text-sm font-bold shadow-lg shadow-[#FF4D6D]/25 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
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
                </div>

              </form>
            )}
          </div>
        </div>

      </div>

      {/* Location Map Section */}
      <div className="bg-white rounded-3xl border border-[#EFE5DC] p-6 sm:p-8 mb-12 sm:mb-16 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] block mb-1">
              Visit In Person
            </span>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
              Mohakhali DOHS Location Map
            </h3>
            <p className="text-xs sm:text-sm text-[#5D5775] mt-0.5">
              Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF0F3] hover:bg-[#FFE0E6] text-[#FF4D6D] text-xs font-bold transition-colors"
          >
            <span>Open in Google Maps</span>
            <IconExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden border border-[#EFE5DC]">
          <iframe
            title="Kawaii Subete Location"
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

      {/* Clean FAQ Section (Anchor #faq) */}
      <div id="faq" className="bg-white rounded-3xl border border-[#EFE5DC] p-7 sm:p-10 shadow-xs mb-10 scroll-mt-20">
        <div className="max-w-xl mb-7 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] text-xs font-bold uppercase tracking-wider text-[#FF4D6D]">
            <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
            Frequently Asked Questions
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#171136]">
            Common Questions &amp; Answers
          </h2>
          <p className="text-xs sm:text-sm text-[#5D5775] leading-relaxed">
            Quick answers about shipping times, Cash on Delivery, authenticity, and returns.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#F0ECE7] border-y border-[#F0ECE7]">
          {faqs.map((faq, idx) => (
            <details
              key={faq.q}
              open={idx === 0}
              className="group py-4 transition-colors"
            >
              <summary className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#171136] hover:text-[#FF4D6D] transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <span>{faq.q}</span>
                <span className="w-7 h-7 rounded-full bg-[#FAF8FF] group-open:bg-[#FFF1F4] flex items-center justify-center text-[#736E9B] group-open:text-[#FF4D6D] transition-transform duration-200 shrink-0 group-open:rotate-90">
                  <IconChevronRight className="w-4 h-4" />
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-[#5D5775] leading-relaxed mt-2.5 pr-6">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div className="rounded-3xl bg-white border border-[#EFE5DC] p-8 sm:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136]">
            Looking for authentic anime collectibles?
          </h3>
          <p className="text-sm sm:text-base text-[#5D5775]">
            Explore 470+ figures, botanical flower sets, and brick models ready to ship from Dhaka today.
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
            href="/about"
            className="px-6 py-3 rounded-full bg-[#FFF0F3] hover:bg-[#FFE0E6] text-[#FF4D6D] text-xs sm:text-sm font-bold transition-colors"
          >
            About Our Store
          </Link>
        </div>
      </div>

    </div>
  );
}
