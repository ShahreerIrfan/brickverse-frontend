"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatPrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  IconChevronRight,
  IconHeart,
  IconBag,
  IconTrash,
  IconTruck,
  IconArrowRight,
  IconLock,
  IconCash,
  IconTicket,
  IconMinus,
  IconPlus,
  IconClose,
  IconCheck,
  IconSparkles,
} from "./icons";

// Upsell recommendation products matching brickverse-cart.svg
const UPSELL_PRODUCTS = [
  {
    id: "upsell-mecha-pilot",
    name: "Mecha Pilot",
    subtitle: "Zero deluxe box set",
    category: "Anime figures",
    categoryColor: "#FF4D6D",
    badge: "HOT",
    badgeColor: "#FF4D6D",
    rating: 4.9,
    reviews: 94,
    price: 58.0,
    priceFormatted: "৳58.00",
    image: "/images/figure-mecha-teal.svg",
    cardBg: "#FFEAF0",
    accent: "#FF4D6D",
    slug: "mecha-pilot",
  },
  {
    id: "upsell-sky-ninja",
    name: "Sky Ninja",
    subtitle: "Kage limited colourway",
    category: "Anime figures",
    categoryColor: "#13BFC9",
    badge: "-25%",
    badgeColor: "#13BFC9",
    rating: 4.6,
    reviews: 212,
    price: 29.5,
    originalPrice: 39.0,
    priceFormatted: "৳29.50",
    originalPriceFormatted: "৳39.00",
    image: "/images/figure-ninja-gold.svg",
    cardBg: "#E4F7F8",
    accent: "#13BFC9",
    slug: "sky-ninja",
  },
  {
    id: "upsell-ronin-base",
    name: "Ronin Base",
    subtitle: "Display stand · walnut",
    category: "Accessories",
    categoryColor: "#E8A317",
    badge: "ADD-ON",
    badgeColor: "#E8A317",
    rating: 4.7,
    reviews: 58,
    price: 18.0,
    priceFormatted: "৳18.00",
    image: "/images/bricks-stack-sunny.svg",
    cardBg: "#FFF4DA",
    accent: "#E8A317",
    slug: "ronin-base",
  },
  {
    id: "upsell-circuit-lab",
    name: "Circuit Lab",
    subtitle: "40 build-along projects",
    category: "Coding kits",
    categoryColor: "#7B5CFF",
    badge: "-23%",
    badgeColor: "#7B5CFF",
    rating: 4.6,
    reviews: 264,
    price: 49.99,
    originalPrice: 65.0,
    priceFormatted: "৳49.99",
    originalPriceFormatted: "৳65.00",
    image: "/images/robot-purple.svg",
    cardBg: "#EFE9FF",
    accent: "#7B5CFF",
    slug: "circuit-lab",
  },
];

const AVAILABLE_COUPONS = [
  { code: "BUILD10", discountPercent: 10, description: "10% off on your entire cart" },
  { code: "BRICK20", discountPercent: 20, description: "20% off on orders over ৳1,000" },
];

