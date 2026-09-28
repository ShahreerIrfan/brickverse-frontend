"use client";

import { useState } from "react";
import Link from "next/link";
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

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Inside Dhaka city, deliveries are completed within 24 to 48 hours. For all other districts across Bangladesh, standard courier shipping takes 48 to 72 hours.",
  },
  {
    q: "Is Cash on Delivery (COD) supported?",
    a: "Yes. Cash on Delivery is available nationwide. You are welcome to inspect your package condition before completing payment.",
  },
  {
    q: "Are the anime figures and brick sets authentic?",
    a: "Yes. Every item in Kawaii Subete is 100% authentic, high quality, and securely packaged for safe delivery.",
  },
  {
    q: "What is your return and replacement policy?",
    a: "We offer a 7-day hassle-free replacement if any product is received damaged or with missing parts during transit.",
  },
  {
    q: "Can I visit your office in person?",
    a: "Yes, you can visit our Mohakhali DOHS office (House 412, Road 29, Dhaka). Please call us ahead at 01402494401 before visiting.",
  },
];

export default function ContactClient() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
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
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* 2-Column Section matching screenshot layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-12 sm:mb-16">
        
        {/* Left Column: 4 Cards */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Card 1: Store & Office Location */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#FF4D6D] to-[#FFA07A]" />
            
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#FFF1F4] flex items-center justify-center text-[#FF4D6D] shrink-0 mt-0.5">
                <IconMapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[#171136] text-base sm:text-lg">
                  Store &amp; Office Location
                </h3>
                <p className="text-xs sm:text-sm text-[#5D5589] mt-1.5 leading-relaxed">
                  Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8FF] hover:bg-[#F0EBFA] border border-[#EAE3F7] text-xs font-semibold text-[#171136] transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">Copied</span>
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF1F4] hover:bg-[#FFE4E9] text-[#FF4D6D] text-xs font-semibold transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <IconExternalLink className="w-3 h-3 text-[#FF4D6D]" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Phone & WhatsApp */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#00C48C] to-[#25D366]" />
            
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#E8FBF0] flex items-center justify-center text-[#25D366] shrink-0 mt-0.5">
                <IconPhone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[#171136] text-base sm:text-lg">
                  Phone &amp; WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#5D5589] mt-1">
                  Call us directly or message us for instant support.
                </p>
                <p className="text-lg sm:text-xl font-extrabold text-[#171136] mt-2.5 tracking-tight">
                  01402494401
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <a
                    href="tel:01402494401"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171136] hover:bg-[#2A2159] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <IconPhone className="w-3.5 h-3.5 text-[#FF4D6D]" />
                    <span>Call Hotline</span>
                  </a>
                  <a
                    href="https://wa.me/8801402494401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <IconWhatsApp className="w-3.5 h-3.5" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Email Inquiries */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-[#7B5CFF] to-[#3B82F6]" />
            
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#EFE9FF] flex items-center justify-center text-[#7B5CFF] shrink-0 mt-0.5">
                <IconMail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-display)] font-bold text-[#171136] text-base sm:text-lg">
                  Email Inquiries
                </h3>
                <p className="text-xs sm:text-sm text-[#5D5589] mt-1">
                  For bulk orders, business queries, or order tracking:
                </p>
                <a
                  href="mailto:support@kawaiisubete.com"
                  className="inline-block text-sm sm:text-base font-bold text-[#7B5CFF] hover:underline mt-2"
                >
                  support@kawaiisubete.com
                </a>
                <p className="text-xs text-[#8A84B0] flex items-center gap-1.5 mt-2">
                  <IconClock className="w-3.5 h-3.5 text-[#7B5CFF]" />
                  <span>Response time: Usually within 2–6 hours</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 4: Follow Kawaii Subete (Dark Navy Card) */}
          <div className="bg-[#171136] rounded-3xl p-6 sm:p-7 text-white shadow-lg">
            <h3 className="font-[family-name:var(--font-display)] font-bold text-base sm:text-lg text-white">
              Follow Kawaii Subete
            </h3>
            <p className="text-xs sm:text-sm text-[#C4BDE0] mt-1.5 leading-relaxed">
              Stay updated with fresh anime figures, limited brick drops, and giveaway announcements.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <a
                href="https://www.facebook.com/profile.php?id=61575469209698"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-[#2A2159] hover:bg-[#392E73] border border-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-[#1877F2] flex items-center justify-center text-white shrink-0">
                  <IconFacebook className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Facebook</p>
                  <p className="text-[10px] text-[#A8A1CC] truncate">@kawaiisubete</p>
                </div>
              </a>

              <a
                href="https://www.instagram.com/kawaii.subete/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-2xl bg-[#2A2159] hover:bg-[#392E73] border border-white/10 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center text-white shrink-0">
                  <IconInstagram className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">Instagram</p>
                  <p className="text-[10px] text-[#A8A1CC] truncate">@kawaii.subete</p>
                </div>
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Send a Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-7 sm:p-10 shadow-[0_12px_40px_rgb(0,0,0,0.04)]">
            
            <div className="mb-6">
              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#FF4D6D] bg-[#FFF1F4] px-3 py-1 rounded-full mb-3">
                SEND A MESSAGE
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold text-[#171136]">
                How can we help you today?
              </h2>
              <p className="text-xs sm:text-sm text-[#5D5589] mt-1.5 leading-relaxed">
                Fill out the form below and our customer support team will get back to you promptly.
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
                  Thank you for reaching out to Kawaii Subete. Our team has received your message and will reply to your email shortly.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                
                {errorMsg && (
                  <div className="p-4 rounded-xl bg-[#FFF1F4] border border-[#FFCCD5] text-[#D90429] text-xs font-semibold">
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
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all cursor-pointer"
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
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 rounded-xl border border-[#EAE3F7] bg-[#FAF8FF] text-sm text-[#171136] placeholder-[#A59FC2] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all resize-y leading-relaxed"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF6B8B] hover:from-[#E63958] hover:to-[#FF4D6D] text-white text-sm font-bold shadow-lg shadow-red-500/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
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

      {/* Location Map */}
      <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-8 mb-12 sm:mb-16 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171136]">
              Location Map
            </h3>
            <p className="text-xs sm:text-sm text-[#5D5589] mt-0.5">
              Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka
            </p>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF1F4] hover:bg-[#FFE4E9] text-[#FF4D6D] text-xs font-semibold transition-colors"
          >
            <span>Open in Google Maps</span>
            <IconExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="w-full h-[300px] sm:h-[360px] rounded-2xl overflow-hidden border border-[#EAE3F7]">
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

      {/* Clean FAQ Section */}
      <div className="bg-white rounded-3xl border border-[#EAE3F7] p-7 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
        <div className="max-w-xl mb-7">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-[#7B5CFF] bg-[#EFE9FF] px-3 py-1 rounded-full mb-2">
            COMMON QUESTIONS
          </span>
          <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[#171136]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5D5589] mt-1">
            Quick answers about shipping, payments, and returns.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#F0ECE7] border-y border-[#F0ECE7]">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#171136] hover:text-[#FF4D6D] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span
                    className={`w-7 h-7 rounded-full bg-[#FAF8FF] flex items-center justify-center text-[#7B5CFF] transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-90 bg-[#FFF1F4] text-[#FF4D6D]" : ""
                    }`}
                  >
                    <IconChevronRight className="w-4 h-4" />
                  </span>
                </button>

                {isOpen && (
                  <p className="text-xs sm:text-sm text-[#5D5589] leading-relaxed mt-2.5 pr-6">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
