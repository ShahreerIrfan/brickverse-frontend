"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  getSystemLogs,
  clearSystemLogs,
  generateTestLog,
  getLogRetention,
  updateLogRetention,
  pruneLogs,
  SystemLogItem,
  SystemLogsResponse,
} from "@/lib/api";
import {
  IconTerminal,
  IconRefresh,
  IconTrash,
  IconSearch,
  IconCheck,
  IconClose,
  IconCopy,
  IconArrowLeft,
  IconActivity,
  IconDownload,
  IconFilter,
} from "../icons";

interface AdminLogsViewProps {
  onBackToDashboard?: () => void;
}

export default function AdminLogsView({ onBackToDashboard }: AdminLogsViewProps) {
  const [data, setData] = useState<SystemLogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLogItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Retention Policy State
  const [retentionDays, setRetentionDays] = useState<number>(1);
  const [isAutoDeleteEnabled, setIsAutoDeleteEnabled] = useState<boolean>(true);
  const [isRetentionModalOpen, setIsRetentionModalOpen] = useState<boolean>(false);
  const [selectedRetentionPreset, setSelectedRetentionPreset] = useState<string>("1");
  const [customDaysInput, setCustomDaysInput] = useState<string>("1");
  const [isSavingRetention, setIsSavingRetention] = useState<boolean>(false);
  const [isPruningNow, setIsPruningNow] = useState<boolean>(false);

  // Filters
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live Auto Refresh (Off, 2s, 3s, 5s, 10s)
  const [autoRefreshSecs, setAutoRefreshSecs] = useState<number>(3);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"table" | "terminal">("table");
  const [secondsUntilNext, setSecondsUntilNext] = useState<number>(3);

  const filtersRef = useRef({
    levelFilter,
    statusFilter,
    methodFilter,
    searchQuery,
  });

  useEffect(() => {
    filtersRef.current = {
      levelFilter,
      statusFilter,
      methodFilter,
      searchQuery,
    };
  }, [levelFilter, statusFilter, methodFilter, searchQuery]);

  // Fetch Logs
  const fetchLogs = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const current = filtersRef.current;
      const res = await getSystemLogs({
        level: current.levelFilter,
        status_code: current.statusFilter,
        method: current.methodFilter,
        search: current.searchQuery,
        limit: 150,
      });
      setData(res);
      setLastUpdated(new Date());
      setSecondsUntilNext(autoRefreshSecs);
    } catch (err) {
      console.error("Failed to fetch system logs:", err);
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  // Immediate fetch on filter change
  useEffect(() => {
    fetchLogs(false);
  }, [levelFilter, statusFilter, methodFilter, searchQuery]);

  // 1-second interval ticker for smooth countdown and reliable auto-refresh
  useEffect(() => {
    if (autoRefreshSecs <= 0) return;

    setSecondsUntilNext(autoRefreshSecs);
    const ticker = setInterval(() => {
      setSecondsUntilNext((prev) => {
        if (prev <= 1) {
          fetchLogs(false);
          return autoRefreshSecs;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(ticker);
  }, [autoRefreshSecs]);

  // Window Focus & Tab Visibility Auto-Sync (Instantly syncs when tab is opened)
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchLogs(false);
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);
    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, []);

  // Initial Retention Policy Loader
  useEffect(() => {
    const loadRetention = async () => {
      try {
        const res = await getLogRetention();
        setRetentionDays(res.retention_days);
        setIsAutoDeleteEnabled(res.is_auto_delete_enabled);
        if ([1, 2, 3, 7, 14, 30].includes(res.retention_days)) {
          setSelectedRetentionPreset(String(res.retention_days));
        } else if (res.retention_days === 0 || !res.is_auto_delete_enabled) {
          setSelectedRetentionPreset("0");
        } else {
          setSelectedRetentionPreset("custom");
          setCustomDaysInput(String(res.retention_days));
        }
      } catch (e) {
        console.warn("Could not load retention settings", e);
      }
    };
    loadRetention();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveRetention = async () => {
    setIsSavingRetention(true);
    let daysToSet = 1;
    let autoDelete = true;

    if (selectedRetentionPreset === "0") {
      daysToSet = 0;
      autoDelete = false;
    } else if (selectedRetentionPreset === "custom") {
      const parsed = parseInt(customDaysInput, 10);
      daysToSet = isNaN(parsed) || parsed < 1 ? 1 : parsed;
      autoDelete = true;
    } else {
      daysToSet = parseInt(selectedRetentionPreset, 10) || 1;
      autoDelete = true;
    }

    const res = await updateLogRetention(daysToSet, autoDelete);
    setIsSavingRetention(false);

    if (res.success) {
      setRetentionDays(daysToSet);
      setIsAutoDeleteEnabled(autoDelete);
      setIsRetentionModalOpen(false);
      showToast(
        autoDelete
          ? `✓ Auto-delete updated: Logs older than ${daysToSet} day(s) will be deleted.`
          : `✓ Auto-delete disabled: Logs will be kept indefinitely.`
      );
      fetchLogs(true);
    } else {
      alert("Failed to update retention policy. Please try again.");
    }
  };

  const handlePruneNow = async () => {
    setIsPruningNow(true);
    let targetDays = retentionDays;
    if (selectedRetentionPreset === "custom") {
      targetDays = parseInt(customDaysInput, 10) || 1;
    } else if (selectedRetentionPreset !== "0") {
      targetDays = parseInt(selectedRetentionPreset, 10) || retentionDays;
    }

    const res = await pruneLogs(targetDays);
    setIsPruningNow(false);

    if (res.success) {
      showToast(`✓ Pruned ${res.deleted_count} log(s) older than ${targetDays} day(s).`);
      fetchLogs(true);
    } else {
      alert("Failed to prune logs.");
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm("Are you sure you want to clear all server and request logs?")) return;
    const res = await clearSystemLogs();
    if (res.success) {
      showToast("✓ All logs have been cleared.");
      fetchLogs(true);
    } else {
      alert("Failed to clear logs.");
    }
  };

  const handleCreateTestLog = async (level: "INFO" | "WARNING" | "ERROR") => {
    const res = await generateTestLog(level);
    if (res.success) {
      showToast(`✓ Generated test ${level} log.`);
      fetchLogs(true);
    }
  };

  const handleCopyText = (text: string, id: string | number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleExportLogs = () => {
    if (!data?.logs?.length) return;
    const jsonStr = JSON.stringify(data.logs, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brickverse-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("✓ Logs exported as JSON.");
  };

  const logsList = data?.logs || [];
  const metrics = data?.metrics || {
    total_logs: 0,
    error_count: 0,
    warning_count: 0,
    request_count: 0,
    avg_duration_ms: 0,
    uptime_seconds: 0,
    server_status: "Operational",
    python_version: "3.13",
    django_version: "5.1",
  };

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const formatLogTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return dateStr;
    }
  };

  const getLevelBadgeClass = (level: string, status?: number) => {
    if (level === "ERROR" || level === "CRITICAL" || (status && status >= 500)) {
      return "bg-[#FFEAF0] text-[#FF4D6D] border-[#FF4D6D]/30";
    }
    if (level === "WARNING" || (status && status >= 400)) {
      return "bg-[#FFF4DA] text-[#D97706] border-[#D97706]/30";
    }
    if (level === "REQUEST") {
      return "bg-[#EFE9FF] text-[#7B5CFF] border-[#7B5CFF]/30";
    }
    return "bg-[#EFFBF6] text-[#2ECC8F] border-[#2ECC8F]/30";
  };

  const getMethodBadgeClass = (method?: string) => {
    switch (method?.toUpperCase()) {
      case "GET":
        return "bg-blue-50 text-blue-600 border-blue-200";
      case "POST":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "PUT":
      case "PATCH":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "DELETE":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#171136] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <span className="text-[#2ECC8F]">●</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE3F7] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#171136] text-white flex items-center justify-center shadow-md">
            <IconTerminal className="w-6 h-6 text-[#2ECC8F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136] tracking-tight">
                Server & Request Logs
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFFBF6] text-[#2ECC8F] text-[11px] font-extrabold border border-[#2ECC8F]/20">
                <span className="w-2 h-2 rounded-full bg-[#2ECC8F] animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-[#736E9B] mt-0.5">
              Real-time monitoring of production HTTP traffic, exceptions, and system events
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Auto-Delete Retention Setting Button */}
          <button
            onClick={() => setIsRetentionModalOpen(true)}
            title="Configure Auto-Delete Retention Period"
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EAE3F7] hover:border-[#FF4D6D] text-[#171136] text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#FFF5F7] transition-all cursor-pointer"
          >
            <span className="text-[#FF4D6D]">🕒</span>
            <span>
              Auto-delete:{" "}
              <strong className="text-[#FF4D6D]">
                {isAutoDeleteEnabled ? `${retentionDays} ${retentionDays === 1 ? "Day" : "Days"}` : "Disabled"}
              </strong>
            </span>
          </button>

          {/* Auto-refresh Selector */}
          <div className="flex items-center gap-1.5 bg-[#F6F1FF] px-3 py-1.5 rounded-xl border border-[#EAE3F7] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#2ECC8F] animate-pulse" />
            <span className="text-[#736E9B] font-semibold">Live stream:</span>
            <select
              value={autoRefreshSecs}
              onChange={(e) => setAutoRefreshSecs(Number(e.target.value))}
              aria-label="Auto-refresh interval"
              className="bg-transparent font-bold text-[#171136] outline-none cursor-pointer"
            >
              <option value={0}>Paused</option>
              <option value={2}>2s</option>
              <option value={3}>3s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
            </select>
            {autoRefreshSecs > 0 && (
              <span className="text-[10px] font-mono text-[#7B5CFF] font-bold">
                ({secondsUntilNext}s)
              </span>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchLogs(true)}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#EAE3F7] hover:border-[#7B5CFF] text-[#171136] text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-[#F6F1FF] transition-all cursor-pointer"
          >
            <IconRefresh className={`w-3.5 h-3.5 text-[#736E9B] ${refreshing ? "animate-spin text-[#7B5CFF]" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Refresh"}</span>
          </button>

          {/* Mode Switch */}
          <div className="flex rounded-xl bg-[#F6F1FF] p-0.5 border border-[#EAE3F7]">
            <button
              onClick={() => setViewMode("table")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table" ? "bg-white text-[#171136] shadow-xs" : "text-[#736E9B] hover:text-[#171136]"
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode("terminal")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "terminal" ? "bg-[#171136] text-[#2ECC8F] shadow-xs" : "text-[#736E9B] hover:text-[#171136]"
              }`}
            >
              Console
            </button>
          </div>

          {/* Test Log Buttons Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCreateTestLog("ERROR")}
              title="Test Error Exception"
              className="px-2.5 py-2 rounded-xl bg-[#FFEAF0] hover:bg-[#FFD6E2] text-[#FF4D6D] text-[11.5px] font-bold transition-all cursor-pointer"
            >
              + Error
            </button>
            <button
              onClick={() => handleCreateTestLog("INFO")}
              title="Test Info Log"
              className="px-2.5 py-2 rounded-xl bg-[#EFFBF6] hover:bg-[#DDF7EB] text-[#2ECC8F] text-[11.5px] font-bold transition-all cursor-pointer"
            >
              + Info
            </button>
          </div>

          {/* Export & Clear */}
          <button
            onClick={handleExportLogs}
            title="Export as JSON"
            className="p-2 rounded-xl bg-white border border-[#EAE3F7] text-[#736E9B] hover:text-[#171136] hover:bg-[#F6F1FF] transition-all cursor-pointer"
          >
            <IconDownload className="w-4 h-4" />
          </button>
          <button
            onClick={handleClearLogs}
            title="Clear all logs"
            className="p-2 rounded-xl bg-white border border-[#EAE3F7] text-[#FF4D6D] hover:bg-[#FFEAF0] transition-all cursor-pointer"
          >
            <IconTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Logs */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3F7] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736E9B]">Captured Events</span>
            <span className="w-2 h-2 rounded-full bg-[#7B5CFF]" />
          </div>
          <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136] mt-1.5 font-mono">
            {metrics.total_logs}
          </p>
          <span className="text-[10.5px] text-[#736E9B] mt-0.5 block">Stored in buffer & DB</span>
        </div>

        {/* 5xx Server Errors */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3F7] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF4D6D]">Errors (5xx)</span>
            <span className="w-2 h-2 rounded-full bg-[#FF4D6D]" />
          </div>
          <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#FF4D6D] mt-1.5 font-mono">
            {metrics.error_count}
          </p>
          <span className="text-[10.5px] text-[#736E9B] mt-0.5 block">
            {metrics.error_count === 0 ? "Zero critical errors" : "Requires inspection"}
          </span>
        </div>

        {/* 4xx Client Warnings */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3F7] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">Warnings (4xx)</span>
            <span className="w-2 h-2 rounded-full bg-[#D97706]" />
          </div>
          <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#D97706] mt-1.5 font-mono">
            {metrics.warning_count}
          </p>
          <span className="text-[10.5px] text-[#736E9B] mt-0.5 block">404s & Bad Requests</span>
        </div>

        {/* Average Latency */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3F7] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736E9B]">Avg Response</span>
            <IconActivity className="w-3.5 h-3.5 text-[#2ECC8F]" />
          </div>
          <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136] mt-1.5 font-mono">
            {metrics.avg_duration_ms} <span className="text-xs text-[#736E9B] font-normal">ms</span>
          </p>
          <span className="text-[10.5px] text-[#2ECC8F] font-bold mt-0.5 block">Fast REST API</span>
        </div>

        {/* System Status & Uptime */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAE3F7] shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#736E9B]">Status & Uptime</span>
            <span className={`w-2 h-2 rounded-full ${metrics.server_status === "Operational" ? "bg-[#2ECC8F]" : "bg-amber-500"}`} />
          </div>
          <p className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136] mt-1.5 truncate">
            {metrics.server_status}
          </p>
          <span className="text-[10.5px] text-[#736E9B] mt-0.5 block font-mono">
            Uptime: {formatUptime(metrics.uptime_seconds)}
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#EAE3F7] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <IconSearch className="w-4 h-4 text-[#736E9B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search paths, error messages, tracebacks, IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F6F1FF] border border-[#EAE3F7] rounded-xl pl-9 pr-8 py-2 text-xs font-semibold text-[#171136] outline-none focus:border-[#7B5CFF]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <IconClose className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Pills / Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-[#F6F1FF] p-1 rounded-xl border border-[#EAE3F7]">
            {["all", "ERROR", "WARNING", "REQUEST"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  levelFilter === lvl ? "bg-[#171136] text-white shadow-2xs" : "text-[#736E9B] hover:text-[#171136]"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter logs by status code"
            className="bg-[#F6F1FF] border border-[#EAE3F7] rounded-xl px-2.5 py-1.5 font-bold text-[#171136] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="2xx">2xx (Success)</option>
            <option value="4xx">4xx (Client Error)</option>
            <option value="5xx">5xx (Server Error)</option>
            <option value="200">200 OK</option>
            <option value="404">404 Not Found</option>
            <option value="500">500 Server Error</option>
          </select>

          {/* Method Filter */}
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            aria-label="Filter logs by HTTP method"
            className="bg-[#F6F1FF] border border-[#EAE3F7] rounded-xl px-2.5 py-1.5 font-bold text-[#171136] outline-none cursor-pointer"
          >
            <option value="all">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>

      {/* Main Logs View: Table vs Console */}
      {viewMode === "terminal" ? (
        /* Dark Terminal Console View */
        <div className="bg-[#0D0B1A] border border-[#2A2159] rounded-3xl p-5 shadow-2xl font-mono text-xs overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-[#2A2159] mb-3 text-[#A79FD1]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF4D6D]" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
              <span className="w-3 h-3 rounded-full bg-[#2ECC8F]" />
              <span className="ml-2 font-bold text-white text-[11px]">brickverse-backend.log</span>
            </div>
            <span className="text-[10px] text-[#A79FD1]">
              Showing {logsList.length} recent entries · Stream active
            </span>
          </div>

          <div className="max-h-[520px] overflow-y-auto space-y-1 pr-2 scrollbar-thin">
            {logsList.length === 0 ? (
              <div className="py-12 text-center text-[#736E9B]">
                &gt; No logs recorded matching criteria. Waiting for incoming requests...
              </div>
            ) : (
              logsList.map((log) => {
                const isErr = log.level === "ERROR" || (log.status_code && log.status_code >= 500);
                const isWarn = log.level === "WARNING" || (log.status_code && log.status_code >= 400);

                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`py-1 px-2 rounded hover:bg-[#1C163A] cursor-pointer flex items-start gap-3 transition-colors ${
                      isErr ? "text-[#FF6B8B]" : isWarn ? "text-[#FBBF24]" : "text-[#D1C9F3]"
                    }`}
                  >
                    <span className="text-[#6D659E] shrink-0">{formatLogTime(log.created_at)}</span>
                    <span
                      className={`font-bold shrink-0 px-1 rounded text-[10.5px] ${
                        isErr
                          ? "bg-[#FF4D6D]/20 text-[#FF4D6D]"
                          : isWarn
                          ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                          : "bg-[#2ECC8F]/20 text-[#2ECC8F]"
                      }`}
                    >
                      {log.level}
                    </span>
                    {log.method && <span className="text-[#93C5FD] font-bold shrink-0">{log.method}</span>}
                    {log.path && <span className="text-white shrink-0 font-semibold">{log.path}</span>}
                    {log.status_code && (
                      <span className={`shrink-0 font-bold ${log.status_code >= 400 ? "text-rose-400" : "text-emerald-400"}`}>
                        [{log.status_code}]
                      </span>
                    )}
                    {log.duration_ms !== undefined && log.duration_ms > 0 && (
                      <span className="text-[#8B84B5] shrink-0">{log.duration_ms}ms</span>
                    )}
                    <span className="truncate flex-1 text-slate-300">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Formatted Table View */
        <div className="bg-white rounded-3xl border border-[#EAE3F7] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7FD] border-b border-[#EAE3F7] text-[11px] font-bold text-[#736E9B] uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Timestamp</th>
                  <th className="py-3.5 px-3">Level</th>
                  <th className="py-3.5 px-3">Method & Path</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-3">Duration</th>
                  <th className="py-3.5 px-3">Client IP</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3F7] text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#736E9B]">
                      <div className="w-8 h-8 border-3 border-[#7B5CFF] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Loading system logs...
                    </td>
                  </tr>
                ) : logsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#736E9B]">
                      No logs found matching your filters.
                    </td>
                  </tr>
                ) : (
                  logsList.map((log) => {
                    const isErr = log.level === "ERROR" || (log.status_code && log.status_code >= 500);
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className={`hover:bg-[#FAF7FD] transition-colors cursor-pointer group ${
                          isErr ? "bg-[#FFF9FA]" : ""
                        }`}
                      >
                        <td className="py-3 px-4 sm:px-6 whitespace-nowrap text-[#736E9B] font-mono">
                          {formatLogTime(log.created_at)}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold border uppercase ${getLevelBadgeClass(
                              log.level,
                              log.status_code
                            )}`}
                          >
                            {log.level}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 max-w-md min-w-0">
                            {log.method && (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border shrink-0 ${getMethodBadgeClass(
                                  log.method
                                )}`}
                              >
                                {log.method}
                              </span>
                            )}
                            <span className="font-semibold text-[#171136] font-mono truncate">
                              {log.path || log.source}
                            </span>
                          </div>
                          {log.message && (
                            <p className="text-[11px] text-[#736E9B] truncate max-w-sm mt-0.5">
                              {log.message}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap font-mono">
                          {log.status_code ? (
                            <span
                              className={`font-bold ${
                                log.status_code >= 500
                                  ? "text-[#FF4D6D]"
                                  : log.status_code >= 400
                                  ? "text-[#D97706]"
                                  : "text-[#2ECC8F]"
                              }`}
                            >
                              {log.status_code}
                            </span>
                          ) : (
                            <span className="text-[#9C96BE]">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-[#736E9B] font-mono">
                          {log.duration_ms !== undefined && log.duration_ms > 0 ? `${log.duration_ms}ms` : "—"}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap text-[#736E9B] font-mono">
                          {log.ip_address || "—"}
                        </td>
                        <td className="py-3 px-4 sm:px-6 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            className="px-3 py-1 rounded-xl bg-[#F6F1FF] group-hover:bg-[#171136] group-hover:text-white text-[#171136] text-[11px] font-bold transition-all shadow-2xs"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log Detail Modal / Drawer */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#EAE3F7] animate-in zoom-in-95 duration-150 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#EAE3F7] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border uppercase ${getLevelBadgeClass(
                      selectedLog.level,
                      selectedLog.status_code
                    )}`}
                  >
                    {selectedLog.level}
                  </span>
                  {selectedLog.method && (
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${getMethodBadgeClass(selectedLog.method)}`}>
                      {selectedLog.method}
                    </span>
                  )}
                  {selectedLog.status_code && (
                    <span className="font-bold text-sm font-mono text-[#171136]">
                      Status: {selectedLog.status_code}
                    </span>
                  )}
                </div>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] font-mono break-all">
                  {selectedLog.path || selectedLog.message}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-9 h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#171136] transition-colors shrink-0"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* General Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#FAF7FD] p-4 rounded-2xl border border-[#EAE3F7] text-xs">
              <div>
                <span className="text-[#736E9B] block font-medium">Timestamp</span>
                <span className="font-bold text-[#171136] font-mono">{selectedLog.created_at}</span>
              </div>
              <div>
                <span className="text-[#736E9B] block font-medium">Duration</span>
                <span className="font-bold text-[#171136] font-mono">
                  {selectedLog.duration_ms ? `${selectedLog.duration_ms} ms` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[#736E9B] block font-medium">Client IP</span>
                <span className="font-bold text-[#171136] font-mono">{selectedLog.ip_address || "127.0.0.1"}</span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[#736E9B] block font-medium">User Agent</span>
                <span className="font-mono text-[#3B3468] break-all">{selectedLog.user_agent || "N/A"}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#736E9B] block mb-1.5">
                Log Message
              </span>
              <div className="bg-[#FAF7FD] p-3.5 rounded-xl border border-[#EAE3F7] text-xs font-semibold text-[#171136]">
                {selectedLog.message}
              </div>
            </div>

            {/* Traceback / Exception Stack (if exists) */}
            {selectedLog.traceback && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D6D] flex items-center gap-1.5">
                    <span>Traceback / Exception Stack</span>
                  </span>
                  <button
                    onClick={() => handleCopyText(selectedLog.traceback || "", selectedLog.id)}
                    className="text-xs font-bold text-[#7B5CFF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <IconCopy className="w-3.5 h-3.5" />
                    <span>{copiedId === selectedLog.id ? "Copied! ✓" : "Copy Traceback"}</span>
                  </button>
                </div>
                <pre className="bg-[#0D0B1A] text-[#FF6B8B] p-4 rounded-2xl text-[11px] font-mono overflow-x-auto border border-[#FF4D6D]/20 leading-relaxed max-h-64 scrollbar-thin">
                  {selectedLog.traceback}
                </pre>
              </div>
            )}

            {/* Details Payload JSON */}
            {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#736E9B] block mb-1.5">
                  Request Details / Metadata
                </span>
                <pre className="bg-[#FAF7FD] p-3.5 rounded-xl border border-[#EAE3F7] text-[11px] font-mono text-[#3B3468] overflow-x-auto max-h-40">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-full bg-[#171136] text-white text-xs font-bold shadow-md hover:bg-[#2A2159] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Retention Policy Modal */}
      {isRetentionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsRetentionModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#EAE3F7] animate-in zoom-in-95 duration-150 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#EAE3F7] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEAF0] text-[#FF4D6D] flex items-center justify-center font-bold text-lg">
                  🕒
                </div>
                <div>
                  <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                    Auto-Delete Log Retention
                  </h3>
                  <p className="text-xs text-[#736E9B] mt-0.5">
                    Automatically purge older server & request logs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRetentionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#171136] transition-colors"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Retention Preset Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#736E9B] block">
                Select Auto-Delete Timeframe
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { value: "1", label: "1 Day (24h)", badge: "Recommended" },
                  { value: "2", label: "2 Days" },
                  { value: "3", label: "3 Days" },
                  { value: "7", label: "7 Days (1 Wk)" },
                  { value: "14", label: "14 Days" },
                  { value: "30", label: "30 Days (1 Mo)" },
                ].map((preset) => {
                  const isSelected = selectedRetentionPreset === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setSelectedRetentionPreset(preset.value)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#FF4D6D] bg-[#FFF5F7] ring-2 ring-[#FF4D6D]/20 shadow-xs"
                          : "border-[#EAE3F7] bg-[#FAF7FD] hover:border-[#7B5CFF]/50"
                      }`}
                    >
                      <span className={`text-xs font-extrabold ${isSelected ? "text-[#FF4D6D]" : "text-[#171136]"}`}>
                        {preset.label}
                      </span>
                      {preset.badge && (
                        <span className="text-[10px] text-[#FF4D6D] font-bold mt-1">
                          {preset.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Days & Never Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {/* Custom Days Card */}
                <div
                  onClick={() => setSelectedRetentionPreset("custom")}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedRetentionPreset === "custom"
                      ? "border-[#FF4D6D] bg-[#FFF5F7] ring-2 ring-[#FF4D6D]/20 shadow-xs"
                      : "border-[#EAE3F7] bg-[#FAF7FD] hover:border-[#7B5CFF]/50"
                  }`}
                >
                  <span className={`text-xs font-extrabold block mb-2 ${selectedRetentionPreset === "custom" ? "text-[#FF4D6D]" : "text-[#171136]"}`}>
                    Custom Time (Days)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={customDaysInput}
                      onChange={(e) => {
                        setSelectedRetentionPreset("custom");
                        setCustomDaysInput(e.target.value);
                      }}
                      placeholder="e.g. 5"
                      className="w-20 bg-white border border-[#EAE3F7] rounded-xl px-3 py-1.5 text-xs font-bold text-[#171136] outline-none focus:border-[#FF4D6D]"
                    />
                    <span className="text-xs text-[#736E9B] font-semibold">days</span>
                  </div>
                </div>

                {/* Never Delete Card */}
                <button
                  type="button"
                  onClick={() => setSelectedRetentionPreset("0")}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-center transition-all cursor-pointer ${
                    selectedRetentionPreset === "0"
                      ? "border-[#FF4D6D] bg-[#FFF5F7] ring-2 ring-[#FF4D6D]/20 shadow-xs"
                      : "border-[#EAE3F7] bg-[#FAF7FD] hover:border-[#7B5CFF]/50"
                  }`}
                >
                  <span className={`text-xs font-extrabold ${selectedRetentionPreset === "0" ? "text-[#FF4D6D]" : "text-[#171136]"}`}>
                    Never Auto-Delete
                  </span>
                  <span className="text-[10.5px] text-[#736E9B] mt-1">
                    Keep all history until cleared
                  </span>
                </button>
              </div>
            </div>

            {/* Explanatory Box */}
            <div className="bg-[#FAF7FD] p-4 rounded-2xl border border-[#EAE3F7] text-xs text-[#736E9B] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#171136]">
                <span className="text-[#2ECC8F]">✓</span>
                <span>Active Policy Behavior</span>
              </div>
              <p>
                {selectedRetentionPreset === "0"
                  ? "Logs will be retained permanently until manually cleared."
                  : selectedRetentionPreset === "custom"
                  ? `All server & request logs older than ${customDaysInput || 1} day(s) are automatically purged.`
                  : `All server & request logs older than ${selectedRetentionPreset} day(s) are automatically purged.`}
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#EAE3F7]">
              <button
                type="button"
                onClick={handlePruneNow}
                disabled={isPruningNow}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#FAF7FD] hover:bg-[#F0EBF8] text-[#7B5CFF] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isPruningNow ? "Pruning..." : "Prune Old Logs Now"}</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsRetentionModalOpen(false)}
                  className="px-4 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveRetention}
                  disabled={isSavingRetention}
                  className="px-5 py-2.5 rounded-full bg-[#FF4D6D] hover:bg-[#E6004C] text-white text-xs font-bold shadow-md shadow-[#FF4D6D]/20 transition-all cursor-pointer"
                >
                  {isSavingRetention ? "Saving..." : "Save Policy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
