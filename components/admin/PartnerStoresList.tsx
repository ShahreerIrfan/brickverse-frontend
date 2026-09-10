"use client";

import React, { useState, useMemo } from "react";
import {
  IconSearch,
  IconPlus,
  IconRefresh,
  IconPartnerStore,
  IconBox,
  IconDollar,
  IconExternalLink,
  IconCheck,
} from "../icons";

export interface PartnerStoreItem {
  id: number | string;
  name: string;
  owner_name?: string;
  phone?: string;
  area?: string;
  is_active?: boolean;
  productsCount?: number;
  valueGiven?: number | string;
  valueRemaining?: number | string;
  amountDue?: number | string;
  settlementStatus?: "up_to_date" | "due_this_month" | "overdue" | string;
  lastSettlementDate?: string | null;
  created_at?: string;
}

interface PartnerStoresListProps {
  stores: PartnerStoreItem[];
  loading?: boolean;
  onRefresh?: () => void;
  onOpenStore: (id: string | number) => void;
  onCreateStore: () => void;
}

export default function PartnerStoresList({
  stores,
  loading = false,
  onRefresh,
  onOpenStore,
  onCreateStore,
}: PartnerStoresListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Format currency in standard BDT
  const formatMoney = (val?: number | string) => {
    const num = Number(val || 0);
    return `৳${num.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  // Compute live KPIs
  const totalStores = stores.length;
  const totalValueGiven = useMemo(
    () => stores.reduce((acc, s) => acc + Number(s.valueGiven || 0), 0),
    [stores]
  );
  const totalValueRemaining = useMemo(
    () => stores.reduce((acc, s) => acc + Number(s.valueRemaining || 0), 0),
    [stores]
  );
  const totalAmountDue = useMemo(
    () => stores.reduce((acc, s) => acc + Number(s.amountDue || 0), 0),
    [stores]
  );

  // Status counts for filter tabs
  const countUpToDate = stores.filter((s) => s.settlementStatus === "up_to_date").length;
  const countDueThisMonth = stores.filter((s) => s.settlementStatus === "due_this_month").length;
  const countOverdue = stores.filter((s) => s.settlementStatus === "overdue").length;

  // Filtered store list
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchStatus =
        statusFilter === "all" || store.settlementStatus === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        store.name?.toLowerCase().includes(q) ||
        store.owner_name?.toLowerCase().includes(q) ||
        store.area?.toLowerCase().includes(q) ||
        store.phone?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [stores, statusFilter, searchQuery]);

  const getStoreAvatarBg = (name: string) => {
    const charCode = (name || "S").charCodeAt(0) || 0;
    const colors = [
      "bg-[#FFEAF0] text-[#FF4D6D] border-[#FFD0DC]",
      "bg-[#EFE9FF] text-[#7B5CFF] border-[#DED4FB]",
      "bg-[#E4F7F8] text-[#00A8A8] border-[#BCEBEC]",
      "bg-[#FFF4DA] text-[#E09000] border-[#FFE6A8]",
      "bg-[#E7F8F0] text-[#1E9E64] border-[#C3EFD9]",
    ];
    return colors[charCode % colors.length];
  };

  const renderStatusPill = (status?: string) => {
    switch (status) {
      case "up_to_date":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#E7F8F0] text-[#1E9E64] border border-[#C3EFD9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E64]" />
            Up to date
          </span>
        );
      case "due_this_month":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#FFF4DA] text-[#C08A00] border border-[#FFE6A8]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C08A00]" />
            Due this month
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#FFE6EA] text-[#D2455C] border border-[#FFCCD4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D2455C]" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F0EBFA] text-[#736E9B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#736E9B]" />
            {status || "Active"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[28px] text-[#171136] tracking-tight">
            Partner Stores
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B] mt-0.5">
            Manage consignment inventory, track sales at partner locations, and reconcile monthly settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              title="Refresh Stores"
              className="p-2.5 rounded-xl border border-[#EAE3F7] bg-white text-[#736E9B] hover:text-[#171136] hover:bg-[#FAF7FF] transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-50"
            >
              <IconRefresh className={`w-4 h-4 ${loading ? "animate-spin text-[#FF4D6D]" : ""}`} />
            </button>
          )}

          <button
            onClick={onCreateStore}
            className="flex items-center gap-2 bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(255,77,109,0.3)] hover:shadow-[0_6px_20px_rgba(255,77,109,0.4)] active:scale-95 transition-all cursor-pointer"
          >
            <IconPlus className="w-4 h-4 text-white" />
            <span>Create store</span>
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Stores */}
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-[0_4px_25px_rgba(23,17,54,0.04)] hover:shadow-[0_8px_30px_rgba(23,17,54,0.08)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#736E9B]">Total partner stores</span>
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9FF] flex items-center justify-center text-[#7B5CFF]">
              <IconPartnerStore className="w-5 h-5" />
            </div>
          </div>
          <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] text-[#171136]">
            {totalStores}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">Active consignment partners</p>
        </div>

        {/* Card 2: Value Given All-Time */}
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-[0_4px_25px_rgba(23,17,54,0.04)] hover:shadow-[0_8px_30px_rgba(23,17,54,0.08)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#736E9B]">Value given all-time</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFEAF0] flex items-center justify-center text-[#FF4D6D]">
              <IconBox className="w-5 h-5" />
            </div>
          </div>
          <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] text-[#171136]">
            {formatMoney(totalValueGiven)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">Cumulative inventory transferred (at TP)</p>
        </div>

        {/* Card 3: Value With Stores (Remaining) */}
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-[0_4px_25px_rgba(23,17,54,0.04)] hover:shadow-[0_8px_30px_rgba(23,17,54,0.08)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#736E9B]">Value with stores</span>
            <div className="w-10 h-10 rounded-2xl bg-[#E4F7F8] flex items-center justify-center text-[#00A8A8]">
              <IconDollar className="w-5 h-5" />
            </div>
          </div>
          <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] text-[#171136]">
            {formatMoney(totalValueRemaining)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">Unsold stock currently on display</p>
        </div>

        {/* Card 4: Amount Due */}
        <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-[0_4px_25px_rgba(23,17,54,0.04)] hover:shadow-[0_8px_30px_rgba(23,17,54,0.08)] transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#736E9B]">Amount due</span>
            <div className="w-10 h-10 rounded-2xl bg-[#FFE6EA] flex items-center justify-center text-[#D2455C]">
              <span className="font-extrabold text-base">৳</span>
            </div>
          </div>
          <div
            className={`font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[26px] ${
              totalAmountDue > 0 ? "text-[#D2455C]" : "text-[#1E9E64]"
            }`}
          >
            {formatMoney(totalAmountDue)}
          </div>
          <p className="text-[11px] text-[#736E9B] mt-1 font-medium">Pending settlement from sales</p>
        </div>
      </div>

      {/* Main Table Card with Search & Status Tabs */}
      <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 sm:p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] space-y-5">
        {/* Filter bar: Search input + Status Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-[#FAF7FF] border border-[#EAE3F7] rounded-2xl shrink-0">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "all"
                  ? "bg-white text-[#171136] shadow-xs"
                  : "text-[#736E9B] hover:text-[#171136]"
              }`}
            >
              <span>All stores</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#EFE9FF] text-[#7B5CFF]">
                {totalStores}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("up_to_date")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "up_to_date"
                  ? "bg-white text-[#1E9E64] shadow-xs"
                  : "text-[#736E9B] hover:text-[#1E9E64]"
              }`}
            >
              <span>Up to date</span>
              {countUpToDate > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#E7F8F0] text-[#1E9E64]">
                  {countUpToDate}
                </span>
              )}
            </button>

            <button
              onClick={() => setStatusFilter("due_this_month")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "due_this_month"
                  ? "bg-white text-[#C08A00] shadow-xs"
                  : "text-[#736E9B] hover:text-[#C08A00]"
              }`}
            >
              <span>Due this month</span>
              {countDueThisMonth > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FFF4DA] text-[#C08A00]">
                  {countDueThisMonth}
                </span>
              )}
            </button>

            <button
              onClick={() => setStatusFilter("overdue")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === "overdue"
                  ? "bg-white text-[#D2455C] shadow-xs"
                  : "text-[#736E9B] hover:text-[#D2455C]"
              }`}
            >
              <span>Overdue</span>
              {countOverdue > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#FFE6EA] text-[#D2455C]">
                  {countOverdue}
                </span>
              )}
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full lg:w-72">
            <IconSearch className="w-4 h-4 text-[#736E9B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store, owner, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-[13px] bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl outline-none focus:border-[#FF4D6D] transition-colors"
            />
          </div>
        </div>

        {/* Stores Table */}
        {filteredStores.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7FF] flex items-center justify-center text-[#736E9B] mb-3">
              <IconPartnerStore className="w-7 h-7" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
              No partner stores found
            </h3>
            <p className="text-xs text-[#736E9B] mt-1 max-w-sm">
              {searchQuery || statusFilter !== "all"
                ? "No stores matched your current search or status filter criteria."
                : "You haven't added any partner stores yet. Start consignment tracking by creating your first store."}
            </p>
            <button
              onClick={onCreateStore}
              className="mt-4 inline-flex items-center gap-2 bg-[#FF4D6D] text-white text-xs font-bold px-4 py-2 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Create partner store</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="border-b border-[#F0EBF9] text-[11px] font-extrabold uppercase tracking-wider text-[#736E9B]">
                  <th className="py-3 px-3">STORE</th>
                  <th className="py-3 px-3">PRODUCTS</th>
                  <th className="py-3 px-3">VALUE GIVEN</th>
                  <th className="py-3 px-3">VALUE REMAINING</th>
                  <th className="py-3 px-3">AMOUNT DUE</th>
                  <th className="py-3 px-3">STATUS</th>
                  <th className="py-3 px-3">LAST SETTLEMENT</th>
                  <th className="py-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBF9] text-[12.5px]">
                {filteredStores.map((store) => {
                  const due = Number(store.amountDue || 0);
                  const initial = (store.name || "S").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={store.id}
                      onClick={() => onOpenStore(store.id)}
                      className="hover:bg-[#FAF7FF] transition-colors cursor-pointer group"
                    >
                      {/* Store info */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl border flex items-center justify-center font-[family-name:var(--font-display)] font-extrabold text-sm shrink-0 ${getStoreAvatarBg(
                              store.name
                            )}`}
                          >
                            {initial}
                          </div>
                          <div>
                            <span className="font-[family-name:var(--font-display)] font-extrabold text-[13.5px] text-[#171136] group-hover:text-[#FF4D6D] transition-colors block">
                              {store.name}
                            </span>
                            <span className="text-[11px] text-[#736E9B]">
                              {[store.owner_name, store.area].filter(Boolean).join(" · ") || store.phone || "Partner store"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Products count */}
                      <td className="py-3.5 px-3 font-semibold text-[#171136]">
                        {store.productsCount ?? 0} items
                      </td>

                      {/* Value Given */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#171136]">
                        {formatMoney(store.valueGiven)}
                      </td>

                      {/* Value Remaining */}
                      <td className="py-3.5 px-3 font-mono font-bold text-[#171136]">
                        {formatMoney(store.valueRemaining)}
                      </td>

                      {/* Amount Due */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`font-mono font-extrabold ${
                            due > 0 ? "text-[#D2455C]" : "text-[#1E9E64]"
                          }`}
                        >
                          {formatMoney(due)}
                        </span>
                      </td>

                      {/* Status Pill */}
                      <td className="py-3.5 px-3">{renderStatusPill(store.settlementStatus)}</td>

                      {/* Last Settlement Date */}
                      <td className="py-3.5 px-3 text-xs text-[#736E9B] font-medium">
                        {store.lastSettlementDate
                          ? new Date(store.lastSettlementDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Never"}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenStore(store.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#F6F1FF] hover:bg-[#FF4D6D] text-[#7B5CFF] hover:text-white font-bold text-xs transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-2xs"
                        >
                          <span>Manage</span>
                          <IconExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
