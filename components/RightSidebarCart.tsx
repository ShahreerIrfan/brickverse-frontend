"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, formatPrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  IconClose,
  IconBag,
  IconCheck,
  IconTrash,
  IconChevronRight,
  IconShield,
  IconArrowRight,
} from "./icons";

export default function RightSidebarCart() {
  const {
    items,
    isCartOpen,
    closeCart,
    showAddedToast,
    closeToast,
    lastAddedItem,
    totalItems,
    subtotal,
    subtotalFormatted,
    isFreeDeliveryUnlocked,
    freeDeliveryThreshold,
    freeDeliveryRemaining,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const { isAuthenticated, openLoginModal } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss top toast after 3.5s
  useEffect(() => {
    if (showAddedToast) {
      const timer = setTimeout(() => {
        closeToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showAddedToast, closeToast]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      closeCart();
      openLoginModal();
    } else {
      alert("Redirecting to secure Brickverse Checkout...");
    }
  };

  const deliveryProgressPercent = Math.min(
    100,
    Math.round((subtotal / freeDeliveryThreshold) * 100)
  );

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP "ADDED TO CART" NOTIFICATION TOAST (Matches attached image) */}
      {/* ========================================================================= */}
      {showAddedToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[70] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#EBFDF5] border border-[#A7F3D0] rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 min-w-[280px] sm:min-w-[340px] justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                ✓
              </span>
              <div className="flex flex-col">
                <span className="text-xs sm:text-[13px] font-bold text-[#065F46]">
                  Added to cart
                </span>
                {lastAddedItem && (
                  <span className="text-[11px] text-[#047857] truncate max-w-[220px]">
                    {lastAddedItem.name}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={closeToast}
              aria-label="Close notification"
              className="w-6 h-6 rounded-full hover:bg-[#D1FAE5] flex items-center justify-center text-[#065F46] transition-colors cursor-pointer shrink-0"
            >
              <IconClose className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BACKDROP OVERLAY */}
      {/* ========================================================================= */}
      <div
        className={`fixed inset-0 bg-[#171136]/60 backdrop-blur-xs z-50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* ========================================================================= */}
      {/* 3. RIGHT SIDEBAR CART FLYOUT DRAWER */}
      {/* ========================================================================= */}
      <aside
        ref={drawerRef}
        aria-label="Shopping Cart Drawer"
        className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[400px] md:w-[420px] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out font-[family-name:var(--font-sans)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* --- Drawer Header --- */}
        <div className="p-4 sm:p-5 border-b border-[#F0EBF8] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136]">
              Shopping Cart
            </h2>
            <span className="w-5.5 h-5.5 rounded-full bg-[#FF0055] text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          </div>

          <button
            onClick={closeCart}
            aria-label="Close Cart"
            className="w-8 h-8 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#171136] transition-colors cursor-pointer"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* --- Free Delivery Indicator Banner --- */}
        <div className="px-5 py-2.5 bg-[#F6FDF9] border-b border-[#E3F8EE] shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-[#00B074]">
            <span className="flex items-center gap-1.5">
              <span className="text-sm">✓</span>
              {isFreeDeliveryUnlocked
                ? "You've unlocked free delivery!"
                : `Add ${formatPrice(freeDeliveryRemaining)} more for free delivery`}
            </span>
            <span className="text-[10.5px] font-extrabold text-[#736E9B]">
              {deliveryProgressPercent}%
            </span>
          </div>
          <div className="w-full h-1 bg-[#D9F5E8] rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-[#00D084] transition-all duration-500 rounded-full"
              style={{ width: `${deliveryProgressPercent}%` }}
            />
          </div>
        </div>

        {/* --- Cart Items List (Scrollable Area) --- */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F0EBF8] px-5 py-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#FF4D6D] flex items-center justify-center mb-3">
                <IconBag className="w-8 h-8" />
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#736E9B] max-w-[220px] mt-1 mb-5">
                Explore anime figures, brick sets and robotics kits to add here!
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="px-6 py-2.5 rounded-full bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex gap-3.5 items-start relative group transition-all"
              >
                {/* Product Thumbnail with border */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#FAF8FE] border border-[#EAE3F7] p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details & Controls */}
                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="font-bold text-xs sm:text-[13px] text-[#171136] line-clamp-2 leading-tight">
                    {item.name}
                  </h4>
                  <p className="text-[10.5px] text-[#8A84A6] mt-0.5 truncate">
                    {item.seller || "Eezy Mart Official"}
                  </p>

                  {/* Quantity Stepper Pill */}
                  <div className="inline-flex items-center rounded-xl border border-[#EAE3F7] bg-white h-7 mt-2 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-full flex items-center justify-center text-[#736E9B] hover:text-[#171136] hover:bg-[#F6F1FF] rounded-l-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Decrease quantity"
                    >
                      —
                    </button>
                    <span className="px-2 font-bold text-xs text-[#171136]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-full flex items-center justify-center text-[#736E9B] hover:text-[#171136] hover:bg-[#F6F1FF] rounded-r-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Icon Button (Top-Right) */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                  className="absolute top-3.5 right-0 text-[#8A84A6] hover:text-red-500 p-1 transition-colors cursor-pointer"
                  title="Remove item"
                >
                  <IconClose className="w-3.5 h-3.5" />
                </button>

                {/* Item Line Total (Right bottom aligned) */}
                <div className="text-right font-bold text-xs sm:text-[13px] text-[#171136] font-mono mt-auto pt-6 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Drawer Footer & Checkout Action Bar --- */}
        {items.length > 0 && (
          <div className="border-t border-[#F0EBF8] p-4 sm:p-5 bg-white shrink-0 space-y-3 shadow-[0_-8px_20px_rgba(0,0,0,0.04)]">
            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-[#736E9B]">
              <div className="flex items-center justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-bold text-[#171136] font-mono">
                  {subtotalFormatted}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span className="text-[#00B074] font-bold">
                  {isFreeDeliveryUnlocked ? "FREE" : "Calculated at checkout"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#F0EBF8]">
                <span className="font-bold text-sm text-[#171136]">Total</span>
                <span className="font-extrabold text-base sm:text-lg text-[#171136] font-mono">
                  {subtotalFormatted}
                </span>
              </div>
            </div>

            {/* Primary Action Button (Matches attached image) */}
            <button
              type="button"
              onClick={handleCheckoutClick}
              className="w-full py-3.5 rounded-2xl bg-[#FF0055] hover:bg-[#E6004C] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-[#FF0055]/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isAuthenticated ? "Proceed to Checkout" : "Login to Checkout"}</span>
            </button>

            {/* Secondary Link */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={closeCart}
                className="text-xs font-bold text-[#736E9B] hover:text-[#171136] inline-flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Full Cart</span>
                <IconChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Encrypted Security Note */}
            <div className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#8A84A6] font-medium pt-1">
              <IconShield className="w-3.5 h-3.5 text-[#00B074]" />
              <span>Secure & encrypted checkout</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