export default function CartPage() {
  const {
    items,
    totalItems,
    subtotal,
    subtotalFormatted,
    isFreeDeliveryUnlocked,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    updateQuantity,
    removeFromCart,
    addToCart,
    clearCart,
  } = useCart();

  const { isAuthenticated, openLoginModal } = useAuth();

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [savedForLaterIds, setSavedForLaterIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    const matched = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (matched) {
      if (code === "BRICK20" && subtotal < 1000) {
        setCouponError("BRICK20 requires minimum order value of ৳1,000.00");
        return;
      }
      setAppliedCoupon(matched);
      setCouponError("");
      setCouponInput("");
      showToast(`Coupon "${matched.code}" applied! (${matched.discountPercent}% OFF)`);
    } else {
      setCouponError("Invalid promo code. Try BUILD10 or BRICK20");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showToast("Promo coupon removed");
  };

  const handleSaveForLater = (item: any) => {
    if (savedForLaterIds.includes(item.id)) {
      setSavedForLaterIds((prev) => prev.filter((id) => id !== item.id));
      showToast(`"${item.name}" moved back to active cart`);
    } else {
      setSavedForLaterIds((prev) => [...prev, item.id]);
      showToast(`"${item.name}" saved for later!`);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openLoginModal();
    } else {
      alert("Redirecting to Brickverse Secure Checkout...");
    }
  };

  // Calculations
  const discountRate = appliedCoupon ? appliedCoupon.discountPercent / 100 : 0;
  const discountAmount = subtotal * discountRate;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingCost = isFreeDeliveryUnlocked || subtotal === 0 ? 0 : 60;
  const estimatedTax = discountedSubtotal * 0.1; // 10% standard tax estimate
  const estimatedTotal = discountedSubtotal + (discountedSubtotal > 0 ? shippingCost : 0) + (discountedSubtotal > 0 ? estimatedTax : 0);

  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-8 font-[family-name:var(--font-sans)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[80] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#171136] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold border border-[#7B5CFF]/30">
            <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
              ✓
            </span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. BREADCRUMBS (Matches brickverse-cart.svg) */}
      {/* ========================================================================= */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#736E9B] mb-3">
        <Link href="/" className="hover:text-[#171136] transition-colors">
          Home
        </Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA]" />
        <span className="font-bold text-[#171136]">Shopping cart</span>
      </nav>

      {/* ========================================================================= */}
      {/* 2. PAGE HEADER ROW */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="flex items-baseline gap-3">
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[32px] text-[#171136] tracking-tight">
            Your cart
          </h1>
          <span className="text-sm sm:text-base font-medium text-[#736E9B]">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF4D6D] hover:text-[#E6004C] transition-colors group cursor-pointer"
        >
          <span>Continue shopping</span>
          <IconArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ========================================================================= */}
      {/* 3. TWO-COLUMN LAYOUT: CART ITEMS (LEFT) + ORDER SUMMARY (RIGHT) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN: CART ITEMS CARD */}
        {/* ======================================================================= */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl sm:rounded-[24px] border border-[#EAE3F7] p-5 sm:p-7 shadow-[0_8px_30px_rgba(23,17,54,0.06)]">
          {items.length === 0 ? (
            /* --- EMPTY CART STATE --- */
            <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#FFEAF0] flex items-center justify-center text-[#FF4D6D] mb-5 shadow-inner">
                <IconBag className="w-12 h-12 stroke-[1.5]" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136] mb-2">
                Your cart is empty
              </h2>
              <p className="text-xs sm:text-sm text-[#736E9B] max-w-sm mb-6">
                Looks like you haven&apos;t added any figures, brick sets, or STEM coding kits to your cart yet.
              </p>
              <Link
                href="/shop"
                className="px-8 py-3.5 rounded-full bg-[#FF4D6D] hover:bg-[#E6004C] text-white font-bold text-sm shadow-lg shadow-[#FF4D6D]/25 transition-all active:scale-95 flex items-center gap-2"
              >
                <span>Start Shopping</span>
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* --- POPULATED CART ITEMS LIST --- */
            <div>
              {/* Card Sub-Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE3F7] mb-5">
                <h2 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136]">
                  {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
                </h2>
                <span className="text-xs font-semibold text-[#736E9B]">
                  Unit price
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#EAE3F7]">
                {items.map((item, index) => {
                  const isSaved = savedForLaterIds.includes(item.id);
                  // Deterministic pastel background for thumbnails matching design
                  const bgColors = ["#FFEAF0", "#E4F7F8", "#FFF4DA", "#EFE9FF"];
                  const itemBg = item.cardBg || bgColors[index % bgColors.length];

                  return (
                    <div
                      key={item.id}
                      className={`py-5 sm:py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 transition-opacity ${
                        isSaved ? "opacity-60 bg-[#FAF7FD]/50 -mx-3 px-3 rounded-2xl" : ""
                      }`}
                    >
                      {/* Left: Thumbnail + Title & Metadata */}
                      <div className="flex items-center gap-3.5 sm:gap-4.5 flex-1 min-w-0">
                        {/* Thumbnail Box */}
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shrink-0 p-2.5 relative overflow-hidden transition-transform group-hover:scale-105"
                          style={{ backgroundColor: itemBg }}
                        >
                          <Image
                            src={item.image || "/images/figure-samurai-red.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="object-contain max-h-full max-w-full drop-shadow-sm"
                            unoptimized
                          />
                        </div>

                        {/* Text Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <Link
                            href={`/product/${item.slug || item.id}`}
                            className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136] hover:text-[#FF4D6D] transition-colors line-clamp-1 cursor-pointer block"
                          >
                            {item.name}
                          </Link>

                          <p className="text-xs sm:text-[13px] text-[#736E9B] line-clamp-1 font-normal">
                            {item.subtitle || `${item.category || "Collector Series"} · Official edition`}
                          </p>

                          {/* Action links: Save for later | Remove */}
                          <div className="flex items-center gap-3 pt-1.5 text-xs">
                            <button
                              type="button"
                              onClick={() => handleSaveForLater(item)}
                              className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                                isSaved ? "text-[#FF4D6D]" : "text-[#736E9B] hover:text-[#FF4D6D]"
                              }`}
                            >
                              <IconHeart className={`w-3.5 h-3.5 ${isSaved ? "fill-[#FF4D6D]" : ""}`} />
                              <span>{isSaved ? "Saved" : "Save for later"}</span>
                            </button>

                            <span className="w-px h-3 bg-[#EAE3F7]" />

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="flex items-center gap-1.5 text-[#D2455C] hover:text-[#b3273e] font-semibold transition-colors cursor-pointer"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity Stepper + Unit Price */}
                      <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0">
                        {/* Stepper Pill */}
                        <div className="bg-white border border-[#EAE3F7] rounded-full px-2.5 py-1 flex items-center gap-3 shadow-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 rounded-full hover:bg-[#F6F1FF] flex items-center justify-center text-[#171136] active:scale-90 transition-all cursor-pointer"
                          >
                            <IconMinus className="w-3 h-3" />
                          </button>

                          <span className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-[15px] text-[#171136] min-w-[16px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-7 h-7 rounded-full hover:bg-[#F6F1FF] flex items-center justify-center text-[#171136] active:scale-90 transition-all cursor-pointer"
                          >
                            <IconPlus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Prices */}
                        <div className="text-right">
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-[#736E9B] line-through font-medium">
                              {formatPrice(item.originalPrice)}
                            </p>
                          )}
                          <p className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136] font-mono">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-6 mt-6 border-t border-[#EAE3F7] flex items-center justify-between text-xs text-[#736E9B]">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[#D2455C] hover:underline font-semibold cursor-pointer"
                >
                  Clear all items
                </button>
                <div className="flex items-center gap-2">
                  <IconSparkles className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  <span>Free returns within 30 days</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN: ORDER SUMMARY CARD (Matches brickverse-cart.svg) */}
        {/* ======================================================================= */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl sm:rounded-[26px] border border-[#EAE3F7] overflow-hidden shadow-[0_12px_36px_rgba(23,17,54,0.08)] lg:sticky lg:top-6">
          {/* Top Gradient Banner Header */}
          <div
            className="p-5 sm:p-6 text-white flex items-center justify-between"
            style={{
              background: "linear-gradient(135deg, #241A55 0%, #3E1C86 100%)",
            }}
          >
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-white">
              Order summary
            </h2>
            <span className="text-xs sm:text-sm font-medium text-[#D9D0F5]">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Promo Code Box */}
            <div className="bg-[#FFF1F4] rounded-2xl p-3.5 sm:p-4 border border-[#FFD9E2] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-[13px] font-bold text-[#FF4D6D]">
                  <IconTicket className="w-4 h-4 shrink-0" />
                  <span>Have a promo code?</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCouponsModal(!showCouponsModal)}
                  className="text-xs font-bold text-[#FF4D6D] underline hover:text-[#E6004C] transition-colors cursor-pointer"
                >
                  {showCouponsModal ? "Hide coupons" : "Available coupons"}
                </button>
              </div>

              {/* Promo Input Row */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. BUILD10)"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  className="bg-white border border-[#FFD9E2] rounded-xl px-3 py-2 text-xs text-[#171136] font-semibold outline-none focus:border-[#FF4D6D] flex-1 min-w-0 uppercase placeholder:normal-case placeholder:text-[#B9B2DA]"
                />
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 rounded-xl bg-[#FF4D6D] hover:bg-[#E6004C] text-white text-xs font-bold transition-colors shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-[#D2455C] font-semibold">{couponError}</p>
              )}

              {/* Applied Coupon Pill */}
              {appliedCoupon && (
                <div className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-[#A7F3D0] shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#065F46]">
                    <span className="w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-extrabold">
                      ✓
                    </span>
                    <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    aria-label="Remove coupon"
                    className="text-[#736E9B] hover:text-[#D2455C] p-1 cursor-pointer transition-colors"
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Expanded Available Coupons List */}
              {showCouponsModal && (
                <div className="pt-2 border-t border-[#FFD9E2] space-y-2">
                  <p className="text-[11px] font-bold text-[#736E9B]">Click to apply coupon:</p>
                  {AVAILABLE_COUPONS.map((cpn) => (
                    <div
                      key={cpn.code}
                      onClick={() => handleApplyCoupon(cpn.code)}
                      className="bg-white p-2.5 rounded-xl border border-[#FFD9E2] hover:border-[#FF4D6D] cursor-pointer transition-all flex items-center justify-between gap-2"
                    >
                      <div>
                        <span className="text-xs font-extrabold text-[#FF4D6D] bg-[#FFF1F4] px-2 py-0.5 rounded-md">
                          {cpn.code}
                        </span>
                        <p className="text-[11px] text-[#736E9B] mt-1">{cpn.description}</p>
                      </div>
                      <span className="text-xs font-bold text-[#FF4D6D]">Apply →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Free Delivery Tracker Bar (Only shown when not yet unlocked) */}
            {!isFreeDeliveryUnlocked && freeDeliveryRemaining > 0 && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#3B3468]">
                    <IconTruck className="w-4 h-4 text-[#FF4D6D] shrink-0" />
                    <span>
                      Add <strong className="text-[#FF4D6D] font-extrabold">{formatPrice(freeDeliveryRemaining)}</strong> more for FREE delivery
                    </span>
                  </div>

                  {/* Gradient Progress Bar */}
                  <div className="w-full bg-[#F0EBFA] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progressPercent}%`,
                        background: "linear-gradient(90deg, #FF9F43 0%, #FFC93C 100%)",
                      }}
                    />
                  </div>
                </div>
                <hr className="border-[#EAE3F7]" />
              </>
            )}

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-[13.5px] text-[#736E9B]">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#3B3468] font-mono">{subtotalFormatted}</span>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-[#2ECC8F]">
                  <span className="font-semibold">Discount · {appliedCoupon.code}</span>
                  <span className="font-bold font-mono">-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span>Estimated shipping</span>
                <span className="font-bold text-[#2ECC8F]">
                  {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Estimated tax (10%)</span>
                <span className="font-bold text-[#3B3468] font-mono">
                  {formatPrice(estimatedTax)}
                </span>
              </div>
            </div>

            <hr className="border-[#EAE3F7]" />

            {/* Total Row */}
            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136]">
                  Estimated total
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-[#736E9B] mr-1.5 uppercase">BDT</span>
                <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] text-[#171136] font-mono">
                  {formatPrice(estimatedTotal)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="w-full py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E6004C] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-base shadow-lg shadow-[#FF4D6D]/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Proceed to checkout</span>
              <IconArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-xs text-[#3B3468] font-semibold">
              <div className="flex items-center gap-1.5">
                <IconLock className="w-4 h-4 text-[#2ECC8F]" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconCash className="w-4 h-4 text-[#2ECC8F]" />
                <span>Cash on delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM UPSELL SECTION: "COMPLETE THE SET — YOU MIGHT ALSO LIKE" */}
      {/* ========================================================================= */}
      <section className="mt-14 sm:mt-20 pt-10 border-t border-[#EAE3F7]">
        {/* Section Header with Pink Accent Bar */}
        <div className="flex items-start gap-3.5 mb-8">
          <div className="w-1.5 h-10 bg-[#FF4D6D] rounded-full shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF4D6D] block">
              Complete the set
            </span>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
              You might also like
            </h2>
          </div>
        </div>

        {/* 4-Product Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {UPSELL_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl sm:rounded-[24px] border border-[#EAE3F7] overflow-hidden shadow-[0_8px_24px_rgba(23,17,54,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Product Card Top Banner */}
              <div
                className="relative h-48 sm:h-52 w-full p-4 flex items-center justify-center overflow-hidden transition-colors"
                style={{ backgroundColor: prod.cardBg }}
              >
                {/* Floating Badge (HOT, -25%, ADD-ON, etc) */}
                <span
                  className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[10.5px] font-extrabold text-white shadow-xs tracking-wide"
                  style={{ backgroundColor: prod.badgeColor }}
                >
                  {prod.badge}
                </span>

                {/* Floating Wishlist Heart */}
                <button
                  type="button"
                  aria-label={`Add ${prod.name} to wishlist`}
                  className="absolute top-3.5 right-3.5 w-8.5 h-8.5 rounded-full bg-white/90 hover:bg-white text-[#736E9B] hover:text-[#FF4D6D] shadow-xs flex items-center justify-center transition-all cursor-pointer active:scale-90"
                >
                  <IconHeart className="w-4 h-4" />
                </button>

                {/* Product Illustration */}
                <Image
                  src={prod.image}
                  alt={prod.name}
                  width={140}
                  height={140}
                  className="object-contain max-h-36 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                  unoptimized
                />
              </div>

              {/* Product Info & Actions */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span
                    className="text-[11px] font-extrabold uppercase tracking-wide block"
                    style={{ color: prod.categoryColor }}
                  >
                    {prod.category}
                  </span>
                  <Link
                    href={`/product/${prod.slug}`}
                    className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136] hover:text-[#FF4D6D] transition-colors block line-clamp-1"
                  >
                    {prod.name}
                  </Link>
                  <p className="text-xs text-[#736E9B] line-clamp-1">{prod.subtitle}</p>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex items-center text-[#FFC93C] text-xs">
                      {"★★★★★".slice(0, Math.floor(prod.rating))}
                    </div>
                    <span className="text-[11.5px] font-medium text-[#736E9B]">
                      {prod.rating} ({prod.reviews})
                    </span>
                  </div>
                </div>

                <hr className="border-[#EAE3F7]" />

                {/* Price & Add to Bag CTA */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    {prod.originalPriceFormatted && (
                      <span className="text-xs text-[#736E9B] line-through block font-medium">
                        {prod.originalPriceFormatted}
                      </span>
                    )}
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136] font-mono">
                      {prod.priceFormatted}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(prod, 1, false);
                      showToast(`"${prod.name}" added to your cart!`);
                    }}
                    aria-label={`Add ${prod.name} to cart`}
                    className="w-11 h-11 rounded-full text-white shadow-md active:scale-90 transition-all flex items-center justify-center cursor-pointer"
                    style={{ backgroundColor: prod.accent }}
                  >
                    <IconBag className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
