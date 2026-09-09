"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  IconShield,
  IconBag,
  IconCheck,
  IconCopy,
  IconTruck,
  IconArrowRight,
  IconMail,
  IconPhone,
  IconReturn,
} from "./icons";

interface OrderItem {
  id?: string;
  name: string;
  subtitle?: string;
  category?: string;
  price: number;
  quantity: number;
  image?: string;
  cardBg?: string;
}

interface OrderDetails {
  id?: string | number;
  order_number: string;
  first_name?: string;
  last_name?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  city?: string;
  district?: string;
  address?: string;
  shipping_address?: string;
  total_amount: number;
  subtotal?: number;
  discount_amount?: number;
  discount_code?: string;
  shipping_cost?: number;
  created_at?: string;
  items: OrderItem[];
}

// Default demonstration items matching brickverse-thankyou.svg
const DEFAULT_DEMO_ORDER: OrderDetails = {
  order_number: "#KS-10482",
  customer_name: "Valued Customer",
  customer_email: "customer@kawaiisubete.com",
  customer_phone: "+880 1712-345678",
  district: "Dhaka",
  shipping_address: "House 12, Road 4, Uttara, Dhaka, Bangladesh",
  total_amount: 130.98,
  subtotal: 130.98,
  discount_amount: 0,
  shipping_cost: 0,
  items: [
    {
      id: "neo-samurai",
      name: "Neo Samurai",
      subtitle: "Ronin edition · 1/7 scale",
      price: 34.99,
      quantity: 1,
      image: "/images/figure-samurai-red.svg",
      cardBg: "#FFEAF0",
    },
    {
      id: "galaxy-station",
      name: "Galaxy Station",
      subtitle: "1,240 pieces · Bricks & sets",
      price: 79.99,
      quantity: 1,
      image: "/images/bricks-castle-navy.svg",
      cardBg: "#E4F7F8",
    },
    {
      id: "robo-coder",
      name: "Robo Coder",
      subtitle: "Starter robot · block coding kit",
      price: 16.0,
      quantity: 1,
      image: "/images/robot-gold.svg",
      cardBg: "#FFF4DA",
    },
  ],
};

