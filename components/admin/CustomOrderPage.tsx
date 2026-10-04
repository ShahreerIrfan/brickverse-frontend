"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Product } from "../productData";
import { createOrder, getMediaUrl } from "@/lib/api";
import {
  IconClose,
  IconTrash,
  IconBag,
  IconUser,
  IconTruck,
  IconDollar,
  IconCheck,
  IconPlus,
  IconSearch,
  IconChevronDown,
  IconArrowLeft,
  IconTicket,
} from "../icons";

interface OrderLineItem {
  id: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
  stock?: number;
  isPreorder?: boolean;
}

interface CustomOrderPageProps {
  products: Product[];
  onOrderCreated: (newOrder: any) => void;
  onCancel: () => void;
}

const SOURCE_OPTIONS = [
  {
    id: "facebook",
    label: "Facebook",
    badge: "FB",
    bgActive: "bg-[#1877F2] text-white border-[#1877F2] shadow-sm",
    bgInactive: "bg-white text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/5",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    badge: "WA",
    bgActive: "bg-[#25D366] text-white border-[#25D366] shadow-sm",
    bgInactive: "bg-white text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/5",
  },
  {
    id: "phone",
    label: "Phone Call",
    badge: "TEL",
    bgActive: "bg-[#7B5CFF] text-white border-[#7B5CFF] shadow-sm",
    bgInactive: "bg-white text-[#7B5CFF] border-[#7B5CFF]/30 hover:bg-[#7B5CFF]/5",
  },
  {
    id: "instagram",
    label: "Instagram",
    badge: "IG",
    bgActive: "bg-[#E1306C] text-white border-[#E1306C] shadow-sm",
    bgInactive: "bg-white text-[#E1306C] border-[#E1306C]/30 hover:bg-[#E1306C]/5",
  },
  {
    id: "direct",
    label: "In-Store / Direct",
    badge: "POS",
    bgActive: "bg-[#2ECC8F] text-white border-[#2ECC8F] shadow-sm",
    bgInactive: "bg-white text-[#2ECC8F] border-[#2ECC8F]/30 hover:bg-[#2ECC8F]/5",
  },
  {
    id: "other",
    label: "Other",
    badge: "OTH",
    bgActive: "bg-[#3B3468] text-white border-[#3B3468] shadow-sm",
    bgInactive: "bg-white text-[#736E9B] border-[#EAE3F7] hover:bg-[#FAF8FF]",
  },
];

const COURIER_OPTIONS = [
  "Steadfast Courier (COD)",
  "Pathao Courier",
  "Paperfly",
  "RedX Delivery",
  "Sundarban Courier",
  "SA Paribahan",
  "In-Store Pickup",
  "Other Delivery",
];

