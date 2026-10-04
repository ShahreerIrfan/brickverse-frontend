"use client";

import React, { useState, useMemo } from "react";
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
  { id: "facebook", label: "Facebook Page", color: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30" },
  { id: "whatsapp", label: "WhatsApp", color: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/30" },
  { id: "phone", label: "Phone Call", color: "bg-[#7B5CFF]/10 text-[#7B5CFF] border-[#7B5CFF]/30" },
  { id: "instagram", label: "Instagram", color: "bg-[#E1306C]/10 text-[#E1306C] border-[#E1306C]/30" },
  { id: "direct", label: "Direct / In-Store", color: "bg-[#2ECC8F]/10 text-[#2ECC8F] border-[#2ECC8F]/30" },
  { id: "other", label: "Other Channel", color: "bg-[#736E9B]/10 text-[#736E9B] border-[#736E9B]/30" },
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
  const [customOrderNumber, setCustomOrderNumber] = useState("");

  // Discount
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Line Items
  const [items, setItems] = useState<OrderLineItem[]>([]);

  // Product Selection Form State
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [itemQuantityToAdd, setItemQuantityToAdd] = useState<number>(1);
  const [itemPriceOverride, setItemPriceOverride] = useState<string>("");

  // Custom (Non-Catalog) Item State
  const [isCustomItemOpen, setIsCustomItemOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState("");
  const [customItemPrice, setCustomItemPrice] = useState("");
  const [customItemQty, setCustomItemQty] = useState(1);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Update zone & shipping fee
  const handleZoneChange = (zone: "dhaka" | "outside" | "free" | "custom") => {
    setDeliveryZone(zone);
    if (zone === "dhaka") setShippingCost(60);
    else if (zone === "outside") setShippingCost(120);
    else if (zone === "free") setShippingCost(0);
  };

  // Currently selected product object from dropdown
  const currentSelectedProduct = useMemo(() => {
    return products.find((p) => String(p.id) === String(selectedProductId)) || null;
  }, [products, selectedProductId]);

  // When product selection changes, auto-fill unit price override field
  const handleProductSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedProductId(pId);
    if (pId) {
      const found = products.find((p) => String(p.id) === String(pId));
      if (found) {
        const rawPrice = parseFloat(
          String(found.discountedPrice || found.price || "0").replace(/[^\d.]/g, "")
        ) || 0;
        setItemPriceOverride(rawPrice > 0 ? String(rawPrice) : "");
      }
    } else {
      setItemPriceOverride("");
    }
  };

  // Add Product from select dropdown
  const handleAddSelectedProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentSelectedProduct) return;

    const parsedPrice = parseFloat(itemPriceOverride.replace(/[^\d.]/g, "")) ||
      parseFloat(String(currentSelectedProduct.discountedPrice || currentSelectedProduct.price || "0").replace(/[^\d.]/g, "")) ||
      0;

    const qtyToAdd = Math.max(1, Number(itemQuantityToAdd) || 1);
    const existingIdx = items.findIndex((it) => it.productId === String(currentSelectedProduct.id));

    if (existingIdx >= 0) {
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === existingIdx
            ? { ...it, quantity: it.quantity + qtyToAdd, price: parsedPrice > 0 ? parsedPrice : it.price }
            : it
        )
      );
    } else {
      const isPreorder = (currentSelectedProduct.stock ?? 0) <= 0 && currentSelectedProduct.productType !== "grouped";
      const newItem: OrderLineItem = {
        id: `prod-${currentSelectedProduct.id}-${Date.now()}`,
        productId: String(currentSelectedProduct.id),
        name: currentSelectedProduct.name,
        price: parsedPrice,
        quantity: qtyToAdd,
        image: currentSelectedProduct.image || (currentSelectedProduct.image_file ? String(currentSelectedProduct.image_file) : undefined),
        sku: currentSelectedProduct.sku,
        stock: currentSelectedProduct.stock,
        isPreorder,
      };
      setItems((prev) => [...prev, newItem]);
    }

    // Reset picker inputs
    setSelectedProductId("");
    setItemQuantityToAdd(1);
    setItemPriceOverride("");
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
      setErrorMsg("Please enter the customer full name.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!customerPhone.trim()) {
      setErrorMsg("Please enter the customer contact phone number.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMsg("Please enter the delivery / shipping address.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (items.length === 0) {
      setErrorMsg("Please select and add at least one product to the ordered items list.");
      return;
    }

    setIsSubmitting(true);

    try {
      const sourceLabel = SOURCE_OPTIONS.find((s) => s.id === orderSource)?.label || "Facebook";
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
      } else {
        setErrorMsg(res.error || "Failed to create order. Please check all fields.");
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
    <div className="space-y-6 max-w-[1400px] animate-in fade-in-50 duration-300">
      {/* Breadcrumb & Top Navigation */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#F6F1FF] text-[#7B5CFF] font-bold text-xs rounded-xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs"
          >
            ← Back to Orders
          </button>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onCancel}
              className="text-[#736E9B] hover:text-[#171136] font-medium cursor-pointer"
            >
              Orders
            </button>
            <span className="text-[#8A84A6]">/</span>
            <span className="font-extrabold text-[#171136]">Add Custom Order</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20">
            Facebook & Direct Orders
          </span>
        </div>
      </div>

      {/* Page Header Card */}
      <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
            Create Custom Order
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B] font-medium mt-1">
            Manual order placement for Facebook page customers, phone inquiries, and direct sales
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[#EAE3F7] bg-white text-xs font-bold text-[#736E9B] hover:text-[#171136] hover:bg-[#FAF8FF] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitOrder}
            disabled={isSubmitting || items.length === 0}
            className="px-6 py-2.5 rounded-xl bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Order...</span>
              </>
            ) : (
              <>
                <IconCheck className="w-4 h-4" />
                <span>Confirm Order (৳{grandTotal.toLocaleString()})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert Box */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FFF1F4] border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
          <span>⚠️ {errorMsg}</span>
          <button
            type="button"
            onClick={() => setErrorMsg("")}
            className="text-[#FF4D6D] hover:opacity-80 cursor-pointer text-sm font-extrabold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Form Form */}
      <form onSubmit={handleSubmitOrder} className="space-y-6">
        {/* Order Channel / Source Selection */}
        <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs space-y-3">
          <label className="block text-xs font-bold text-[#171136] uppercase tracking-wider">
            1. Select Order Channel / Origin
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {SOURCE_OPTIONS.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setOrderSource(src.id)}
                className={`px-3.5 py-3 rounded-2xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  orderSource === src.id
                    ? `${src.color} ring-2 ring-[#7B5CFF]/40 shadow-xs font-extrabold scale-[1.02]`
                    : "bg-[#FAF8FF] text-[#736E9B] border-[#EAE3F7] hover:bg-white hover:border-[#7B5CFF]/30"
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two Column Layout: Customer Details vs Ordered Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Customer Information & Delivery Options */}
          <div className="lg:col-span-6 space-y-6">
            {/* Customer Details Card */}
            <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b border-[#F0EBF8] pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#7B5CFF]/10 text-[#7B5CFF] flex items-center justify-center">
                  <IconUser className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-[#171136]">2. Customer Details</h2>
                  <p className="text-[11px] text-[#736E9B]">Recipient and delivery address</p>
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#171136] mb-1.5">
                    Customer Full Name <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nusrat Sara"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#171136] mb-1.5">
                    Contact Phone Number <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 01752543972"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF]"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Customer Email <span className="text-[#8A84A6] font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. sorowarjahan59@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF]"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Complete Delivery Address <span className="text-[#FF4D6D]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Sonirakra 24 ft rosulbug mosjid green tower building, kodomtali, dhaka"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none focus:bg-white focus:border-[#7B5CFF] focus:ring-1 focus:ring-[#7B5CFF] resize-none"
                />
              </div>

              {/* Delivery Zone & Fee */}
              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Delivery Zone & Shipping Charge
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => handleZoneChange("dhaka")}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      deliveryZone === "dhaka"
                        ? "bg-[#7B5CFF] text-white border-[#7B5CFF] shadow-xs"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Dhaka (৳60)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange("outside")}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      deliveryZone === "outside"
                        ? "bg-[#7B5CFF] text-white border-[#7B5CFF] shadow-xs"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Outside (৳120)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange("free")}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      deliveryZone === "free"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Free (৳0)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleZoneChange("custom")}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      deliveryZone === "custom"
                        ? "bg-[#171136] text-white border-[#171136] shadow-xs"
                        : "bg-white text-[#171136] border-[#EAE3F7] hover:bg-[#F8F6FD]"
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {deliveryZone === "custom" && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-[#736E9B]">Custom Fee: ৳</span>
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

              {/* Courier & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0EBF8]">
                <div>
                  <label className="block text-xs font-bold text-[#171136] mb-1.5">
                    Courier Provider
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] outline-none cursor-pointer focus:border-[#7B5CFF]"
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
                    Initial Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-bold capitalize text-[#171136] outline-none cursor-pointer focus:border-[#7B5CFF]"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-[#171136] mb-1.5">
                  Admin / Special Instructions <span className="text-[#8A84A6] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Requested urgent delivery before Eid, FB chat confirmed"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Selection & Order Items Table */}
          <div className="lg:col-span-6 space-y-6">
            {/* Product Picker Card */}
            <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F0EBF8] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center">
                    <IconBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base text-[#171136]">3. Select Product(s)</h2>
                    <p className="text-[11px] text-[#736E9B]">
                      Pick from all {products.length} existing store catalog products
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustomItemOpen(!isCustomItemOpen)}
                  className="text-xs font-bold text-[#7B5CFF] hover:underline cursor-pointer"
                >
                  {isCustomItemOpen ? "✕ Close Custom Item" : "+ Add Custom Item"}
                </button>
              </div>

              {/* Product Select Field Form */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EAE3F7] space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#171136] mb-1.5">
                    Product <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={handleProductSelectChange}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3F7] rounded-xl text-xs font-bold text-[#171136] outline-none focus:border-[#7B5CFF] cursor-pointer"
                  >
                    <option value="">-- Select an existing product ({products.length} available) --</option>
                    {products.map((p) => {
                      const rawPrice = parseFloat(
                        String(p.discountedPrice || p.price || "0").replace(/[^\d.]/g, "")
                      ) || 0;
                      const skuText = p.sku ? ` [SKU: ${p.sku}]` : "";
                      const stockVal = p.stock ?? 0;
                      const stockText = stockVal > 0 ? `(Stock: ${stockVal})` : "(Pre-order)";

                      return (
                        <option key={p.id} value={p.id}>
                          {p.name}{skuText} — ৳{rawPrice.toLocaleString()} {stockText}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Selected Product Quick Info & Inputs */}
                {currentSelectedProduct && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE3F7] overflow-hidden flex items-center justify-center shrink-0">
                      {currentSelectedProduct.image || currentSelectedProduct.image_file ? (
                        <img
                          src={getMediaUrl(currentSelectedProduct.image || currentSelectedProduct.image_file)}
                          alt={currentSelectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="font-extrabold text-sm text-[#FF4D6D]">
                          {currentSelectedProduct.name[0]}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <div>
                        <label className="block text-[10px] font-bold text-[#736E9B] mb-0.5">
                          Unit Price (৳)
                        </label>
                        <input
                          type="number"
                          value={itemPriceOverride}
                          onChange={(e) => setItemPriceOverride(e.target.value)}
                          placeholder="Price"
                          className="w-full px-2.5 py-1.5 bg-white border border-[#EAE3F7] rounded-lg text-xs font-bold text-[#171136]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#736E9B] mb-0.5">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={itemQuantityToAdd}
                          onChange={(e) => setItemQuantityToAdd(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2.5 py-1.5 bg-white border border-[#EAE3F7] rounded-lg text-xs font-bold text-[#171136]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddSelectedProduct}
                      className="px-4 py-2.5 bg-[#7B5CFF] hover:bg-[#6847FF] text-white text-xs font-extrabold rounded-xl shadow-xs transition-all cursor-pointer shrink-0 self-end"
                    >
                      + Add Item
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Non-Catalog Item Panel */}
              {isCustomItemOpen && (
                <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FF4D6D]/20 space-y-3 animate-in fade-in duration-150">
                  <p className="text-xs font-extrabold text-[#FF4D6D] uppercase tracking-wider">
                    Add Custom / Non-Catalog Item
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      placeholder="Item name / title"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="sm:col-span-2 px-3 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Unit Price (৳)"
                      value={customItemPrice}
                      onChange={(e) => setCustomItemPrice(e.target.value)}
                      className="px-3 py-2 bg-white border border-[#EAE3F7] rounded-xl text-xs font-semibold text-[#171136] focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="px-4 py-1.5 bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Add Custom Item
                    </button>
                  </div>
                </div>
              )}

              {/* Ordered Items Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#171136]">
                    Ordered Items List ({items.length})
                  </span>
                </div>

                <div className="border border-[#EAE3F7] rounded-2xl overflow-hidden bg-white">
                  {items.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#8A84A6] space-y-1">
                      <p className="font-bold text-[#736E9B] text-sm">No items added to order</p>
                      <p className="text-[11px]">Select a product from the dropdown above and click "+ Add Item"</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F0EBF8]">
                      {items.map((it) => {
                        const lineTotal = it.price * it.quantity;
                        return (
                          <div
                            key={it.id}
                            className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF8FF]/70 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-10 h-10 rounded-xl bg-[#F6F1FF] border border-[#EAE3F7] overflow-hidden flex items-center justify-center shrink-0">
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

                            {/* Quantity Controls & Line Total */}
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

                              <p className="font-extrabold text-xs text-[#171136] w-20 text-right">
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

              {/* Financial Calculation Summary */}
              <div className="p-5 rounded-2xl bg-[#FAF8FF] border border-[#EAE3F7] space-y-2.5 text-xs">
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
                    className="w-24 px-2 py-1 text-right text-xs font-bold text-[#171136] bg-white border border-[#EAE3F7] rounded-lg focus:outline-none"
                  />
                </div>
                <div className="border-t border-[#EAE3F7] pt-3 flex justify-between items-center text-sm font-extrabold text-[#171136]">
                  <span>Grand Total</span>
                  <span className="text-xl text-[#FF4D6D] font-[family-name:var(--font-display)]">
                    ৳{grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Actions */}
        <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-[#EAE3F7] bg-white text-xs font-bold text-[#736E9B] hover:text-[#171136] hover:bg-[#FAF8FF] transition-all cursor-pointer"
          >
            ← Cancel & Return
          </button>

          <button
            type="submit"
            disabled={isSubmitting || items.length === 0}
            className="px-8 py-3 rounded-2xl bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating Custom Order...</span>
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
  );
}
