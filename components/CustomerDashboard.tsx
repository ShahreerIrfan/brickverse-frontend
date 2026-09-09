"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "./productData";
import { useAuth } from "@/context/AuthContext";
import { getCustomerOrders, trackOrder } from "@/lib/api";
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
  IconTruck,
} from "./icons";

interface CustomerDashboardProps {
  user: User;
  initialTab?: "account" | "orders" | "orders-single" | "track" | "wishlist" | "coupons" | "password";
  initialOrderParam?: string;
}

type DashboardTab = "account" | "orders" | "orders-single" | "track" | "wishlist" | "coupons" | "password";

export default function CustomerDashboard({
  user,
  initialTab = "account",
  initialOrderParam,
}: CustomerDashboardProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Single Order View state
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [singleOrderLoading, setSingleOrderLoading] = useState(false);

  // Tracking state
  const [searchOrderNumber, setSearchOrderNumber] = useState(initialOrderParam || "");
  const [trackedOrder, setTrackedOrder] = useState<any | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // Navigation helper that updates both activeTab and browser URL cleanly
  const navigateToTab = (tab: DashboardTab, orderParam?: string) => {
    setActiveTab(tab);
    let targetPath = "/dashboard";
    if (tab === "orders") targetPath = "/dashboard/orders";
    else if (tab === "orders-single" && orderParam) targetPath = `/dashboard/orders/${orderParam}`;
    else if (tab === "track") targetPath = orderParam ? `/dashboard/track-order/${orderParam}` : "/dashboard/track-order";
    else if (tab === "wishlist") targetPath = "/dashboard/wishlist";
    else if (tab === "coupons") targetPath = "/dashboard/coupons";
    else if (tab === "password") targetPath = "/dashboard/password";

    if (typeof window !== "undefined") {
      window.history.pushState({}, "", targetPath);
    }
  };

  // Load customer orders on mount
  useEffect(() => {
    getCustomerOrders(user.email)
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);

          // If on single order view, find the selected order
          if (initialTab === "orders-single" && initialOrderParam) {
            const found = data.find(
              (o) =>
                o.order_number?.toLowerCase() === initialOrderParam.toLowerCase() ||
                String(o.id) === String(initialOrderParam)
            );
            if (found) {
              setSelectedOrder(found);
            } else {
              // Fallback track order API to get full order details
              trackOrder(initialOrderParam).then((res) => {
                if (res && !res.error) setSelectedOrder(res);
              });
            }
          }

          // If on track view with order param
          if (initialTab === "track" && initialOrderParam) {
            handleTrackOrder(initialOrderParam);
          } else if (initialTab === "track" && data.length > 0 && !searchOrderNumber) {
            handleTrackOrder(data[0].order_number);
          }
        }
      })
      .finally(() => setLoadingOrders(false));
  }, [user.email, initialTab, initialOrderParam]);

  const handleTrackOrder = async (orderNumToTrack?: string) => {
    const target = (orderNumToTrack || searchOrderNumber || "").trim();
    if (!target) {
      setTrackingError("Please enter an order number to track.");
      return;
    }
    setTrackingLoading(true);
    setTrackingError("");
    try {
      const res = await trackOrder(target);
      if (res && !res.error && res.order_number) {
        setTrackedOrder(res);
        setSearchOrderNumber(res.order_number);
      } else {
        setTrackingError(res?.error || "Order not found. Please check your order number.");
        setTrackedOrder(null);
      }
    } catch (e) {
      setTrackingError("Failed to track order. Please try again.");
      setTrackedOrder(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const selectAndTrackOrder = (orderNumber: string) => {
    setSearchOrderNumber(orderNumber);
    navigateToTab("track", orderNumber);
    handleTrackOrder(orderNumber);
  };

  const selectAndOpenSingleOrder = (order: any) => {
    setSelectedOrder(order);
    navigateToTab("orders-single", order.order_number || String(order.id));
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const avatarInitial = (user.first_name ? user.first_name[0] : (user.email ? user.email[0] : "U")).toUpperCase();
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.first_name || user.email.split("@")[0];

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
          {/* LEFT SIDEBAR MENU (Strictly 5 Standard Tabs - No Extra Track Order Menu) */}
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
                onClick={() => navigateToTab("account")}
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
                onClick={() => navigateToTab("orders")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all cursor-pointer ${
                  activeTab === "orders" || activeTab === "orders-single" || activeTab === "track"
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
                onClick={() => navigateToTab("wishlist")}
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
                onClick={() => navigateToTab("coupons")}
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
                onClick={() => navigateToTab("password")}
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
            {/* TAB 1: MY ACCOUNT (Overview) */}
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
                    onClick={() => navigateToTab("orders")}
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
                    onClick={() => navigateToTab("wishlist")}
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

                  {/* Card 3: Coupons */}
                  <div
                    onClick={() => navigateToTab("coupons")}
                    className="bg-white rounded-3xl border border-[#EAE3F7] p-5 shadow-xs flex items-center justify-between cursor-pointer hover:border-[#FFC93C]/40 transition-all"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-[#FFF9E6] text-[#FFC93C] flex items-center justify-center mb-3">
                        <IconTag className="w-5 h-5" />
                      </div>
                      <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                        2
                      </span>
                      <p className="text-xs font-bold text-[#736E9B] mt-0.5">My Coupons</p>
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
                      onClick={() => navigateToTab("orders")}
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
                      onClick={() => navigateToTab("coupons")}
                      className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl hover:bg-[#F8F6FD] transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FFF9E6] text-[#FFC93C] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <IconTag className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-[#171136] text-center">
                        My Coupons
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigateToTab("wishlist")}
                      className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl hover:bg-[#F8F6FD] transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#FFEAEF] text-[#FF4D6D] flex items-center justify-center group-hover:scale-105 transition-transform">
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
                      onClick={() => navigateToTab("orders")}
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
                          onClick={() => selectAndOpenSingleOrder(order)}
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
            {/* TAB 2: ORDERS (Full History List) */}
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
                        className="rounded-2xl border border-[#EAE3F7] p-4 sm:p-5 bg-[#F8F6FD]/40 hover:border-[#FF4D6D]/30 transition-all"
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
                              {order.carrier || "Australia Post / Pathao"}
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

                        {/* Items Preview */}
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

                        {/* Bottom Actions Card: Address + View Details + Track Package */}
                        <div className="mt-3 pt-2.5 border-t border-[#EAE3F7] text-[11px] text-[#736E9B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="truncate max-w-sm">📍 {order.shipping_address}</span>
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => selectAndOpenSingleOrder(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F8F6FD] text-[#171136] font-bold text-xs rounded-xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs"
                            >
                              View Details 📄
                            </button>

                            <button
                              type="button"
                              onClick={() => selectAndTrackOrder(order.order_number)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF1F4] hover:bg-[#FFE0E6] text-[#FF4D6D] font-bold text-xs rounded-xl border border-[#FF4D6D]/25 transition-all cursor-pointer shadow-2xs"
                            >
                              <IconTruck className="w-3.5 h-3.5" />
                              Track Package
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 3: SOLID SINGLE ORDER DETAILS PAGE (/dashboard/orders/[orderNum]) */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "orders-single" && (
              <div className="flex flex-col gap-6">
                {/* Back to Orders Bar */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigateToTab("orders")}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#736E9B] hover:text-[#171136] bg-white px-4 py-2 rounded-2xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs"
                  >
                    ← Back to Order History
                  </button>

                  {selectedOrder && (
                    <button
                      type="button"
                      onClick={() => selectAndTrackOrder(selectedOrder.order_number)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFF1F4] hover:bg-[#FFE0E6] text-[#FF4D6D] font-bold text-xs sm:text-sm rounded-2xl border border-[#FF4D6D]/25 transition-all cursor-pointer shadow-xs"
                    >
                      <IconTruck className="w-4 h-4" />
                      Track Live GPS 🚚
                    </button>
                  )}
                </div>

                {selectedOrder ? (
                  <div className="space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#EAE3F7]">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                              Order #{selectedOrder.order_number}
                            </h2>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                                selectedOrder.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : selectedOrder.status === "shipped"
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : selectedOrder.status === "processing"
                                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                                  : selectedOrder.status === "cancelled"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}
                            >
                              ● {selectedOrder.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#736E9B] mt-1">
                            Placed on {new Date(selectedOrder.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="text-xs font-bold text-[#171136] bg-[#F8F6FD] hover:bg-[#EFE9FF] px-4 py-2 rounded-xl border border-[#EAE3F7] transition-all cursor-pointer"
                          >
                            🖨️ Print Invoice
                          </button>
                        </div>
                      </div>

                      {/* 3 Top Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        {/* 1. Recipient & Shipping */}
                        <div className="p-4 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7]">
                          <div className="flex items-center gap-2 mb-2 text-[#7B5CFF] font-bold text-xs">
                            <IconPin className="w-4 h-4" />
                            <span>Shipping Address</span>
                          </div>
                          <p className="font-extrabold text-sm text-[#171136]">{selectedOrder.customer_name}</p>
                          <p className="text-xs text-[#736E9B] mt-1 leading-relaxed">{selectedOrder.shipping_address}</p>
                          {selectedOrder.customer_phone && <p className="text-xs text-[#736E9B] mt-1">📞 {selectedOrder.customer_phone}</p>}
                          <p className="text-xs text-[#736E9B]">✉️ {selectedOrder.customer_email}</p>
                        </div>

                        {/* 2. Carrier & Tracking */}
                        <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC]">
                          <div className="flex items-center gap-2 mb-2 text-[#FF4D6D] font-bold text-xs">
                            <IconTruck className="w-4 h-4" />
                            <span>Carrier & Delivery</span>
                          </div>
                          <p className="font-extrabold text-sm text-[#171136]">
                            {selectedOrder.carrier || "Pathao Express / Standard"}
                          </p>
                          <p className="text-xs text-[#736E9B] mt-1">
                            Tracking: <strong className="text-[#171136]">{selectedOrder.tracking_number || "Auto-assigned on dispatch"}</strong>
                          </p>
                          <span className="inline-block mt-2 text-[10.5px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            ✓ 48h Safe Transit
                          </span>
                        </div>

                        {/* 3. Payment & Total */}
                        <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
                          <div className="flex items-center gap-2 mb-2 text-emerald-700 font-bold text-xs">
                            <IconShield className="w-4 h-4" />
                            <span>Payment Summary</span>
                          </div>
                          <p className="text-xs text-[#736E9B]">Payment Method: <strong>Cash on Delivery / Online</strong></p>
                          <div className="mt-2 pt-2 border-t border-[#BBF7D0]">
                            <span className="text-xs font-bold text-[#736E9B]">Grand Total</span>
                            <p className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                              ৳{selectedOrder.total_amount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                      <h3 className="font-bold text-base text-[#171136] mb-4 flex items-center gap-2">
                        <IconBag className="w-5 h-5 text-[#FF4D6D]" />
                        Purchased Items ({selectedOrder.items?.length || 1})
                      </h3>

                      <div className="divide-y divide-[#EAE3F7]">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item: any) => (
                            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7] flex items-center justify-center text-xl shrink-0">
                                  🧱
                                </div>
                                <div>
                                  <h4 className="font-bold text-sm text-[#171136]">{item.product_name}</h4>
                                  <p className="text-xs text-[#736E9B] mt-0.5">
                                    Qty: <strong className="text-[#171136]">{item.quantity}</strong> · Unit Price: ৳{item.price}
                                  </p>
                                </div>
                              </div>
                              <span className="font-extrabold text-sm sm:text-base text-[#171136]">
                                ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="py-4 text-xs text-[#736E9B]">
                            Brickverse Collector Edition Kit
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#EAE3F7] flex flex-col gap-2 max-w-xs ml-auto text-xs">
                        <div className="flex items-center justify-between text-[#736E9B]">
                          <span>Items Subtotal:</span>
                          <span className="font-bold text-[#171136]">৳{selectedOrder.total_amount}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#736E9B]">
                          <span>Shipping & Handling:</span>
                          <span className="font-bold text-emerald-600">Free Collector Delivery</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[#EAE3F7] text-sm">
                          <span className="font-extrabold text-[#171136]">Final Amount:</span>
                          <span className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#FF4D6D]">
                            ৳{selectedOrder.total_amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-[#EAE3F7] p-10 text-center shadow-xs">
                    <p className="text-xs text-[#736E9B]">Loading order details...</p>
                  </div>
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 4: TRACK ORDER PAGE (/dashboard/track-order) */}
            {/* --------------------------------------------------------------------- */}
            {activeTab === "track" && (
              <div className="flex flex-col gap-6">
                {/* Back to Orders Bar */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => navigateToTab("orders")}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#736E9B] hover:text-[#171136] bg-white px-4 py-2 rounded-2xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs"
                  >
                    ← Back to Order History
                  </button>
                </div>

                {/* 1. Track Search Header Card */}
                <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-bold text-lg sm:text-xl text-[#171136] flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-[#FFF1F4] text-[#FF4D6D] flex items-center justify-center text-sm">
                          🚚
                        </span>
                        Live Order Tracking
                      </h2>
                      <p className="text-xs text-[#736E9B] mt-1">
                        Real-time delivery status, milestone updates, and carrier details
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#16A34A] text-xs font-bold rounded-full border border-[#BBF7D0]">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
                      Live GPS Sync
                    </span>
                  </div>

                  {/* Search Input Bar */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTrackOrder();
                    }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={searchOrderNumber}
                        onChange={(e) => setSearchOrderNumber(e.target.value)}
                        placeholder="Enter Order Number (e.g. #KS-1001 or KS-1001)..."
                        className="w-full bg-[#F8F6FD] border border-[#EAE3F7] focus:border-[#FF4D6D] focus:bg-white rounded-2xl h-12 pl-11 pr-4 outline-none text-sm text-[#171136] transition-all font-medium"
                      />
                      <IconSearch className="w-5 h-5 text-[#736E9B] absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>

                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs sm:text-sm px-6 h-12 rounded-2xl transition-all shadow-md shadow-[#FF4D6D]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                    >
                      {trackingLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Searching...</span>
                        </>
                      ) : (
                        <>
                          <IconTruck className="w-4 h-4" />
                          <span>Track Package</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Quick Select Buttons from user's actual orders */}
                  {orders.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#EAE3F7] flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#736E9B]">Quick Track:</span>
                      {orders.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => selectAndTrackOrder(o.order_number)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                            searchOrderNumber === o.order_number && trackedOrder?.order_number === o.order_number
                              ? "bg-[#FFF1F4] text-[#FF4D6D] border-[#FF4D6D]/40 shadow-xs ring-2 ring-[#FF4D6D]/20"
                              : "bg-[#F8F6FD] text-[#171136] border-[#EAE3F7] hover:bg-[#EFE9FF]"
                          }`}
                        >
                          #{o.order_number} · ৳{o.total_amount}
                        </button>
                      ))}
                    </div>
                  )}

                  {trackingError && (
                    <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{trackingError}</span>
                    </div>
                  )}
                </div>

                {/* 2. Tracked Order Result Details */}
                {trackedOrder ? (
                  <div className="space-y-6">
                    {/* Main Status & Stepper Card */}
                    <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs">
                      {/* Top Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3F7]">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136]">
                              Order #{trackedOrder.order_number}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                                trackedOrder.status === "delivered"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                  : trackedOrder.status === "shipped"
                                  ? "bg-blue-100 text-blue-800 border border-blue-300"
                                  : trackedOrder.status === "processing"
                                  ? "bg-purple-100 text-purple-800 border border-purple-300"
                                  : trackedOrder.status === "cancelled"
                                  ? "bg-red-100 text-red-800 border border-red-300"
                                  : "bg-amber-100 text-amber-800 border border-amber-300"
                              }`}
                            >
                              ● {trackedOrder.status}
                            </span>
                          </div>
                          <p className="text-xs text-[#736E9B] mt-1">
                            Placed on {new Date(trackedOrder.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>

                        {/* Tracking ID & Carrier Badge */}
                        <div className="bg-[#F8F6FD] rounded-2xl p-3 sm:p-4 border border-[#EAE3F7] flex items-center justify-between sm:justify-start gap-4">
                          <div>
                            <p className="text-[10px] sm:text-[11px] font-bold text-[#736E9B] uppercase tracking-wider">Carrier & Tracking</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs sm:text-sm font-extrabold text-[#171136]">
                                {trackedOrder.carrier || "Australia Post / Pathao Express"}
                              </span>
                              {trackedOrder.tracking_number && (
                                <span className="text-xs font-mono font-bold text-[#7B5CFF]">
                                  #{trackedOrder.tracking_number}
                                </span>
                              )}
                            </div>
                          </div>

                          {trackedOrder.tracking_number && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(trackedOrder.tracking_number)}
                              className="bg-white hover:bg-[#EFE9FF] text-[#7B5CFF] text-xs font-bold px-3 py-2 rounded-xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs shrink-0"
                            >
                              {copiedTracking ? "✓ Copied!" : "Copy #"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Interactive Visual Stepper */}
                      {(() => {
                        const statusSteps = [
                          { key: "pending", label: "Order Placed", desc: "Order verified & logged", icon: "📋" },
                          { key: "processing", label: "Processing", desc: "Packed at warehouse", icon: "📦" },
                          { key: "shipped", label: "Dispatched", desc: `In transit via ${trackedOrder.carrier || "Carrier"}`, icon: "🚚" },
                          { key: "delivered", label: "Delivered", desc: "Package reached destination", icon: "🎉" },
                        ];

                        const statusRank: Record<string, number> = {
                          pending: 0,
                          processing: 1,
                          shipped: 2,
                          delivered: 3,
                          cancelled: -1,
                        };

                        const currentRank = statusRank[trackedOrder.status?.toLowerCase()] ?? 0;
                        const isCancelled = trackedOrder.status?.toLowerCase() === "cancelled";

                        if (isCancelled) {
                          return (
                            <div className="my-6 p-5 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
                              <span className="text-2xl">❌</span>
                              <div>
                                <h4 className="font-bold text-sm">Order Cancelled</h4>
                                <p className="text-xs text-red-600 mt-0.5">
                                  This order has been marked as cancelled. If payment was deducted, a refund will be credited back to you.
                                </p>
                              </div>
                            </div>
                          );
                        }

                        const progressPercentage = Math.min(100, Math.max(12, ((currentRank) / (statusSteps.length - 1)) * 100));

                        return (
                          <div className="py-6 sm:py-8">
                            {/* Progress Bar Container */}
                            <div className="relative mb-8 px-4 sm:px-10">
                              {/* Background Track Line */}
                              <div className="absolute top-1/2 left-8 right-8 h-2 bg-[#EAE3F7] -translate-y-1/2 rounded-full"></div>
                              {/* Active Filled Line */}
                              <div
                                className="absolute top-1/2 left-8 h-2 bg-gradient-to-r from-[#FF4D6D] to-[#7B5CFF] -translate-y-1/2 rounded-full transition-all duration-700"
                                style={{ width: `calc(${progressPercentage}% - 16px)` }}
                              ></div>

                              {/* Step Circles */}
                              <div className="relative flex items-center justify-between">
                                {statusSteps.map((step, idx) => {
                                  const isCompleted = currentRank >= idx;
                                  const isCurrent = currentRank === idx;

                                  return (
                                    <div key={step.key} className="flex flex-col items-center">
                                      <div
                                        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-base sm:text-xl font-bold transition-all shadow-md ${
                                          isCompleted
                                            ? "bg-gradient-to-tr from-[#FF4D6D] to-[#7B5CFF] text-white shadow-[#FF4D6D]/30 ring-4 ring-[#FFF1F4]"
                                            : "bg-white border-2 border-[#EAE3F7] text-[#736E9B]"
                                        } ${isCurrent ? "scale-110 ring-4 ring-[#7B5CFF]/30" : ""}`}
                                      >
                                        {isCompleted ? step.icon : idx + 1}
                                      </div>

                                      <div className="text-center mt-3 max-w-[80px] sm:max-w-[120px]">
                                        <p
                                          className={`text-xs sm:text-sm font-extrabold ${
                                            isCompleted ? "text-[#171136]" : "text-[#736E9B]"
                                          }`}
                                        >
                                          {step.label}
                                        </p>
                                        <p className="text-[10px] sm:text-[11px] text-[#736E9B] mt-0.5 hidden sm:block">
                                          {step.desc}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Live Checkpoint Box */}
                            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start sm:items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#FF4D6D] text-white flex items-center justify-center shrink-0 shadow-xs">
                                  <IconTruck className="w-5 h-5" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs sm:text-sm text-[#171136]">
                                    {currentRank === 3
                                      ? "Package successfully delivered to recipient!"
                                      : currentRank === 2
                                      ? "Package is in transit with carrier network"
                                      : currentRank === 1
                                      ? "Order is undergoing quality inspection and packing"
                                      : "Order received & ready for dispatch"}
                                  </h4>
                                  <p className="text-[11.5px] text-[#736E9B] mt-0.5">
                                    Destination Address: <strong className="text-[#171136]">{trackedOrder.shipping_address}</strong>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-extrabold text-[#FF4D6D] bg-white px-3 py-1.5 rounded-xl border border-[#FFE3CC] shadow-2xs">
                                  {currentRank === 3 ? "Delivered" : "48h Fast Dispatch"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* 2-Column Info Grid (Package Items + Shipping & Customer details) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left 2 Cols: Package Items */}
                      <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs">
                        <h3 className="font-bold text-sm sm:text-base text-[#171136] mb-4 flex items-center gap-2">
                          <IconBag className="w-4 h-4 text-[#FF4D6D]" />
                          Package Items ({trackedOrder.items?.length || 1})
                        </h3>

                        <div className="divide-y divide-[#EAE3F7]">
                          {trackedOrder.items && trackedOrder.items.length > 0 ? (
                            trackedOrder.items.map((item: any) => (
                              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-11 h-11 rounded-xl bg-[#F8F6FD] border border-[#EAE3F7] flex items-center justify-center text-lg shrink-0">
                                    🧱
                                  </div>
                                  <div>
                                    <p className="font-bold text-xs sm:text-sm text-[#171136]">
                                      {item.product_name}
                                    </p>
                                    <p className="text-[11px] text-[#736E9B]">
                                      Qty: <strong className="text-[#171136]">{item.quantity}</strong> × ৳{item.price}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-extrabold text-xs sm:text-sm text-[#171136]">
                                  ৳{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="py-4 text-xs text-[#736E9B]">
                              Brickverse Anime Figures & Collector Building Kits
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#EAE3F7] flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-[#736E9B]">Total Paid</span>
                          <span className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#FF4D6D]">
                            ৳{trackedOrder.total_amount}
                          </span>
                        </div>
                      </div>

                      {/* Right 1 Col: Shipping & Support */}
                      <div className="flex flex-col gap-6">
                        {/* Delivery Destination Card */}
                        <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs">
                          <h3 className="font-bold text-sm sm:text-base text-[#171136] mb-3 flex items-center gap-2">
                            <IconPin className="w-4 h-4 text-[#7B5CFF]" />
                            Delivery Address
                          </h3>
                          <div className="space-y-1.5 text-xs text-[#736E9B]">
                            <p className="font-bold text-[#171136]">{trackedOrder.customer_name}</p>
                            <p className="leading-relaxed">{trackedOrder.shipping_address}</p>
                            {trackedOrder.customer_phone && <p>📞 {trackedOrder.customer_phone}</p>}
                            <p>✉️ {trackedOrder.customer_email}</p>
                          </div>
                        </div>

                        {/* Assistance Support Card */}
                        <div className="bg-[#EFE9FF] rounded-3xl border border-[#7B5CFF]/20 p-5">
                          <h4 className="font-extrabold text-xs text-[#7B5CFF] uppercase tracking-wide">
                            Need Help With Package?
                          </h4>
                          <p className="text-xs text-[#171136] font-medium mt-1">
                            Contact Brickverse Collector Care for courier inquiries and delivery rescheduling.
                          </p>
                          <Link
                            href="/"
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#7B5CFF] hover:bg-[#6847ff] px-4 py-2 rounded-xl transition-all shadow-xs"
                          >
                            Collector Support <IconArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  !trackingLoading && (
                    <div className="bg-white rounded-3xl border border-[#EAE3F7] p-10 text-center shadow-xs">
                      <div className="w-16 h-16 rounded-full bg-[#FFF1F4] text-[#FF4D6D] flex items-center justify-center mx-auto text-2xl mb-4">
                        📦
                      </div>
                      <h3 className="font-bold text-base text-[#171136]">No Package Selected</h3>
                      <p className="text-xs text-[#736E9B] mt-1 max-w-sm mx-auto">
                        Enter an order number above or click on any of your recent orders to see real-time delivery checkpoints.
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 5: WISHLIST */}
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
            {/* TAB 6: MY COUPONS */}
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
                        <span className="font-extrabold text-base text-[#7B5CFF]">20% OFF</span>
                        <span className="text-[10px] font-bold uppercase bg-[#7B5CFF] text-white px-2 py-0.5 rounded-full">
                          BRICK20
                        </span>
                      </div>
                      <p className="font-bold text-xs text-[#171136]">20% Off Orders Over ৳1,000</p>
                      <p className="text-xs text-[#736E9B] mt-1">
                        Use promo code BRICK20 at checkout for 20% off on orders over ৳1,000.
                      </p>
                    </div>
                    <button
                      onClick={() => navigator.clipboard?.writeText("BRICK20")}
                      className="mt-4 bg-[#7B5CFF] text-white text-xs font-bold py-2 rounded-xl hover:bg-[#6847ff] transition-all text-center block cursor-pointer"
                    >
                      Copy Code: BRICK20
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------------- */}
            {/* TAB 7: CHANGE PASSWORD */}
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