export default function CustomOrderPage({
  products,
  onOrderCreated,
  onCancel,
}: CustomOrderPageProps) {
  // Customer & Shipping Info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderSource, setOrderSource] = useState("facebook");
  const [orderNotes, setOrderNotes] = useState("");

  // Delivery Zone & Charges
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside" | "free" | "custom">("dhaka");
  const [shippingCost, setShippingCost] = useState<number>(60);
  const [carrier, setCarrier] = useState("Steadfast Courier (COD)");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");

  // Discount
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Line Items
  const [items, setItems] = useState<OrderLineItem[]>([]);

  // Searchable Product Combobox
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Custom (Non-Catalog) Item State
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [customItemQty, setCustomItemQty] = useState(1);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 60);
    }
  }, [isDropdownOpen]);

  // Filter products by search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q);
      const skuMatch = p.sku && p.sku.toLowerCase().includes(q);
      const catMatch = typeof p.category === "string" && p.category.toLowerCase().includes(q);
      return nameMatch || skuMatch || catMatch;
    });
  }, [products, searchQuery]);

  // Update zone & shipping fee
  const handleZoneChange = (zone: "dhaka" | "outside" | "free" | "custom") => {
    setDeliveryZone(zone);
    if (zone === "dhaka") setShippingCost(60);
    else if (zone === "outside") setShippingCost(120);
    else if (zone === "free") setShippingCost(0);
  };

  // Add Product to list
  const handleAddProduct = (prod: Product) => {
    const rawPrice = parseFloat(
      String(prod.discountedPrice || prod.price || "0").replace(/[^\d.]/g, "")
    ) || 0;

    const existingIdx = items.findIndex((it) => it.productId === String(prod.id));

    if (existingIdx >= 0) {
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === existingIdx ? { ...it, quantity: it.quantity + 1 } : it
        )
      );
    } else {
      const isPreorder = (prod.stock ?? 0) <= 0 && prod.productType !== "grouped";
      const newItem: OrderLineItem = {
        id: `prod-${prod.id}-${Date.now()}`,
        productId: String(prod.id),
        name: prod.name,
        price: rawPrice,
        quantity: 1,
        image: prod.image || (prod.image_file ? String(prod.image_file) : undefined),
        sku: prod.sku,
        stock: prod.stock,
        isPreorder,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  // Add Custom Item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) return;
    const priceVal = parseFloat(customItemPrice.replace(/[^\d.]/g, "")) || 0;
    const newItem: OrderLineItem = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      price: priceVal,
      quantity: Math.max(1, customItemQty),
    };
    setItems((prev) => [...prev, newItem]);
    setCustomItemName("");
    setCustomItemPrice("");
    setCustomItemQty(1);
    setIsCustomItemOpen(false);
  };

  // Remove Line Item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Update item quantity
  const handleUpdateQty = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, quantity: newQty } : it))
    );
  };

  // Update item price
  const handleUpdatePrice = (id: string, newPriceStr: string) => {
    const val = parseFloat(newPriceStr.replace(/[^\d.]/g, "")) || 0;
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, price: val } : it))
    );
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }, [items]);

  const grandTotal = useMemo(() => {
    const total = subtotal + Number(shippingCost || 0) - Number(discountAmount || 0);
    return Math.max(0, total);
  }, [subtotal, shippingCost, discountAmount]);

  // Submit Order Creation
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Please enter the customer's full name.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg("Please enter the contact phone number.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMsg("Please enter the delivery address.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Please add at least one item to this order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceLabel = SOURCE_OPTIONS.find((s) => s.id === orderSource)?.label || "Manual";
      const finalAddress = orderNotes.trim()
        ? `${shippingAddress.trim()} (Source: ${sourceLabel}, Note: ${orderNotes.trim()})`
        : `${shippingAddress.trim()} (Source: ${sourceLabel})`;

      const payload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || `${customerPhone.trim().replace(/[^\d]/g, "") || "order"}@fb-customer.local`,
        shipping_address: finalAddress,
        shipping_cost: Number(shippingCost || 0),
        total_amount: grandTotal,
        status: orderStatus,
        carrier: carrier,
        tracking_number: trackingNumber.trim(),
        items: items.map((it) => ({
          productId: it.productId,
          product_id: it.productId,
          name: it.name,
          product_name: it.name,
          price: it.price,
          quantity: it.quantity,
          isPreorder: it.isPreorder,
          image: it.image,
        })),
      };

      const res = await createOrder(payload as any);

      if (res.success && res.order) {
        onOrderCreated(res.order);
      } else {
        setErrorMsg(res.error || "Failed to create order. Please check the inputs.");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred while saving order.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1360px] mx-auto animate-in fade-in-50 duration-300 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#736E9B]">
            <button
              type="button"
              onClick={onCancel}
              className="hover:text-[#171136] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <IconArrowLeft className="w-3.5 h-3.5" />
              <span>Orders</span>
            </button>
            <span>/</span>
            <span className="text-[#171136] font-bold">New Custom Order</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
              Create Order
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FF4D6D]/10 text-[#FF4D6D] border border-[#FF4D6D]/20">
              Manual Entry
            </span>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[#EAE3F7] bg-white text-xs font-bold text-[#736E9B] hover:text-[#171136] hover:bg-[#FAF8FF] transition-all cursor-pointer shadow-2xs"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isSubmitting || items.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <IconCheck className="w-4 h-4" />
                <span>Save Order (৳{grandTotal.toLocaleString()})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FFF1F4] border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-[#FF4D6D] hover:opacity-80 cursor-pointer text-sm font-extrabold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT MAIN COLUMN: Products & Customer Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. ORDERED PRODUCTS CARD */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-[#F0EBF8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center font-bold">
                  <IconBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-[#171136]">
                    Ordered Items
                  </h2>
                  <p className="text-xs text-[#736E9B]">
                    {items.length === 0
                      ? "No products added yet"
                      : `${items.reduce((s, i) => s + i.quantity, 0)} units selected`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomItemOpen(!isCustomItemOpen)}
                className="text-xs font-bold text-[#7B5CFF] hover:text-[#6847FF] hover:underline cursor-pointer flex items-center gap-1"
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>{isCustomItemOpen ? "Close Custom Item" : "Custom Item"}</span>
              </button>
            </div>

            {/* Searchable Combobox to Pick Products */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-full px-4 py-3 bg-[#FAF8FF] border rounded-2xl text-xs font-medium text-[#171136] cursor-pointer flex items-center justify-between gap-3 transition-all hover:bg-white ${
                  isDropdownOpen
                    ? "bg-white border-[#7B5CFF] ring-2 ring-[#7B5CFF]/20 shadow-sm"
                    : "border-[#EAE3F7] hover:border-[#7B5CFF]/40"
                }`}
              >
                <div className="flex items-center gap-2.5 text-[#736E9B]">
                  <IconSearch className="w-4 h-4 text-[#7B5CFF]" />
                  <span className="font-semibold text-xs text-[#171136]">
                    Search or select products from store ({products.length} items)...
                  </span>
                </div>
                <IconChevronDown
                  className={`w-4 h-4 text-[#8A84A6] transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-[#7B5CFF]" : "rotate-0"
                  }`}
                />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EAE3F7] rounded-2xl shadow-2xl z-40 overflow-hidden animate-in fade-in duration-150">
                  {/* SEARCH BAR (First option inside dropdown) */}
                  <div className="p-3 bg-[#FAF8FF] border-b border-[#F0EBF8] sticky top-0 z-10 space-y-1">
                    <div className="relative flex items-center">
                      <IconSearch className="absolute left-3.5 w-4 h-4 text-[#8A84A6] pointer-events-none" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Type to filter by name, SKU, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full pl-10 pr-8 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#7B5CFF] shadow-2xs"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSearchQuery("");
                            searchInputRef.current?.focus();
                          }}
                          className="absolute right-3 text-xs text-[#8A84A6] hover:text-[#171136] p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10.5px] text-[#736E9B] px-1 pt-1 font-medium">
                      <span>{filteredProducts.length} products available</span>
                      {searchQuery && <span className="text-[#7B5CFF] font-bold">Filtered</span>}
                    </div>
                  </div>

                  {/* Scrollable Products List */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F0EBF8]">
                    {filteredProducts.length === 0 ? (
                      <div className="py-10 text-center text-xs text-[#8A84A6] space-y-1">
                        <p className="font-bold text-[#736E9B]">No products found</p>
                        <p className="text-[11px]">Try searching with a different name or SKU</p>
                      </div>
                    ) : (
                      filteredProducts.map((p) => {
                        const rawPrice = parseFloat(
                          String(p.discountedPrice || p.price || "0").replace(/[^\d.]/g, "")
                        ) || 0;
                        const stockVal = p.stock ?? 0;
                        const isPre = stockVal <= 0 && p.productType !== "grouped";
                        const inOrder = items.some((i) => i.productId === String(p.id));

                        return (
                          <div
                            key={p.id}
                            onClick={() => handleAddProduct(p)}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-[#F6F1FF] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-11 h-11 rounded-xl bg-[#FAF8FF] border border-[#EAE3F7] overflow-hidden flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                {p.image || p.image_file ? (
                                  <img
                                    src={getMediaUrl(p.image || p.image_file)}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="font-extrabold text-xs text-[#FF4D6D]">
                                    {p.name[0]}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-xs text-[#171136] group-hover:text-[#7B5CFF] transition-colors truncate">
                                  {p.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-[#736E9B] flex-wrap">
                                  {p.sku && (
                                    <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#EAE3F7] text-[10px]">
                                      SKU: {p.sku}
                                    </span>
                                  )}
                                  <span className={isPre ? "text-[#C08A00] font-bold" : "text-emerald-600 font-bold"}>
                                    {isPre ? "Pre-order" : `Stock: ${stockVal}`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-extrabold text-xs text-[#171136] block">
                                ৳{rawPrice.toLocaleString()}
                              </span>
                              <span className="text-[10.5px] font-bold text-[#7B5CFF] group-hover:underline">
                                {inOrder ? "+ Add More" : "+ Select"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Non-Catalog Item Panel */}
            {isCustomItemOpen && (
              <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FF4D6D]/20 space-y-3 animate-in fade-in duration-150">
                <p className="text-xs font-extrabold text-[#FF4D6D] uppercase tracking-wider">
                  Add Non-Catalog / Custom Item
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <input
                    type="text"
                    placeholder="Item title / description"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    className="sm:col-span-2 px-3.5 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#FF4D6D]"
                  />
                  <input
                    type="number"
                    placeholder="Price (৳)"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    className="px-3.5 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleAddCustomItem}
                    className="px-4 py-2 bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Add Custom Item
                  </button>
                </div>
              </div>
            )}

            {/* Items Table */}
            <div className="border border-[#EAE3F7] rounded-2xl overflow-hidden bg-white">
              {items.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8FF] border border-[#EAE3F7] flex items-center justify-center mx-auto text-[#8A84A6]">
                    <IconBag className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-xs text-[#171136]">Your cart is empty</p>
                  <p className="text-[11px] text-[#736E9B] max-w-xs mx-auto">
                    Use the search bar above to add products to this customer&apos;s order
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#F0EBF8]">
                  {items.map((it) => {
                    const lineTotal = it.price * it.quantity;
                    return (
                      <div
                        key={it.id}
                        className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8FF]/60 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-11 h-11 rounded-xl bg-[#F6F1FF] border border-[#EAE3F7] overflow-hidden flex items-center justify-center shrink-0">
                            {it.image ? (
                              <img
                                src={getMediaUrl(it.image)}
                                alt={it.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-extrabold text-xs text-[#FF4D6D]">
                                {it.name[0]}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-[#171136] truncate">
                              {it.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {it.sku && (
                                <span className="text-[10px] text-[#736E9B] font-mono">
                                  SKU: {it.sku}
                                </span>
                              )}
                              <span className="text-[10.5px] text-[#736E9B]">Price: ৳</span>
                              <input
                                type="number"
                                min={0}
                                value={it.price}
                                onChange={(e) => handleUpdatePrice(it.id, e.target.value)}
                                className="w-18 px-2 py-0.5 text-xs font-bold text-[#171136] border border-[#EAE3F7] rounded-lg bg-white focus:outline-none focus:border-[#7B5CFF]"
                              />
                              {it.isPreorder && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF4D6] text-[#C08A00] font-extrabold uppercase">
                                  Pre-order
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls & Line Total */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center border border-[#EAE3F7] rounded-xl overflow-hidden bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(it.id, it.quantity - 1)}
                              className="px-2.5 py-1 text-xs font-bold text-[#736E9B] hover:bg-[#F6F1FF] cursor-pointer transition-colors"
                            >
                              -
                            </button>
                            <span className="px-2.5 text-xs font-extrabold text-[#171136]">
                              {it.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(it.id, it.quantity + 1)}
                              className="px-2.5 py-1 text-xs font-bold text-[#736E9B] hover:bg-[#F6F1FF] cursor-pointer transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <p className="font-extrabold text-xs sm:text-sm text-[#171136] w-20 text-right font-mono">
                            ৳{lineTotal.toLocaleString()}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="p-1.5 text-[#FF4D6D] hover:bg-[#FFF1F4] rounded-lg transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. CUSTOMER & DELIVERY CARD */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#F0EBF8] pb-4">
              <div className="w-9 h-9 rounded-2xl bg-[#7B5CFF]/10 text-[#7B5CFF] flex items-center justify-center font-bold">
                <IconUser className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-[#171136]">Customer & Shipping</h2>
                <p className="text-xs text-[#736E9B]">Recipient contact and delivery details</p>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Customer Name <span className="text-[#FF4D6D]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nusrat Sara"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Phone Number <span className="text-[#FF4D6D]">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-[#8A84A6]">
                    🇧🇩 +880
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="1752543972"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-20 pr-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#171136] mb-1.5">
                Email Address <span className="text-[#8A84A6] font-normal text-[11px]">(Optional for tracking receipts)</span>
              </label>
              <input
                type="email"
                placeholder="e.g. customer@gmail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] transition-all"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold text-[#171136] mb-1.5">
                Delivery Address <span className="text-[#FF4D6D]">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="House, Road, Block, Thana, District"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] transition-all resize-none"
              />
            </div>

            {/* Admin Notes */}
            <div>
              <label className="block text-xs font-bold text-[#171136] mb-1.5">
                Special Delivery Notes <span className="text-[#8A84A6] font-normal text-[11px]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Call before delivery, gift wrap requested"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] transition-all"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN: Source, Logistics & Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3. ORDER CHANNEL & LOGISTICS CARD */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3 border-b border-[#F0EBF8] pb-4">
              <div className="w-9 h-9 rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center font-bold">
                <IconTruck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-[#171136]">Order Channel & Logistics</h2>
                <p className="text-xs text-[#736E9B]">Source channel and courier partner</p>
              </div>
            </div>

            {/* Channel Pills */}
            <div>
              <label className="block text-xs font-bold text-[#171136] mb-2">
                Order Origin
              </label>
              <div className="grid grid-cols-3 gap-2">
                {SOURCE_OPTIONS.map((src) => {
                  const isActive = orderSource === src.id;
                  return (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setOrderSource(src.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                        isActive ? src.bgActive : src.bgInactive
                      }`}
                    >
                      <span className="text-[10px] font-extrabold opacity-75">{src.badge}</span>
                      <span>{src.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delivery Zone Pills */}
            <div>
              <label className="block text-xs font-bold text-[#171136] mb-2">
                Delivery Charge Zone
              </label>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => handleZoneChange("dhaka")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left flex items-center justify-between ${
                    deliveryZone === "dhaka"
                      ? "bg-[#7B5CFF] text-white border-[#7B5CFF] shadow-xs"
                      : "bg-[#FAF8FF] text-[#171136] border-[#EAE3F7] hover:bg-white"
                  }`}
                >
                  <span>Inside Dhaka</span>
                  <span className="font-mono">৳60</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleZoneChange("outside")}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left flex items-center justify-between ${
                    deliveryZone === "outside"
                      ? "bg-[#7B5CFF] text-white border-[#7B5CFF] shadow-xs"
                      : "bg-[#FAF8FF] text-[#171136] border-[#EAE3F7] hover:bg-white"
                  }`}
                >
                  <span>Outside Dhaka</span>
                  <span className="font-mono">৳120</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleZoneChange("free")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    deliveryZone === "free"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-[#FAF8FF] text-[#171136] border-[#EAE3F7] hover:bg-white"
                  }`}
                >
                  Free Delivery (৳0)
                </button>

                <button
                  type="button"
                  onClick={() => handleZoneChange("custom")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                    deliveryZone === "custom"
                      ? "bg-[#171136] text-white border-[#171136] shadow-xs"
                      : "bg-[#FAF8FF] text-[#171136] border-[#EAE3F7] hover:bg-white"
                  }`}
                >
                  Custom Fee
                </button>
              </div>

              {deliveryZone === "custom" && (
                <div className="flex items-center gap-2 mt-2 bg-[#FAF8FF] p-2.5 rounded-xl border border-[#EAE3F7]">
                  <span className="text-xs font-bold text-[#736E9B]">Custom Fee: ৳</span>
                  <input
                    type="number"
                    min={0}
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="Fee"
                    className="w-full px-3 py-1 bg-white border border-[#EAE3F7] rounded-lg text-xs font-bold text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                  />
                </div>
              )}
            </div>

            {/* Courier & Initial Status */}
            <div className="space-y-3 pt-1 border-t border-[#F0EBF8]">
              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Courier Provider
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] outline-none cursor-pointer focus:border-[#7B5CFF] focus:bg-white"
                >
                  {COURIER_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Initial Status
                </label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-bold capitalize text-[#171136] outline-none cursor-pointer focus:border-[#7B5CFF] focus:bg-white"
                >
                  <option value="pending">Pending (Awaiting Confirmation)</option>
                  <option value="processing">Processing (In Packing)</option>
                  <option value="shipped">Shipped (Handed to Courier)</option>
                  <option value="delivered">Delivered (Completed)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 4. PAYMENT SUMMARY CARD (Sticky) */}
          <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs space-y-4 sticky top-6">
            <div className="flex items-center gap-3 border-b border-[#F0EBF8] pb-4">
              <div className="w-9 h-9 rounded-2xl bg-[#2ECC8F]/10 text-[#2ECC8F] flex items-center justify-center font-bold">
                <IconDollar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-base text-[#171136]">Payment Summary</h2>
                <p className="text-xs text-[#736E9B]">Subtotal, shipping & discounts</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-[#736E9B]">
                <span>Items Subtotal</span>
                <span className="font-bold text-[#171136] font-mono text-sm">
                  ৳{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center text-[#736E9B]">
                <span>Delivery Charge</span>
                <span className="font-bold text-[#171136] font-mono text-sm">
                  ৳{Number(shippingCost || 0).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#736E9B] pt-1">
                <span className="flex items-center gap-1.5">
                  <IconTicket className="w-3.5 h-3.5 text-[#7B5CFF]" />
                  <span>Manual Discount</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#736E9B]">৳</span>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    className="w-20 px-2 py-1 text-right text-xs font-bold text-[#171136] bg-[#FAF8FF] border border-[#EAE3F7] rounded-lg focus:outline-none focus:border-[#7B5CFF] focus:bg-white"
                  />
                </div>
              </div>

              {/* Total Row */}
              <div className="border-t border-[#F0EBF8] pt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-[#736E9B] block">Order Grand Total</span>
                  <span className="text-[11px] text-[#8A84A6]">Includes delivery & VAT</span>
                </div>
                <div className="text-right">
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#FF4D6D] tracking-tight">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full py-3.5 rounded-2xl bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Custom Order...</span>
                  </>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" />
                    <span>Confirm & Create Order (৳{grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
