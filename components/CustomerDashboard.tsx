"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "./productData";
import { useAuth } from "@/context/AuthContext";
import { getCustomerOrders } from "@/lib/api";
import {
  IconHome,
  IconBag,
  IconHeart,
  IconTag,
  IconPin,
  IconLock,
  IconLogOut,
  IconStore,
  IconChevronRight,
  IconSearch,
  IconCheck,
  IconArrowRight,
  IconShield,
} from "./icons";

interface CustomerDashboardProps {
  user: User;
}

type DashboardTab = "account" | "orders" | "wishlist" | "coupons" | "addresses" | "password";

export default function CustomerDashboard({ user }: CustomerDashboardProps) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("account");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address state
  const [shippingAddress, setShippingAddress] = useState({
    street: "742 Evergreen Terrace",
    city: "Melbourne",
    state: "VIC",
    postalCode: "3000",
    country: "Australia",
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  useEffect(() => {
    getCustomerOrders(user.email)
      .then((data) => {
        if (Array.isArray(data)) setOrders(data);
      })
      .finally(() => setLoadingOrders(false));
  }, [user.email]);

  const avatarInitial = (user.first_name ? user.first_name[0] : (user.email ? user.email[0] : "U")).toUpperCase();
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.first_name || user.email.split("@")[0];

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordMsg("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("Passwords do not match.");
      return;
    }
    setPasswordMsg("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF6EE] text-[#171136]">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-[#EAE3F7] sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image src="/images/logo-mark.svg" alt="Brickverse" width={38} height={38} />
              <div className="flex flex-col leading-tight">
                <span className="font-[family-name:var(--font-display)] font-extrabold text-xl tracking-tight text-[#171136]">
                  Brickverse
                </span>
                <span className="text-[10.5px] font-medium text-[#736E9B]">
                  Customer Member Area
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 bg-[#FFF1F4] text-[#FF4D6D] text-xs font-bold rounded-full border border-[#FF4D6D]/20">
              ⭐ VIP Collector
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171136] bg-[#F6F1FF] hover:bg-[#EFE9FF] border border-[#EAE3F7] px-4 py-2 rounded-xl transition-all shadow-2xs"
            >
              <IconStore className="w-4 h-4 text-[#FF4D6D]" />
              Storefront
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <IconLogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main 2-Column Dashboard Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR MENU (Exact Match to Reference Design) */}
          {/* ========================================================================= */}
          <aside className="lg:col-span-1 bg-white rounded-3xl border border-[#EAE3F7] p-5 shadow-xs">
            {/* User Profile Summary Card */}
            <div className="flex items-center gap-3.5 pb-5 border-b border-[#EAE3F7]">
              <div className="w-12 h-12 rounded-full bg-[#FF4D6D] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                {avatarInitial}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold text-sm text-[#171136] truncate">
                  {fullName}
                </h2>
                <p className="text-xs text-[#736E9B] truncate">{user.email}</p>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="flex flex-col gap-1.5 pt-4">
              <button
                type="button"
                onClick={() => setActiveTab("account")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "account"
                    ? "bg-[#FFF1F4] text-[#FF4D6D] font-extrabold"
                    : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD] font-semibold"
                }`}
              >
                <IconHome className="w-4 h-4 shrink-0" />
                <span>My Account</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#FFF1F4] text-[#FF4D6D] font-extrabold"
                    : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD] font-semibold"
                }`}
              >
                <IconBag className="w-4 h-4 shrink-0" />
                <span>Orders</span>
                {orders.length > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-[#FF4D6D] text-white px-2 py-0.5 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "wishlist"
                    ? "bg-[#FFF1F4] text-[#FF4D6D] font-extrabold"
                    : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD] font-semibold"
                }`}
              >
                <IconHeart className="w-4 h-4 shrink-0" />
                <span>Wishlist</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("coupons")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "coupons"
                    ? "bg-[#FFF1F4] text-[#FF4D6D] font-extrabold"
                    : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD] font-semibold"
                }`}
              >
                <IconTag className="w-4 h-4 shrink-0" />
                <span>My Coupons</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-[#FFF1F4] text-[#FF4D6D] font-extrabold"
                    : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD] font-semibold"
                }`}
              >
                <IconPin className="w-4 h-4 shrink-0" />
                <span>Addresses</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "password"
                    ? "bg-[#FFF1F4] text-[#FF4D6D] font-extrabold"
                    : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD] font-semibold"
                }`}
              >
                <IconLock className="w-4 h-4 shrink-0" />
                <span>Change Password</span>
              </button>
            </nav>

            <div className="pt-4 mt-4 border-t border-[#EAE3F7]">
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <IconLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT MAIN CONTENT AREA */}
          {/* ========================================================================= */}
          <main className="lg:col-span-3 flex flex-col gap-6">
            {/* --------------------------------------------------------------------- */}
            {/* TAB 1: MY ACCOUNT (Overview matching reference layout) */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "account" && (
              <div className="flex flex-col gap-6">
                {/* 1. Welcome Banner */}
                <div className="bg-[#FFF1F4] rounded-3xl p-6 sm:p-7 border border-[#FFE0E6] flex flex-col justify-between">
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136]">
                    Welcome back, {fullName}! 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-[#736E9B] mt-1 font-medium">
                    Here&apos;s what&apos;s happening with your Brickverse collector account today.
                  </p>
                </div>

                {/* 2. Stat Cards Row (3 Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Card 1: Orders */}
                  <div
                    onClick={() => setActiveTab("orders")}
                    className="bg-white rounded-3xl border border-[#EAE3F7] p-5 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#FF4D6D]/40 transition-all"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF1F4] text-[#FF4D6D] flex items-center justify-center mb-3">
                        <IconBag className="w-5 h-5" />
                      </div>
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                        {orders.length}
                      </span>
                      <p className="text-xs font-bold text-[#736E9B] mt-0.5">Orders</p>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-[#736E9B]" />
                  </div>

                  {/* Card 2: Wishlist */}
                  <div
                    onClick={() => setActiveTab("wishlist")}
                    className="bg-white rounded-3xl border border-[#EAE3F7] p-5 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#7B5CFF]/40 transition-all"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center mb-3">
                        <IconHeart className="w-5 h-5" />
                      </div>
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                        3
                      </span>
                      <p className="text-xs font-bold text-[#736E9B] mt-0.5">Saved Items</p>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-[#736E9B]" />
                  </div>

                  {/* Card 3: Addresses */}
                  <div
                    onClick={() => setActiveTab("addresses")}
                    className="bg-white rounded-3xl border border-[#EAE3F7] p-5 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#00B4D8]/40 transition-all"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#E6F9F5] text-[#00B4D8] flex items-center justify-center mb-3">
                        <IconPin className="w-5 h-5" />
                      </div>
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                        1
                      </span>
                      <p className="text-xs font-bold text-[#736E9B] mt-0.5">Shipping Address</p>
                    </div>
                    <IconChevronRight className="w-4 h-4 text-[#736E9B]" />
                  </div>
                </div>

                {/* 3. Quick Actions Card */}
                <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs">
                  <h3 className="font-bold text-sm sm:text-base text-[#171136] mb-4">
                    Quick Actions
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Link
                      href="/"
                      className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl hover:bg-[#F8F6FD] transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FFF1F4] text-[#FF4D6D] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconSearch className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#171136] text-center">
                        Browse Products
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl hover:bg-[#F8F6FD] transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconBag className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#171136] text-center">
                        My Orders
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("addresses")}
                      className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl hover:bg-[#F8F6FD] transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E6F9F5] text-[#00B4D8] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconPin className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#171136] text-center">
                        Edit Address
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("wishlist")}
                      className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl hover:bg-[#F8F6FD] transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FFF9E6] text-[#FFC93C] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconHeart className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#171136] text-center">
                        View Wishlist
                      </span>
                    </button>
                  </div>
                </div>

                {/* 4. Recent Orders Card */}
                <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm sm:text-base text-[#171136]">Recent Orders</h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("orders")}
                      className="text-xs font-bold text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  {loadingOrders ? (
                    <p className="text-xs text-[#736E9B] py-4 text-center">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-xs text-[#736E9B]">No orders placed yet.</p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4D6D] mt-2 hover:underline"
                      >
                        Explore figures & kits <IconArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#EAE3F7]">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8F6FD] rounded-xl px-2 transition-colors cursor-pointer"
                          onClick={() => setActiveTab("orders")}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] flex items-center justify-center text-[#736E9B] shrink-0">
                              📦
                            </div>
                            <div>
                              <p className="font-bold text-xs sm:text-sm text-[#171136]">
                                #{order.order_number}
                              </p>
                              <p className="text-[11px] text-[#736E9B]">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase ${
                                order.status === "delivered"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="font-extrabold text-xs sm:text-sm text-[#171136]">
                              ৳{order.total_amount}
                            </span>
                            <IconChevronRight className="w-4 h-4 text-[#736E9B]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 2: ORDERS (Full History) */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-bold text-lg text-[#171136]">Order History</h2>
                    <p className="text-xs text-[#736E9B]">Track your packages and view invoices</p>
                  </div>
                  <span className="text-xs font-bold bg-[#FFF1F4] text-[#FF4D6D] px-3 py-1 rounded-full">
                    {orders.length} Total Orders
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-xs text-[#736E9B] mb-3">No orders found.</p>
                    <Link
                      href="/"
                      className="bg-[#FF4D6D] text-white text-xs font-bold px-4 py-2 rounded-xl inline-block"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl border border-[#EAE3F7] p-4 sm:p-5 bg-[#F8F6FD]/40"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EAE3F7] pb-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-[#171136]">
                                #{order.order_number}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  order.status === "delivered"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#736E9B] mt-0.5">
                              Placed on {new Date(order.created_at).toLocaleDateString()} · Carrier:{" "}
                              {order.carrier || "Australia Post"}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-base text-[#171136]">
                              ৳{order.total_amount}
                            </span>
                            {order.tracking_number && (
                              <p className="text-[11px] text-[#7B5CFF] font-semibold">
                                📦 Tracking: {order.tracking_number}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-1.5 text-xs">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item: any) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between py-1 text-xs"
                              >
                                <span className="font-medium text-[#171136]">
                                  {item.quantity}x {item.product_name}
                                </span>
                                <span className="font-bold text-[#171136]">৳{item.price}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-[#736E9B]">
                              Brickverse Anime & Collectibles Set
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-[#EAE3F7] text-[11px] text-[#736E9B] flex items-center justify-between">
                          <span>📍 {order.shipping_address}</span>
                          <span className="text-emerald-600 font-bold">✓ 48h Dispatched</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: WISHLIST */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                <h2 className="font-bold text-lg text-[#171136] mb-1">My Wishlist</h2>
                <p className="text-xs text-[#736E9B] mb-5">
                  Items you have saved to purchase later
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold bg-[#FF4D6D] text-white px-2 py-0.5 rounded-full">
                        ANIME FIGURE
                      </span>
                      <h3 className="font-bold text-sm text-[#171136] mt-2">
                        Neon Valkyrie EVA-01
                      </h3>
                      <p className="text-xs text-[#736E9B] mt-0.5">1/7 Scale Pre-Painted Figure</p>
                      <p className="font-bold text-sm text-[#FF4D6D] mt-2">৳89.99</p>
                    </div>
                    <button className="mt-4 w-full bg-[#171136] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-[#251c4a] transition-all cursor-pointer">
                      Move to Bag
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold bg-[#7B5CFF] text-white px-2 py-0.5 rounded-full">
                        BRICKS
                      </span>
                      <h3 className="font-bold text-sm text-[#171136] mt-2">
                        Cyber Blade Shinobi Set
                      </h3>
                      <p className="text-xs text-[#736E9B] mt-0.5">1,240 pcs articulated kit</p>
                      <p className="font-bold text-sm text-[#FF4D6D] mt-2">৳52.50</p>
                    </div>
                    <button className="mt-4 w-full bg-[#171136] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-[#251c4a] transition-all cursor-pointer">
                      Move to Bag
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold bg-[#00B4D8] text-white px-2 py-0.5 rounded-full">
                        STEM KIT
                      </span>
                      <h3 className="font-bold text-sm text-[#171136] mt-2">
                        Astro Rover STEM Kit
                      </h3>
                      <p className="text-xs text-[#736E9B] mt-0.5">Programmable Python rover</p>
                      <p className="font-bold text-sm text-[#FF4D6D] mt-2">৳129.99</p>
                    </div>
                    <button className="mt-4 w-full bg-[#171136] text-white font-bold text-xs py-2.5 rounded-xl hover:bg-[#251c4a] transition-all cursor-pointer">
                      Move to Bag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: MY COUPONS */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "coupons" && (
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                <h2 className="font-bold text-lg text-[#171136] mb-1">My Coupons & Discounts</h2>
                <p className="text-xs text-[#736E9B] mb-5">
                  Exclusive active vouchers for your account
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-[#FFF1F4] border border-[#FF4D6D]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-base text-[#FF4D6D]">10% OFF</span>
                        <span className="text-[10px] font-bold uppercase bg-white text-[#FF4D6D] px-2 py-0.5 rounded-full border border-[#FF4D6D]/20">
                          Active
                        </span>
                      </div>
                      <p className="font-bold text-xs text-[#171136]">First Order Welcome Bonus</p>
                      <p className="text-xs text-[#736E9B] mt-1">
                        Use code <strong className="text-[#FF4D6D]">BUILD10</strong> at checkout
                        to get 10% off your entire cart.
                      </p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard?.writeText("BUILD10")}
                      className="mt-4 bg-[#FF4D6D] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#ff3358] transition-all cursor-pointer text-center"
                    >
                      Copy Code: BUILD10
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#EFE9FF] border border-[#7B5CFF]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-extrabold text-base text-[#7B5CFF]">FREE SHIPPING</span>
                        <span className="text-[10px] font-bold uppercase bg-white text-[#7B5CFF] px-2 py-0.5 rounded-full border border-[#7B5CFF]/20">
                          Automatic
                        </span>
                      </div>
                      <p className="font-bold text-xs text-[#171136]">Free Delivery Over ৳500</p>
                      <p className="text-xs text-[#736E9B] mt-1">
                        Automatically applied to all orders with cart value of ৳500 or higher across Australia.
                      </p>
                    </div>
                    <Link
                      href="/"
                      className="mt-4 bg-[#7B5CFF] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#6847ff] transition-all text-center block"
                    >
                      Shop Qualified Items
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 5: ADDRESSES */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "addresses" && (
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs max-w-2xl">
                <h2 className="font-bold text-lg text-[#171136] mb-1">Shipping Address</h2>
                <p className="text-xs text-[#736E9B] mb-5">
                  Manage your default shipping details for 48-hour dispatch
                </p>

                {addressSaved && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-bold">
                    ✓ Shipping address updated successfully!
                  </div>
                )}

                <form onSubmit={handleSaveAddress} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#171136] mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.street}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, street: e.target.value })
                      }
                      className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#171136] mb-1">City / Suburb</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#171136] mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#171136] mb-1">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                        }
                        className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#171136] mb-1">Country</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-2 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-[#FF4D6D]/20 cursor-pointer"
                  >
                    Save Address
                  </button>
                </form>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 6: CHANGE PASSWORD */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "password" && (
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs max-w-lg">
                <h2 className="font-bold text-lg text-[#171136] mb-1">Change Password</h2>
                <p className="text-xs text-[#736E9B] mb-5">
                  Update your account password for security
                </p>

                {passwordMsg && (
                  <div
                    className={`mb-4 p-3 text-xs rounded-xl font-bold ${
                      passwordMsg.includes("successfully")
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                        : "bg-red-50 border border-red-200 text-red-600"
                    }`}
                  >
                    {passwordMsg}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#171136] mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#171136] mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#171136] mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-xl h-11 px-3.5 outline-none text-sm text-[#171136]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md shadow-[#FF4D6D]/20 cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
