"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconPartnerStore,
  IconBox,
  IconSearch,
} from "../icons";
import { createStore, getAllProducts } from "@/lib/api";
import type { Product } from "../productData";

interface StartingStockRow {
  productId: string;
  qty: number;
}

interface PartnerStoreFormProps {
  onSaved: (store: any) => void;
  onCancel: () => void;
  showToast?: (msg: string) => void;
}

export default function PartnerStoreForm({
  onSaved,
  onCancel,
  showToast,
}: PartnerStoreFormProps) {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Repeatable starting stock rows
  const [stockRows, setStockRows] = useState<StartingStockRow[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  useEffect(() => {
    const loadCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const prods = await getAllProducts();
        if (Array.isArray(prods)) {
          setCatalogProducts(prods);
        }
      } catch (err) {
        console.error("Failed loading products for store creation:", err);
      } finally {
        setLoadingCatalog(false);
      }
    };
    loadCatalog();
  }, []);

  const addStockRow = () => {
    const firstProdId = catalogProducts[0]?.id || "";
    setStockRows((prev) => [...prev, { productId: firstProdId, qty: 5 }]);
  };

  const removeStockRow = (idx: number) => {
    setStockRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateRowProduct = (idx: number, prodId: string) => {
    setStockRows((prev) => {
      const next = [...prev];
      next[idx].productId = prodId;
      return next;
    });
  };

  const updateRowQty = (idx: number, qty: number) => {
    setStockRows((prev) => {
      const next = [...prev];
      next[idx].qty = Math.max(1, qty);
      return next;
    });
  };

  const getProductTradePrice = (prodId: string) => {
    const prod = catalogProducts.find((p) => String(p.id) === String(prodId));
    return prod?.tradePrice || "৳0.00";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast?.("Store name is required");
      return;
    }

    setSubmitting(true);
    try {
      const validStartingStock = stockRows
        .filter((r) => r.productId && r.qty > 0)
        .map((r) => ({
          productId: r.productId,
          qty: r.qty,
        }));

      const res = await createStore({
        name: name.trim(),
        owner_name: ownerName.trim(),
        phone: phone.trim(),
        area: area.trim(),
        address: address.trim(),
        notes: notes.trim(),
        is_active: true,
        startingStock: validStartingStock,
      });

      if (res.success && res.data) {
        showToast?.("Partner store created successfully!");
        onSaved(res.data);
      } else {
        showToast?.(res.error || "Failed to create partner store");
      }
    } catch {
      showToast?.("Network error while creating partner store");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#736E9B] mb-2">
          <button
            onClick={onCancel}
            className="hover:text-[#FF4D6D] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            <span>Partner Stores</span>
          </button>
          <span>/</span>
          <span className="text-[#171136] font-bold">Add New Store</span>
        </div>

        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[28px] text-[#171136] tracking-tight">
          Create Partner Store
        </h1>
        <p className="text-xs sm:text-sm text-[#736E9B] mt-0.5">
          Register a new partner shop for physical consignment inventory distribution.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Store Basic Information */}
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#F0EBF9]">
            <div className="w-8 h-8 rounded-xl bg-[#FFEAF0] text-[#FF4D6D] flex items-center justify-center">
              <IconPartnerStore className="w-4 h-4" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
              Store Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#171136] block mb-1">
                Store Name <span className="text-[#FF4D6D]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Manga Paradise, Anime Haven Uttara"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm font-semibold bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171136] block mb-1">
                Owner / Contact Person
              </label>
              <input
                type="text"
                placeholder="e.g. Tanvir Ahmed"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171136] block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. +880 1712-345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171136] block mb-1">
                Area / City
              </label>
              <input
                type="text"
                placeholder="e.g. Mirpur-10, Dhaka"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#171136] block mb-1">
                Full Physical Address
              </label>
              <input
                type="text"
                placeholder="e.g. Shop #42, Level 3, Mirpur Shopping Complex"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-[#171136] block mb-1">
                Notes / Terms
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Settle up on the 5th of every month. Initial consignment agreement."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Initial Starting Stock (Optional) */}
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EBF9]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center">
                <IconBox className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                  Initial Consignment Stock (Optional)
                </h2>
                <p className="text-xs text-[#736E9B]">
                  Assign products directly to this store upon creation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addStockRow}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF1F4] text-[#FF4D6D] hover:bg-[#FF4D6D] hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Add product row</span>
            </button>
          </div>

          {stockRows.length === 0 ? (
            <div className="py-6 text-center border-2 border-dashed border-[#F0EBF9] rounded-2xl">
              <p className="text-xs text-[#736E9B]">
                No initial inventory specified. You can also transfer stock later from the store detail page.
              </p>
              <button
                type="button"
                onClick={addStockRow}
                className="mt-2 text-xs font-bold text-[#FF4D6D] hover:underline cursor-pointer"
              >
                + Add Starting Product
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {stockRows.map((row, idx) => {
                const tp = getProductTradePrice(row.productId);
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <label className="text-[11px] font-bold text-[#736E9B] block mb-1">
                        Product
                      </label>
                      <select
                        value={row.productId}
                        onChange={(e) => updateRowProduct(idx, e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] cursor-pointer"
                      >
                        {catalogProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.sku || "KS-PROD"})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="w-32 shrink-0">
                      <label className="text-[11px] font-bold text-[#736E9B] block mb-1">
                        Trade Price (TP)
                      </label>
                      <div className="px-3 py-2 text-xs font-mono font-bold bg-white/70 border border-[#EAE3F7] rounded-xl text-[#7B5CFF]">
                        {tp}
                      </div>
                    </div>

                    <div className="w-24 shrink-0">
                      <label className="text-[11px] font-bold text-[#736E9B] block mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={row.qty}
                        onChange={(e) => updateRowQty(idx, parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-xs font-bold bg-white border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeStockRow(idx)}
                      title="Remove product"
                      className="p-2 rounded-xl text-[#736E9B] hover:text-[#D2455C] hover:bg-[#FFE6EA] transition-colors self-end sm:self-center cursor-pointer"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-[#736E9B] hover:bg-white border border-transparent hover:border-[#EAE3F7] transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs sm:text-sm font-extrabold shadow-[0_4px_16px_rgba(255,77,109,0.3)] hover:shadow-[0_6px_20px_rgba(255,77,109,0.4)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? "Creating Store..." : "Create Partner Store"}
          </button>
        </div>
      </form>
    </div>
  );
}
