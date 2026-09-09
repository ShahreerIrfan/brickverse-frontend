"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, formatPrice } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/api";
import {
  IconLock,
  IconBag,
  IconPhone,
  IconChevronRight,
  IconChevronDown,
  IconSearch,
  IconCash,
  IconShield,
  IconReturn,
  IconTruck,
  IconCheck,
  IconClose,
  IconArrowRight,
  IconSparkles,
} from "./icons";

// All 64 Districts of Bangladesh in alphabetical order
const BANGLADESH_DISTRICTS = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon",
];

const AVAILABLE_COUPONS = [
  { code: "BUILD10", discountPercent: 10, description: "10% off on your entire cart" },
  { code: "BRICK20", discountPercent: 20, description: "20% off on orders over ৳1,000" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, subtotal, subtotalFormatted, isFreeDeliveryUnlocked, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Form State
  const [firstName, setFirstName] = useState(user?.first_name || "Tanvir");
  const [lastName, setLastName] = useState(user?.last_name || "Ahmed");
  const [phone, setPhone] = useState(user?.phone || "+880 1712-345678");
  const [district, setDistrict] = useState("Dhaka");
  const [districtSearch, setDistrictSearch] = useState("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [address, setAddress] = useState("House 12, Road 4, Sector 7, Uttara");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const districtDropdownRef = React.useRef<HTMLDivElement>(null);

  // Close district dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target as Node)) {
        setIsDistrictDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDistrictDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filtered districts based on search
  const filteredDistricts = BANGLADESH_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase().trim())
  );

  // Coupon State
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  // Update pre-filled info if user logs in
  useEffect(() => {
    if (user) {
      if (user.first_name) setFirstName(user.first_name);
      if (user.last_name) setLastName(user.last_name);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  // Calculations (NO TAX per user requirements)
  const discountRate = appliedCoupon ? appliedCoupon.discountPercent / 100 : 0;
  const discountAmount = subtotal * discountRate;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingCost = isFreeDeliveryUnlocked || subtotal === 0 ? 0 : 60;
  const totalAmount = discountedSubtotal + (discountedSubtotal > 0 ? shippingCost : 0);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const matched = AVAILABLE_COUPONS.find((c) => c.code === code);
    if (matched) {
      if (code === "BRICK20" && subtotal < 1000) {
        setCouponError("BRICK20 requires minimum order of ৳1,000.00");
        return;
      }
      setAppliedCoupon(matched);
      setCouponError("");
      setCouponInput("");
    } else {
      setCouponError("Invalid promo code. Try BUILD10 or BRICK20");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = "First name is required";
    if (!lastName.trim()) errors.lastName = "Last name is required";
    if (!phone.trim()) errors.phone = "Phone number is required";
    if (!address.trim()) errors.address = "Delivery address is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty. Please add items before checking out.");
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    const orderPayload = {
      first_name: firstName,
      last_name: lastName,
      customer_name: `${firstName} ${lastName}`.trim(),
      customer_phone: phone,
      customer_email: user?.email || "guest@brickverse.com",
      city: district,
      district: district,
      address,
      shipping_address: `${address}, ${district}`,
      total_amount: totalAmount,
      items: items.map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity,
      })),
    };

    const res = await createOrder(orderPayload);
    setIsSubmitting(false);

    if (res.success && res.order) {
      setOrderSuccess(res.order);
      clearCart();
    } else {
      alert(res.error || "Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6EE] flex flex-col font-[family-name:var(--font-sans)]">
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT BAR (Matches brickverse-checkout.svg) */}
      {/* ========================================================================= */}
      <div
        className="w-full h-10 px-4 flex items-center justify-center text-white text-xs font-semibold shadow-xs"
        style={{
          background: "linear-gradient(90deg, #FF4D6D 0%, #B045F0 55%, #4B7BFF 100%)",
        }}
      >
        <div className="flex items-center gap-2">
          <IconShield className="w-3.5 h-3.5 fill-white/20" />
          <span>Secure checkout · Cash on delivery available</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CHECKOUT HEADER NAVBAR */}
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

          {/* Center/Right Trust Message */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[#3B3468]">
            <IconLock className="w-4 h-4 text-[#2ECC8F]" />
            <span>Your information is protected</span>
          </div>

          {/* Cart Bag Icon with Count */}
          <Link
            href="/cart"
            aria-label="View Cart"
            className="w-10 h-10 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center relative transition-colors cursor-pointer"
          >
            <IconBag className="w-4.5 h-4.5 text-[#171136]" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF4D6D] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. MAIN CHECKOUT CONTAINER */}
      {/* ========================================================================= */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10">
        {/* Page Title & Subtitle */}
        <div className="mb-7 sm:mb-9">
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[28px] text-[#171136] tracking-tight mb-1">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B]">
            Pay with cash when your order arrives at your doorstep.
          </p>
        </div>

        {/* 2-Column Grid: Left (Forms) + Right (Sticky Order Summary) */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: DELIVERY DETAILS & PAYMENT METHOD */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-8">
            {/* --- Section 1: Delivery Details --- */}
            <div className="space-y-4 sm:space-y-5">
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136] tracking-tight">
                Delivery details
              </h2>

              {/* Name Fields (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (formErrors.firstName) setFormErrors((prev) => ({ ...prev, firstName: "" }));
                    }}
                    placeholder="First name"
                    className={`w-full bg-white border ${
                      formErrors.firstName ? "border-[#FF4D6D]" : "border-[#EAE3F7]"
                    } rounded-xl px-4 py-3 text-sm font-semibold text-[#171136] outline-none focus:border-[#FF4D6D] transition-colors shadow-2xs`}
                  />
                  {formErrors.firstName && (
                    <p className="text-[11px] text-[#FF4D6D] font-semibold">{formErrors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (formErrors.lastName) setFormErrors((prev) => ({ ...prev, lastName: "" }));
                    }}
                    placeholder="Last name"
                    className={`w-full bg-white border ${
                      formErrors.lastName ? "border-[#FF4D6D]" : "border-[#EAE3F7]"
                    } rounded-xl px-4 py-3 text-sm font-semibold text-[#171136] outline-none focus:border-[#FF4D6D] transition-colors shadow-2xs`}
                  />
                  {formErrors.lastName && (
                    <p className="text-[11px] text-[#FF4D6D] font-semibold">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone Number Field with Icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                  Phone number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-[#736E9B] pointer-events-none">
                    <IconPhone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="+880 1XXX-XXXXXX"
                    className={`w-full bg-white border ${
                      formErrors.phone ? "border-[#FF4D6D]" : "border-[#EAE3F7]"
                    } rounded-xl pl-11 pr-4 py-3 text-sm font-semibold text-[#171136] outline-none focus:border-[#FF4D6D] transition-colors shadow-2xs`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-[#FF4D6D] font-semibold">{formErrors.phone}</p>
                )}
              </div>

              {/* District Searchable Dropdown */}
              <div className="space-y-1.5 relative" ref={districtDropdownRef}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                  District
                </label>
                
                {/* Selector Box */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDistrictDropdownOpen((prev) => !prev);
                    setDistrictSearch("");
                  }}
                  className={`w-full bg-white border ${
                    isDistrictDropdownOpen ? "border-[#FF4D6D] ring-2 ring-[#FF4D6D]/10" : "border-[#EAE3F7]"
                  } rounded-xl px-4 py-3 text-sm font-semibold text-[#171136] flex items-center justify-between shadow-2xs hover:border-[#FF4D6D] transition-all cursor-pointer text-left`}
                >
                  <span className={district ? "text-[#171136]" : "text-[#736E9B]"}>
                    {district || "Select District"}
                  </span>
                  <IconChevronDown
                    className={`w-4 h-4 text-[#736E9B] transition-transform duration-200 ${
                      isDistrictDropdownOpen ? "rotate-180 text-[#FF4D6D]" : ""
                    }`}
                  />
                </button>

                {/* Searchable Dropdown Popup */}
                {isDistrictDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#EAE3F7] rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150 flex flex-col">
                    {/* Top Search Input Option (First option in dropdown) */}
                    <div className="p-2.5 bg-[#FAF7FD] border-b border-[#EAE3F7] relative flex items-center">
                      <IconSearch className="w-4 h-4 text-[#736E9B] absolute left-5 pointer-events-none" />
                      <input
                        type="text"
                        autoFocus
                        value={districtSearch}
                        onChange={(e) => setDistrictSearch(e.target.value)}
                        placeholder="Search district..."
                        className="w-full bg-white border border-[#EAE3F7] focus:border-[#FF4D6D] rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-[#171136] outline-none placeholder:text-[#9C96BE] shadow-2xs"
                      />
                      {districtSearch && (
                        <button
                          type="button"
                          onClick={() => setDistrictSearch("")}
                          className="absolute right-5 text-[#736E9B] hover:text-[#D2455C] p-0.5 cursor-pointer"
                        >
                          <IconClose className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filtered Districts Scrollable List */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-[#FAF7FD] p-1.5">
                      {filteredDistricts.length === 0 ? (
                        <div className="py-6 text-center text-xs text-[#736E9B]">
                          No district found for &ldquo;<strong>{districtSearch}</strong>&rdquo;
                        </div>
                      ) : (
                        filteredDistricts.map((d) => {
                          const isSelected = district === d;
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => {
                                setDistrict(d);
                                setIsDistrictDropdownOpen(false);
                                setDistrictSearch("");
                              }}
                              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors cursor-pointer text-left ${
                                isSelected
                                  ? "bg-[#FFEAF0] text-[#FF4D6D] font-bold"
                                  : "text-[#171136] hover:bg-[#F6F1FF] hover:text-[#FF4D6D]"
                              }`}
                            >
                              <span>{d}</span>
                              {isSelected && <IconCheck className="w-4 h-4 text-[#FF4D6D]" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Full Address Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#736E9B]">
                  Full address
                </label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  placeholder="House 12, Road 4, Uttara, Dhaka"
                  className={`w-full bg-white border ${
                    formErrors.address ? "border-[#FF4D6D]" : "border-[#EAE3F7]"
                  } rounded-xl p-3.5 text-sm font-semibold text-[#171136] outline-none focus:border-[#FF4D6D] transition-colors shadow-2xs resize-none`}
                />
                <p className="text-[11.5px] text-[#736E9B]">
                  House / road / area, landmark (optional)
                </p>
                {formErrors.address && (
                  <p className="text-[11px] text-[#FF4D6D] font-semibold">{formErrors.address}</p>
                )}
              </div>
            </div>

            {/* --- Section 2: Payment Method (Matches brickverse-checkout.svg) --- */}
            <div className="space-y-4 sm:space-y-5 pt-3">
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136] tracking-tight">
                Payment method
              </h2>

              {/* Selected Cash on Delivery Card */}
              <div className="bg-[#EFFBF6] border-2 border-[#2ECC8F] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-sm transition-all">
                <div className="flex items-center gap-3.5 sm:gap-4.5">
                  {/* Custom Radio Button */}
                  <div className="w-5.5 h-5.5 rounded-full bg-white border-2 border-[#2ECC8F] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2ECC8F]" />
                  </div>

                  {/* Cash Badge Icon with Gradient */}
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{
                      background: "linear-gradient(135deg, #2ECC8F 0%, #13BFC9 100%)",
                    }}
                  >
                    <IconCash className="w-5 h-5" />
                  </div>

                  {/* Label & Description */}
                  <div>
                    <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136]">
                      Cash on delivery
                    </h3>
                    <p className="text-xs sm:text-[12.5px] text-[#736E9B] mt-0.5">
                      Pay in cash to the courier when your parcel is delivered.
                    </p>
                  </div>
                </div>

                {/* Right Status Badge */}
                <span className="hidden sm:inline-block text-xs font-bold text-[#1E9B6C] bg-white px-2.5 py-1 rounded-full border border-[#2ECC8F]/30 shrink-0">
                  Only option
                </span>
              </div>
            </div>

            {/* Terms Agreement Subtext */}
            <p className="text-xs text-[#736E9B] pt-1">
              By placing your order you agree to Brickverse&apos;s{" "}
              <Link href="#" className="underline text-[#171136] hover:text-[#FF4D6D]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline text-[#171136] hover:text-[#FF4D6D]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: STICKY ORDER SUMMARY (Matches brickverse-checkout.svg) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-3xl sm:rounded-[26px] border border-[#EAE3F7] overflow-hidden shadow-[0_12px_36px_rgba(23,17,54,0.08)] lg:sticky lg:top-6">
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

            {/* Summary Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {/* Cart Items List */}
              <div className="divide-y divide-[#EAE3F7] max-h-72 overflow-y-auto pr-1">
                {items.map((it, idx) => {
                  const bgColors = ["#FFEAF0", "#E4F7F8", "#FFF4DA", "#EFE9FF"];
                  const itemBg = it.cardBg || bgColors[idx % bgColors.length];

                  return (
                    <div key={it.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      {/* Thumbnail with Quantity Badge */}
                      <div className="relative shrink-0">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center p-2 overflow-hidden"
                          style={{ backgroundColor: itemBg }}
                        >
                          <Image
                            src={it.image || "/images/figure-samurai-red.svg"}
                            alt={it.name}
                            width={50}
                            height={50}
                            className="object-contain max-h-full max-w-full drop-shadow-sm"
                            unoptimized
                          />
                        </div>
                        {/* Quantity Bubble on Top Left */}
                        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#171136] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                          {it.quantity}
                        </span>
                      </div>

                      {/* Product Name & Specs */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136] truncate">
                          {it.name}
                        </h3>
                        <p className="text-[11.5px] text-[#736E9B] truncate">
                          {it.subtitle || `${it.category || "Collector Series"}`}
                        </p>
                      </div>

                      {/* Price */}
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-[15px] text-[#171136] font-mono shrink-0">
                        {formatPrice(it.price * it.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <hr className="border-[#EAE3F7]" />

              {/* Promo Code Input & Apply */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Promo code (e.g. BUILD10)"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError("");
                    }}
                    className="bg-white border border-[#EAE3F7] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#171136] outline-none focus:border-[#FF4D6D] flex-1 min-w-0 uppercase placeholder:normal-case placeholder:text-[#736E9B]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-2.5 rounded-xl bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-[11px] text-[#D2455C] font-semibold">{couponError}</p>
                )}

                {appliedCoupon && (
                  <div className="flex items-center justify-between bg-[#EBFDF5] rounded-xl px-3 py-1.5 border border-[#A7F3D0] text-xs font-bold text-[#065F46]">
                    <span>{appliedCoupon.code} applied ({appliedCoupon.discountPercent}% OFF)</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[#736E9B] hover:text-[#D2455C] cursor-pointer"
                    >
                      <IconClose className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              <hr className="border-[#EAE3F7]" />

              {/* Cost Breakdown (No tax per user requirements) */}
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
                  <span>Shipping</span>
                  <span className="font-bold text-[#2ECC8F]">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>

              <hr className="border-[#EAE3F7]" />

              {/* Total Row */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136]">
                    Total
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#736E9B] mr-1.5 uppercase">BDT</span>
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] text-[#171136] font-mono">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA Button (COD) */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-4 rounded-full bg-[#FF4D6D] hover:bg-[#E6004C] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-base shadow-lg shadow-[#FF4D6D]/25 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <IconCash className="w-5 h-5" />
                <span>{isSubmitting ? "Placing order..." : "Place order (COD)"}</span>
              </button>

              {/* 3 Trust Columns under Summary */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10.5px] text-[#736E9B] font-medium border-t border-[#EAE3F7]">
                <div className="flex flex-col items-center gap-1">
                  <IconShield className="w-4 h-4 text-[#736E9B]" />
                  <span>Buyer protection</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <IconReturn className="w-4 h-4 text-[#736E9B]" />
                  <span>7-day returns</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <IconTruck className="w-4 h-4 text-[#736E9B]" />
                  <span>Ships in 24h</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* ========================================================================= */}
      {/* 4. MINIMAL CHECKOUT FOOTER (Matches brickverse-checkout.svg) */}
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

          {/* Highlights & Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#736E9B] pt-4 border-t border-[#EAE3F7]">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <IconShield className="w-4 h-4 text-[#736E9B]" />
                <span>Secured checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <IconTruck className="w-4 h-4 text-[#736E9B]" />
                <span>Cash on delivery, nationwide</span>
              </div>
            </div>

            <p className="text-[11.5px] text-[#9C96BE]">
              © 2026 Brickverse Pty Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. ORDER CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-[#EAE3F7] text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#EFFBF6] text-[#2ECC8F] flex items-center justify-center mx-auto shadow-inner">
              <IconCheck className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                Order Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-[#736E9B] mt-1">
                Thank you, <strong>{orderSuccess.customer_name}</strong>! Your order has been placed successfully.
              </p>
            </div>

            <div className="bg-[#FAF7FD] p-4 rounded-2xl border border-[#EAE3F7] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#736E9B]">Order Number:</span>
                <span className="font-extrabold text-[#171136] font-mono">{orderSuccess.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E9B]">Payment Method:</span>
                <span className="font-bold text-[#1E9B6C]">Cash on Delivery (COD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E9B]">Total Amount:</span>
                <span className="font-extrabold text-[#171136] font-mono">{formatPrice(orderSuccess.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#736E9B]">Shipping to:</span>
                <span className="font-semibold text-[#171136] truncate max-w-[200px]">{orderSuccess.shipping_address}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href="/dashboard"
                className="w-full py-3.5 rounded-full bg-[#171136] hover:bg-[#251c4a] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>View Order in Dashboard</span>
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop"
                className="w-full py-3 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#171136] font-bold text-xs transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
