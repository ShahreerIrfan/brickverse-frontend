"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Category, Product } from "./productData";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getAllUsers,
  updateUserRole,
  createUser,
  deleteUser,
} from "@/lib/api";
import {
  IconShield,
  IconStore,
  IconBag,
  IconUser,
  IconTruck,
  IconArrowRight,
  IconCheck,
  IconClose,
  IconSearch,
  IconStar,
  IconLogOut,
  IconDashboard,
  IconBox,
  IconOrders,
  IconUsers,
  IconLayers,
  IconChevronDown,
  IconChevronRight,
  IconPlus,
  IconEdit,
  IconTrash,
  IconRefresh,
  IconTrendingUp,
  IconFolder,
  IconInfo,
  IconDollar,
  IconPhoto,
  IconArrowLeft,
  IconBell,
  IconMail,
  IconMoon,
  IconExternalLink,
} from "./icons";

interface AdminDashboardProps {
  user: User;
  initialNav?: ActiveNav;
}

type ActiveNav = "dashboard" | "products-all" | "products-form" | "products-taxonomy" | "orders-all" | "users-all";

export default function AdminDashboard({ user, initialNav }: AdminDashboardProps) {
  const { logout } = useAuth();

  // Navigation State - initialized from prop or URL
  const [activeNav, setActiveNav] = useState<ActiveNav>(initialNav || "dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [productsMenuOpen, setProductsMenuOpen] = useState(initialNav ? initialNav.startsWith("products") : false);
  const [ordersMenuOpen, setOrdersMenuOpen] = useState(initialNav ? initialNav.startsWith("orders") : false);
  const [usersMenuOpen, setUsersMenuOpen] = useState(initialNav ? initialNav.startsWith("users") : false);

  // Profile Dropdown Popover
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // URL Slug mapping for Admin routing
  const navToUrlMap: Record<ActiveNav, string> = {
    "dashboard": "/en/admin",
    "products-all": "/en/admin/products",
    "products-form": "/en/admin/products/new",
    "products-taxonomy": "/en/admin/products/taxonomy",
    "orders-all": "/en/admin/orders",
    "users-all": "/en/admin/users",
  };

  const navigateTo = (nav: ActiveNav, customUrl?: string) => {
    setActiveNav(nav);
    if (nav.startsWith("products")) setProductsMenuOpen(true);
    if (nav.startsWith("orders")) setOrdersMenuOpen(true);
    if (nav.startsWith("users")) setUsersMenuOpen(true);
    const targetUrl = customUrl || navToUrlMap[nav] || "/en/admin";
    if (typeof window !== "undefined" && window.location.pathname !== targetUrl) {
      window.history.pushState(null, "", targetUrl);
    }
  };

  useEffect(() => {
    if (initialNav) {
      setActiveNav(initialNav);
      if (initialNav.startsWith("products")) setProductsMenuOpen(true);
      if (initialNav.startsWith("orders")) setOrdersMenuOpen(true);
      if (initialNav.startsWith("users")) setUsersMenuOpen(true);
    }
  }, [initialNav]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("/products/new") || path.includes("/products/edit")) {
        setActiveNav("products-form");
        setProductsMenuOpen(true);
      } else if (path.includes("/products/taxonomy")) {
        setActiveNav("products-taxonomy");
        setProductsMenuOpen(true);
      } else if (path.includes("/products")) {
        setActiveNav("products-all");
        setProductsMenuOpen(true);
      } else if (path.includes("/orders")) {
        setActiveNav("orders-all");
        setOrdersMenuOpen(true);
      } else if (path.includes("/users")) {
        setActiveNav("users-all");
        setUsersMenuOpen(true);
      } else if (path.includes("/en/admin") || path.includes("/admin")) {
        setActiveNav("dashboard");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Live Time clock
  const [timeString, setTimeString] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Data States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsData, setStatsData] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Search states
  const [searchGlobal, setSearchGlobal] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Modals & Action Drawers
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formCategory, setFormCategory] = useState<string>("figures");
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false);
  const [selectedParentCatId, setSelectedParentCatId] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Local File Upload States
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState<any[]>([]);

  // Product Form dynamic states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formRegularPrice, setFormRegularPrice] = useState("46.00");
  const [formDiscountedPrice, setFormDiscountedPrice] = useState("34.99");
  const [formTradePrice, setFormTradePrice] = useState("28.00");
  const [formStock, setFormStock] = useState(50);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const generateRandomSku = (baseName?: string) => {
    const prefix = baseName
      ? baseName.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "BV"
      : "BV";
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `BV-${prefix}-${rand}`;
  };

  const calculatedDiscountPercent = useMemo(() => {
    const reg = parseFloat(formRegularPrice.replace(/[^\d.]/g, ""));
    const disc = parseFloat(formDiscountedPrice.replace(/[^\d.]/g, ""));
    if (reg > 0 && disc > 0 && reg > disc) {
      return Math.round(((reg - disc) / reg) * 100);
    }
    return 0;
  }, [formRegularPrice, formDiscountedPrice]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch all live backend data
  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [stats, prods, cats, ords, usrs] = await Promise.all([
        getAdminStats(),
        getAllProducts(),
        getCategories(),
        getAllOrders(),
        getAllUsers(),
      ]);
      if (stats) setStatsData(stats);
      if (prods && Array.isArray(prods)) setProducts(prods);
      if (cats && Array.isArray(cats)) setCategories(cats);
      if (ords && Array.isArray(ords)) setOrders(ords);
      if (usrs && Array.isArray(usrs)) setUsersList(usrs);
    } catch (err) {
      console.error("Failed fetching admin data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute live KPI metrics
  const stats = statsData?.stats || {
    total_revenue: orders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0) || 5120.0,
    total_orders: orders.length || 13,
    total_customers: usersList.filter((u) => u.role === "customer").length || 37,
    total_products: products.length || 12,
    total_categories: categories.length || 11,
    active_vendors: 4,
    avg_rating: 4.8,
    profit_est: 72.0,
    commission_est: 316.0,
  };

  const statusDist = statsData?.status_distribution || {
    delivered: orders.filter((o) => o.status === "delivered").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    processing: orders.filter((o) => o.status === "processing").length,
    pending: orders.filter((o) => o.status === "pending").length,
    total: orders.length,
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        productCategoryFilter === "all" ||
        p.category?.toLowerCase() === productCategoryFilter.toLowerCase() ||
        p.id?.toLowerCase().includes(productCategoryFilter.toLowerCase());
      const matchSearch =
        !searchGlobal ||
        p.name.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        p.category.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        p.id.toLowerCase().includes(searchGlobal.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, productCategoryFilter, searchGlobal]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const matchSearch =
        !searchGlobal ||
        o.order_number?.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        o.customer_name?.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        o.customer_email?.toLowerCase().includes(searchGlobal.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, searchGlobal]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchSearch =
        !searchGlobal ||
        u.email?.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        u.first_name?.toLowerCase().includes(searchGlobal.toLowerCase()) ||
        u.last_name?.toLowerCase().includes(searchGlobal.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [usersList, userRoleFilter, searchGlobal]);

  // -------------------------------------------------------------
  // Product Navigation & Form Handlers
  // -------------------------------------------------------------
  const openNewProductForm = () => {
    setEditingProduct(null);
    setFormCategory(categories[0]?.id || "figures");
    setFormName("");
    setFormSlug("");
    setFormSku(generateRandomSku());
    setFormRegularPrice("46.00");
    setFormDiscountedPrice("34.99");
    setFormTradePrice("28.00");
    setFormStock(50);
    setPrimaryFile(null);
    setPrimaryPreviewUrl(null);
    setGalleryFiles([]);
    setGalleryPreviewUrls([]);
    setExistingGalleryImages([]);
    navigateTo("products-form");
  };

  const openEditProductForm = (prod: Product) => {
    setEditingProduct(prod);
    setFormCategory(prod.category || categories[0]?.id || "figures");
    setFormName(prod.name || "");
    setFormSlug(prod.slug || prod.id || "");
    setFormSku(prod.sku || `BV-${prod.id.toUpperCase().slice(0, 6)}`);
    setFormRegularPrice(prod.regularPrice?.replace("৳", "") || prod.originalPrice?.replace("৳", "") || "46.00");
    setFormDiscountedPrice(prod.discountedPrice?.replace("৳", "") || prod.price?.replace("৳", "") || "34.99");
    setFormTradePrice(prod.tradePrice?.replace("৳", "") || "28.00");
    setFormStock(prod.stock ?? 50);
    setPrimaryFile(null);
    setPrimaryPreviewUrl(prod.image || null);
    setGalleryFiles([]);
    setGalleryPreviewUrls([]);
    setExistingGalleryImages(prod.gallery_images || []);
    navigateTo("products-form");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormName(val);
    if (!editingProduct) {
      const generated = generateSlug(val);
      setFormSlug(generated);
    }
  };

  const handlePrimaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPrimaryFile(file);
      setPrimaryPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newUrls = newFiles.map((file) => URL.createObjectURL(file));
      setGalleryFiles((prev) => [...prev, ...newFiles]);
      setGalleryPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittingProduct(true);
    const formElement = e.currentTarget;
    const form = new FormData(formElement);

    const name = formName.trim();
    const slug = (formSlug.trim() || generateSlug(name)) || `prod-${Date.now()}`;
    const id = editingProduct ? editingProduct.id : slug;
    const sku = formSku.trim() || generateRandomSku(name);
    const category = (form.get("category") as string) || formCategory;
    const subcategoryId = form.get("subcategoryId") as string;
    const description = (form.get("description") as string) || "";
    const regularPrice = formRegularPrice.startsWith("৳") ? formRegularPrice : `৳${formRegularPrice}`;
    const discountedPrice = formDiscountedPrice.startsWith("৳") ? formDiscountedPrice : `৳${formDiscountedPrice}`;
    const tradePrice = formTradePrice.startsWith("৳") ? formTradePrice : `৳${formTradePrice}`;
    const stock = Number(formStock || 50);

    const data = new FormData();
    data.append("id", id);
    data.append("slug", slug);
    data.append("sku", sku);
    data.append("name", name);
    data.append("category", category);
    if (subcategoryId) data.append("subcategoryId", subcategoryId);
    if (description) data.append("description", description);
    data.append("regularPrice", regularPrice);
    data.append("discountedPrice", discountedPrice);
    data.append("tradePrice", tradePrice);
    data.append("price", discountedPrice);
    data.append("originalPrice", regularPrice);
    data.append("stock", String(stock));
    data.append("discountPercent", String(calculatedDiscountPercent));

    // Primary image
    if (primaryFile) {
      data.append("image_file", primaryFile);
    } else if (editingProduct?.image) {
      data.append("image", editingProduct.image);
    } else {
      data.append("image", "/images/figure-samurai-red.svg");
    }

    // Gallery images
    if (galleryFiles.length > 0) {
      galleryFiles.forEach((file) => {
        data.append("gallery_files", file);
      });
    }

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, data);
        if (res.success) {
          showToast(`✓ Product "${name}" updated successfully!`);
          setEditingProduct(null);
          navigateTo("products-all");
          fetchData();
        } else {
          alert("Error updating product: " + (res.error || "Unknown"));
        }
      } else {
        const res = await createProduct(data);
        if (res.success) {
          showToast(`✓ Product "${name}" published to catalog!`);
          setEditingProduct(null);
          navigateTo("products-all");
          fetchData();
        } else {
          alert("Error creating product: " + (res.error || "Please check fields"));
        }
      }
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setSubmittingProduct(false);
    }
  };


  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    const res = await deleteProduct(deletingProduct.id);
    if (res.success) {
      showToast(`✓ Product "${deletingProduct.name}" removed from catalog.`);
      setDeletingProduct(null);

      fetchData();
    } else {
      alert("Could not delete product.");
    }
  };

  // -------------------------------------------------------------
  // Order Status Update Handler
  // -------------------------------------------------------------
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showToast(`✓ Order #${orderId} status updated to ${newStatus.toUpperCase()}`);
      fetchData();
    } else {
      alert("Failed updating order status.");
    }
  };

  // -------------------------------------------------------------
  // User Role Switch Handler
  // -------------------------------------------------------------
  const handleToggleUserRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "customer" : "admin";
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      showToast(`✓ User role updated to ${newRole.toUpperCase()}`);
      fetchData();
    } else {
      alert("Failed updating user role.");
    }
  };

  // -------------------------------------------------------------
  // Category / Subcategory Creation Handlers
  // -------------------------------------------------------------
  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = ((formData.get("id") as string) || (formData.get("label") as string).toLowerCase().replace(/\s+/g, "-")).trim();
    const label = formData.get("label") as string;
    const color = (formData.get("color") as string) || "#FF4D6D";
    const icon_type = formData.get("icon_type") as string;

    const res = await createCategory({ id, label, color, icon_type, featured: true });
    if (res.success) {
      showToast(`✓ Category "${label}" added to taxonomy!`);
      setIsAddCategoryOpen(false);
      fetchData();
    } else {
      alert("Error adding category.");
    }
  };

  const handleCreateSubCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = (formData.get("category") as string) || selectedParentCatId;
    const label = formData.get("label") as string;
    const id = `${category}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const description = formData.get("description") as string;

    const res = await createSubCategory({ id, category, label, slug, description });
    if (res.success) {
      showToast(`✓ Subcategory "${label}" added under category!`);
      setIsAddSubCategoryOpen(false);
      fetchData();
    } else {
      alert("Error adding subcategory.");
    }
  };

  // -------------------------------------------------------------
  // Add User Handler
  // -------------------------------------------------------------
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = (formData.get("password") as string) || "User1234!";
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as string;

    const res = await createUser({ email, password, first_name, last_name, phone, role });
    if (res.success) {
      showToast(`✓ User account ${email} created as ${role.toUpperCase()}!`);
      setIsAddUserOpen(false);
      fetchData();
    } else {
      alert("Error creating user account.");
    }
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F7F5FA] text-[#171136] flex font-[family-name:var(--font-sans)]">
      {/* ------------------------------------------------------------- */}
      {/* Toast Notification Banner */}
      {/* ------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#171136] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] animate-ping" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-2">
            <IconClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR MENU (Permanently Sticky / Fixed Height) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`h-full bg-white border-r border-[#EAE3F7] flex flex-col justify-between shrink-0 select-none z-30 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-[240px] lg:w-[260px]"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#F0EBF8]">
            <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF4D6D] to-[#FF85A1] flex items-center justify-center shrink-0 shadow-sm text-white font-extrabold text-sm">
                BV
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-base tracking-tight text-[#171136] flex items-center gap-1.5">
                    Brickverse
                  </span>
                  <span className="text-[10px] font-extrabold text-[#FF4D6D] tracking-wider uppercase">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle Sidebar"
              className="w-7 h-7 rounded-xl bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#736E9B] hover:text-[#171136] transition-colors shrink-0 cursor-pointer"
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-4">
            {/* 1) OVERVIEW -> Dashboard */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider mb-1.5">
                  Overview
                </p>
              )}
              <button
                onClick={() => navigateTo("dashboard")}
                title="Dashboard"
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                  activeNav === "dashboard"
                    ? "bg-[#FF4D6D] text-white shadow-[0_4px_16px_rgba(255,77,109,0.35)]"
                    : "text-[#5C5478] hover:bg-[#F8F6FD] hover:text-[#171136]"
                }`}
              >
                <IconDashboard className="w-4 h-4 shrink-0" />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </button>
            </div>

            {/* 2) COMMERCE -> Products */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider mb-1.5">
                  Commerce
                </p>
              )}
              <div className="space-y-1">
                {/* Products Parent Accordion */}
                <button
                  onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                  title="Products"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                    activeNav.startsWith("products")
                      ? "text-[#FF4D6D] bg-[#FFF0F4]"
                      : "text-[#5C5478] hover:bg-[#F8F6FD] hover:text-[#171136]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconBox className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Products</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <IconChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        productsMenuOpen ? "rotate-0" : "-rotate-90 text-[#8A84A6]"
                      }`}
                    />
                  )}
                </button>

                {/* Products Submenus */}
                {productsMenuOpen && !sidebarCollapsed && (
                  <div className="pl-8 pr-1 py-1 space-y-1">
                    <button
                      onClick={() => navigateTo("products-all")}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        activeNav === "products-all"
                          ? "text-[#FF4D6D] font-extrabold bg-[#FFF0F4]"
                          : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD]"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>All Products</span>
                    </button>
                    <button
                      onClick={() => navigateTo("products-taxonomy")}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        activeNav === "products-taxonomy"
                          ? "text-[#FF4D6D] font-extrabold bg-[#FFF0F4]"
                          : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD]"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>Category as the taxonomy</span>
                    </button>
                  </div>
                )}

                {/* 3) Orders Parent Accordion */}
                <button
                  onClick={() => setOrdersMenuOpen(!ordersMenuOpen)}
                  title="Orders"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                    activeNav.startsWith("orders")
                      ? "text-[#FF4D6D] bg-[#FFF0F4]"
                      : "text-[#5C5478] hover:bg-[#F8F6FD] hover:text-[#171136]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconOrders className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Orders</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <IconChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        ordersMenuOpen ? "rotate-0" : "-rotate-90 text-[#8A84A6]"
                      }`}
                    />
                  )}
                </button>

                {/* Orders Submenus */}
                {ordersMenuOpen && !sidebarCollapsed && (
                  <div className="pl-8 pr-1 py-1 space-y-1">
                    <button
                      onClick={() => navigateTo("orders-all")}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        activeNav === "orders-all"
                          ? "text-[#FF4D6D] font-extrabold bg-[#FFF0F4]"
                          : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD]"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>All Orders</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4) USERS -> Users */}
            <div>
              {!sidebarCollapsed && (
                <p className="px-3 text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider mb-1.5">
                  Users
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                  title="Users"
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs sm:text-[13px] transition-all cursor-pointer ${
                    activeNav.startsWith("users")
                      ? "text-[#FF4D6D] bg-[#FFF0F4]"
                      : "text-[#5C5478] hover:bg-[#F8F6FD] hover:text-[#171136]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconUsers className="w-4 h-4 shrink-0" />
                    {!sidebarCollapsed && <span>Users</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <IconChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        usersMenuOpen ? "rotate-0" : "-rotate-90 text-[#8A84A6]"
                      }`}
                    />
                  )}
                </button>

                {/* Users Submenus */}
                {usersMenuOpen && !sidebarCollapsed && (
                  <div className="pl-8 pr-1 py-1 space-y-1">
                    <button
                      onClick={() => navigateTo("users-all")}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        activeNav === "users-all"
                          ? "text-[#FF4D6D] font-extrabold bg-[#FFF0F4]"
                          : "text-[#736E9B] hover:text-[#171136] hover:bg-[#F8F6FD]"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>All Users</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Clean Sidebar Footer */}
        <div className="p-3.5 border-t border-[#F0EBF8] text-center">
          {!sidebarCollapsed && (
            <p className="text-[10px] font-bold text-[#A5A0C2] uppercase tracking-wider">
              Brickverse v2.4 • Admin
            </p>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#EAE3F7] sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <span className="font-[family-name:var(--font-display)] font-extrabold text-sm sm:text-base text-[#171136] hidden md:inline">
              Welcome back, <span className="text-[#FF4D6D]">{[user.first_name, user.last_name].filter(Boolean).join(" ") || user.first_name || "Admin"}</span>!
            </span>

            {/* Search Bar */}
            <div className="relative w-full max-w-sm">
              <IconSearch className="w-4 h-4 text-[#8A84A6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search products, orders, users..."
                value={searchGlobal}
                onChange={(e) => setSearchGlobal(e.target.value)}
                className="w-full bg-[#F8F6FD] border border-[#EAE3F7] rounded-full pl-9 pr-4 py-1.5 text-xs text-[#171136] placeholder-[#8A84A6] focus:outline-none focus:border-[#FF4D6D]"
              />
              {searchGlobal && (
                <button
                  onClick={() => setSearchGlobal("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <IconClose className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Storefront Icon Button */}
            <Link
              href="/"
              target="_blank"
              title="View Storefront"
              className="w-9 h-9 rounded-full bg-[#F8F6FD] hover:bg-[#EFE9FF] flex items-center justify-center text-[#736E9B] hover:text-[#FF4D6D] transition-all cursor-pointer"
            >
              <IconExternalLink className="w-4 h-4" />
            </Link>

            {/* Notification Bell */}
            <button
              title="Notifications"
              onClick={() => showToast("🔔 All systems operational. 0 alerts.")}
              className="w-9 h-9 rounded-full bg-[#F8F6FD] hover:bg-[#EFE9FF] flex items-center justify-center text-[#736E9B] hover:text-[#171136] transition-all cursor-pointer relative"
            >
              <IconBell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-[#FF4D6D] absolute top-2 right-2 border-2 border-white" />
            </button>

            {/* Messages / Mail */}
            <button
              title="Messages"
              onClick={() => showToast("✉️ No new customer messages.")}
              className="w-9 h-9 rounded-full bg-[#F8F6FD] hover:bg-[#EFE9FF] flex items-center justify-center text-[#736E9B] hover:text-[#171136] transition-all cursor-pointer"
            >
              <IconMail className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              title="Toggle Theme"
              onClick={() => showToast("🌙 Light/Dark theme mode active.")}
              className="w-9 h-9 rounded-full bg-[#F8F6FD] hover:bg-[#EFE9FF] flex items-center justify-center text-[#736E9B] hover:text-[#171136] transition-all cursor-pointer"
            >
              <IconMoon className="w-4 h-4" />
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-[#EAE3F7] mx-1" />

            {/* Admin Avatar Circle & Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-9 h-9 rounded-full bg-[#FF4D6D] hover:opacity-90 text-white flex items-center justify-center font-extrabold text-sm shadow-md transition-all cursor-pointer ring-2 ring-offset-2 ring-[#FF4D6D]/20"
                title="Admin Account Profile"
              >
                {(user.first_name ? user.first_name[0] : (user.email ? user.email[0] : "A")).toUpperCase()}
              </button>

              {/* Profile Popover Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-[#EAE3F7] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* User Profile Card */}
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8FD] border border-[#F0EBF8]">
                    <div className="w-10 h-10 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center font-extrabold text-base shrink-0 shadow-sm">
                      {(user.first_name ? user.first_name[0] : (user.email ? user.email[0] : "A")).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-sm text-[#171136] truncate">
                        {[user.first_name, user.last_name].filter(Boolean).join(" ") || user.email.split("@")[0] || "Admin"}
                      </span>
                      <span className="text-[11px] font-semibold text-[#8A84A6] capitalize truncate">
                        {user.role || "admin"}
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#F0EBF8] my-2" />

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <IconLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Workspace Views */}
        <main className="p-4 sm:p-8 flex-1">
          {/* ========================================================= */}
          {/* 1) VIEW: DASHBOARD */}
          {/* ========================================================= */}
          {activeNav === "dashboard" && (
            <div className="space-y-6">
              {/* Page Title & Subtitle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs sm:text-sm text-[#736E9B]">
                    Real-time overview of your marketplace performance
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateTo("products-all")}
                    className="bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    <span>Manage Products</span>
                  </button>
                  <button
                    onClick={() => navigateTo("orders-all")}
                    className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>View Orders</span>
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Major KPI Cards (Matching screenshot style) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. TOTAL REVENUE */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex items-start justify-between relative overflow-hidden">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#8A84A6] uppercase tracking-wider block">
                      Total Revenue
                    </span>
                    <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] mt-1.5">
                      ৳{Number(stats.total_revenue).toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                      <IconTrendingUp className="w-3.5 h-3.5" />
                      <span>100%</span>
                      <span className="text-[#8A84A6] font-normal">vs last 30 days</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#FFEAF0] flex items-center justify-center text-[#FF4D6D] shrink-0">
                    <span className="font-extrabold text-base">৳</span>
                  </div>
                </div>

                {/* 2. TOTAL ORDERS */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex items-start justify-between relative overflow-hidden">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#8A84A6] uppercase tracking-wider block">
                      Total Orders
                    </span>
                    <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] mt-1.5">
                      {stats.total_orders}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                      <IconTrendingUp className="w-3.5 h-3.5" />
                      <span>100%</span>
                      <span className="text-[#8A84A6] font-normal">vs last 30 days</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#FFEAF0] flex items-center justify-center text-[#FF4D6D] shrink-0">
                    <IconBag className="w-5 h-5" />
                  </div>
                </div>

                {/* 3. TOTAL CUSTOMERS */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex items-start justify-between relative overflow-hidden">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#8A84A6] uppercase tracking-wider block">
                      Total Customers
                    </span>
                    <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] mt-1.5">
                      {stats.total_customers}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                      <IconTrendingUp className="w-3.5 h-3.5" />
                      <span>66.7%</span>
                      <span className="text-[#8A84A6] font-normal">vs last 30 days</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#F6F1FF] flex items-center justify-center text-[#7B5CFF] shrink-0">
                    <IconUser className="w-5 h-5" />
                  </div>
                </div>

                {/* 4. ACTIVE VENDORS / CATALOG */}
                <div className="bg-white rounded-3xl p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex items-start justify-between relative overflow-hidden">
                  <div>
                    <span className="text-[11px] font-extrabold text-[#8A84A6] uppercase tracking-wider block">
                      Active Vendors
                    </span>
                    <div className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] mt-1.5">
                      {stats.active_vendors || 4}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-2">
                      <IconTrendingUp className="w-3.5 h-3.5" />
                      <span>0%</span>
                      <span className="text-[#8A84A6] font-normal">vs last 30 days</span>
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF6EE] flex items-center justify-center text-[#FF922B] shrink-0">
                    <IconStore className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* 4 Mini KPI Metric Pills Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-[#EAF7FF] border border-[#C5E9FF] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#0099FF] shadow-xs">
                    <IconBox className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-[#171136] block leading-tight">
                      {stats.total_products}
                    </span>
                    <span className="text-[11px] text-[#5A738E] font-semibold">Products in Catalog</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FFF9E6] border border-[#FFE8A3] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#FFC93C] shadow-xs">
                    <IconStar className="w-4 h-4" filled />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-[#171136] block leading-tight">
                      {stats.avg_rating || 4.8} <span className="text-xs text-[#8A84A6]">/ 5</span>
                    </span>
                    <span className="text-[11px] text-[#8C7A3E] font-semibold">Avg Store Rating</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EAFBF3] border border-[#B3F2D4] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#059669] shadow-xs">
                    <IconTrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-[#171136] block leading-tight">
                      ৳{stats.profit_est || 72}
                    </span>
                    <span className="text-[11px] text-[#427A62] font-semibold">Net Profit Margin</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F4F1FD] border border-[#DFD7FA] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[#7B5CFF] shadow-xs">
                    <span className="font-extrabold text-xs">৳</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base text-[#171136] block leading-tight">
                      ৳{stats.commission_est || 316}
                    </span>
                    <span className="text-[11px] text-[#6956A8] font-semibold">Commission & Fees</span>
                  </div>
                </div>
              </div>

              {/* Main Analytics Grid: Revenue Chart (Left) + Order Status Donut (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Analytics Curve / Bars */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                          Revenue Analytics
                        </h2>
                        <p className="text-xs text-[#736E9B]">
                          Monthly revenue, vendor earnings & fee commissions
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-[#7B5CFF]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#7B5CFF]" />
                          Revenue
                        </span>
                        <span className="flex items-center gap-1.5 text-[#10B981]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                          Vendor
                        </span>
                        <span className="flex items-center gap-1.5 text-[#FF922B]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF922B]" />
                          Commission
                        </span>
                      </div>
                    </div>

                    {/* Chart Visualization */}
                    <div className="h-56 mt-6 flex items-end justify-between gap-3 px-2 pt-6 pb-2 border-b border-[#F0EBF8] relative">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 top-0 border-b border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span>৳5.0K</span>
                      </div>
                      <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-gray-100 flex items-center justify-between text-[10px] text-gray-400">
                        <span>৳2.5K</span>
                      </div>

                      {/* Monthly Bar Stacks */}
                      {[
                        { m: "Jan", r: 40, v: 25, c: 8 },
                        { m: "Feb", r: 52, v: 34, c: 11 },
                        { m: "Mar", r: 65, v: 42, c: 14 },
                        { m: "Apr", r: 78, v: 50, c: 18 },
                        { m: "May", r: 70, v: 45, c: 16 },
                        { m: "Jun", r: 88, v: 56, c: 22 },
                        { m: "Jul", r: 92, v: 60, c: 24 },
                        { m: "Aug", r: 100, v: 65, c: 28 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer">
                          <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full">
                            <div
                              style={{ height: `${item.r}%` }}
                              className="w-2.5 bg-gradient-to-t from-[#7B5CFF] to-[#A48EFF] rounded-t-md transition-all group-hover:brightness-110"
                              title={`Revenue: ${item.r}%`}
                            />
                            <div
                              style={{ height: `${item.v}%` }}
                              className="w-2.5 bg-gradient-to-t from-[#10B981] to-[#6EE7B7] rounded-t-md transition-all group-hover:brightness-110"
                              title={`Vendor: ${item.v}%`}
                            />
                            <div
                              style={{ height: `${item.c}%` }}
                              className="w-2 bg-gradient-to-t from-[#FF922B] to-[#FFC078] rounded-t-md transition-all group-hover:brightness-110"
                              title={`Commission: ${item.c}%`}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#736E9B] mt-2">{item.m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Status Donut Chart */}
                <div className="bg-white rounded-3xl p-6 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)] flex flex-col justify-between">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136]">
                      Order Status
                    </h2>
                    <p className="text-xs text-[#736E9B]">Current fulfillment distribution</p>

                    {/* Donut graphic */}
                    <div className="flex items-center justify-center py-6">
                      <div className="relative w-40 h-40 rounded-full flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          {/* Delivered arc (teal) */}
                          <path
                            className="text-[#10B981]"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="75, 100"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Processing arc (orange) */}
                          <path
                            className="text-[#FF922B]"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="15, 100"
                            strokeDashoffset="-75"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Pending arc (purple) */}
                          <path
                            className="text-[#7B5CFF]"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="10, 100"
                            strokeDashoffset="-90"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>

                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                            {stats.total_orders}
                          </span>
                          <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider">
                            TOTAL
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Breakdown Legend */}
                  <div className="space-y-2 pt-2 border-t border-[#F0EBF8] text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#171136]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                        <span>Delivered</span>
                      </div>
                      <span className="font-extrabold text-[#10B981]">
                        {statusDist.delivered || stats.total_orders}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#171136]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF922B]" />
                        <span>Processing</span>
                      </div>
                      <span className="font-extrabold text-[#FF922B]">
                        {statusDist.processing || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#171136]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7B5CFF]" />
                        <span>Pending</span>
                      </div>
                      <span className="font-extrabold text-[#7B5CFF]">
                        {statusDist.pending || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview Table */}
              <div className="bg-white rounded-3xl p-6 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.03)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                      Recent Customer Orders
                    </h2>
                    <p className="text-xs text-[#736E9B]">Latest transactions across Brickverse store</p>
                  </div>
                  <button
                    onClick={() => {
                      setOrdersMenuOpen(true);
                      setActiveNav("orders-all");
                    }}
                    className="text-xs font-bold text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all orders</span>
                    <IconArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE3F7] text-[#8A84A6]">
                        <th className="pb-3 font-semibold">Order #</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBF8]">
                      {orders.slice(0, 5).map((o: any) => (
                        <tr key={o.id} className="hover:bg-[#F8F6FD] transition-colors">
                          <td className="py-3.5 font-extrabold text-[#171136]">{o.order_number}</td>
                          <td className="py-3.5">
                            <p className="font-bold text-[#171136]">{o.customer_name}</p>
                            <p className="text-[11px] text-[#736E9B]">{o.customer_email}</p>
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase ${
                                o.status === "delivered"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : o.status === "shipped"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 font-extrabold text-[#171136]">৳{o.total_amount}</td>
                          <td className="py-3.5 text-[#736E9B]">
                            {new Date(o.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="text-xs font-bold text-[#7B5CFF] hover:underline cursor-pointer"
                            >
                              Invoice ↗
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2) VIEW: PRODUCTS -> ALL PRODUCTS */}
          {/* ========================================================= */}
          {activeNav === "products-all" && (
            <div className="space-y-6">
              {/* Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                    All Products
                  </h1>
                  <p className="text-xs sm:text-sm text-[#736E9B]">
                    Manage store catalog, regular/discount pricing, trade price (TP), and inventory stock
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openNewProductForm}
                    className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-[#EAE3F7] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#736E9B]">Category:</span>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#F8F6FD] border border-[#EAE3F7] text-xs font-semibold rounded-xl px-3 py-1.5 text-[#171136] focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-xs text-[#736E9B] font-semibold">
                  Showing <strong className="text-[#171136]">{filteredProducts.length}</strong> products
                </span>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE3F7] text-[#8A84A6]">
                        <th className="pb-3 font-semibold">Product & SKU</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Regular Price</th>
                        <th className="pb-3 font-semibold">Discounted Price</th>
                        <th className="pb-3 font-semibold">Trade Price (TP)</th>
                        <th className="pb-3 font-semibold">Stock</th>
                        <th className="pb-3 font-semibold">Discount</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBF8]">
                      {filteredProducts.map((p) => {
                        const reg = p.regularPrice || p.originalPrice || "—";
                        const disc = p.discountedPrice || p.price || "—";
                        const tp = p.tradePrice || "—";
                        const discountBadge = p.discountPercent ? `-${p.discountPercent}%` : null;

                        return (
                          <tr key={p.id} className="hover:bg-[#F8F6FD] transition-colors">
                            <td className="py-3.5 flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-[#F6F1FF] flex items-center justify-center overflow-hidden shrink-0 border border-[#EAE3F7]">
                                <Image src={p.image} alt={p.name} width={40} height={40} className="object-contain" />
                              </div>
                              <div>
                                <p className="font-extrabold text-[#171136] text-sm leading-tight">{p.name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10.5px] px-1.5 py-0.5 rounded bg-[#F0EBF8] text-[#5C5478] font-bold">
                                    {p.sku || p.id}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5">
                              <span className="px-2.5 py-1 bg-[#F6F1FF] text-[#7B5CFF] text-[11px] font-bold rounded-lg capitalize">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className="text-[11.5px] text-[#8A84A6] line-through font-semibold">
                                {reg}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className="font-extrabold text-[#171136] text-sm">
                                {disc}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span className="font-bold text-[#059669] text-xs bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                                {tp}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                                  (p.stock || 10) > 10
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {p.stock || 100} in stock
                              </span>
                            </td>
                            <td className="py-3.5">
                              {discountBadge ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FF4D6D] text-white shadow-xs">
                                  {discountBadge}
                                </span>
                              ) : (
                                <span className="text-[#8A84A6]">—</span>
                              )}
                            </td>
                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/product/${p.slug || p.id}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg text-[#736E9B] hover:text-[#171136] hover:bg-[#F6F1FF] transition-colors"
                                  title="View on Store"
                                >
                                  <IconStore className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => openEditProductForm(p)}
                                  className="p-1.5 rounded-lg text-[#7B5CFF] hover:bg-[#EFE9FF] transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <IconEdit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingProduct(p)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                  title="Delete Product"
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
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2.5) VIEW: PRODUCTS -> ADD / EDIT PRODUCT FORM */}
          {/* ========================================================= */}
          {activeNav === "products-form" && (
            <div className="space-y-6 w-full">
              {/* Back button & Page Title */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    navigateTo("products-all");
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#736E9B] hover:text-[#FF4D6D] transition-colors mb-2 cursor-pointer"
                >
                  <IconArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Products</span>
                </button>
                <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                  {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
                </h1>
                <p className="text-xs sm:text-sm text-[#736E9B] mt-1">
                  {editingProduct
                    ? "Update pricing, trade price, stock, and media catalog entry"
                    : "Fill in the details to create a new product listing"}
                </p>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6 w-full">
                {/* 1. Basic Information Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3F7] shadow-xs space-y-5 w-full">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBF8]">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF0F4] text-[#FF4D6D] flex items-center justify-center shrink-0">
                      <IconEdit className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                        Basic Information
                      </h2>
                      <p className="text-xs text-[#736E9B]">Product title and full catalog description</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="font-bold text-xs text-[#171136]">
                        Product Name <span className="text-[#FF4D6D]">*</span>
                      </label>
                      <span title="Primary title of the product in the storefront" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                        <IconInfo className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <input
                      name="name"
                      value={formName}
                      onChange={handleNameChange}
                      required
                      placeholder="e.g. Kingo Salted Almond Nuts 250gm"
                      className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="font-bold text-xs text-[#171136]">Description</label>
                      <span title="Comprehensive product narrative, details, and ingredients" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                        <IconInfo className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingProduct?.description || ""}
                      placeholder="Write a detailed product description, collectible lore, ingredients or specifications..."
                      className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all resize-y"
                    />
                  </div>
                </div>

                {/* 2. Organization & Taxonomy Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3F7] shadow-xs space-y-5 w-full">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBF8]">
                    <div className="w-10 h-10 rounded-2xl bg-[#F4F1FD] text-[#7B5CFF] flex items-center justify-center shrink-0">
                      <IconFolder className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                        Organization & Taxonomy
                      </h2>
                      <p className="text-xs text-[#736E9B]">
                        Categorize product with distinct Auto-Generated SKU and SEO URL Slug
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">
                          Category <span className="text-[#FF4D6D]">*</span>
                        </label>
                        <span title="Main parent category taxonomy" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <select
                        name="category"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all cursor-pointer"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">Subcategory</label>
                        <span title="Child taxonomy within department" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <select
                        name="subcategoryId"
                        defaultValue={editingProduct?.subcategoryId || editingProduct?.subcategory?.id || ""}
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all cursor-pointer"
                      >
                        <option value="">General / Default</option>
                        {categories
                          .find((c) => c.id === formCategory)
                          ?.subcategories?.map((sub: any) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.label}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Auto-generated SKU Field */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <label className="font-bold text-xs text-[#171136]">
                            SKU (Auto Generated) <span className="text-[#FF4D6D]">*</span>
                          </label>
                          <span title="Unique stock keeping unit code" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                            <IconInfo className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormSku(generateRandomSku(formName))}
                          className="text-[11px] font-bold text-[#7B5CFF] hover:underline cursor-pointer flex items-center gap-0.5"
                          title="Generate new SKU"
                        >
                          <IconRefresh className="w-3 h-3" />
                          <span>Generate</span>
                        </button>
                      </div>
                      <input
                        name="sku"
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        required
                        placeholder="e.g. BV-KINGO-8492"
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white font-mono text-xs font-bold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all"
                      />
                    </div>

                    {/* Auto-generated URL Slug Field */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">
                          URL Slug (Auto Generated) <span className="text-[#FF4D6D]">*</span>
                        </label>
                        <span title="Product URL slug for SEO routing" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <input
                        name="slug"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        required
                        disabled={!!editingProduct}
                        placeholder="e.g. kingo-salted-almond-nuts-250gm"
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white font-mono text-xs font-semibold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Pricing & Stock Inventory Card (4 Dedicated Fields) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3F7] shadow-xs space-y-5 w-full">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EBF8] flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#EAFBF3] text-[#059669] flex items-center justify-center shrink-0">
                        <IconDollar className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                          Pricing & Stock Inventory
                        </h2>
                        <p className="text-xs text-[#736E9B]">
                          Configure Regular Price, Discounted Selling Price, TP (Trade Price), and Stock Quantity
                        </p>
                      </div>
                    </div>

                    {/* Live Calculated Discount Percentage Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#736E9B]">Calculated Discount:</span>
                      {calculatedDiscountPercent > 0 ? (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FF4D6D] text-white shadow-xs animate-in zoom-in-90">
                          -{calculatedDiscountPercent}% OFF
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F0EBF8] text-[#736E9B]">
                          No discount
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* 1) Regular Price */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">
                          1) Regular Price (৳) <span className="text-[#FF4D6D]">*</span>
                        </label>
                        <span title="Original MSRP / List price before discount" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <input
                        name="regularPrice"
                        value={formRegularPrice}
                        onChange={(e) => setFormRegularPrice(e.target.value)}
                        required
                        placeholder="46.00"
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-bold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all"
                      />
                    </div>

                    {/* 2) Discounted Price */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">
                          2) Discounted Price (৳) <span className="text-[#FF4D6D]">*</span>
                        </label>
                        <span title="Final customer selling price in Bangladeshi Taka" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <input
                        name="discountedPrice"
                        value={formDiscountedPrice}
                        onChange={(e) => setFormDiscountedPrice(e.target.value)}
                        required
                        placeholder="34.99"
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-extrabold text-[#FF4D6D] focus:outline-none focus:border-[#FF4D6D] transition-all"
                      />
                    </div>

                    {/* 3) Trade Price (TP) */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">
                          3) TP (Trade Price ৳) <span className="text-[#FF4D6D]">*</span>
                        </label>
                        <span title="Trade / Wholesale purchase price from supplier" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <input
                        name="tradePrice"
                        value={formTradePrice}
                        onChange={(e) => setFormTradePrice(e.target.value)}
                        required
                        placeholder="28.00"
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-bold text-[#059669] focus:outline-none focus:border-[#059669] transition-all"
                      />
                    </div>

                    {/* 4) Stock Quantity */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <label className="font-bold text-xs text-[#171136]">
                          4) Stock Quantity <span className="text-[#FF4D6D]">*</span>
                        </label>
                        <span title="Available inventory units in warehouse" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                          <IconInfo className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <input
                        type="number"
                        name="stock"
                        value={formStock}
                        onChange={(e) => setFormStock(Number(e.target.value))}
                        required
                        min={0}
                        className="w-full px-4 py-3 rounded-2xl border border-[#EAE3F7] bg-[#FAF8FD] focus:bg-white text-xs font-bold text-[#171136] focus:outline-none focus:border-[#FF4D6D] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Product Media & Gallery Card (Local File Uploads) */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3F7] shadow-xs space-y-6 w-full">
                  <div className="flex items-center gap-3 pb-3 border-b border-[#F0EBF8]">
                    <div className="w-10 h-10 rounded-2xl bg-[#EAF7FF] text-[#0099FF] flex items-center justify-center shrink-0">
                      <IconPhoto className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                        Product Media & Image Gallery
                      </h2>
                      <p className="text-xs text-[#736E9B]">
                        Upload primary showcase image and multiple gallery photos directly from your computer
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Primary Image Upload Field */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <label className="font-bold text-xs text-[#171136]">
                            Primary Product Image <span className="text-[#FF4D6D]">*</span>
                          </label>
                          <span title="Main showcase photo displayed in product card and header" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                            <IconInfo className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        {primaryPreviewUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setPrimaryFile(null);
                              setPrimaryPreviewUrl(null);
                            }}
                            className="text-[11px] font-bold text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="border-2 border-dashed border-[#EAE3F7] hover:border-[#FF4D6D] rounded-2xl p-4 bg-[#FAF8FD] transition-colors flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
                        {primaryPreviewUrl ? (
                          <div className="flex flex-col items-center gap-3 w-full">
                            <div className="w-32 h-32 rounded-2xl bg-white p-2 shadow-xs border border-[#EAE3F7] flex items-center justify-center overflow-hidden">
                              <Image
                                src={primaryPreviewUrl}
                                alt="Primary Preview"
                                width={110}
                                height={110}
                                className="object-contain max-h-28"
                              />
                            </div>
                            <label
                              htmlFor="primary-image-input"
                              className="px-4 py-1.5 rounded-xl bg-white border border-[#EAE3F7] text-xs font-bold text-[#7B5CFF] hover:bg-[#F6F1FF] transition-all cursor-pointer shadow-xs"
                            >
                              Choose Different File
                            </label>
                          </div>
                        ) : (
                          <label
                            htmlFor="primary-image-input"
                            className="flex flex-col items-center justify-center cursor-pointer p-4 text-center w-full"
                          >
                            <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-[#EAE3F7] flex items-center justify-center text-[#7B5CFF] mb-2">
                              <IconPhoto className="w-6 h-6" />
                            </div>
                            <span className="font-extrabold text-xs text-[#171136]">
                              Click to select primary image
                            </span>
                            <span className="text-[11px] text-[#736E9B] mt-0.5">
                              Upload PNG, JPG, SVG or WebP from your computer
                            </span>
                          </label>
                        )}
                        <input
                          id="primary-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handlePrimaryFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Image Gallery Multi-Upload Field */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <label className="font-bold text-xs text-[#171136]">
                            Product Image Gallery (Multiple)
                          </label>
                          <span title="Additional photos for angles, close-ups, and box contents" className="text-[#8A84A6] hover:text-[#171136] cursor-help">
                            <IconInfo className="w-3.5 h-3.5" />
                          </span>
                        </div>
                        <label
                          htmlFor="gallery-image-input"
                          className="px-3 py-1 rounded-xl bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          + Add Photos
                        </label>
                      </div>

                      <div className="border border-[#EAE3F7] rounded-2xl p-4 bg-[#FAF8FD] min-h-[160px] flex flex-col justify-center">
                        {galleryPreviewUrls.length === 0 && existingGalleryImages.length === 0 ? (
                          <label
                            htmlFor="gallery-image-input"
                            className="flex flex-col items-center justify-center cursor-pointer py-6 text-center"
                          >
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#EAE3F7] flex items-center justify-center text-[#736E9B] mb-2 shadow-xs">
                              <IconPlus className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xs text-[#171136]">
                              Add gallery photos from your computer
                            </span>
                            <span className="text-[11px] text-[#736E9B] mt-0.5">
                              Select multiple images to showcase all sides and details
                            </span>
                          </label>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {/* Existing Gallery Images */}
                            {existingGalleryImages.map((g: any, i: number) => (
                              <div
                                key={`exist-${g.id || i}`}
                                className="relative rounded-xl bg-white p-1.5 border border-[#EAE3F7] shadow-xs flex flex-col items-center justify-center group h-24 overflow-hidden"
                              >
                                <Image
                                  src={g.imageUrl || g.image_url || "/images/figure-samurai-red.svg"}
                                  alt={`Gallery ${i}`}
                                  width={64}
                                  height={64}
                                  className="object-contain max-h-16"
                                />
                                <span className="text-[9px] font-bold text-[#8A84A6] mt-1 truncate">Saved</span>
                              </div>
                            ))}

                            {/* Newly Selected Local Gallery Files */}
                            {galleryPreviewUrls.map((url, idx) => (
                              <div
                                key={`new-${idx}`}
                                className="relative rounded-xl bg-white p-1.5 border border-[#7B5CFF]/40 shadow-xs flex flex-col items-center justify-center group h-24 overflow-hidden"
                              >
                                <Image
                                  src={url}
                                  alt={`New upload ${idx}`}
                                  width={64}
                                  height={64}
                                  className="object-contain max-h-16"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryFile(idx)}
                                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer"
                                  title="Remove image"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}

                            {/* Add More Button */}
                            <label
                              htmlFor="gallery-image-input"
                              className="rounded-xl border border-dashed border-[#7B5CFF] bg-[#F6F1FF]/50 hover:bg-[#F6F1FF] flex flex-col items-center justify-center h-24 cursor-pointer text-[#7B5CFF] transition-colors"
                            >
                              <IconPlus className="w-5 h-5" />
                              <span className="text-[10px] font-bold mt-1">Add More</span>
                            </label>
                          </div>
                        )}
                        <input
                          id="gallery-image-input"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleGalleryFilesChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Action Buttons Bar */}
                <div className="flex items-center justify-between pt-4 pb-12 w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setActiveNav("products-all");
                    }}
                    className="px-6 py-3 rounded-2xl bg-white border border-[#EAE3F7] text-[#5C5478] hover:text-[#171136] font-bold text-xs hover:bg-[#F8F6FD] transition-all cursor-pointer flex items-center gap-2"
                  >
                    <IconArrowLeft className="w-4 h-4" />
                    <span>Cancel & Back</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={submittingProduct}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF85A1] text-white font-extrabold text-xs shadow-[0_4px_16px_rgba(255,77,109,0.35)] hover:brightness-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    >
                      <IconCheck className="w-4 h-4" />
                      <span>{submittingProduct ? "Saving..." : (editingProduct ? "Save Changes" : "Create Product Listing")}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}



          {/* ========================================================= */}
          {/* 3) VIEW: PRODUCTS -> CATEGORY AS THE TAXONOMY */}
          {/* ========================================================= */}
          {activeNav === "products-taxonomy" && (
            <div className="space-y-6">
              {/* Header & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                    Category Taxonomy
                  </h1>
                  <p className="text-xs sm:text-sm text-[#736E9B]">
                    Hierarchical structure of parent Categories and child Subcategories
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddCategoryOpen(true)}
                    className="bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>+ Add Parent Category</span>
                  </button>
                  <button
                    onClick={() => setIsAddSubCategoryOpen(true)}
                    className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>+ Add Subcategory</span>
                  </button>
                </div>
              </div>

              {/* Taxonomy Tree / Cards Explorer */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-3xl p-5 border border-[#EAE3F7] shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: cat.color || "#FF4D6D" }}
                          />
                          <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                            {cat.label}
                          </h2>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F6F1FF] text-[#7B5CFF]">
                          {cat.subcategories?.length || 0} subcategories
                        </span>
                      </div>

                      {/* Nested Subcategories Pill List */}
                      <div className="space-y-1.5 mt-3 pt-3 border-t border-[#F0EBF8]">
                        <p className="text-[11px] font-bold text-[#8A84A6] uppercase tracking-wide mb-1">
                          Subcategories:
                        </p>
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((sub: any) => (
                            <div
                              key={sub.id}
                              className="p-2 rounded-xl bg-[#F8F6FD] border border-[#EAE3F7] flex items-center justify-between text-xs"
                            >
                              <span className="font-semibold text-[#171136]">{sub.label}</span>
                              <span className="text-[10px] text-[#736E9B] font-mono">slug: {sub.slug}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-[#8A84A6] italic">No child subcategories yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Quick Add Subcategory action button */}
                    <div className="mt-4 pt-3 border-t border-[#F0EBF8] flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedParentCatId(cat.id);
                          setIsAddSubCategoryOpen(true);
                        }}
                        className="text-xs font-bold text-[#FF4D6D] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <IconPlus className="w-3 h-3" />
                        <span>Add Subcategory</span>
                      </button>

                      <span className="text-[11px] text-[#8A84A6] font-mono">{cat.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4) VIEW: ORDERS -> ALL ORDERS */}
          {/* ========================================================= */}
          {activeNav === "orders-all" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                    All Orders
                  </h1>
                  <p className="text-xs sm:text-sm text-[#736E9B]">
                    View real-time customer orders, update tracking status, and generate invoices
                  </p>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex border-b border-[#EAE3F7] gap-2 overflow-x-auto whitespace-nowrap">
                {["all", "pending", "processing", "shipped", "delivered"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all capitalize cursor-pointer ${
                      orderStatusFilter === st
                        ? "border-[#FF4D6D] text-[#FF4D6D]"
                        : "border-transparent text-[#736E9B] hover:text-[#171136]"
                    }`}
                  >
                    {st === "all" ? `All Orders (${orders.length})` : st}
                  </button>
                ))}
              </div>

              {/* Orders Data Table */}
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE3F7] text-[#8A84A6]">
                        <th className="pb-3 font-semibold">Order #</th>
                        <th className="pb-3 font-semibold">Customer Details</th>
                        <th className="pb-3 font-semibold">Items Count</th>
                        <th className="pb-3 font-semibold">Total</th>
                        <th className="pb-3 font-semibold">Fulfillment Status</th>
                        <th className="pb-3 font-semibold">Tracking</th>
                        <th className="pb-3 font-semibold text-right">Invoice & Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBF8]">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#F8F6FD] transition-colors">
                          <td className="py-3.5 font-extrabold text-[#171136]">{o.order_number}</td>
                          <td className="py-3.5">
                            <p className="font-bold text-[#171136]">{o.customer_name}</p>
                            <p className="text-[11px] text-[#736E9B]">{o.customer_email}</p>
                            {o.customer_phone && (
                              <p className="text-[10px] text-[#8A84A6]">{o.customer_phone}</p>
                            )}
                          </td>
                          <td className="py-3.5">
                            <span className="font-semibold text-[#171136]">
                              {o.items?.length || 1} items
                            </span>
                          </td>
                          <td className="py-3.5 font-extrabold text-[#171136] text-sm">
                            ৳{o.total_amount}
                          </td>
                          <td className="py-3.5">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer border ${
                                o.status === "delivered"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : o.status === "shipped"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 text-[11px] text-[#736E9B]">
                            {o.tracking_number || "—"}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="px-3 py-1.5 bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] font-bold rounded-xl transition-all cursor-pointer"
                            >
                              View Invoice ↗
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5) VIEW: USERS -> ALL USERS */}
          {/* ========================================================= */}
          {activeNav === "users-all" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                    All Users
                  </h1>
                  <p className="text-xs sm:text-sm text-[#736E9B]">
                    Manage store customer accounts, administrators, and role permissions
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddUserOpen(true)}
                    className="bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <IconPlus className="w-4 h-4" />
                    <span>+ Add New User</span>
                  </button>
                </div>
              </div>

              {/* Role Filter Tabs */}
              <div className="flex border-b border-[#EAE3F7] gap-2">
                <button
                  onClick={() => setUserRoleFilter("all")}
                  className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                    userRoleFilter === "all"
                      ? "border-[#FF4D6D] text-[#FF4D6D]"
                      : "border-transparent text-[#736E9B] hover:text-[#171136]"
                  }`}
                >
                  All Users ({usersList.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter("customer")}
                  className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                    userRoleFilter === "customer"
                      ? "border-[#FF4D6D] text-[#FF4D6D]"
                      : "border-transparent text-[#736E9B] hover:text-[#171136]"
                  }`}
                >
                  Customers ({usersList.filter((u) => u.role === "customer").length})
                </button>
                <button
                  onClick={() => setUserRoleFilter("admin")}
                  className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                    userRoleFilter === "admin"
                      ? "border-[#FF4D6D] text-[#FF4D6D]"
                      : "border-transparent text-[#736E9B] hover:text-[#171136]"
                  }`}
                >
                  Admins ({usersList.filter((u) => u.role === "admin").length})
                </button>
              </div>

              {/* Users Data Table */}
              <div className="bg-white rounded-3xl border border-[#EAE3F7] p-6 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE3F7] text-[#8A84A6]">
                        <th className="pb-3 font-semibold">User</th>
                        <th className="pb-3 font-semibold">Email</th>
                        <th className="pb-3 font-semibold">Phone</th>
                        <th className="pb-3 font-semibold">Role</th>
                        <th className="pb-3 font-semibold">Joined Date</th>
                        <th className="pb-3 font-semibold text-right">Toggle Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBF8]">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#F8F6FD] transition-colors">
                          <td className="py-3.5 flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-full bg-[#171136] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {(u.first_name ? u.first_name[0] : (u.email ? u.email[0] : "U")).toUpperCase()}
                            </span>
                            <span className="font-bold text-[#171136]">
                              {[u.first_name, u.last_name].filter(Boolean).join(" ") || u.email.split("@")[0] || "User"}
                            </span>
                          </td>
                          <td className="py-3.5 text-[#736E9B] font-medium">{u.email}</td>
                          <td className="py-3.5 text-[#736E9B]">{u.phone || "—"}</td>
                          <td className="py-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                u.role === "admin"
                                  ? "bg-[#EFE9FF] text-[#7B5CFF] border border-[#7B5CFF]/30"
                                  : "bg-[#FFF1F4] text-[#FF4D6D] border border-[#FF4D6D]/30"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5 text-[11px] text-[#736E9B]">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleToggleUserRole(u.id, u.role)}
                              className="text-xs font-bold text-[#7B5CFF] hover:underline cursor-pointer"
                            >
                              Make {u.role === "admin" ? "Customer" : "Admin"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>




      {/* ============================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION */}
      {/* ============================================================= */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete Product?
            </h3>
            <p className="text-xs text-[#736E9B] mb-5">
              Are you sure you want to remove <strong>{deletingProduct.name}</strong> from the catalog?
            </p>
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD PARENT CATEGORY */}
      {/* ============================================================= */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                Add Parent Category
              </h3>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171136] block mb-1">Category ID (slug)</label>
                <input
                  name="id"
                  required
                  placeholder="e.g. anime-figures"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] font-mono focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Category Label / Name</label>
                <input
                  name="label"
                  required
                  placeholder="e.g. Anime figures"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Accent Color</label>
                  <select
                    name="color"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="#FF4D6D">Pink (#FF4D6D)</option>
                    <option value="#7B5CFF">Purple (#7B5CFF)</option>
                    <option value="#00B4D8">Cyan (#00B4D8)</option>
                    <option value="#FFC93C">Gold (#FFC93C)</option>
                    <option value="#10B981">Green (#10B981)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#171136] block mb-1">Icon Type</label>
                  <select
                    name="icon_type"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="figure">Figure</option>
                    <option value="toon">Cartoon</option>
                    <option value="brick">Bricks</option>
                    <option value="code">Coding</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#171136] text-white font-bold hover:bg-[#251c4a] shadow-md cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD SUBCATEGORY */}
      {/* ============================================================= */}
      {isAddSubCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                Add Subcategory Taxonomy
              </h3>
              <button
                onClick={() => setIsAddSubCategoryOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171136] block mb-1">Parent Category</label>
                <select
                  name="category"
                  defaultValue={selectedParentCatId || categories[0]?.id}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} ({c.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Subcategory Title</label>
                <input
                  name="label"
                  required
                  placeholder="e.g. Scale Figures (1/7 & 1/4)"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Short Description (Optional)</label>
                <input
                  name="description"
                  placeholder="e.g. Hand-painted PVC scale statues"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubCategoryOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF4D6D] text-white font-bold hover:bg-[#ff3358] shadow-md cursor-pointer"
                >
                  Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD USER */}
      {/* ============================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                Add New User
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">First Name *</label>
                  <input
                    name="first_name"
                    required
                    placeholder="Alex"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Last Name *</label>
                  <input
                    name="last_name"
                    required
                    placeholder="Morgan"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="user@brickverse.com"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Temporary Password</label>
                  <input
                    type="password"
                    name="password"
                    defaultValue="User1234!"
                    required
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#171136] block mb-1">Role</label>
                  <select
                    name="role"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#171136] block mb-1">Phone Number (Optional)</label>
                <input
                  name="phone"
                  placeholder="+880 1700-000000"
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF4D6D] text-white font-bold hover:bg-[#ff3358] shadow-md cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ORDER INVOICE & DETAILS */}
      {/* ============================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3F7]">
              <div>
                <span className="text-[10.5px] font-extrabold text-[#7B5CFF] uppercase tracking-wider block">
                  Brickverse Order Invoice
                </span>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                  Order #{selectedOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              {/* Customer & Shipping Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7]">
                <div>
                  <span className="font-bold text-[#8A84A6] uppercase text-[10px] block">Customer</span>
                  <p className="font-extrabold text-[#171136] text-sm mt-0.5">{selectedOrder.customer_name}</p>
                  <p className="text-[#736E9B]">{selectedOrder.customer_email}</p>
                  <p className="text-[#736E9B]">{selectedOrder.customer_phone || "—"}</p>
                </div>
                <div>
                  <span className="font-bold text-[#8A84A6] uppercase text-[10px] block">Shipping Address</span>
                  <p className="text-[#171136] font-medium mt-0.5 whitespace-pre-line">
                    {selectedOrder.shipping_address || "Standard Customer Address"}
                  </p>
                </div>
              </div>

              {/* Order Status & Tracking */}
              <div className="p-4 rounded-2xl bg-[#FFF6EE] border border-[#FFE3CC] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#FF922B] uppercase text-[10px] block">Status</span>
                  <span className="font-extrabold text-sm text-[#171136] uppercase">{selectedOrder.status}</span>
                </div>
                <div>
                  <span className="font-bold text-[#FF922B] uppercase text-[10px] block">Tracking No.</span>
                  <span className="font-mono text-xs text-[#171136]">
                    {selectedOrder.tracking_number || "BV-TRACK-88219"}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div>
                <span className="font-bold text-[#171136] block mb-2">Itemized Products</span>
                <div className="border border-[#EAE3F7] rounded-2xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-[#F8F6FD] border-b border-[#EAE3F7] text-[#8A84A6]">
                      <tr>
                        <th className="p-3 font-semibold">Item</th>
                        <th className="p-3 font-semibold text-center">Qty</th>
                        <th className="p-3 font-semibold text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBF8]">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-3 font-bold text-[#171136]">{item.product_name}</td>
                            <td className="p-3 text-center">{item.quantity}</td>
                            <td className="p-3 text-right font-extrabold">৳{item.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-3 font-bold text-[#171136]">Collector Statue Bundle</td>
                          <td className="p-3 text-center">1</td>
                          <td className="p-3 text-right font-extrabold">৳{selectedOrder.total_amount}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between items-center pt-2 border-t border-[#EAE3F7]">
                <span className="font-extrabold text-sm text-[#171136]">Total Paid</span>
                <span className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#FF4D6D]">
                  ৳{selectedOrder.total_amount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

