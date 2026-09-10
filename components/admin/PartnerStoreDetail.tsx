"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  IconArrowLeft,
  IconPlus,
  IconRefresh,
  IconCheck,
  IconClose,
  IconSearch,
  IconBox,
  IconDollar,
  IconEdit,
  IconPartnerStore,
  IconTruck,
  IconBag,
} from "../icons";
import {
  getStoreById,
  getStoreSettlement,
  addStoreProduct,
  recordStoreSale,
  recordStoreReturn,
  recordStorePayment,
  updateStore,
  getAllProducts,
} from "@/lib/api";
import type { Product } from "../productData";

interface PartnerStoreDetailProps {
  storeId: string | number;
  onBack: () => void;
  showToast?: (msg: string) => void;
}

export default function PartnerStoreDetail({
  storeId,
  onBack,
  showToast,
}: PartnerStoreDetailProps) {
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any | null>(null);
  const [settlementHistory, setSettlementHistory] = useState<any[]>([]);
  const [allCatalogProducts, setAllCatalogProducts] = useState<Product[]>([]);

  // Action Modals / Drawers
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isEditStoreOpen, setIsEditStoreOpen] = useState(false);

  // Add Product Form State
  const [selectedProductId, setSelectedProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [addProductQty, setAddProductQty] = useState(5);
  const [addingProduct, setAddingProduct] = useState(false);

  // Inline Row Action States (for recording sale / return)
  const [activeSaleLineId, setActiveSaleLineId] = useState<number | null>(null);
  const [saleQty, setSaleQty] = useState<number>(1);
  const [submittingSale, setSubmittingSale] = useState(false);

  const [activeReturnLineId, setActiveReturnLineId] = useState<number | null>(null);
  const [returnQty, setReturnQty] = useState<number>(1);
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Record Payment Form State
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentNote, setPaymentNote] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Edit Store Form State
  const [editName, setEditName] = useState("");
  const [editOwner, setEditOwner] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editArea, setEditArea] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  const formatMoney = (val?: number | string) => {
    const num = Number(val || 0);
    return `৳${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const fetchStoreData = async () => {
    setLoading(true);
    try {
      const [storeData, settlements, prods] = await Promise.all([
        getStoreById(storeId),
        getStoreSettlement(storeId),
        getAllProducts(),
      ]);

      if (storeData) {
        setStore(storeData);
        setEditName(storeData.name || "");
        setEditOwner(storeData.owner_name || "");
        setEditPhone(storeData.phone || "");
        setEditArea(storeData.area || "");
        setEditAddress(storeData.address || "");
        setEditNotes(storeData.notes || "");
        setEditIsActive(storeData.is_active ?? true);
      }
      if (Array.isArray(settlements)) {
        setSettlementHistory(settlements);
      }
      if (Array.isArray(prods)) {
        setAllCatalogProducts(prods);
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
        }
      }
    } catch (err) {
      console.error("Failed fetching partner store details:", err);
      showToast?.("Failed to load store data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  // Filter catalog products for adding
  const filteredCatalog = useMemo(() => {
    const q = productSearch.toLowerCase().trim();
    if (!q) return allCatalogProducts;
    return allCatalogProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [allCatalogProducts, productSearch]);

  const selectedProductObj = useMemo(() => {
    return allCatalogProducts.find((p) => String(p.id) === String(selectedProductId));
  }, [allCatalogProducts, selectedProductId]);

  // Handle Add Product Submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || addProductQty <= 0) return;
    setAddingProduct(true);
    try {
      const res = await addStoreProduct(storeId, selectedProductId, addProductQty);
      if (res.success) {
        showToast?.("Product inventory assigned to store successfully!");
        setIsAddProductOpen(false);
        setAddProductQty(5);
        fetchStoreData();
      } else {
        showToast?.(res.error || "Failed to add product to store");
      }
    } catch {
      showToast?.("Network error while adding product");
    } finally {
      setAddingProduct(false);
    }
  };

  // Handle Record Sale
  const handleConfirmSale = async (lineId: number) => {
    if (saleQty <= 0) return;
    setSubmittingSale(true);
    try {
      const res = await recordStoreSale(storeId, lineId, saleQty);
      if (res.success) {
        showToast?.(`Recorded sale of ${saleQty} unit(s)`);
        setActiveSaleLineId(null);
        setSaleQty(1);
        fetchStoreData();
      } else {
        showToast?.(res.error || "Failed to record sale");
      }
    } catch {
      showToast?.("Error recording sale");
    } finally {
      setSubmittingSale(false);
    }
  };

  // Handle Record Return
  const handleConfirmReturn = async (lineId: number) => {
    if (returnQty <= 0) return;
    setSubmittingReturn(true);
    try {
      const res = await recordStoreReturn(storeId, lineId, returnQty);
      if (res.success) {
        showToast?.(`Recorded return of ${returnQty} unit(s) to warehouse inventory`);
        setActiveReturnLineId(null);
        setReturnQty(1);
        fetchStoreData();
      } else {
        showToast?.(res.error || "Failed to record return");
      }
    } catch {
      showToast?.("Error recording return");
    } finally {
      setSubmittingReturn(false);
    }
  };

  // Handle Record Payment Submit
  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(paymentAmount);
    if (isNaN(amt) || amt <= 0) {
      showToast?.("Please enter a valid payment amount");
      return;
    }
    setSubmittingPayment(true);
    try {
      const res = await recordStorePayment(storeId, amt, paymentDate, paymentNote);
      if (res.success) {
        showToast?.(`Payment of ${formatMoney(amt)} recorded successfully!`);
        setIsRecordPaymentOpen(false);
        setPaymentAmount("");
        setPaymentNote("");
        fetchStoreData();
      } else {
        showToast?.(res.error || "Failed to record payment");
      }
    } catch {
      showToast?.("Error recording payment");
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Handle Edit Store Submit
  const handleEditStoreSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setSubmittingEdit(true);
    try {
      const res = await updateStore(storeId, {
        name: editName,
        owner_name: editOwner,
        phone: editPhone,
        area: editArea,
        address: editAddress,
        notes: editNotes,
        is_active: editIsActive,
      });
      if (res.success) {
        showToast?.("Store details updated successfully");
        setIsEditStoreOpen(false);
        fetchStoreData();
      } else {
        showToast?.(res.error || "Failed to update store");
      }
    } catch {
      showToast?.("Error updating store");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const renderStatusPill = (status?: string) => {
    switch (status) {
      case "up_to_date":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold bg-[#E7F8F0] text-[#1E9E64] border border-[#C3EFD9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E64]" />
            Up to date
          </span>
        );
      case "due_this_month":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold bg-[#FFF4DA] text-[#C08A00] border border-[#FFE6A8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C08A00]" />
            Due this month
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold bg-[#FFE6EA] text-[#D2455C] border border-[#FFCCD4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2455C]" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold bg-[#F0EBFA] text-[#736E9B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#736E9B]" />
            Active
          </span>
        );
    }
  };

  if (loading && !store) {
    return (
      <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-12 text-center flex flex-col items-center justify-center">
        <IconRefresh className="w-8 h-8 text-[#FF4D6D] animate-spin mb-3" />
        <p className="text-sm font-bold text-[#171136]">Loading store details...</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-12 text-center">
        <p className="text-sm text-[#736E9B]">Partner store not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-[#FF4D6D] text-white rounded-full text-xs font-bold"
        >
          Return to All Stores
        </button>
      </div>
    );
  }

  const lines = store.productLines || [];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumbs & Store Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#736E9B]">
          <button onClick={onBack} className="hover:text-[#FF4D6D] transition-colors flex items-center gap-1 cursor-pointer">
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Partner Stores</span>
          </button>
          <span>/</span>
          <span className="text-[#171136] font-bold">{store.name}</span>
        </div>

        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 sm:p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFEAF0] text-[#FF4D6D] border border-[#FFD0DC] flex items-center justify-center font-[family-name:var(--font-display)] font-extrabold text-xl shrink-0">
              {(store.name || "S").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136]">
                  {store.name}
                </h1>
                {renderStatusPill(store.settlementStatus)}
              </div>
              <p className="text-xs text-[#736E9B] mt-1">
                {[store.owner_name, store.phone, store.area].filter(Boolean).join(" · ")}
              </p>
              {store.address && (
                <p className="text-[11.5px] text-[#736E9B]/80 mt-0.5">{store.address}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditStoreOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#EAE3F7] bg-[#FAF7FF] text-[#171136] text-xs font-bold hover:bg-[#F0EBFA] transition-all cursor-pointer"
            >
              <IconEdit className="w-3.5 h-3.5 text-[#736E9B]" />
              <span>Edit details</span>
            </button>

            <button
              onClick={() => setIsRecordPaymentOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E9E64] hover:bg-[#198755] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>Record payment</span>
            </button>

            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Give stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards (Mirrors admin-03-store-detail.svg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Value Given */}
        <div className="bg-white rounded-[20px] border border-[#EAE3F7] p-5 shadow-[0_4px_20px_rgba(23,17,54,0.03)]">
          <span className="text-xs font-bold text-[#736E9B] block mb-2">Total value given</span>
          <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
            {formatMoney(store.valueGiven)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">All-time stock transferred</p>
        </div>

        {/* Value Remaining */}
        <div className="bg-white rounded-[20px] border border-[#EAE3F7] p-5 shadow-[0_4px_20px_rgba(23,17,54,0.03)]">
          <span className="text-xs font-bold text-[#736E9B] block mb-2">Value remaining</span>
          <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
            {formatMoney(store.valueRemaining)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">Current stock at store</p>
        </div>

        {/* Total Sold Value */}
        <div className="bg-white rounded-[20px] border border-[#EAE3F7] p-5 shadow-[0_4px_20px_rgba(23,17,54,0.03)]">
          <span className="text-xs font-bold text-[#736E9B] block mb-2">Total sold value</span>
          <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
            {formatMoney(store.valueSold)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">Units sold by partner</p>
        </div>

        {/* Amount Due Now */}
        <div className="bg-white rounded-[20px] border border-[#EAE3F7] p-5 shadow-[0_4px_20px_rgba(23,17,54,0.03)]">
          <span className="text-xs font-bold text-[#736E9B] block mb-2">Amount due now</span>
          <div
            className={`font-[family-name:var(--font-display)] font-extrabold text-2xl ${
              Number(store.amountDue || 0) > 0 ? "text-[#D2455C]" : "text-[#1E9E64]"
            }`}
          >
            {formatMoney(store.amountDue)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">
            Sold value − Payments received
          </p>
        </div>
      </div>

      {/* Section 1: Products Given (Consignment Lines) */}
      <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 sm:p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
              Products on Consignment ({lines.length})
            </h2>
            <p className="text-xs text-[#736E9B] mt-0.5">
              Live inventory balances snapshotting Trade Price (TP) at time of transfer.
            </p>
          </div>

          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF1F4] text-[#FF4D6D] hover:bg-[#FF4D6D] hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Add product</span>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="py-10 text-center border-2 border-dashed border-[#F0EBF9] rounded-2xl">
            <p className="text-xs font-bold text-[#736E9B]">
              No inventory given to this store yet.
            </p>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="mt-3 px-4 py-1.5 rounded-full bg-[#FF4D6D] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              + Give First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[840px]">
              <thead>
                <tr className="border-b border-[#F0EBF9] text-[11px] font-extrabold uppercase tracking-wider text-[#736E9B]">
                  <th className="py-3 px-3">PRODUCT</th>
                  <th className="py-3 px-3">TP</th>
                  <th className="py-3 px-3 text-center">GIVEN</th>
                  <th className="py-3 px-3 text-center">SOLD</th>
                  <th className="py-3 px-3 text-center">RETURNED</th>
                  <th className="py-3 px-3 text-center">REMAINING</th>
                  <th className="py-3 px-3">VALUE GIVEN</th>
                  <th className="py-3 px-3">VALUE SOLD</th>
                  <th className="py-3 px-3 text-right">RECORD ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBF9] text-[12.5px]">
                {lines.map((line: any) => {
                  const isRecordingSale = activeSaleLineId === line.id;
                  const isRecordingReturn = activeReturnLineId === line.id;
                  const remaining = line.qtyRemaining ?? 0;

                  return (
                    <tr key={line.id} className="hover:bg-[#FAF7FF]/60 transition-colors">
                      {/* Product */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF7FF] border border-[#EAE3F7] p-1 flex items-center justify-center shrink-0">
                            <img
                              src={line.productImage || "/images/figure-samurai-red.svg"}
                              alt={line.productName}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/images/figure-samurai-red.svg";
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-[family-name:var(--font-display)] font-extrabold text-[13px] text-[#171136] block">
                              {line.productName}
                            </span>
                            <span className="text-[10.5px] font-mono text-[#736E9B]">
                              SKU: {line.productSku || "KS-PROD"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Trade Price Snapshot */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#7B5CFF]">
                        {formatMoney(line.tp)}
                      </td>

                      {/* Given */}
                      <td className="py-3.5 px-3 text-center font-bold text-[#171136]">
                        {line.qtyGiven}
                      </td>

                      {/* Sold */}
                      <td className="py-3.5 px-3 text-center font-bold text-[#1E9E64]">
                        {line.qtySold}
                      </td>

                      {/* Returned */}
                      <td className="py-3.5 px-3 text-center font-bold text-[#736E9B]">
                        {line.qtyReturned}
                      </td>

                      {/* Remaining */}
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EFE9FF] text-[#7B5CFF] font-extrabold text-xs">
                          {remaining}
                        </span>
                      </td>

                      {/* Value Given */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#171136]">
                        {formatMoney(line.valueGiven)}
                      </td>

                      {/* Value Sold */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#1E9E64]">
                        {formatMoney(line.valueSold)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        {isRecordingSale ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              min={1}
                              max={remaining}
                              value={saleQty}
                              onChange={(e) =>
                                setSaleQty(Math.max(1, Math.min(remaining, parseInt(e.target.value) || 1)))
                              }
                              className="w-14 px-2 py-1 bg-white border border-[#EAE3F7] rounded-lg text-xs font-bold text-center outline-none"
                            />
                            <button
                              onClick={() => handleConfirmSale(line.id)}
                              disabled={submittingSale || remaining <= 0}
                              className="px-2.5 py-1 bg-[#1E9E64] text-white rounded-lg text-xs font-bold hover:bg-[#198755] cursor-pointer shadow-2xs"
                            >
                              {submittingSale ? "..." : "Save"}
                            </button>
                            <button
                              onClick={() => setActiveSaleLineId(null)}
                              className="p-1 text-[#736E9B] hover:text-[#171136] cursor-pointer"
                            >
                              <IconClose className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : isRecordingReturn ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <input
                              type="number"
                              min={1}
                              max={remaining}
                              value={returnQty}
                              onChange={(e) =>
                                setReturnQty(Math.max(1, Math.min(remaining, parseInt(e.target.value) || 1)))
                              }
                              className="w-14 px-2 py-1 bg-white border border-[#EAE3F7] rounded-lg text-xs font-bold text-center outline-none"
                            />
                            <button
                              onClick={() => handleConfirmReturn(line.id)}
                              disabled={submittingReturn || remaining <= 0}
                              className="px-2.5 py-1 bg-[#736E9B] text-white rounded-lg text-xs font-bold hover:bg-[#5C5685] cursor-pointer shadow-2xs"
                            >
                              {submittingReturn ? "..." : "Return"}
                            </button>
                            <button
                              onClick={() => setActiveReturnLineId(null)}
                              className="p-1 text-[#736E9B] hover:text-[#171136] cursor-pointer"
                            >
                              <IconClose className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveSaleLineId(line.id);
                                setActiveReturnLineId(null);
                                setSaleQty(1);
                              }}
                              disabled={remaining <= 0}
                              className="px-2.5 py-1 rounded-lg bg-[#E7F8F0] hover:bg-[#1E9E64] text-[#1E9E64] hover:text-white text-[11px] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                            >
                              Record sale
                            </button>
                            <button
                              onClick={() => {
                                setActiveReturnLineId(line.id);
                                setActiveSaleLineId(null);
                                setReturnQty(1);
                              }}
                              disabled={remaining <= 0}
                              className="px-2.5 py-1 rounded-lg bg-[#F0EBFA] hover:bg-[#736E9B] text-[#736E9B] hover:text-white text-[11px] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
                            >
                              Return
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Monthly Settlement History */}
      <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 sm:p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
              Monthly Settlement Reconciliation
            </h2>
            <p className="text-xs text-[#736E9B] mt-0.5">
              Reconciles monthly sold inventory against payments received and carries forward balances.
            </p>
          </div>

          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E7F8F0] text-[#1E9E64] hover:bg-[#1E9E64] hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Record payment</span>
          </button>
        </div>

        {settlementHistory.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-[#F0EBF9] rounded-2xl">
            <p className="text-xs font-bold text-[#736E9B]">
              No sales or payments recorded yet for this partner store.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F0EBF9] text-[11px] font-extrabold uppercase tracking-wider text-[#736E9B]">
                  <th className="py-3 px-3">MONTH</th>
                  <th className="py-3 px-3">VALUE SOLD</th>
                  <th className="py-3 px-3">PAYMENT RECEIVED</th>
                  <th className="py-3 px-3 text-right">BALANCE CARRIED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBF9] text-[12.5px]">
                {settlementHistory.map((item, idx) => {
                  const balance = Number(item.balanceCarried || 0);
                  return (
                    <tr key={idx} className="hover:bg-[#FAF7FF]/60 transition-colors">
                      <td className="py-3 px-3 font-bold text-[#171136]">{item.month}</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#171136]">
                        {formatMoney(item.valueSold)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#1E9E64]">
                        {formatMoney(item.paymentReceived)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-mono font-extrabold ${
                            balance > 0 ? "text-[#D2455C]" : "text-[#1E9E64]"
                          }`}
                        >
                          {formatMoney(balance)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Give Stock / Add Product */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#EAE3F7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3F7]">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                Give Inventory on Consignment
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-lg text-[#736E9B] hover:text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1.5">
                  Select Product from Catalog
                </label>
                <input
                  type="text"
                  placeholder="Filter catalog by name or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] mb-2"
                />
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] cursor-pointer"
                >
                  {filteredCatalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (TP: {p.tradePrice || "৳0.00"}, Stock: {p.stock ?? 50})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProductObj && (
                <div className="p-3 bg-[#FAF7FF] rounded-xl border border-[#EAE3F7] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[#736E9B] block">Trade Price (Snapshot):</span>
                    <span className="font-mono font-extrabold text-[#7B5CFF] text-sm">
                      {selectedProductObj.tradePrice || "৳0.00"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#736E9B] block">Warehouse Stock:</span>
                    <span className="font-bold text-[#171136]">
                      {selectedProductObj.stock ?? 50} units
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Quantity Given
                </label>
                <input
                  type="number"
                  min={1}
                  value={addProductQty}
                  onChange={(e) => setAddProductQty(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#736E9B] hover:bg-[#FAF7FF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingProduct || !selectedProductId}
                  className="px-5 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {addingProduct ? "Adding..." : "Transfer Stock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Record Payment */}
      {isRecordPaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#EAE3F7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3F7]">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                Record Settlement Payment
              </h3>
              <button
                onClick={() => setIsRecordPaymentOpen(false)}
                className="p-1 rounded-lg text-[#736E9B] hover:text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Payment Amount (৳)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 5000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-bold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                  required
                />
                <p className="text-[11px] text-[#736E9B] mt-1">
                  Current total amount due: <span className="font-extrabold text-[#D2455C]">{formatMoney(store.amountDue)}</span>
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] cursor-pointer"
                >
                  <option value="cash">Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Note / Reference (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Settlement for September sales"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordPaymentOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#736E9B] hover:bg-[#FAF7FF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-5 py-2.5 rounded-full bg-[#1E9E64] hover:bg-[#198755] text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingPayment ? "Recording..." : "Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Store Details */}
      {isEditStoreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#EAE3F7] space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3F7]">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                Edit Partner Store
              </h3>
              <button
                onClick={() => setIsEditStoreOpen(false)}
                className="p-1 rounded-lg text-[#736E9B] hover:text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditStoreSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#736E9B] block mb-1">
                    Owner / Contact Name
                  </label>
                  <input
                    type="text"
                    value={editOwner}
                    onChange={(e) => setEditOwner(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#736E9B] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Area / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mirpur-10, Dhaka"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Full Address
                </label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#736E9B] block mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editIsActive"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="rounded text-[#FF4D6D] accent-[#FF4D6D] cursor-pointer"
                />
                <label htmlFor="editIsActive" className="text-xs font-bold text-[#171136] cursor-pointer">
                  Active Partner Store
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditStoreOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#736E9B] hover:bg-[#FAF7FF] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="px-5 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-extrabold shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submittingEdit ? "Saving..." : "Update Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
