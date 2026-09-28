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
  subject: "General Inquiry",
  orderNumber: "",
  message: "",
};

const faqs = [
  {
    q: "How long does shipping take?",
    a: "Orders inside Dhaka are typically delivered within 24 to 48 hours. Deliveries outside Dhaka across Bangladesh usually take 48 to 72 hours via express courier.",
  },
  {
    q: "Is Cash on Delivery (COD) supported?",
    a: "Yes. Cash on Delivery is available across all districts in Bangladesh. You can check the parcel condition before completing payment.",
  },
  {
    q: "Are the figures and brick sets original?",
    a: "Yes, every product listed on Kawaii Subete is authentic, high quality, and securely packaged for safe transit.",
  },
  {
    q: "What is your return and replacement policy?",
    a: "We offer a 7-day replacement guarantee if your product arrives damaged, defective, or missing pieces.",
  },
  {
    q: "Can I visit your office in person?",
    a: "Yes, you are welcome to visit our office in Mohakhali DOHS (House 412, Road 29, Dhaka). Please call us ahead at 01402494401 to ensure someone is available to assist you.",
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
        throw new Error("Unable to send your message. Please try again or reach out by phone.");
      }

      setSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please contact us directly by phone or WhatsApp.";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-white border-b border-[#EAE5DF] py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1240px] mx-auto">
          <p className="text-xs font-semibold tracking-wider text-[#8A85A6] uppercase">
            Get in touch
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#171136] mt-2">
            Contact Kawaii Subete
          </h1>
          <p className="text-sm sm:text-base text-[#5A5579] mt-2 max-w-2xl leading-relaxed">
            Have questions about an order, brick set, or anime figure? Reach out to us directly or send a message below.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-white rounded-2xl border border-[#EAE5DF] p-6 sm:p-8 shadow-xs">
              <h2 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171136] mb-6">
                Contact Information
              </h2>

              <div className="flex flex-col gap-6">
                
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#EAE5DF] flex items-center justify-center text-[#171136] shrink-0 mt-0.5">
                    <IconMapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#8A85A6] uppercase">Address</p>
                    <p className="text-sm font-medium text-[#171136] mt-1 leading-relaxed">
                      Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171136] hover:text-[#FF4D6D] transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <IconCheck className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="w-3.5 h-3.5 text-[#8A85A6]" />
                            <span>Copy address</span>
                          </>
                        )}
                      </button>
                      <span className="text-[#D1CADF]">•</span>
                      <a
                        href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171136] hover:text-[#FF4D6D] transition-colors"
                      >
                        <span>Google Maps</span>
                        <IconExternalLink className="w-3 h-3 text-[#8A85A6]" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#F0ECE7]" />

                {/* Phone & WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#EAE5DF] flex items-center justify-center text-[#171136] shrink-0 mt-0.5">
                    <IconPhone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#8A85A6] uppercase">Phone &amp; WhatsApp</p>
                    <a
                      href="tel:01402494401"
                      className="inline-block text-base font-bold text-[#171136] hover:text-[#FF4D6D] mt-1 transition-colors"
                    >
                      01402494401
                    </a>
                    <div className="flex items-center gap-2 mt-3">
                      <a
                        href="tel:01402494401"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171136] text-white text-xs font-semibold hover:bg-[#2A2159] transition-colors"
                      >
                        <IconPhone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      <a
                        href="https://wa.me/8801402494401"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE5DF] bg-white text-[#171136] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
                      >
                        <IconWhatsApp className="w-3.5 h-3.5 text-[#171136]" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#F0ECE7]" />

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#EAE5DF] flex items-center justify-center text-[#171136] shrink-0 mt-0.5">
                    <IconMail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#8A85A6] uppercase">Email</p>
                    <a
                      href="mailto:support@kawaiisubete.com"
                      className="inline-block text-sm font-semibold text-[#171136] hover:text-[#FF4D6D] mt-1 transition-colors"
                    >
                      support@kawaiisubete.com
                    </a>
                  </div>
                </div>

                <div className="border-t border-[#F0ECE7]" />

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#EAE5DF] flex items-center justify-center text-[#171136] shrink-0 mt-0.5">
                    <IconClock className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-[#8A85A6] uppercase">Support Hours</p>
                    <p className="text-sm font-medium text-[#171136] mt-1">
                      Saturday – Friday: 10:00 AM – 9:00 PM
                    </p>
                  </div>
                </div>

                <div className="border-t border-[#F0ECE7]" />

                {/* Social Channels */}
                <div>
                  <p className="text-xs font-semibold text-[#8A85A6] uppercase mb-3">
                    Social Media
                  </p>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://www.facebook.com/profile.php?id=61575469209698"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#EAE5DF] bg-white text-xs font-semibold text-[#171136] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <IconFacebook className="w-3.5 h-3.5 text-[#171136]" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://www.instagram.com/kawaii.subete/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#EAE5DF] bg-white text-xs font-semibold text-[#171136] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <IconInstagram className="w-3.5 h-3.5 text-[#171136]" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Clean Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-[#EAE5DF] p-6 sm:p-8 shadow-xs">
              
              <div className="mb-6">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-[#171136]">
                  Send a message
                </h2>
                <p className="text-sm text-[#5A5579] mt-1">
                  Fill out the form below and we will get back to your email as soon as possible.
                </p>
              </div>

              {success ? (
                <div className="rounded-xl bg-[#FAF8F5] border border-[#EAE5DF] p-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#171136] text-white flex items-center justify-center mx-auto mb-4">
                    <IconCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[#171136]">
                    Thank you! Your message has been sent.
                  </h3>
                  <p className="text-sm text-[#5A5579] mt-2 max-w-md mx-auto">
                    We have received your note and our team will get back to you shortly.
                  </p>
                  
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="px-4 py-2 rounded-lg bg-[#171136] text-white text-xs font-semibold hover:bg-[#2A2159] transition-colors cursor-pointer"
                    >
                      Send another message
                    </button>
                    <Link
                      href="/shop"
                      className="px-4 py-2 rounded-lg border border-[#EAE5DF] text-[#171136] text-xs font-semibold hover:bg-[#FAF8F5] transition-colors"
                    >
                      Browse store
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  
                  {errorMsg && (
                    <div className="p-3.5 rounded-lg bg-[#FFF5F5] border border-[#FED7D7] text-[#C53030] text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-[#171136] mb-1.5">
                        Name <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D0C9] bg-white text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:border-[#171136] focus:ring-1 focus:ring-[#171136] transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-[#171136] mb-1.5">
                        Email address <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D0C9] bg-white text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:border-[#171136] focus:ring-1 focus:ring-[#171136] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-semibold text-[#171136] mb-1.5">
                        Phone number <span className="text-xs text-[#8A85A6] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D0C9] bg-white text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:border-[#171136] focus:ring-1 focus:ring-[#171136] transition-colors"
                      />
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-semibold text-[#171136] mb-1.5">
                        Subject
                      </label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D0C9] bg-white text-sm text-[#171136] focus:outline-none focus:border-[#171136] focus:ring-1 focus:ring-[#171136] transition-colors cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order & Shipping">Order &amp; Shipping</option>
                        <option value="Product Availability">Product Availability</option>
                        <option value="Returns & Exchange">Returns &amp; Exchange</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Order ID */}
                  <div>
                    <label className="block text-xs font-semibold text-[#171136] mb-1.5">
                      Order ID <span className="text-xs text-[#8A85A6] font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={form.orderNumber}
                      onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                      placeholder="e.g. KS-1029"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D0C9] bg-white text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:border-[#171136] focus:ring-1 focus:ring-[#171136] transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#171136] mb-1.5">
                      Message <span className="text-[#FF4D6D]">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help?"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5D0C9] bg-white text-sm text-[#171136] placeholder-[#9E97C2] focus:outline-none focus:border-[#171136] focus:ring-1 focus:ring-[#171136] transition-colors resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#171136] hover:bg-[#2A2159] text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <IconSend className="w-3.5 h-3.5" />
                          <span>Send message</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl border border-[#EAE5DF] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="font-[family-name:var(--font-display)] text-base font-bold text-[#171136]">
                Location Map
              </h3>
              <p className="text-xs text-[#5A5579] mt-0.5">
                Mohakhali DOHS, House No-412, Flat-3/A &amp; 3/B Road No-29, Dhaka
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Mohakhali+DOHS+House+412+Road+29+Dhaka"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#171136] hover:text-[#FF4D6D] transition-colors"
            >
              <span>Open in Maps</span>
              <IconExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-[300px] sm:h-[360px] rounded-xl overflow-hidden border border-[#EAE5DF]">
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
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-white border-t border-[#EAE5DF] py-12 sm:py-16">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[#171136]">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5579] mt-1.5">
              Quick answers to common questions about orders, shipping, and returns.
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
                    className="w-full text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#171136] hover:text-[#FF4D6D] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span
                      className={`text-[#8A85A6] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-90 text-[#171136]" : ""
                      }`}
                    >
                      <IconChevronRight className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <p className="text-xs sm:text-sm text-[#5A5579] leading-relaxed mt-2.5 pr-6">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
