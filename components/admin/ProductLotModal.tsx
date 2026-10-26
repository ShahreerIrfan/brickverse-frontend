"use client";

import React, { useState, useEffect } from "react";
import {
  getProductLots,
  createProductLot,
  updateProductLot,
  deleteProductLot,
  initProductLotFromStock,
  type ProductLotResponse,
} from "@/lib/api";
import { Product, ProductLot } from "../productData";
import {
  IconClose,
  IconPlus,
  IconCheck,
  IconRefresh,
  IconBox,
  IconLayers,
  IconClock,
  IconDollar,
  IconInfo,
  IconTrash,
  IconEdit,
} from "../icons";

interface ProductLotModalProps {
  product: Product;
  onClose: () => void;
  onProductUpdated?: (updatedProduct: any) => void;
  showToast?: (msg: string) => void;
}

export default function ProductLotModal({
  product,
  onClose,
  onProductUpdated,
  showToast,
}: ProductLotModalProps) {
  const [loading, setLoading] = useState(true);
  const [lotData, setLotData] = useState<ProductLotResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // New Lot Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLotNumber, setNewLotNumber] = useState("");
  const [newQuantity, setNewQuantity] = useState<number | "">(10);
  const [newTradePrice, setNewTradePrice] = useState(
    product.tradePrice?.replace("৳", "").trim() || "0.00"
  );
  const [newMrp, setNewMrp] = useState(
    product.regularPrice?.replace("৳", "").trim() ||
      product.price?.replace("৳", "").trim() ||
      "0.00"
  );
  const [newDiscountedPrice, setNewDiscountedPrice] = useState(
    product.discountedPrice?.replace("৳", "").trim() || ""
  );
  const [newNotes, setNewNotes] = useState("");

  // Edit Lot state
  const [editingLotId, setEditingLotId] = useState<number | null>(null);
  const [editRemainingQty, setEditRemainingQty] = useState<number>(0);
  const [editTradePrice, setEditTradePrice] = useState("");
  const [editMrp, setEditMrp] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const fetchLots = async () => {
    setLoading(true);
    setErrorMsg("");
    const res = await getProductLots(product.id);
    if (res.success && res.data) {
      setLotData(res.data);
    } else {
      setErrorMsg(res.error || "Failed to load product lots.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLots();
  }, [product.id]);

  const handleInitFromStock = async () => {
    setSubmitting(true);
    setErrorMsg("");
    const res = await initProductLotFromStock(product.id);
    if (res.success) {
      setSuccessMsg("Initial lot created from current stock!");
      if (showToast) showToast("✓ Initial lot created successfully!");
      if (res.data?.product && onProductUpdated) {
        onProductUpdated(res.data.product);
      }
      fetchLots();
    } else {
      setErrorMsg(res.error || "Failed to initialize lot.");
    }
    setSubmitting(false);
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuantity || Number(newQuantity) <= 0) {
      setErrorMsg("Please enter a valid quantity greater than 0.");
      return;
    }
    if (!newTradePrice) {
      setErrorMsg("Trade price (TP) is required.");
      return;
    }
    if (!newMrp) {
      setErrorMsg("MRP (selling price) is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      lotNumber: newLotNumber.trim() || undefined,
      tradePrice: newTradePrice.startsWith("৳") ? newTradePrice : `৳${newTradePrice}`,
      mrp: newMrp.startsWith("৳") ? newMrp : `৳${newMrp}`,
      discountedPrice: newDiscountedPrice
        ? newDiscountedPrice.startsWith("৳")
          ? newDiscountedPrice
          : `৳${newDiscountedPrice}`
        : "",
      quantity: Number(newQuantity),
      notes: newNotes.trim(),
    };

    const res = await createProductLot(product.id, payload);
    if (res.success) {
      setSuccessMsg(`✓ Lot created successfully! Stock increased by ${newQuantity}.`);
      if (showToast) showToast(`✓ New lot restocked successfully!`);
      setShowAddForm(false);
      setNewLotNumber("");
      setNewNotes("");
      if (res.data?.product && onProductUpdated) {
        onProductUpdated(res.data.product);
      }
      fetchLots();
    } else {
      setErrorMsg(res.error || "Failed to restock lot.");
    }
    setSubmitting(false);
  };

  const handleSaveEditLot = async (lotId: number) => {
    setSubmitting(true);
    setErrorMsg("");
    const payload = {
      remainingQuantity: editRemainingQty,
      tradePrice: editTradePrice.startsWith("৳") ? editTradePrice : `৳${editTradePrice}`,
      mrp: editMrp.startsWith("৳") ? editMrp : `৳${editMrp}`,
      notes: editNotes,
    };
    const res = await updateProductLot(lotId, payload);
    if (res.success) {
      setSuccessMsg("✓ Lot updated successfully.");
      setEditingLotId(null);
      if (res.data?.product && onProductUpdated) {
        onProductUpdated(res.data.product);
      }
      fetchLots();
    } else {
      setErrorMsg(res.error || "Failed to update lot.");
    }
    setSubmitting(false);
  };

  const handleDeleteOrDeactivateLot = async (lot: ProductLot) => {
    if (!confirm(`Are you sure you want to deactivate or remove lot "${lot.lotNumber}"?`)) {
      return;
    }
    setSubmitting(true);
    const res = await deleteProductLot(lot.id);
    if (res.success) {
      setSuccessMsg("Lot removed or deactivated.");
      fetchLots();
    } else {
      setErrorMsg(res.error || "Failed to remove lot.");
    }
    setSubmitting(false);
  };

  const lots = (lotData?.lots || []) as ProductLot[];
  const activeLotId = lotData?.activeLotId;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B071A]/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#EAE3F7] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#FAF8FD] via-white to-[#FFF5F7] border-b border-[#F0EBF8] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#7B5CFF] text-white flex items-center justify-center shadow-md shadow-[#FF4D6D]/20 shrink-0">
              <IconLayers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#171136] tracking-tight">
                  FIFO Lot & Batch Inventory
                </h2>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#7B5CFF]/10 text-[#7B5CFF] border border-[#7B5CFF]/20 uppercase tracking-wider">
                  Automated Price Transition
                </span>
              </div>
              <p className="text-xs text-[#736E9B] mt-0.5 font-medium line-clamp-1">
                Product: <strong className="text-[#171136]">{product.name}</strong> • SKU: {product.sku || product.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#8A84A6] hover:text-[#171136] hover:bg-[#F4F0FB] transition-colors"
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Status Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-[#FFF0F2] border border-[#FFCCD3] text-[#D90429] text-xs font-bold flex items-center gap-2.5">
              <IconInfo className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-bold flex items-center gap-2.5">
              <IconCheck className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* FIFO Real-Time Explainer Card */}
          <div className="bg-gradient-to-br from-[#F8F6FF] to-[#FFF7FA] rounded-2xl p-4 sm:p-5 border border-[#E9E1F9] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#171136]">
                  <IconClock className="w-4 h-4 text-[#7B5CFF]" />
                  <span>How FIFO Automatic Transition Works</span>
                </div>
                <p className="text-xs text-[#635B80] leading-relaxed max-w-xl">
                  Products are sold strictly from the <strong>oldest active lot first</strong> (First-In, First-Out).
                  When a lot reaches <strong>0 quantity</strong>, the storefront seamlessly transitions to the next queued lot, 
                  automatically updating both the <strong>Trade Price (TP)</strong> and <strong>MRP / Selling Price</strong>!
                </p>
              </div>

              {/* Current Live Stats Pill */}
              <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#E4DCF5] shadow-xs shrink-0">
                <div className="text-right">
                  <div className="text-[10px] font-extrabold text-[#8A84A6] uppercase tracking-wider">Active Selling Price</div>
                  <div className="text-sm font-black text-[#171136]">
                    MRP: <span className="text-[#FF4D6D]">{lotData?.currentRegularPrice || product.regularPrice || "৳0.00"}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#059669]">
                    TP: {lotData?.currentTradePrice || product.tradePrice || "৳0.00"}
                  </div>
                </div>
                <div className="h-8 w-[1px] bg-[#EAE3F7]" />
                <div className="text-left pl-1">
                  <div className="text-[10px] font-extrabold text-[#8A84A6] uppercase tracking-wider">Total Stock</div>
                  <div className="text-sm font-black text-[#7B5CFF]">
                    {lotData?.totalLotRemaining ?? product.stock ?? 0} units
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action: If product has NO lots, offer 1-click initialize */}
          {lots.length === 0 && !loading && (
            <div className="bg-white rounded-2xl p-6 border-2 border-dashed border-[#DCD3F5] text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#F4F1FD] text-[#7B5CFF] flex items-center justify-center">
                <IconBox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-extrabold text-[#171136]">
                No FIFO Lots Configured for &quot;{product.name}&quot;
              </h3>
              <p className="text-xs text-[#736E9B] max-w-md mx-auto">
                This product currently uses legacy flat stock ({product.stock ?? 0} units, TP: {product.tradePrice || "৳0.00"}, MRP: {product.regularPrice || product.price || "৳0.00"}).
                Convert this stock into Lot 1 with 1 click to activate FIFO!
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleInitFromStock}
                  className="px-5 py-2.5 rounded-xl bg-[#7B5CFF] hover:bg-[#6A49F2] text-white text-xs font-bold shadow-md shadow-[#7B5CFF]/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <IconCheck className="w-4 h-4" />
                  <span>Initialize Lot 1 from Current Stock</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(true)}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#FAF8FD] border border-[#DCD3F5] text-[#171136] text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <IconPlus className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Create Custom First Lot</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Bar */}
          {lots.length > 0 && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-[#171136]">
                  Configured Lots ({lots.length})
                </span>
                <span className="text-[11px] text-[#736E9B]">
                  • Sold in sequence from top to bottom
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchLots}
                  disabled={loading}
                  className="p-2 rounded-xl border border-[#EAE3F7] text-[#736E9B] hover:text-[#171136] hover:bg-[#F9F7FD] transition-all cursor-pointer"
                  title="Refresh lots"
                >
                  <IconRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 rounded-xl bg-[#171136] hover:bg-[#28214E] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <IconPlus className="w-4 h-4 text-[#FF4D6D]" />
                  <span>Restock New Lot</span>
                </button>
              </div>
            </div>
          )}

          {/* Add New Lot Restock Form */}
          {showAddForm && (
            <form
              onSubmit={handleCreateLot}
              className="bg-[#FAF9FE] rounded-2xl p-5 border border-[#E4DCF5] space-y-4 animate-slideDown"
            >
              <div className="flex items-center justify-between border-b border-[#EDE6FA] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FF4D6D]/15 text-[#FF4D6D] flex items-center justify-center">
                    <IconPlus className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-[#171136]">
                    Restock New Inventory Lot / Batch
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs text-[#8A84A6] hover:text-[#171136]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Lot Quantity */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#171136] mb-1">
                    Quantity (Units) <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newQuantity}
                    onChange={(e) =>
                      setNewQuantity(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="e.g. 10"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3F5] bg-white text-xs font-bold text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                  />
                </div>

                {/* 2. Trade Price (TP) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#171136] mb-1">
                    Trade Price (TP ৳) <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTradePrice}
                    onChange={(e) => setNewTradePrice(e.target.value)}
                    placeholder="e.g. 10.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3F5] bg-white text-xs font-bold text-[#059669] focus:outline-none focus:border-[#059669]"
                  />
                  <p className="text-[10px] text-[#736E9B] mt-0.5">Supplier purchase cost</p>
                </div>

                {/* 3. MRP (Selling Price) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#171136] mb-1">
                    MRP (Selling Price ৳) <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMrp}
                    onChange={(e) => setNewMrp(e.target.value)}
                    placeholder="e.g. 13.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3F5] bg-white text-xs font-bold text-[#FF4D6D] focus:outline-none focus:border-[#FF4D6D]"
                  />
                  <p className="text-[10px] text-[#736E9B] mt-0.5">Customer sale price</p>
                </div>

                {/* 4. Lot Number / Batch ID */}
                <div>
                  <label className="block text-[11px] font-extrabold text-[#171136] mb-1">
                    Lot / Batch ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLotNumber}
                    onChange={(e) => setNewLotNumber(e.target.value)}
                    placeholder="Auto (e.g. LOT-20261026-01)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCD3F5] bg-white text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                  />
                  <p className="text-[10px] text-[#736E9B] mt-0.5">Leave blank to auto-generate</p>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#171136] mb-1">
                  Supplier or Batch Notes (Optional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Received from Supplier X, New packaging batch"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCD3F5] bg-white text-xs font-medium text-[#171136] focus:outline-none focus:border-[#7B5CFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl border border-[#DCD3F5] bg-white text-xs font-bold text-[#635B80] hover:bg-[#FAF8FD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF4D6D] to-[#7B5CFF] text-white text-xs font-extrabold shadow-md shadow-[#FF4D6D]/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  {submitting ? "Adding..." : "Add Lot & Restock"}
                </button>
              </div>
            </form>
          )}

          {/* Lots List (FIFO Order) */}
          {lots.length > 0 && (
            <div className="space-y-3">
              {lots.map((lot, idx) => {
                const isActive = lot.id === activeLotId;
                const isExhausted = lot.remainingQuantity <= 0;
                const percentLeft =
                  lot.initialQuantity > 0
                    ? Math.round((lot.remainingQuantity / lot.initialQuantity) * 100)
                    : 0;

                const isEditing = editingLotId === lot.id;

                return (
                  <div
                    key={lot.id}
                    className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#FAF8FD] via-white to-[#FFF9FB] border-[#FF4D6D]/40 shadow-sm ring-1 ring-[#FF4D6D]/20"
                        : isExhausted
                        ? "bg-[#FAF8FD]/50 border-[#EFEBF8] opacity-75"
                        : "bg-white border-[#EAE3F7] hover:border-[#DCD3F5]"
                    }`}
                  >
                    {isEditing ? (
                      /* Editing Mode */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-[#F0EBF8] pb-2">
                          <span className="text-xs font-bold text-[#171136]">
                            Editing {lot.lotNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingLotId(null)}
                            className="text-xs text-[#8A84A6] hover:text-[#171136]"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-extrabold text-[#171136] block mb-1">
                              Remaining Stock
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={editRemainingQty}
                              onChange={(e) => setEditRemainingQty(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-xl border border-[#DCD3F5] text-xs font-bold text-[#171136]"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-extrabold text-[#171136] block mb-1">
                              Trade Price (TP ৳)
                            </label>
                            <input
                              type="text"
                              value={editTradePrice}
                              onChange={(e) => setEditTradePrice(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#DCD3F5] text-xs font-bold text-[#059669]"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-extrabold text-[#171136] block mb-1">
                              MRP (৳)
                            </label>
                            <input
                              type="text"
                              value={editMrp}
                              onChange={(e) => setEditMrp(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#DCD3F5] text-xs font-bold text-[#FF4D6D]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingLotId(null)}
                            className="px-3 py-1.5 rounded-lg border border-[#DCD3F5] text-xs font-bold text-[#635B80]"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={submitting}
                            onClick={() => handleSaveEditLot(lot.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#7B5CFF] text-white text-xs font-bold"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display Mode */
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left: Priority badge + Lot info */}
                        <div className="flex items-start sm:items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                              isActive
                                ? "bg-[#FF4D6D] text-white shadow-sm shadow-[#FF4D6D]/30"
                                : isExhausted
                                ? "bg-[#EAE3F7] text-[#8A84A6]"
                                : "bg-[#7B5CFF]/15 text-[#7B5CFF]"
                            }`}
                          >
                            #{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-xs text-[#171136]">
                                {lot.lotNumber}
                              </span>
                              {/* Status Badge */}
                              {isActive ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#059669] border border-[#10B981]/30">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                  Active Selling (1st in Line)
                                </span>
                              ) : isExhausted ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#8A84A6]/10 text-[#736E9B]">
                                  Exhausted / Sold Out
                                </span>
                              ) : (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#7B5CFF]/10 text-[#7B5CFF] border border-[#7B5CFF]/20">
                                  Queued Batch (Waiting)
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#736E9B] mt-0.5">
                              Created: {lot.createdAt || "N/A"}{" "}
                              {lot.notes ? `• ${lot.notes}` : ""}
                            </p>
                          </div>
                        </div>

                        {/* Middle: Stock Progress */}
                        <div className="w-full sm:w-44 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-[#171136]">
                              {lot.remainingQuantity} / {lot.initialQuantity} left
                            </span>
                            <span className="text-[#8A84A6]">{percentLeft}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#EAE3F7] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isActive
                                  ? "bg-gradient-to-r from-[#FF4D6D] to-[#7B5CFF]"
                                  : isExhausted
                                  ? "bg-[#DCD3F5]"
                                  : "bg-[#7B5CFF]"
                              }`}
                              style={{ width: `${percentLeft}%` }}
                            />
                          </div>
                        </div>

                        {/* Right: Pricing & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#F0EBF8]">
                          <div className="text-right">
                            <div className="text-xs font-black text-[#171136]">
                              MRP: <span className="text-[#FF4D6D]">{lot.mrp}</span>
                            </div>
                            <div className="text-[11px] font-bold text-[#059669]">
                              TP: {lot.tradePrice}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingLotId(lot.id);
                                setEditRemainingQty(lot.remainingQuantity);
                                setEditTradePrice(lot.tradePrice?.replace("৳", "") || "");
                                setEditMrp(lot.mrp?.replace("৳", "") || "");
                                setEditNotes(lot.notes || "");
                              }}
                              className="p-1.5 rounded-lg text-[#736E9B] hover:text-[#171136] hover:bg-[#F4F0FB] transition-colors"
                              title="Edit Lot"
                            >
                              <IconEdit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrDeactivateLot(lot)}
                              className="p-1.5 rounded-lg text-[#8A84A6] hover:text-[#D90429] hover:bg-[#FFF0F2] transition-colors"
                              title="Deactivate Lot"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-[#FAF8FD] border-t border-[#F0EBF8] flex items-center justify-between gap-3">
          <div className="text-xs text-[#736E9B]">
            Total FIFO Batches: <strong>{lots.length}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#171136] hover:bg-[#28214E] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