export default function ThankYouPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [order, setOrder] = useState<OrderDetails>(DEFAULT_DEMO_ORDER);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there is a recently placed order in sessionStorage
    try {
      const stored = sessionStorage.getItem("last_placed_order");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          // Normalize items with images/backgrounds if missing
          const bgColors = ["#FFEAF0", "#E4F7F8", "#FFF4DA", "#EFE9FF"];
          const normalizedItems = (parsed.items || []).map((it: any, idx: number) => ({
            name: it.name || "Collector Product",
            subtitle: it.subtitle || "Collector Series · Official Edition",
            price: Number(it.price) || 0,
            quantity: Number(it.quantity) || 1,
            image: it.image || "/images/figure-samurai-red.svg",
            cardBg: it.cardBg || bgColors[idx % bgColors.length],
          }));

          setOrder({
            order_number: parsed.order_number || `#KS-${Math.floor(10000 + Math.random() * 90000)}`,
            customer_name: parsed.customer_name || (parsed.first_name ? `${parsed.first_name} ${parsed.last_name || ""}`.trim() : "Valued Customer"),
            customer_email: parsed.customer_email || user?.email || "customer@kawaiisubete.com",
            customer_phone: parsed.customer_phone || "+880 1XXX-XXXXXX",
            district: parsed.district || parsed.city || "Dhaka",
            shipping_address: parsed.shipping_address || (parsed.address ? `${parsed.address}, ${parsed.district || "Dhaka"}, Bangladesh` : "House 12, Road 4, Uttara, Dhaka"),
            total_amount: Number(parsed.total_amount) || normalizedItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
            subtotal: normalizedItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
            discount_amount: Number(parsed.discount_amount) || 0,
            discount_code: parsed.discount_code,
            shipping_cost: Number(parsed.shipping_cost) || 0,
            items: normalizedItems.length > 0 ? normalizedItems : DEFAULT_DEMO_ORDER.items,
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Could not retrieve stored order", e);
    }

    // Check URL query param order_id or order_number
    const queryOrderNum = searchParams.get("order_number") || searchParams.get("order_id");
    if (queryOrderNum) {
      setOrder((prev) => ({
        ...prev,
        order_number: queryOrderNum.startsWith("#") ? queryOrderNum : `#${queryOrderNum}`,
      }));
    }
  }, [searchParams, user]);

  const handleCopyOrderNumber = () => {
    if (!order.order_number) return;
    navigator.clipboard.writeText(order.order_number.replace("#", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const totalItemsCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FFF6EE] flex flex-col font-[family-name:var(--font-sans)]">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BAR (Matches brickverse-thankyou.svg) */}
      {/* ========================================================================= */}
      <div
        className="w-full h-10 px-4 flex items-center justify-center text-white text-xs font-semibold shadow-xs"
        style={{
          background: "linear-gradient(90deg, #FF4D6D 0%, #B045F0 55%, #4B7BFF 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <IconShield className="w-3.5 h-3.5 fill-white/20" />
          <span>Your order is confirmed · thank you for shopping with us</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. NAVBAR (Matches brickverse-thankyou.svg) */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-[#EAE3F7]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 h-20 sm:h-22 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-8.5 bg-[#FF4D6D] rounded-xl flex items-center justify-center shadow-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
              <div className="absolute -top-1 left-1.5 w-3 h-2 bg-[#FF4D6D] rounded-xs" />
              <div className="absolute -top-1 right-1.5 w-3 h-2 bg-[#FF4D6D] rounded-xs" />
            </div>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136] tracking-tight leading-none">
                Brickverse
              </span>
              <span className="text-[10px] sm:text-[10.5px] font-medium text-[#736E9B]">
                figures · bricks · code kits
              </span>
            </div>
          </Link>

          {/* Cart Bag Icon with 0 count (Empty cart state after successful checkout) */}
          <Link
            href="/cart"
            aria-label="View Cart"
            className="w-10 h-10 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <IconBag className="w-4.5 h-4.5 text-[#171136]" />
            <span className="absolute -top-1 -right-1 bg-[#2ECC8F] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. HERO CONFIRMATION SECTION (Matches brickverse-thankyou.svg) */}
      {/* ========================================================================= */}
      <section
        className="w-full relative overflow-hidden py-10 sm:py-14 border-b border-[#EAE3F7]"
        style={{
          background: "linear-gradient(135deg, #FFF8F0 0%, #FFF1F4 100%)",
        }}
      >
        {/* Decorative Floating Confetti Dots */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <span className="absolute top-8 left-[12%] w-3 h-3 rounded-full bg-[#FF4D6D]/30" />
          <span className="absolute top-28 left-[18%] w-2.5 h-2.5 rounded-full bg-[#13BFC9]/25" />
          <span className="absolute top-12 left-[29%] w-2 h-2 rounded-full bg-[#FFC93C]/35" />
          <span className="absolute bottom-6 left-[40%] w-3.5 h-3.5 rounded-full bg-[#7B5CFF]/20" />
          <span className="absolute top-10 right-[37%] w-2.5 h-2.5 rounded-full bg-[#FF4D6D]/28" />
          <span className="absolute bottom-8 right-[27%] w-3 h-3 rounded-full bg-[#13BFC9]/22" />
          <span className="absolute top-16 right-[16%] w-2 h-2 rounded-full bg-[#FFC93C]/30" />
          <span className="absolute bottom-10 right-[8%] w-2.5 h-2.5 rounded-full bg-[#7B5CFF]/25" />
          <span className="absolute top-24 left-[8%] w-2 h-2 rounded-full bg-[#2ECC8F]/20" />
          <span className="absolute top-20 right-[22%] w-2 h-2 rounded-full bg-[#2ECC8F]/20" />
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
          {/* Pulsing Concentric Green Checkmark Circle */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="absolute w-26 h-26 rounded-full border border-[#2ECC8F]/15 animate-ping duration-1000" />
            <div className="absolute w-22 h-22 rounded-full border-2 border-[#2ECC8F]/25" />
            <div className="w-19 h-19 rounded-full bg-[#2ECC8F] flex items-center justify-center text-white shadow-lg shadow-[#2ECC8F]/30">
              <IconCheck className="w-9 h-9 stroke-[3]" />
            </div>
          </div>

          {/* Title & Subtitles */}
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl md:text-[32px] text-[#171136] tracking-tight mb-2">
            Thank you for your order!
          </h1>
          <p className="text-sm sm:text-base text-[#736E9B] max-w-lg mb-1">
            We&apos;ve received your order and will have it on its way shortly.
          </p>
          <p className="text-xs sm:text-sm text-[#736E9B] max-w-lg mb-6">
            A confirmation email has been sent to{" "}
            <strong className="text-[#171136] font-semibold">{order.customer_email || "your email inbox"}</strong>.
          </p>

          {/* Interactive Order Number Pill with Copy Button */}
          <div className="inline-flex items-center gap-3 bg-white border border-[#EAE3F7] rounded-full px-5 sm:px-6 py-2.5 sm:py-3 shadow-xs">
            <span className="text-xs sm:text-[13px] font-medium text-[#736E9B]">
              Order number:
            </span>
            <span className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136] tracking-tight font-mono">
              {order.order_number}
            </span>
            <button
              type="button"
              onClick={handleCopyOrderNumber}
              aria-label="Copy order number"
              className="ml-1 p-1.5 rounded-full hover:bg-[#F6F1FF] text-[#736E9B] hover:text-[#FF4D6D] transition-colors cursor-pointer active:scale-90"
              title="Copy to clipboard"
            >
              {copied ? (
                <span className="text-xs font-bold text-[#2ECC8F] flex items-center gap-1">
                  <IconCheck className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </span>
              ) : (
                <IconCopy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MAIN CONTENT CONTAINER (2 COLUMNS: LEFT DETAILS + RIGHT SUMMARY) */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: ORDER ITEMS, DELIVERY DETAILS & NEXT STEPS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6">
            {/* --- Card 1: Your items (Matches brickverse-thankyou.svg) --- */}
            <div className="bg-white rounded-3xl sm:rounded-[22px] border border-[#EAE3F7] p-5 sm:p-7 shadow-[0_8px_30px_rgba(23,17,54,0.06)]">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3F7] mb-5">
                <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136]">
                  Your items
                </h2>
                <span className="text-xs sm:text-[13px] font-medium text-[#736E9B]">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#EAE3F7]">
                {order.items.map((it, idx) => {
                  const bgColors = ["#FFEAF0", "#E4F7F8", "#FFF4DA", "#EFE9FF"];
                  const itemBg = it.cardBg || bgColors[idx % bgColors.length];

                  return (
                    <div
                      key={it.id || idx}
                      className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                    >
                      {/* Thumbnail with generous padding & complete illustration visibility */}
                      <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                        <div
                          className="w-[72px] h-[72px] rounded-[18px] flex items-center justify-center p-2 shrink-0 overflow-hidden"
                          style={{ backgroundColor: itemBg }}
                        >
                          <Image
                            src={it.image || "/images/figure-samurai-red.svg"}
                            alt={it.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-contain drop-shadow-sm"
                            unoptimized
                          />
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 min-w-0 space-y-0.5">
                          <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136] truncate">
                            {it.name}
                          </h3>
                          <p className="text-xs text-[#736E9B] truncate">
                            {it.subtitle || it.category || "Collector Series"}
                          </p>
                          <span className="inline-block text-[11.5px] font-semibold text-[#3B3468] pt-0.5">
                            Qty: {it.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Line Price */}
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136] font-mono shrink-0">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --- Card 2: Delivery details (Matches brickverse-thankyou.svg) --- */}
            <div className="bg-white rounded-3xl sm:rounded-[22px] border border-[#EAE3F7] p-5 sm:p-7 shadow-[0_8px_30px_rgba(23,17,54,0.06)]">
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136] mb-5">
                Delivery details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Sub-Column: Shipping Address */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                    Shipping address
                  </span>
                  <p className="font-bold text-sm text-[#171136]">
                    {order.customer_name || "Valued Customer"}
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#3B3468]">
                    {order.shipping_address || "House 12, Road 4, Uttara, Dhaka"}
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#3B3468]">
                    {order.district || "Dhaka"}, Bangladesh
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#3B3468] pt-1">
                    {order.customer_phone || "+880 1XXX-XXXXXX"}
                  </p>
                </div>

                {/* Right Sub-Column: Payment Method */}
                <div className="space-y-1.5">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                    Payment
                  </span>
                  <p className="font-bold text-sm text-[#171136]">
                    Cash on delivery
                  </p>
                  <p className="text-xs sm:text-[13px] text-[#3B3468]">
                    Pay the courier when your order arrives
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: ORDER SUMMARY CARD & ACTION BUTTONS */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-3xl sm:rounded-[22px] border border-[#EAE3F7] p-5 sm:p-7 shadow-[0_8px_30px_rgba(23,17,54,0.06)] space-y-5 lg:sticky lg:top-6">
            {/* Summary Title */}
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136]">
              Order summary
            </h2>

            {/* Breakdown (NO TAX per user requirements) */}
            <div className="space-y-3 text-xs sm:text-[13.5px] text-[#736E9B]">
              <div className="flex items-center justify-between">
                <span>Subtotal ({totalItemsCount} {totalItemsCount === 1 ? "item" : "items"})</span>
                <span className="font-bold text-[#3B3468] font-mono">
                  {formatPrice(order.subtotal || order.total_amount)}
                </span>
              </div>

              {order.discount_amount && order.discount_amount > 0 ? (
                <div className="flex items-center justify-between text-[#2ECC8F]">
                  <span className="font-semibold">Discount · {order.discount_code || "BUILD10"}</span>
                  <span className="font-bold font-mono">-{formatPrice(order.discount_amount)}</span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-bold text-[#3B3468] font-mono">
                  {formatPrice(order.shipping_cost !== undefined ? order.shipping_cost : 60)}
                </span>
              </div>
            </div>

            <hr className="border-[#EAE3F7]" />

            {/* Total Paid Row */}
            <div className="flex items-baseline justify-between pt-1">
              <span className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136]">
                Total paid
              </span>
              <div className="text-right">
                <span className="text-[11px] font-bold text-[#736E9B] mr-1.5 uppercase">BDT</span>
                <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] text-[#171136] font-mono">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>

            <hr className="border-[#EAE3F7]" />

            {/* Payment Method Badge */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                Payment method
              </span>
              <div className="bg-[#EFFBF6] border border-[#2ECC8F] rounded-xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2ECC8F]" />
                  <span className="text-xs sm:text-[13px] font-bold text-[#171136]">
                    Cash on delivery
                  </span>
                </div>
                <span className="font-[family-name:var(--font-display)] font-extrabold text-xs sm:text-sm text-[#171136] font-mono">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="space-y-3 pt-2">
              {/* Primary: Track Your Order */}
              <Link
                href="/dashboard"
                className="w-full py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E6004C] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#FF4D6D]/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <IconTruck className="w-5 h-5 text-white" />
                <span>Track your order</span>
              </Link>

              {/* Secondary: Continue Shopping */}
              <Link
                href="/shop"
                className="w-full py-4 rounded-full bg-white hover:bg-[#FAF7FD] active:scale-[0.99] border border-[#EAE3F7] text-[#171136] font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
              >
                <IconArrowRight className="w-5 h-5 text-[#171136]" />
                <span>Continue shopping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. BOTTOM 3 HELP / SUPPORT CARDS (Matches brickverse-thankyou.svg) */}
        {/* ========================================================================= */}
        <section className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Need help? (Email) */}
            <div className="bg-white rounded-2xl border border-[#EAE3F7] p-5 shadow-[0_4px_16px_rgba(23,17,54,0.04)] flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEAF0] flex items-center justify-center text-[#FF4D6D] shrink-0">
                <IconMail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-[15px] text-[#171136]">
                  Need help?
                </h3>
                <p className="text-xs text-[#736E9B] mt-0.5">
                  Reach us at <a href="mailto:hi@brickverse.com.bd" className="hover:text-[#FF4D6D] underline">hi@brickverse.com.bd</a>
                </p>
              </div>
            </div>

            {/* Card 2: Call us (Phone) */}
            <div className="bg-white rounded-2xl border border-[#EAE3F7] p-5 shadow-[0_4px_16px_rgba(23,17,54,0.04)] flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#E4F7F8] flex items-center justify-center text-[#13BFC9] shrink-0">
                <IconPhone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-[15px] text-[#171136]">
                  Call us
                </h3>
                <p className="text-xs text-[#736E9B] mt-0.5">
                  +880 1700-000001 · Mon–Fri 9am–5pm
                </p>
              </div>
            </div>

            {/* Card 3: Returns (Policy) */}
            <div className="bg-white rounded-2xl border border-[#EAE3F7] p-5 shadow-[0_4px_16px_rgba(23,17,54,0.04)] flex items-center gap-4 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-2xl bg-[#EFE9FF] flex items-center justify-center text-[#7B5CFF] shrink-0">
                <IconReturn className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-[15px] text-[#171136]">
                  Returns
                </h3>
                <p className="text-xs text-[#736E9B] mt-0.5">
                  Changed your mind? 7-day easy returns
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* 6. MINIMAL FOOTER (Matches brickverse-thankyou.svg) */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-[#EAE3F7] py-8 sm:py-10 mt-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-7 bg-[#FF4D6D] rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-white" />
                  <div className="w-1 h-1 rounded-full bg-white" />
                </div>
              </div>
              <span className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                Brickverse
              </span>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#736E9B] font-medium">
              <Link href="#" className="hover:text-[#171136] transition-colors">
                Refund policy
              </Link>
              <Link href="#" className="hover:text-[#171136] transition-colors">
                Privacy policy
              </Link>
              <Link href="#" className="hover:text-[#171136] transition-colors">
                Terms of service
              </Link>
              <Link href="#" className="hover:text-[#171136] transition-colors">
                Contact us
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center sm:text-left text-xs text-[#9C96BE] pt-4 border-t border-[#EAE3F7]">
            © 2026 Brickverse Pty Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
