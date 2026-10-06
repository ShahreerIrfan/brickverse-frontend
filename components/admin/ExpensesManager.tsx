"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  type Expense,
  type ExpenseSummary,
} from "@/lib/api";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconClose,
  IconSearch,
  IconCheck,
  IconRefresh,
  IconFilter,
  IconWallet,
  IconTrendingUp,
  IconBox,
  IconMegaphone,
  IconTruck,
  IconFolder,
} from "../icons";

const CATEGORY_META: Record<
  string,
  { label: string; bg: string; text: string; border: string; iconBg: string }
> = {
  SOCIAL_MEDIA_AD_COST: {
    label: "Social Media Ad Cost",
    bg: "bg-[#E3F2FD]",
    text: "text-[#1976D2]",
    border: "border-[#BBDEFB]",
    iconBg: "from-[#42A5F5] to-[#1E88E5]",
  },
  PACKAGING_MATERIAL: {
    label: "Packaging Material",
    bg: "bg-[#FFF3E0]",
    text: "text-[#E65100]",
    border: "border-[#FFE0B2]",
    iconBg: "from-[#FFA726] to-[#FB8C00]",
  },
  PR_AND_ADVERTISEMENT: {
    label: "PR & Advertisement",
    bg: "bg-[#F3E5F5]",
    text: "text-[#7B1FA2]",
    border: "border-[#E1BEE7]",
    iconBg: "from-[#AB47BC] to-[#8E24AA]",
  },
  TRANSPORT: {
    label: "Transport",
    bg: "bg-[#E0F2F1]",
    text: "text-[#00796B]",
    border: "border-[#B2DFDB]",
    iconBg: "from-[#26A69A] to-[#00897B]",
  },
  OTHER_EXPENSE: {
    label: "Other Expense",
    bg: "bg-[#ECEFF1]",
    text: "text-[#455A64]",
    border: "border-[#CFD8DC]",
    iconBg: "from-[#78909C] to-[#546E7A]",
  },
};

const CATEGORY_OPTIONS = [
  { value: "SOCIAL_MEDIA_AD_COST", label: "social media ad cost" },
  { value: "PACKAGING_MATERIAL", label: "packaging material" },
  { value: "PR_AND_ADVERTISEMENT", label: "pr and advertisement" },
  { value: "TRANSPORT", label: "transport" },
  { value: "OTHER_EXPENSE", label: "other expense" },
];

