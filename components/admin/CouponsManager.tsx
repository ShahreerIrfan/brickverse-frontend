"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, type Coupon } from "@/lib/api";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconSearch,
  IconCheck,
  IconRefresh,
  IconInfo,
} from "../icons";

// Coupon/Ticket Icon
function IconTicket({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 11v2" />
      <path d="M13 17v2" />
    </svg>
  );
}

// Copy icon
function IconCopy({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

// Tooltip helper
function TooltipInfo({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
        aria-label="Info"
      >
        <IconInfo className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute left-1/2 bottom-full mb-1.5 -translate-x-1/2 z-50 bg-[#171136] text-white text-[11px] font-medium py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#171136]" />
        </div>
      )}
    </div>
  );
}

export default function CouponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  // Form State matching screenshot
  const [formCode, setFormCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDiscountType, setFormDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [formValue, setFormValue] = useState("");
  const [formMinOrder, setFormMinOrder] = useState("");
  const [formMaxDiscount, setFormMaxDiscount] = useState("");
  const [formUsageLimit, setFormUsageLimit] = useState("");
  const [formPerUserLimit, setFormPerUserLimit] = useState("1");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Format date helper for datetime-local input (YYYY-MM-DDTHH:mm)
  const toLocalIsoString = (date: Date) => {
    const pad = (num: number) => String(num).padStart(2, "0");
    const y = date.getFullYear();
    const m = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    return `${y}-${m}-${d}T${hh}:${mm}`;
  };

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCoupons();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormDescription("");
    setFormDiscountType("percentage");
    setFormValue("");
    setFormMinOrder("0");
    setFormMaxDiscount("");
    setFormUsageLimit("");
    setFormPerUserLimit("1");
    setFormStartDate(toLocalIsoString(new Date()));
    setFormEndDate("");
    setFormIsActive(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormDescription(coupon.description || "");
    setFormDiscountType(coupon.discount_type || "percentage");
    setFormValue(String(coupon.value || ""));
    setFormMinOrder(coupon.min_order_amount != null ? String(coupon.min_order_amount) : "0");
    setFormMaxDiscount(coupon.max_discount != null ? String(coupon.max_discount) : "");
    setFormUsageLimit(coupon.usage_limit != null ? String(coupon.usage_limit) : "");
    setFormPerUserLimit(coupon.per_user_limit != null ? String(coupon.per_user_limit) : "1");
    
    // Parse dates to datetime-local format
    if (coupon.start_date) {
      try {
        setFormStartDate(toLocalIsoString(new Date(coupon.start_date)));
      } catch {
        setFormStartDate("");
      }
    } else {
      setFormStartDate("");
    }

    if (coupon.end_date) {
      try {
        setFormEndDate(toLocalIsoString(new Date(coupon.end_date)));
      } catch {
        setFormEndDate("");
      }
    } else {
      setFormEndDate("");
    }

    setFormIsActive(coupon.is_active !== false);
    setFormError(null);
    setModalOpen(true);
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    const updatedStatus = !coupon.is_active;
    // Optimistic UI update
    setCoupons((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, is_active: updatedStatus } : c))
    );

    const res = await updateCoupon(coupon.id, { is_active: updatedStatus });
    if (res.success) {
      setToast(`Coupon "${coupon.code}" is now ${updatedStatus ? "Enabled" : "Disabled"}.`);
    } else {
      // Revert on error
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, is_active: coupon.is_active } : c))
      );
      alert("Failed to update coupon status: " + (res.error || "Unknown error"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const code = formCode.trim().toUpperCase();
    if (!code) {
      setFormError("Coupon code is required.");
      return;
    }

    const valueNum = parseFloat(formValue);
    if (isNaN(valueNum) || valueNum <= 0) {
      setFormError("Please enter a valid discount value greater than 0.");
      return;
    }

    if (formDiscountType === "percentage" && valueNum > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    setSaving(true);

    const payload: Partial<Coupon> = {
      code,
      description: formDescription.trim(),
      discount_type: formDiscountType,
      value: valueNum,
      min_order_amount: formMinOrder ? parseFloat(formMinOrder) : 0,
      max_discount: formMaxDiscount ? parseFloat(formMaxDiscount) : null,
      usage_limit: formUsageLimit ? parseInt(formUsageLimit, 10) : null,
      per_user_limit: formPerUserLimit ? parseInt(formPerUserLimit, 10) : 1,
      start_date: formStartDate ? new Date(formStartDate).toISOString() : null,
      end_date: formEndDate ? new Date(formEndDate).toISOString() : null,
      is_active: formIsActive,
    };

    try {
      if (editingCoupon) {
        const res = await updateCoupon(editingCoupon.id, payload);
        if (res.success) {
          setToast(`✓ Coupon "${code}" updated successfully!`);
          setModalOpen(false);
          void loadCoupons();
        } else {
          setFormError(res.error || "Failed to update coupon.");
        }
      } else {
        const res = await createCoupon(payload);
        if (res.success) {
          setToast(`✓ Coupon "${code}" created successfully!`);
          setModalOpen(false);
          void loadCoupons();
        } else {
          setFormError(res.error || "Failed to create coupon.");
        }
      }
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteCoupon(deleteTarget.id);
    if (res.success) {
      setToast(`✓ Coupon "${deleteTarget.code}" deleted.`);
      setDeleteTarget(null);
      void loadCoupons();
    } else {
      alert("Failed to delete coupon: " + (res.error || "Unknown error"));
    }
  };

  // Filtered list
  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        !search ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && c.is_active) ||
        (filterStatus === "inactive" && !c.is_active);

      return matchSearch && matchStatus;
    });
  }, [coupons, search, filterStatus]);

  // Quick stats
  const stats = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.is_active).length;
    const totalUsed = coupons.reduce((sum, c) => sum + (c.times_used || 0), 0);
    return { total, active, totalUsed };
  }, [coupons]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#171136] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] animate-ping" />
          <span className="text-xs font-bold">{toast}</span>
          <button onClick={() => setToast(null)} className="text-white/60 hover:text-white ml-2 cursor-pointer">
            <IconClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EAE3F7] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E6F8F0] text-[#00C48C] flex items-center justify-center font-bold">
              <IconTicket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#171136] tracking-tight">
                Coupons &amp; Discounts
              </h1>
              <p className="text-xs sm:text-sm text-[#736E9B] mt-0.5">
                Create discount coupons for promotions and special offers.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadCoupons}
            title="Refresh coupons"
            className="p-3 rounded-2xl bg-[#F6F2FC] hover:bg-[#EEE7F9] text-[#736E9B] hover:text-[#171136] transition-colors cursor-pointer"
          >
            <IconRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#FF1774] hover:bg-[#E01365] active:scale-[0.98] text-white text-xs sm:text-sm font-extrabold px-5 py-3 rounded-2xl transition-all shadow-md shadow-[#FF1774]/20 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Create Coupon</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EAE3F7] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#736E9B] uppercase tracking-wider">Total Coupons</p>
            <p className="text-2xl font-black text-[#171136] mt-1">{stats.total}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F6F2FC] text-[#6B47ED] flex items-center justify-center font-black">
            🏷️
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3F7] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#736E9B] uppercase tracking-wider">Active Coupons</p>
            <p className="text-2xl font-black text-[#00C48C] mt-1">{stats.active}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#E6F8F0] text-[#00C48C] flex items-center justify-center font-black">
            ✓
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EAE3F7] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#736E9B] uppercase tracking-wider">Total Redemptions</p>
            <p className="text-2xl font-black text-[#FF1774] mt-1">{stats.totalUsed}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#FFEAF0] text-[#FF1774] flex items-center justify-center font-black">
            ⚡
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE3F7] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <IconSearch className="w-4 h-4 text-[#A79FD1] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F6F2FC] border border-[#EAE3F7] rounded-xl text-[#171136] placeholder-[#A79FD1] focus:outline-none focus:border-[#6B47ED]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <IconClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(["all", "active", "inactive"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-[#171136] text-white shadow-xs"
                  : "bg-[#F6F2FC] text-[#736E9B] hover:text-[#171136] hover:bg-[#EEE7F9]"
              }`}
            >
              {st === "all" ? "All Coupons" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3F7] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#FF1774] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#736E9B]">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-[#F6F2FC] text-[#A79FD1] flex items-center justify-center mx-auto mb-3">
              <IconTicket className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#171136]">No coupons found</h3>
            <p className="text-xs text-[#736E9B] max-w-sm mx-auto mt-1">
              {search || filterStatus !== "all"
                ? "No coupons match your filter or search query."
                : "No coupons created yet. Click 'Create Coupon' to start offering discounts!"}
            </p>
            {(!search && filterStatus === "all") && (
              <button
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 bg-[#FF1774] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs cursor-pointer hover:bg-[#E01365]"
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>Create First Coupon</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EAE3F7] bg-[#FAF8FD] text-[11px] font-bold text-[#736E9B] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Order Limits</th>
                  <th className="py-3.5 px-4">Usage / Redemptions</th>
                  <th className="py-3.5 px-4">Validity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3F7] text-xs">
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.end_date && new Date(coupon.end_date) < new Date();
                  const isPercentage = coupon.discount_type === "percentage";

                  return (
                    <tr key={coupon.id} className="hover:bg-[#FAF8FD] transition-colors">
                      {/* Code */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs px-2.5 py-1 bg-[#F6F2FC] border border-[#EAE3F7] rounded-lg text-[#171136] tracking-wider">
                            {coupon.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            title="Copy code"
                            className="text-[#A79FD1] hover:text-[#6B47ED] p-1 rounded-md transition-colors cursor-pointer"
                          >
                            {copiedCode === coupon.code ? (
                              <IconCheck className="w-3.5 h-3.5 text-[#00C48C]" />
                            ) : (
                              <IconCopy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-[#736E9B] mt-1 line-clamp-1 max-w-xs">
                            {coupon.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#171136]">
                          {isPercentage ? `${coupon.value}% OFF` : `৳${Number(coupon.value).toLocaleString()}`}
                        </div>
                        <span className="text-[10.5px] text-[#736E9B]">
                          {isPercentage ? "Percentage" : "Fixed Amount"}
                        </span>
                      </td>

                      {/* Limits */}
                      <td className="py-4 px-4">
                        <div className="text-[#171136] font-medium">
                          Min: <span className="font-bold">৳{Number(coupon.min_order_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="text-[10.5px] text-[#736E9B]">
                          Max Disc:{" "}
                          <span className="font-semibold">
                            {coupon.max_discount ? `৳${Number(coupon.max_discount).toLocaleString()}` : "Unlimited"}
                          </span>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-[#171136]">
                          {coupon.times_used} / {coupon.usage_limit != null ? coupon.usage_limit : "∞"}
                        </div>
                        <div className="text-[10.5px] text-[#736E9B]">
                          Per user: {coupon.per_user_limit != null ? coupon.per_user_limit : "Unlimited"}
                        </div>
                      </td>

                      {/* Validity */}
                      <td className="py-4 px-4">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D2455C] bg-[#FFEAF0] px-2 py-0.5 rounded-md">
                            Expired
                          </span>
                        ) : coupon.end_date ? (
                          <div>
                            <span className="text-[11px] font-semibold text-[#171136]">
                              Until {new Date(coupon.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-semibold text-[#00C48C]">
                            No Expiry
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(coupon)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                              coupon.is_active ? "bg-[#FF1774]" : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                coupon.is_active ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                          <span className={`text-[11px] font-bold ${coupon.is_active ? "text-[#00C48C]" : "text-slate-400"}`}>
                            {coupon.is_active ? "Active" : "Disabled"}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(coupon)}
                            title="Edit coupon"
                            className="w-8 h-8 rounded-xl bg-[#F6F2FC] hover:bg-[#6B47ED] text-[#736E9B] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <IconEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(coupon)}
                            title="Delete coupon"
                            className="w-8 h-8 rounded-xl bg-[#FFEAF0] hover:bg-[#FF1774] text-[#FF1774] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CREATE / EDIT COUPON MODAL (Strictly matches attached image) */}
      {/* ------------------------------------------------------------- */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171136]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#EAE3F7] p-6 sm:p-7 relative animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#F0EBF8]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E6F8F0] text-[#00C48C] flex items-center justify-center shrink-0 mt-0.5">
                  <IconTicket className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#171136]">
                    {editingCoupon ? "Edit Coupon" : "Create Coupon"}
                  </h2>
                  <p className="text-xs text-[#736E9B] mt-0.5">
                    Create discount coupons for promotions and special offers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F2FC] hover:bg-[#EEE7F9] text-[#736E9B] hover:text-[#171136] flex items-center justify-center cursor-pointer transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-[#FFEAF0] text-[#D2455C] text-xs font-semibold flex items-center gap-2">
                <span>⚠️</span>
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs sm:text-[13px]">
              {/* 1) Coupon Code */}
              <div>
                <label className="block font-bold text-[#171136] mb-1">
                  Coupon Code <span className="text-[#FF1774]">*</span>
                  <TooltipInfo text="Unique code customers will enter at checkout." />
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAVE20"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                />
              </div>

              {/* 2) Description */}
              <div>
                <label className="block font-bold text-[#171136] mb-1">
                  Description
                  <TooltipInfo text="Optional description for internal reference or campaign notes." />
                </label>
                <input
                  type="text"
                  placeholder="Short description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                />
              </div>

              {/* 3) Discount Type & Value Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Discount Type <span className="text-[#FF1774]">*</span>
                    <TooltipInfo text="Choose between percentage off or a flat amount discount." />
                  </label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as "percentage" | "fixed")}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Value <span className="text-[#FF1774]">*</span>
                    <TooltipInfo text="The discount percentage (e.g. 10) or fixed amount in BDT (e.g. 500)." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="e.g. 10"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                </div>
              </div>

              {/* 4) Min Order Amount & Max Discount Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Min Order Amount (৳)
                    <TooltipInfo text="Minimum subtotal required to use this coupon (0 for no minimum)." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0"
                    value={formMinOrder}
                    onChange={(e) => setFormMinOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Max Discount (৳)
                    <TooltipInfo text="Maximum discount cap for percentage coupons. Leave empty for unlimited." />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Unlimited"
                    value={formMaxDiscount}
                    onChange={(e) => setFormMaxDiscount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                </div>
              </div>

              {/* 5) Usage Limit & Per User Limit Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Usage Limit
                    <TooltipInfo text="Total times this coupon can be used across all customers." />
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={formUsageLimit}
                    onChange={(e) => setFormUsageLimit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Per User Limit
                    <TooltipInfo text="How many times a single customer can use this coupon." />
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formPerUserLimit}
                    onChange={(e) => setFormPerUserLimit(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] placeholder-slate-400 font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                </div>
              </div>

              {/* 6) Start Date & End Date Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    Start Date <span className="text-[#FF1774]">*</span>
                    <TooltipInfo text="When this coupon becomes valid for use." />
                  </label>
                  <input
                    type="datetime-local"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#171136] mb-1">
                    End Date
                    <TooltipInfo text="When this coupon expires. Leave empty for no expiration." />
                  </label>
                  <input
                    type="datetime-local"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D5CCE5] rounded-xl text-[#171136] font-medium focus:outline-none focus:border-[#FF1774] focus:ring-1 focus:ring-[#FF1774]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Leave empty for no expiry</p>
                </div>
              </div>

              {/* 7) Status Box with toggle */}
              <div className="p-4 rounded-2xl border border-[#D5CCE5] bg-white flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#171136]">Status</p>
                  <p className="text-[11px] text-[#736E9B] mt-0.5">
                    Enable this coupon for customers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsActive(!formIsActive)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formIsActive ? "bg-[#FF1774]" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      formIsActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBF8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl border border-[#FF1774] text-[#FF1774] font-bold text-xs sm:text-sm hover:bg-[#FFEAF0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#FF1774] hover:bg-[#E01365] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#FF1774]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171136]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#EAE3F7] text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#FFEAF0] text-[#FF1774] flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#171136]">Delete Coupon?</h3>
            <p className="text-xs text-[#736E9B] mt-1">
              Are you sure you want to delete coupon <span className="font-mono font-bold text-[#171136]">{deleteTarget.code}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-[#F6F2FC] text-[#736E9B] hover:text-[#171136] font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-[#FF1774] hover:bg-[#E01365] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
