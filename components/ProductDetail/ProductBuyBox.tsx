"use client";

import { useState } from "react";
import { IconHeart, IconBag, IconCheck } from "../icons";
import type { Product } from "../productData";
import { useCart } from "@/context/CartContext";

interface ProductBuyBoxProps {
  product: Product;
}

export default function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [buyNowModal, setBuyNowModal] = useState(false);

  const priceFormatted = product.discountedPrice || product.price || "৳34.99";
  const originalPriceFormatted = product.regularPrice || product.originalPrice || "৳46.00";

  const discountPercent = product.discountPercent || (() => {
    const reg = parseFloat(originalPriceFormatted.replace(/[^\d.]/g, ""));
    const disc = parseFloat(priceFormatted.replace(/[^\d.]/g, ""));
    if (reg > disc && disc > 0) {
      return Math.round(((reg - disc) / reg) * 100);
    }
    return null;
  })();

  const handleAddToCart = () => {
    addToCart(product, quantity, true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, true);
  };

  return (
    <div className="flex flex-col flex-1 max-w-xl">
      {/* Category Eyebrow */}
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <span className="text-[#FF4D6D] uppercase tracking-wider font-bold">
          {product.category || "All Products"}
        </span>
      </div>

      {/* Product Title */}
      <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#171136] mt-2 tracking-tight leading-tight">
        {product.name}
      </h1>

      {/* SKU */}
      <div className="flex items-center gap-2 sm:gap-3 mt-3.5 flex-wrap text-xs sm:text-[13px]">
        <span className="text-xs text-[#736E9B]">
          SKU <strong className="text-[#171136] font-mono font-bold">{product.sku || product.id}</strong>
        </span>
      </div>

      <hr className="my-4 border-[#EAE3F7]" />

      {/* Price Section */}
      <div className="flex items-baseline gap-3 flex-wrap">
        <span className="font-[family-name:var(--font-display)] font-extrabold text-3xl sm:text-4xl text-[#171136] tracking-tight">
          {priceFormatted}
        </span>
        {originalPriceFormatted && originalPriceFormatted !== priceFormatted && (
          <span className="text-base sm:text-lg text-[#736E9B] font-medium line-through">
            {originalPriceFormatted}
          </span>
        )}
        {discountPercent ? (
          <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#FF4D6D] text-white shadow-xs">
            -{discountPercent}% OFF
          </span>
        ) : null}
      </div>

      {/* Bundle contents (grouped products) */}
      {product.productType === "grouped" && product.groupItems && product.groupItems.length > 0 && (
        <div className="mt-4 rounded-2xl border border-[#EAE3F7] bg-white overflow-hidden">
          <p className="px-4 py-2.5 bg-[#F6F1FF] text-xs font-extrabold text-[#171136] uppercase tracking-wide">
            This bundle includes
          </p>
          <ul className="divide-y divide-[#F0EBF8]">
            {product.groupItems.map((item) => (
              <li key={item.childId} className="flex items-center gap-3 px-4 py-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt="" className="w-11 h-11 rounded-xl object-cover bg-[#F6F1FF] shrink-0" />
                <span className="flex-1 min-w-0 text-[13px] font-bold text-[#171136] truncate">{item.name}</span>
                <span className="text-xs font-extrabold text-[#736E9B] shrink-0">× {item.quantity}</span>
                <span className="text-xs font-bold text-[#171136] w-20 text-right shrink-0">{item.price}</span>
              </li>
            ))}
          </ul>
          {product.bundleTotal ? (
            <div className="px-4 py-2.5 bg-[#FAF8FE] flex items-center justify-between text-xs">
              <span className="text-[#736E9B] font-semibold">Total if bought separately</span>
              <span className="font-extrabold text-[#171136] line-through decoration-[#FF4D6D]/60">
                ৳{product.bundleTotal.toLocaleString("en-US", { maximumFractionDigits: 2 })}
              </span>
            </div>
          ) : null}
        </div>
      )}

      <hr className="my-4 border-[#EAE3F7]" />

      {/* Quantity Stepper */}
      <div className="flex flex-col gap-2">
        <label className="text-xs sm:text-sm font-bold text-[#171136]">Quantity</label>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Stepper */}
          <div className="inline-flex items-center justify-between w-[140px] sm:w-[148px] h-12 rounded-full bg-white border border-[#EAE3F7] px-3 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#171136] hover:bg-[#F6F1FF] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              —
            </button>
            <span className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#171136] hover:bg-[#F6F1FF] active:scale-95 transition-all text-lg font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* CTA Action Buttons */}
      <div className="flex items-center gap-3 mt-6 flex-wrap">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="flex-1 min-w-[200px] sm:min-w-[240px] h-14 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] active:scale-98 transition-all text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(255,77,109,0.25)] cursor-pointer"
        >
          <IconBag className="w-5 h-5 text-white" />
          <span>Add to cart</span>
        </button>

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          className="w-[140px] sm:w-[160px] h-14 rounded-full bg-[#171136] hover:bg-[#251c4a] active:scale-98 transition-all text-white font-bold text-base flex items-center justify-center shadow-sm cursor-pointer"
        >
          Buy now
        </button>

        {/* Wishlist Square Icon Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          aria-label="Add to wishlist"
          className="w-14 h-14 rounded-full bg-white border border-[#EAE3F7] hover:border-[#FF4D6D] flex items-center justify-center transition-all cursor-pointer shadow-xs shrink-0"
        >
          <IconHeart className={`w-5 h-5 ${isWishlisted ? "text-[#FF4D6D] fill-[#FF4D6D]" : "text-[#FF4D6D]"}`} />
        </button>
      </div>

      {/* Added to Cart Feedback Toast */}
      {addedToast && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-bold animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <IconCheck className="w-4 h-4 text-emerald-600" />
            <span>Added {quantity}x {product.name} to your cart!</span>
          </div>
          <a href="/dashboard" className="underline hover:text-emerald-900 font-extrabold">
            View Bag →
          </a>
        </div>
      )}

      {/* Buy Now Modal */}
      {buyNowModal && (
        <div
          className="fixed inset-0 z-50 bg-[#171136]/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setBuyNowModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-extrabold text-lg text-[#171136] mb-1">Instant Checkout</h3>
            <p className="text-xs text-[#736E9B] mb-4">Complete your order with 48h express dispatch</p>

            <div className="p-3 bg-[#F8F6FD] rounded-2xl flex items-center justify-between mb-4 text-xs font-bold text-[#171136]">
              <span>{quantity}x {product.name}</span>
              <span className="text-[#FF4D6D] text-sm font-extrabold">{product.price}</span>
            </div>

            <button
              onClick={() => {
                setBuyNowModal(false);
                setAddedToast(true);
              }}
              className="w-full h-12 bg-[#FF4D6D] text-white font-bold text-sm rounded-2xl hover:bg-[#ff3358] transition-all cursor-pointer"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