export default function ExpensesManager() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState("SOCIAL_MEDIA_AD_COST");
  const [formAmount, setFormAmount] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Toast timer
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, sum] = await Promise.all([
        getExpenses({
          category: categoryFilter,
          search,
          start_date: startDate,
          end_date: endDate,
        }),
        getExpenseSummary(),
      ]);
      setExpenses(list);
      setSummary(sum);
    } catch (err) {
      console.error("Failed to load expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [categoryFilter, startDate, endDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void loadData();
  };

  const openCreateModal = () => {
    setEditingExpense(null);
    setFormCategory("SOCIAL_MEDIA_AD_COST");
    setFormAmount("");
    const todayStr = new Date().toISOString().split("T")[0];
    setFormDate(todayStr);
    setFormDescription("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: Expense) => {
    setEditingExpense(item);
    setFormCategory(item.expense_title);
    setFormAmount(String(item.amount));
    setFormDate(item.date || new Date().toISOString().split("T")[0]);
    setFormDescription(item.description || "");
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const amt = parseFloat(formAmount.replace(/[^\d.]/g, ""));
    if (isNaN(amt) || amt <= 0) {
      setFormError("Please enter a valid expense amount greater than 0.");
      return;
    }

    if (!formDate) {
      setFormError("Please select a date.");
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Expense> = {
        expense_title: formCategory,
        amount: amt,
        date: formDate,
        description: formDescription.trim(),
      };

      if (editingExpense) {
        const res = await updateExpense(editingExpense.id, payload);
        if (res.success) {
          setToast("✓ Expense updated successfully!");
          setModalOpen(false);
          void loadData();
        } else {
          setFormError(res.error || "Failed to update expense.");
        }
      } else {
        const res = await createExpense(payload);
        if (res.success) {
          setToast("✓ Expense recorded successfully!");
          setModalOpen(false);
          void loadData();
        } else {
          setFormError(res.error || "Failed to record expense.");
        }
      }
    } catch (err: any) {
      setFormError(err?.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await deleteExpense(deleteTarget.id);
      if (res.success) {
        setToast("✓ Expense deleted.");
        setDeleteTarget(null);
        void loadData();
      } else {
        alert("Failed to delete expense: " + (res.error || "Unknown error"));
      }
    } catch (err) {
      alert("Failed to delete expense.");
    } finally {
      setSaving(false);
    }
  };

  // Top Category
  const topCategory = useMemo(() => {
    if (!summary?.category_breakdown || summary.category_breakdown.length === 0) return null;
    return summary.category_breakdown[0];
  }, [summary]);

  const totalExpenseComputed = useMemo(() => {
    if (summary && summary.total_expense != null) return summary.total_expense;
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [summary, expenses]);

  const formatDateLabel = (dStr: string) => {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dStr;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#171136] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-3 animate-in slide-in-from-top-3">
          <div className="w-6 h-6 rounded-full bg-[#2ECC8F]/20 text-[#2ECC8F] flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <span className="text-xs sm:text-sm font-semibold">{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FFEAF0] text-[#FF4D6D] text-[11px] font-extrabold tracking-wide uppercase">
              Financial Management
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[28px] text-[#171136] tracking-tight mt-1.5">
            Expenses &amp; Operating Costs
          </h1>
          <p className="text-xs sm:text-[13px] text-[#736E9B] mt-1">
            Track and categorize social media ads, packaging, transport, and operational costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => void loadData()}
            disabled={loading}
            title="Refresh"
            className="p-3 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#3B3468] transition-all cursor-pointer disabled:opacity-50"
          >
            <IconRefresh className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#FF7A93] hover:from-[#e83e5f] hover:to-[#ff6884] text-white text-xs sm:text-[13px] font-bold flex items-center gap-2 shadow-md shadow-[#FF4D6D]/20 transition-all active:scale-98 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Expenses */}
        <div className="bg-white rounded-[22px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#FF4D6D] to-[#FF7A93] flex items-center justify-center text-white shadow-md shadow-[#FF4D6D]/20">
              <IconWallet className="w-5 h-5" />
            </div>
            <span className="text-[11.5px] font-semibold text-[#736E9B]">All Time Cost</span>
          </div>
          <div className="mt-4">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block font-mono">
              ৳{Number(totalExpenseComputed).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#736E9B]">
              <span className="font-bold text-[#171136]">{summary?.total_count || expenses.length}</span> recorded entries
            </div>
          </div>
        </div>

        {/* 2. This Month's Expenses */}
        <div className="bg-white rounded-[22px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#6B3BF7] to-[#B14BE8] flex items-center justify-center text-white shadow-md shadow-[#6B3BF7]/20">
              <IconTrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[11.5px] font-semibold text-[#736E9B]">This Month</span>
          </div>
          <div className="mt-4">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block font-mono">
              ৳{Number(summary?.this_month_expense || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#736E9B]">
              Current calendar month
            </div>
          </div>
        </div>

        {/* 3. Top Expense Category */}
        <div className="bg-white rounded-[22px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#13BFC9] to-[#57E0C9] flex items-center justify-center text-white shadow-md shadow-[#13BFC9]/20">
              <IconBox className="w-5 h-5" />
            </div>
            <span className="text-[11.5px] font-semibold text-[#736E9B]">Top Category</span>
          </div>
          <div className="mt-4">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-[19px] text-[#171136] tracking-tight block truncate" title={topCategory?.label || "None"}>
              {topCategory?.label || "None"}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#736E9B]">
              <span className="font-mono font-bold text-[#FF4D6D]">
                ৳{Number(topCategory?.total_amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
              <span>({topCategory?.count || 0} times)</span>
            </div>
          </div>
        </div>

        {/* 4. Active Categories Count */}
        <div className="bg-white rounded-[22px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#FF9F43] to-[#FFC93C] flex items-center justify-center text-white shadow-md shadow-[#FF9F43]/20">
              <IconFolder className="w-5 h-5" />
            </div>
            <span className="text-[11.5px] font-semibold text-[#736E9B]">Categories Tracked</span>
          </div>
          <div className="mt-4">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block">
              {summary?.category_breakdown?.length || 5} / 5
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#2ECC8F] font-semibold">
              ✓ All Standard Categories
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bar Visual */}
      {summary?.category_breakdown && summary.category_breakdown.length > 0 && totalExpenseComputed > 0 && (
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-[0_4px_20px_rgba(23,17,54,0.02)] space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-[#171136]">
            <span>Spending by Category</span>
            <span className="text-[#736E9B]">Total: ৳{totalExpenseComputed.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </div>

          <div className="w-full h-3 bg-[#F0EBFA] rounded-full overflow-hidden flex">
            {summary.category_breakdown.map((cat, idx) => {
              const pct = totalExpenseComputed > 0 ? (cat.total_amount / totalExpenseComputed) * 100 : 0;
              const colors = ["#FF4D6D", "#6B3BF7", "#13BFC9", "#FF9F43", "#8B84B8"];
              return (
                <div
                  key={cat.category}
                  style={{ width: `${pct}%` }}
                  className="h-full transition-all duration-300"
                  title={`${cat.label}: ৳${cat.total_amount.toLocaleString()} (${pct.toFixed(1)}%)`}
                >
                  <div className="w-full h-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {summary.category_breakdown.map((cat, idx) => {
              const pct = totalExpenseComputed > 0 ? (cat.total_amount / totalExpenseComputed) * 100 : 0;
              const meta = CATEGORY_META[cat.category] || CATEGORY_META.OTHER_EXPENSE;
              return (
                <div
                  key={cat.category}
                  onClick={() => setCategoryFilter(categoryFilter === cat.category ? "all" : cat.category)}
                  className={`px-3 py-1.5 rounded-xl text-[11.5px] font-semibold border flex items-center gap-2 cursor-pointer transition-all ${
                    categoryFilter === cat.category
                      ? "ring-2 ring-[#171136] shadow-sm bg-white"
                      : `${meta.bg} ${meta.text} ${meta.border} hover:opacity-85`
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="font-mono font-bold">৳{cat.total_amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}</span>
                  <span className="text-[10px] opacity-75">({pct.toFixed(0)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-[0_4px_20px_rgba(23,17,54,0.02)] space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <IconSearch className="w-4 h-4 text-[#736E9B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or note..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F6F1FF] border border-transparent focus:border-[#6B3BF7] focus:bg-white text-xs font-semibold text-[#171136] outline-none transition-all"
            />
          </form>

          {/* Category Dropdown Filter */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <IconFilter className="w-3.5 h-3.5 text-[#736E9B]" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-full bg-[#F6F1FF] border border-transparent focus:border-[#6B3BF7] text-xs font-bold text-[#171136] outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#736E9B]">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F6F1FF] text-xs font-semibold text-[#171136] outline-none border border-transparent focus:border-[#6B3BF7]"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F6F1FF] text-xs font-semibold text-[#171136] outline-none border border-transparent focus:border-[#6B3BF7]"
              />
              {(startDate || endDate || categoryFilter !== "all" || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("all");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="text-xs text-[#FF4D6D] hover:underline font-bold ml-1 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-[24px] border border-[#EAE3F7] shadow-[0_4px_25px_rgba(23,17,54,0.03)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EAE3F7] flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
            Expense Records ({expenses.length})
          </h2>
          <span className="text-xs text-[#736E9B]">
            Showing most recent first
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#736E9B]">Loading expenses data...</p>
          </div>
        ) : expenses.length === 0 ? (
          <div className="py-20 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFEAF0] text-[#FF4D6D] mx-auto flex items-center justify-center mb-3">
              <IconWallet className="w-7 h-7" />
            </div>
            <h3 className="font-extrabold text-base text-[#171136]">No Expenses Found</h3>
            <p className="text-xs text-[#736E9B] mt-1 max-w-sm mx-auto">
              {search || categoryFilter !== "all"
                ? "No expense records match your current filters. Try resetting the search or category."
                : "No operating expenses have been logged yet. Click the Add Expense button to record your first expense."}
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#171136] hover:bg-[#2A2159] text-white text-xs font-bold transition-all cursor-pointer"
            >
              + Add First Expense
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF8FE] border-b border-[#EAE3F7] text-[11px] font-extrabold text-[#736E9B] uppercase tracking-wider">
                  <th className="py-3.5 px-6">Date</th>
                  <th className="py-3.5 px-6">Expense Title / Category</th>
                  <th className="py-3.5 px-6">Description / Note</th>
                  <th className="py-3.5 px-6">Amount</th>
                  <th className="py-3.5 px-6">Logged By</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3F7] text-xs">
                {expenses.map((item) => {
                  const meta = CATEGORY_META[item.expense_title] || CATEGORY_META.OTHER_EXPENSE;
                  return (
                    <tr key={item.id} className="hover:bg-[#FAF8FE] transition-colors">
                      {/* Date */}
                      <td className="py-4 px-6 font-semibold text-[#171136] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#6B3BF7]" />
                          <span>{formatDateLabel(item.date)}</span>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-extrabold border ${meta.bg} ${meta.text} ${meta.border}`}
                        >
                          {item.expense_title_display || meta.label}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 max-w-xs text-[#3B3468]">
                        <p className="line-clamp-2">{item.description || "—"}</p>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-6 font-mono font-extrabold text-sm sm:text-base text-[#171136] whitespace-nowrap">
                        ৳{Number(item.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Logged By */}
                      <td className="py-4 px-6 text-[#736E9B] whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F6F1FF] text-[11px] font-bold text-[#3B3468]">
                          {item.created_by_name || "Admin"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit Expense"
                            className="p-2 rounded-xl text-[#6B3BF7] hover:bg-[#EFE9FF] transition-all cursor-pointer"
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            title="Delete Expense"
                            className="p-2 rounded-xl text-[#FF4D6D] hover:bg-[#FFEAF0] transition-all cursor-pointer"
                          >
                            <IconTrash className="w-4 h-4" />
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

      {/* Add / Edit Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[28px] shadow-2xl border border-[#EAE3F7] p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3F7]">
              <div>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136]">
                  {editingExpense ? "Edit Expense" : "Record New Expense"}
                </h3>
                <p className="text-xs text-[#736E9B] mt-0.5">
                  Enter expense category, amount, and details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] hover:bg-[#EAE3F7] flex items-center justify-center text-[#736E9B] hover:text-[#171136] transition-colors cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-2xl bg-[#FFEAF0] text-[#FF4D6D] text-xs font-semibold border border-[#FF4D6D]/20">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveExpense} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-extrabold text-[#171136] mb-1.5">
                  Expense Category <span className="text-[#FF4D6D]">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F6F1FF] border border-transparent focus:border-[#6B3BF7] focus:bg-white text-xs font-bold text-[#171136] outline-none cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount & Date in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-extrabold text-[#171136] mb-1.5">
                    Amount (৳) <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#736E9B]">
                      ৳
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={formAmount}
                      onChange={(e) => setFormAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#F6F1FF] border border-transparent focus:border-[#6B3BF7] focus:bg-white text-xs font-bold font-mono text-[#171136] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-[#171136] mb-1.5">
                    Date <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-3 rounded-2xl bg-[#F6F1FF] border border-transparent focus:border-[#6B3BF7] focus:bg-white text-xs font-bold text-[#171136] outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-[#171136] mb-1.5">
                  Description / Note (Optional)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="e.g. Facebook boost campaign for Naruto figures, bubble wrap rolls..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F6F1FF] border border-transparent focus:border-[#6B3BF7] focus:bg-white text-xs text-[#171136] outline-none resize-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EAE3F7]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#EAE3F7] text-xs font-bold text-[#736E9B] hover:bg-[#F6F1FF] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF4D6D] to-[#FF7A93] hover:from-[#e83e5f] hover:to-[#ff6884] text-white text-xs font-bold shadow-md shadow-[#FF4D6D]/20 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingExpense ? "Update Expense" : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl border border-[#EAE3F7] p-6 space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEAF0] text-[#FF4D6D] mx-auto flex items-center justify-center">
              <IconTrash className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                Delete Expense?
              </h3>
              <p className="text-xs text-[#736E9B] mt-1">
                Are you sure you want to delete this{" "}
                <span className="font-bold text-[#171136]">
                  ৳{Number(deleteTarget.amount).toLocaleString()}
                </span>{" "}
                expense record? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-full border border-[#EAE3F7] text-xs font-bold text-[#736E9B] hover:bg-[#F6F1FF] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleDeleteExpense}
                className="px-5 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#e83e5f] text-white text-xs font-bold shadow-md shadow-[#FF4D6D]/20 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
