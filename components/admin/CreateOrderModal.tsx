"use client";

import React, { useState, useMemo } from "react";
import { Product } from "../productData";
import { createOrder, getMediaUrl } from "@/lib/api";
import {
  IconClose,
  IconTrash,
  IconBag,
  IconUser,
  IconSearch,
  IconCheck,
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

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onOrderCreated: (newOrder: any) => void;
}

const SOURCE_OPTIONS = [
  { id: "facebook", label: "Facebook Page", color: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20" },
  { id: "whatsapp", label: "WhatsApp", color: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20" },
  { id: "phone", label: "Phone Call", color: "bg-[#7B5CFF]/10 text-[#7B5CFF] border-[#7B5CFF]/20" },
  { id: "instagram", label: "Instagram", color: "bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/20" },
  { id: "direct", label: "Direct / In-Store", color: "bg-[#2ECC8F]/10 text-[#2ECC8F] border-[#2ECC8F]/20" },
  { id: "other", label: "Other", color: "bg-[#736E9B]/10 text-[#736E9B] border-[#736E9B]/20" },
];

const COURIER_OPTIONS = [
  "Steadfast Courier (COD)",
  "Pathao Courier",
  "Paperfly",
  "RedX Delivery",
  "Sundarban Courier",
  "SA Paribahan",
  "In-Store Pickup",
  "Other Courier",
];

export default function CreateOrderModal({
  isOpen,
  onClose,
  products,
  onOrderCreated,
}: CreateOrderModalProps) {
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderSource, setOrderSource] = useState("facebook");
  const [orderNotes, setOrderNotes] = useState("");
  
  // Delivery & Courier
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside" | "free" | "custom">("dhaka");
  const [shippingCost, setShippingCost] = useState<number>(60);
  const [carrier, setCarrier] = useState("Steadfast Courier (COD)");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [customOrderNumber, setCustomOrderNumber] = useState("");

  // Discount
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Line items
  const [items, setItems] = useState<OrderLineItem[]>([]);

  // Product Picker state
  const [productSearch, setProductSearch] = useState("");
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [customItemQty, setCustomItemQty] = useState(1);

  // Loading & Error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Synchronize delivery fee with zone picker
  const handleZoneChange = (zone: "dhaka" | "outside" | "free" | "custom") => {
    setDeliveryZone(zone);
    if (zone === "dhaka") setShippingCost(60);
    else if (zone === "outside") setShippingCost(120);
    else if (zone === "free") setShippingCost(0);
  };

  // Filter catalog products for search dropdown
  const filteredCatalogProducts = useMemo(() => {
    if (!productSearch.trim()) return products.slice(0, 15);
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [products, productSearch]);

  // Add selected catalog product to order items
  const handleAddCatalogProduct = (prod: Product) => {
    const rawPrice = parseFloat(
      String(prod.discountedPrice || prod.price || "0").replace(/[^\d.]/g, "")
    ) || 0;

    const existingIdx = items.findIndex((it) => it.productId === String(prod.id));
    if (existingIdx >= 0) {
      // Increment quantity
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
    setProductSearch("");
  };

  // Add custom non-catalog item
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

  // Remove line item
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

  // Update item price (custom override)
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
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg("Please enter the customer's phone number.");
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMsg("Please enter the delivery / shipping address.");
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Please add at least one product / item to the order.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceLabel = SOURCE_OPTIONS.find((s) => s.id === orderSource)?.label || "Manual";
      const finalAddress = orderNotes.trim() ? `${shippingAddress.trim()} (Source: ${sourceLabel}, Note: ${orderNotes.trim()})` : `${shippingAddress.trim()} (Source: ${sourceLabel})`;

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
        order_number: customOrderNumber.trim() || undefined,
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
        onClose();
      } else {
        setErrorMsg(res.error || "Failed to create order. Please check the inputs.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred while creating order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#171136]/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#EAE3F7] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0EBF8] flex items-center justify-between bg-gradient-to-r from-[#FAF8FF] to-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center shrink-0">
              <IconBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136]">
                  Add New Order
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold bg-[#7B5CFF]/10 text-[#7B5CFF] border border-[#7B5CFF]/20">
                  Manual / Social
                </span>
              </div>
              <p className="text-xs text-[#736E9B] mt-0.5">
                Create and record custom orders from Facebook, Phone, WhatsApp or In-Store
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#736E9B] hover:text-[#171136] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-[#FFF1F4] border border-[#FF4D6D]/20 text-[#FF4D6D] text-xs font-bold flex items-center justify-between">
              <span>⚠️ {errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg("")}
                className="text-[#FF4D6D] hover:opacity-80 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Order Channel / Source Picker */}
          <div>
            <label className="block text-xs font-bold text-[#171136] mb-2 uppercase tracking-wider">
              Order Source / Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {SOURCE_OPTIONS.map((src) => (
                <button
                  key={src.id}
                  type="button"
                  onClick={() => setOrderSource(src.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                    orderSource === src.id
                      ? `${src.color} ring-2 ring-[#7B5CFF]/40 shadow-xs font-extrabold`
                      : "bg-[#FAF8FF] text-[#736E9B] border-[#EAE3F7] hover:bg-white"
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: Customer & Shipping Details */}
            <div className="lg:col-span-6 space-y-5 bg-[#FAF8FF]/70 p-5 rounded-2xl border border-[#F0EBF8]">
              <div className="flex items-center gap-2 border-b border-[#EAE3F7] pb-2.5">
                <IconUser className="w-4 h-4 text-[#7B5CFF]" />
                <h3 className="font-extrabold text-sm text-[#171136]">Customer Information</h3>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                    Customer Name <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahat Chowdhury"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                    Phone Number <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01712345678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF]"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                  Email Address <span className="text-[#8A84A6] font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF]"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                  Delivery Address <span className="text-[#FF4D6D]">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="House, Road, Area, Thana, District"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF] resize-none"
                />
              </div>

              {/* Delivery Zone & Fee */}
              <div>
                <label className="block text-[11px] font-bold text-[#736E9B] mb-1.5">
                  Delivery Zone & Charge
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleZoneChange("dhaka")}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      deliveryZone === "dhaka"
                        ? "bg-[#7B5CFF] text-white border-[#7B5CFF]"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Dhaka (৳60)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange("outside")}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      deliveryZone === "outside"
                        ? "bg-[#7B5CFF] text-white border-[#7B5CFF]"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Outside (৳120)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange("free")}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      deliveryZone === "free"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Free (৳0)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange("custom")}
                    className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      deliveryZone === "custom"
                        ? "bg-[#171136] text-white border-[#171136]"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {deliveryZone === "custom" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-[#736E9B]">৳</span>
                    <input
                      type="number"
                      min={0}
                      value={shippingCost}
                      onChange={(e) => setShippingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                      placeholder="Delivery fee"
                      className="w-32 px-3 py-1.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-bold text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                    />
                  </div>
                )}
              </div>

              {/* Courier & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-[#EAE3F7]">
                <div>
                  <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                    Courier Service
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] outline-none cursor-pointer"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                    Initial Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-bold capitalize text-[#171136] outline-none cursor-pointer"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Notes / Instructions */}
              <div>
                <label className="block text-[11px] font-bold text-[#736E9B] mb-1">
                  Admin / Customer Notes <span className="text-[#8A84A6] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call before delivery, FB inbox order"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Products & Bill Breakdown */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3F7] pb-2.5">
                <div className="flex items-center gap-2">
                  <IconBag className="w-4 h-4 text-[#FF4D6D]" />
                  <h3 className="font-extrabold text-sm text-[#171136]">
                    Ordered Items ({items.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCustomItemOpen(!isCustomItemOpen)}
                  className="text-xs font-bold text-[#7B5CFF] hover:underline cursor-pointer"
                >
                  {isCustomItemOpen ? "✕ Close Custom Item" : "+ Add Custom Item"}
                </button>
              </div>

              {/* Custom Item Quick Form (if open) */}
              {isCustomItemOpen && (
                <div className="p-3.5 rounded-2xl bg-[#F6F1FF]/60 border border-[#EAE3F7] space-y-3 animate-in fade-in duration-150">
                  <p className="text-[11px] font-extrabold text-[#7B5CFF] uppercase tracking-wider">
                    Add Non-Catalog / Custom Product
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Item name / title"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="sm:col-span-2 px-3 py-1.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Price (৳)"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="px-4 py-1.5 bg-[#7B5CFF] hover:bg-[#6847FF] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Add Custom Item
                    </button>
                  </div>
                </div>
              )}

              {/* Catalog Search & Dropdown Picker */}
              <div className="relative">
                <div className="relative flex items-center">
                  <IconSearch className="absolute left-3.5 w-4 h-4 text-[#8A84A6]" />
                  <input
                    type="text"
                    placeholder="Search product by title, SKU, category to add..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-2xl text-xs font-medium text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF]"
                  />
                  {productSearch && (
                    <button
                      type="button"
                      onClick={() => setProductSearch("")}
                      className="absolute right-3 text-xs text-[#8A84A6] hover:text-[#171136]"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Dropdown Results */}
                {productSearch.trim().length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 max-h-60 overflow-y-auto bg-white border border-[#EAE3F7] rounded-2xl shadow-xl z-20 divide-y divide-[#F0EBF8]">
                    {filteredCatalogProducts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#736E9B]">
                        No matching catalog products found.
                      </div>
                    ) : (
                      filteredCatalogProducts.map((p) => {
                        const rawPrice = parseFloat(
                          String(p.discountedPrice || p.price || "0").replace(/[^\d.]/g, "")
                        ) || 0;
                        const stockVal = p.stock ?? 0;
                        const isPre = stockVal <= 0 && p.productType !== "grouped";

                        return (
                          <div
                            key={p.id}
                            onClick={() => handleAddCatalogProduct(p)}
                            className="p-2.5 flex items-center justify-between hover:bg-[#FAF8FF] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-[#EAE3F7] overflow-hidden flex items-center justify-center shrink-0">
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
                              <div>
                                <p className="font-bold text-xs text-[#171136] group-hover:text-[#7B5CFF] transition-colors line-clamp-1">
                                  {p.name}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5 text-[10.5px] text-[#736E9B]">
                                  {p.sku && <span>SKU: {p.sku}</span>}
                                  <span>•</span>
                                  <span className={isPre ? "text-[#C08A00] font-bold" : "text-emerald-600 font-bold"}>
                                    {isPre ? "Pre-order (0 stock)" : `Stock: ${stockVal}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-extrabold text-xs text-[#171136]">
                                ৳{rawPrice.toLocaleString()}
                              </p>
                              <span className="text-[10.5px] font-bold text-[#7B5CFF] group-hover:underline">
                                + Add
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Items List Table / Container */}
              <div className="border border-[#EAE3F7] rounded-2xl overflow-hidden bg-white">
                {items.length === 0 ? (
                  <div className="py-10 text-center text-xs text-[#8A84A6] space-y-1">
                    <p className="font-bold text-[#736E9B]">No items added yet</p>
                    <p className="text-[11px]">Search products above or click "+ Add Custom Item"</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#F0EBF8] max-h-56 overflow-y-auto">
                    {items.map((it) => {
                      const lineTotal = it.price * it.quantity;
                      return (
                        <div
                          key={it.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-[#FAF8FF]/60 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="w-9 h-9 rounded-xl bg-[#F6F1FF] border border-[#EAE3F7] overflow-hidden flex items-center justify-center shrink-0">
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
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10.5px] text-[#736E9B]">Price: ৳</span>
                                <input
                                  type="number"
                                  min={0}
                                  value={it.price}
                                  onChange={(e) => handleUpdatePrice(it.id, e.target.value)}
                                  className="w-16 px-1.5 py-0.5 text-[11px] font-bold text-[#171136] border border-[#EAE3F7] rounded bg-white"
                                />
                                {it.isPreorder && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFF4D6] text-[#C08A00] font-extrabold uppercase">
                                    Pre-order
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls & Total */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center border border-[#EAE3F7] rounded-xl overflow-hidden bg-white">
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(it.id, it.quantity - 1)}
                                className="px-2 py-1 text-xs font-bold text-[#736E9B] hover:bg-[#F6F1FF] cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-extrabold text-[#171136]">
                                {it.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleUpdateQty(it.id, it.quantity + 1)}
                                className="px-2 py-1 text-xs font-bold text-[#736E9B] hover:bg-[#F6F1FF] cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <p className="font-extrabold text-xs text-[#171136] w-16 text-right">
                              ৳{lineTotal.toLocaleString()}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleRemoveItem(it.id)}
                              className="p-1 text-[#FF4D6D] hover:bg-[#FFF1F4] rounded-lg transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <IconTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Billing Summary Box */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EAE3F7] space-y-2 text-xs">
                <div className="flex justify-between text-[#736E9B]">
                  <span>Items Subtotal</span>
                  <span className="font-bold text-[#171136]">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#736E9B]">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-[#171136]">৳{Number(shippingCost || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#736E9B]">
                  <span>Manual Discount (৳)</span>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    placeholder="0"
                    className="w-20 px-2 py-1 text-right text-xs font-bold text-[#171136] bg-white border border-[#EAE3F7] rounded-lg focus:outline-none"
                  />
                </div>
                <div className="border-t border-[#EAE3F7] pt-2.5 flex justify-between items-center text-sm font-extrabold text-[#171136]">
                  <span>Grand Total</span>
                  <span className="text-base text-[#FF4D6D] font-[family-name:var(--font-display)]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#F0EBF8] flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-[#EAE3F7] text-xs font-bold text-[#736E9B] hover:text-[#171136] hover:bg-[#FAF8FF] transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="px-6 py-2.5 rounded-xl bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Order...</span>
                </>
              ) : (
                <>
                  <IconCheck className="w-4 h-4" />
                  <span>Confirm & Create Order (৳{grandTotal.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
