"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, Category, Product } from "./productData";
import { CategoryGlyph } from "./CategoryRail";
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
  IconTrendingDown,
  IconFolder,
  IconInfo,
  IconDollar,
  IconPhoto,
  IconArrowLeft,
  IconBell,
  IconMail,
  IconMoon,
  IconExternalLink,
  IconDownload,
  IconTarget,
  IconFilter,
  IconWallet,
  IconDots,
} from "./icons";

interface AdminDashboardProps {
  user: User;
  initialNav?: ActiveNav;
}

type ActiveNav = "dashboard" | "products-all" | "products-form" | "products-taxonomy" | "orders-all" | "users-all";

export default function AdminDashboard({ user, initialNav }: AdminDashboardProps) {
  const { logout } = useAuth();

  // Dynamic user display name & avatar resolution (First Name, Last Name, Avatar initial)
  const userFullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim() ||
    user?.first_name?.trim() ||
    (user?.email ? user.email.split("@")[0] : "Admin");

  const userFirstName =
    user?.first_name?.trim() ||
    (userFullName ? userFullName.split(" ")[0] : "Admin");

  const avatarInitial = (
    user?.first_name?.trim()?.[0] ||
    user?.last_name?.trim()?.[0] ||
    user?.email?.trim()?.[0] ||
    "A"
  ).toUpperCase();

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
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [formCategory, setFormCategory] = useState<string>("figures");
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<any | null>(null);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [isAddSubCategoryOpen, setIsAddSubCategoryOpen] = useState(false);
  const [selectedParentCatId, setSelectedParentCatId] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // Category Icon File Upload State
  const [categoryIconFile, setCategoryIconFile] = useState<File | null>(null);
  const [categoryIconPreviewUrl, setCategoryIconPreviewUrl] = useState<string | null>(null);

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

  const formatOrderDate = (dateStr?: string) => {
    if (!dateStr) return { date: "—", time: "" };
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return { date: dateStr, time: "" };
      const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
      return { date, time };
    } catch {
      return { date: dateStr, time: "" };
    }
  };

  const formatOrderRelativeTime = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      const diffSecs = Math.floor((Date.now() - d.getTime()) / 1000);
      if (diffSecs < 0) return "Just now";
      if (diffSecs < 60) return "Just now";
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)} min ago`;
      if (diffSecs < 86400) {
        const hours = Math.floor(diffSecs / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      }
      if (diffSecs < 604800) {
        const days = Math.floor(diffSecs / 86400);
        return `${days} day${days > 1 ? "s" : ""} ago`;
      }
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  const getOrderAvatarBg = (initial: string) => {
    const charCode = initial.charCodeAt(0) || 0;
    const colors = [
      "bg-[#EFE9FF] text-[#7B5CFF]",
      "bg-[#FFF1F4] text-[#FF4D6D]",
      "bg-[#E3F0FF] text-[#3B82F6]",
      "bg-[#E7F8F0] text-[#2ECC8F]",
      "bg-[#FFF4D6] text-[#C08A00]",
    ];
    return colors[charCode % colors.length];
  };

  const copyTracking = (tracking: string) => {
    if (!tracking) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tracking);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
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
  // Category Icon & Modal Handlers
  // -------------------------------------------------------------
  const openAddCategoryModal = () => {
    setCategoryIconFile(null);
    setCategoryIconPreviewUrl(null);
    setIsAddCategoryOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setCategoryIconFile(null);
    setCategoryIconPreviewUrl(cat.category_icon || cat.categoryIcon || null);
    setEditingCategory(cat);
  };

  const handleCategoryIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategoryIconFile(file);
      setCategoryIconPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeCategoryIconFile = () => {
    setCategoryIconFile(null);
    setCategoryIconPreviewUrl(null);
  };

  // -------------------------------------------------------------
  // Category / Subcategory Creation Handlers
  // -------------------------------------------------------------
  const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const id = ((formData.get("id") as string) || (formData.get("label") as string).toLowerCase().replace(/\s+/g, "-")).trim();
    const label = formData.get("label") as string;
    const color = (formData.get("color") as string) || "#FF4D6D";
    const icon_type = formData.get("icon_type") as string;

    const data = new FormData();
    data.append("id", id);
    data.append("label", label);
    data.append("color", color);
    data.append("icon_type", icon_type);
    data.append("featured", "true");
    if (categoryIconFile) {
      data.append("category_icon_file", categoryIconFile);
    }

    const res = await createCategory(data);
    if (res.success) {
      showToast(`✓ Category "${label}" added to taxonomy!`);
      setIsAddCategoryOpen(false);
      setCategoryIconFile(null);
      setCategoryIconPreviewUrl(null);
      fetchData();
    } else {
      alert("Error adding category.");
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const label = formData.get("label") as string;
    const color = (formData.get("color") as string) || "#FF4D6D";
    const icon_type = formData.get("icon_type") as string;

    const data = new FormData();
    data.append("label", label);
    data.append("color", color);
    data.append("icon_type", icon_type);
    if (categoryIconFile) {
      data.append("category_icon_file", categoryIconFile);
    }

    const res = await updateCategory(editingCategory.id, data);

    if (res.success) {
      showToast(`✓ Category "${label}" updated successfully!`);
      setEditingCategory(null);
      setCategoryIconFile(null);
      setCategoryIconPreviewUrl(null);
      fetchData();
    } else {
      alert("Error updating category.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    const res = await deleteCategory(deletingCategory.id);
    if (res.success) {
      showToast(`✓ Category "${deletingCategory.label}" deleted.`);
      setDeletingCategory(null);
      fetchData();
    } else {
      alert("Error deleting category.");
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
    <div className="h-screen w-full overflow-hidden bg-[#F6F2FC] text-[#171136] flex font-[family-name:var(--font-sans)]">
      {/* ------------------------------------------------------------- */}
      {/* Toast Notification Banner */}
      {/* ------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#171136] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00E599] animate-ping" />
          <span className="text-xs font-bold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/60 hover:text-white ml-2 cursor-pointer">
            <IconClose className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* LEFT SIDEBAR MENU (Matches brickverse-admin-dashboard.svg) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`h-full bg-gradient-to-b from-[#1C1440] to-[#120C2E] border-r border-[#2E2760] flex flex-col justify-between shrink-0 select-none z-30 overflow-y-auto transition-all duration-300 ${
          sidebarCollapsed ? "w-[72px]" : "w-[240px] lg:w-[260px]"
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#2E2760]">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              {/* Brickverse Logo Icon matching SVG */}
              <div className="relative w-9 h-8 rounded-xl bg-[#FF4D6D] flex flex-col items-center justify-center shrink-0 shadow-md shadow-[#FF4D6D]/30">
                <span className="absolute -top-1 left-1.5 w-2.5 h-1.5 rounded-xs bg-[#FF4D6D]" />
                <span className="absolute -top-1 right-1.5 w-2.5 h-1.5 rounded-xs bg-[#FF4D6D]" />
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-white" />
                  <span className="w-1 h-1 rounded-full bg-white" />
                </div>
                <div className="w-2.5 h-0.5 border-b-2 border-white rounded-full mt-0.5" />
              </div>

              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                    Brickverse
                  </span>
                  <span className="text-[10px] font-medium text-[#B9B2DA] tracking-wide">
                    figures · bricks · code kits
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label="Toggle Sidebar"
              className="w-7 h-7 rounded-lg bg-[#2A2159] hover:bg-[#352b6d] flex items-center justify-center text-[#A79FD1] hover:text-white transition-colors shrink-0 cursor-pointer text-xs"
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-2">
            {/* 1) Dashboard */}
            <button
              onClick={() => navigateTo("dashboard")}
              title="Dashboard"
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-[13.5px] transition-all cursor-pointer relative ${
                activeNav === "dashboard"
                  ? "bg-[#2A2159] text-white before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:rounded-r-sm before:bg-[#FF4D6D]"
                  : "text-[#C7C0E8] hover:bg-[#2A2159]/60 hover:text-white"
              }`}
            >
              <IconDashboard className={`w-4 h-4 shrink-0 ${activeNav === "dashboard" ? "text-white" : "text-[#A79FD1]"}`} />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </button>

            {/* 2) Products Accordion */}
            <div className="space-y-1">
              <button
                onClick={() => setProductsMenuOpen(!productsMenuOpen)}
                title="Products"
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-[13.5px] transition-all cursor-pointer relative ${
                  activeNav.startsWith("products")
                    ? "bg-[#2A2159] text-white before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:rounded-r-sm before:bg-[#FF4D6D]"
                    : "text-[#C7C0E8] hover:bg-[#2A2159]/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconBox className={`w-4 h-4 shrink-0 ${activeNav.startsWith("products") ? "text-white" : "text-[#A79FD1]"}`} />
                  {!sidebarCollapsed && <span>Products</span>}
                </div>
                {!sidebarCollapsed && (
                  <IconChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      productsMenuOpen ? "rotate-0 text-white" : "-rotate-90 text-[#A79FD1]"
                    }`}
                  />
                )}
              </button>

              {productsMenuOpen && !sidebarCollapsed && (
                <div className="pl-8 pr-1 py-1 space-y-1">
                  <button
                    onClick={() => navigateTo("products-all")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeNav === "products-all"
                        ? "text-[#FF4D6D] font-extrabold bg-[#2A2159]"
                        : "text-[#A79FD1] hover:text-white hover:bg-[#2A2159]/40"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>All Products</span>
                  </button>
                  <button
                    onClick={() => navigateTo("products-taxonomy")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeNav === "products-taxonomy"
                        ? "text-[#FF4D6D] font-extrabold bg-[#2A2159]"
                        : "text-[#A79FD1] hover:text-white hover:bg-[#2A2159]/40"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>Category as taxonomy</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3) Orders Accordion */}
            <div className="space-y-1">
              <button
                onClick={() => setOrdersMenuOpen(!ordersMenuOpen)}
                title="Orders"
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-[13.5px] transition-all cursor-pointer relative ${
                  activeNav.startsWith("orders")
                    ? "bg-[#2A2159] text-white before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:rounded-r-sm before:bg-[#FF4D6D]"
                    : "text-[#C7C0E8] hover:bg-[#2A2159]/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconOrders className={`w-4 h-4 shrink-0 ${activeNav.startsWith("orders") ? "text-white" : "text-[#A79FD1]"}`} />
                  {!sidebarCollapsed && <span>Orders</span>}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#FF4D6D] text-white text-[10.5px] font-extrabold">
                      {orders.length || 12}
                    </span>
                    <IconChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        ordersMenuOpen ? "rotate-0 text-white" : "-rotate-90 text-[#A79FD1]"
                      }`}
                    />
                  </div>
                )}
              </button>

              {ordersMenuOpen && !sidebarCollapsed && (
                <div className="pl-8 pr-1 py-1 space-y-1">
                  <button
                    onClick={() => navigateTo("orders-all")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeNav === "orders-all"
                        ? "text-[#FF4D6D] font-extrabold bg-[#2A2159]"
                        : "text-[#A79FD1] hover:text-white hover:bg-[#2A2159]/40"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>All Orders</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4) Users Accordion */}
            <div className="space-y-1">
              <button
                onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                title="Users"
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-[13.5px] transition-all cursor-pointer relative ${
                  activeNav.startsWith("users")
                    ? "bg-[#2A2159] text-white before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-1 before:rounded-r-sm before:bg-[#FF4D6D]"
                    : "text-[#C7C0E8] hover:bg-[#2A2159]/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconUsers className={`w-4 h-4 shrink-0 ${activeNav.startsWith("users") ? "text-white" : "text-[#A79FD1]"}`} />
                  {!sidebarCollapsed && <span>Users</span>}
                </div>
                {!sidebarCollapsed && (
                  <IconChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      usersMenuOpen ? "rotate-0 text-white" : "-rotate-90 text-[#A79FD1]"
                    }`}
                  />
                )}
              </button>

              {usersMenuOpen && !sidebarCollapsed && (
                <div className="pl-8 pr-1 py-1 space-y-1">
                  <button
                    onClick={() => navigateTo("users-all")}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                      activeNav === "users-all"
                        ? "text-[#FF4D6D] font-extrabold bg-[#2A2159]"
                        : "text-[#A79FD1] hover:text-white hover:bg-[#2A2159]/40"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    <span>All Users</span>
                  </button>
                </div>
              )}
            </div>

            {/* STORE Section (Matching SVG) */}
            <div className="pt-4 border-t border-[#2E2760] space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 text-[10.5px] font-bold text-[#7A72A8] uppercase tracking-wider mb-2">
                  STORE
                </p>
              )}
              <Link
                href="/"
                target="_blank"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#C7C0E8] hover:text-white hover:bg-[#2A2159]/60 transition-colors cursor-pointer"
              >
                <IconStore className="w-4 h-4 text-[#A79FD1]" />
                {!sidebarCollapsed && <span>View storefront</span>}
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#C7C0E8] hover:text-white hover:bg-[#2A2159]/60 transition-colors cursor-pointer"
              >
                <IconLogOut className="w-4 h-4 text-[#A79FD1]" />
                {!sidebarCollapsed && <span>Log out</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card at bottom (Matching SVG) */}
        <div className="p-3 border-t border-[#2E2760]">
          <div className="bg-[#241D54] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#FF4D6D] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                {avatarInitial}
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-xs text-white truncate">
                    {userFullName}
                  </span>
                  <span className="text-[11px] font-medium text-[#A79FD1] truncate">
                    Store admin
                  </span>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-[#A79FD1] hover:text-white p-1 transition-colors cursor-pointer"
                title="Account menu"
              >
                <IconDots className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        {/* Top Header Bar (Matching brickverse-admin-dashboard.svg) */}
        <header className="bg-white border-b border-[#EAE3F7] sticky top-0 z-20 px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4 shrink-0">
          {/* Search Bar matching SVG */}
          <div className="relative w-full max-w-sm sm:max-w-md">
            <IconSearch className="w-4 h-4 text-[#736E9B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search orders, products, customers…"
              value={searchGlobal}
              onChange={(e) => setSearchGlobal(e.target.value)}
              className="w-full bg-[#F6F1FF] border border-[#EAE3F7] rounded-full pl-10 pr-4 py-2.5 text-xs text-[#171136] placeholder-[#736E9B] focus:outline-none focus:border-[#FF4D6D] transition-all"
            />
            {searchGlobal && (
              <button
                onClick={() => setSearchGlobal("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <IconClose className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Notification Bell */}
            <button
              title="Notifications"
              onClick={() => showToast("🔔 All systems operational. 0 alerts.")}
              className="w-9 h-9 rounded-full bg-[#F6F1FF] border border-[#EAE3F7] flex items-center justify-center text-[#3B3468] hover:bg-[#EFE9FF] transition-all cursor-pointer relative"
            >
              <IconBell className="w-4 h-4" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] absolute top-1.5 right-1.5 border-2 border-white" />
            </button>

            {/* Messages / Mail */}
            <button
              title="Messages"
              onClick={() => showToast("✉️ 0 unread customer messages.")}
              className="w-9 h-9 rounded-full bg-[#F6F1FF] border border-[#EAE3F7] flex items-center justify-center text-[#3B3468] hover:bg-[#EFE9FF] transition-all cursor-pointer relative"
            >
              <IconMail className="w-4 h-4" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#13BFC9] absolute top-1.5 right-1.5 border-2 border-white" />
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-[#EAE3F7] mx-1 hidden sm:block" />

            {/* Admin Avatar & Dropdown Pill */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1 sm:pr-3 rounded-full hover:bg-[#F6F1FF] border border-transparent hover:border-[#EAE3F7] transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center font-extrabold text-xs shrink-0">
                  {avatarInitial}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="font-bold text-xs text-[#171136] leading-tight truncate">
                    {userFullName}
                  </span>
                  <span className="text-[10px] font-medium text-[#736E9B] leading-tight">
                    Store admin
                  </span>
                </div>
                <IconChevronDown className="w-3 h-3 text-[#736E9B] hidden sm:block" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-[#EAE3F7] p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-2 border-b border-[#F0EBF8] mb-1.5">
                    <p className="font-bold text-xs text-[#171136]">
                      {userFullName}
                    </p>
                    <p className="text-[10.5px] text-[#736E9B] truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/"
                    target="_blank"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#3B3468] hover:bg-[#F6F1FF] transition-colors"
                  >
                    <IconExternalLink className="w-3.5 h-3.5 text-[#736E9B]" />
                    <span>Storefront</span>
                  </Link>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left"
                  >
                    <IconLogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Main Workspace Views */}
        <main className="p-4 sm:p-8 flex-1">
          {/* ========================================================= */}
          {/* 1) VIEW: DASHBOARD (Matches brickverse-admin-dashboard.svg) */}
          {/* ========================================================= */}
          {activeNav === "dashboard" && (
            <div className="space-y-6 max-w-[1400px]">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[28px] text-[#171136] tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-xs sm:text-[13.5px] text-[#736E9B] mt-0.5">
                    Welcome back, {userFirstName}. Here&apos;s what&apos;s happening with your store today.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="px-4 py-2.5 rounded-full bg-white border border-[#EAE3F7] flex items-center gap-2 text-xs font-semibold text-[#171136] shadow-xs cursor-pointer">
                    <IconChevronRight className="w-3 h-3 text-[#736E9B] rotate-90" />
                    <span>Last 7 days</span>
                  </div>

                  <button
                    onClick={() => showToast("📊 Performance export downloaded.")}
                    className="px-5 py-2.5 rounded-full bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <IconDownload className="w-3.5 h-3.5" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* 4 Major KPI Cards (Matching SVG) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. Total revenue */}
                <div className="bg-white rounded-[20px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#FF4D6D] to-[#FF7A93] flex items-center justify-center text-white shadow-md shadow-[#FF4D6D]/20">
                      <IconWallet className="w-5 h-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#736E9B]">
                      Total revenue
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block font-mono">
                      ৳{Number(stats.total_revenue || 48920.50).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#E7F8F0] text-[#2ECC8F] text-[11px] font-extrabold flex items-center gap-1">
                        <IconTrendingUp className="w-3 h-3" />
                        +12.4%
                      </span>
                      <span className="text-[10.5px] text-[#736E9B]">vs last week</span>
                    </div>
                  </div>
                </div>

                {/* 2. Orders */}
                <div className="bg-white rounded-[20px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#6B3BF7] to-[#B14BE8] flex items-center justify-center text-white shadow-md shadow-[#6B3BF7]/20">
                      <IconBag className="w-5 h-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#736E9B]">
                      Orders
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block">
                      {stats.total_orders ? stats.total_orders.toLocaleString("en-US") : "1,284"}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#E7F8F0] text-[#2ECC8F] text-[11px] font-extrabold flex items-center gap-1">
                        <IconTrendingUp className="w-3 h-3" />
                        +8.1%
                      </span>
                      <span className="text-[10.5px] text-[#736E9B]">vs last week</span>
                    </div>
                  </div>
                </div>

                {/* 3. New customers */}
                <div className="bg-white rounded-[20px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#13BFC9] to-[#57E0C9] flex items-center justify-center text-white shadow-md shadow-[#13BFC9]/20">
                      <IconUsers className="w-5 h-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#736E9B]">
                      New customers
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block">
                      {stats.total_customers ? stats.total_customers.toLocaleString("en-US") : "382"}
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#E7F8F0] text-[#2ECC8F] text-[11px] font-extrabold flex items-center gap-1">
                        <IconTrendingUp className="w-3 h-3" />
                        +3.2%
                      </span>
                      <span className="text-[10.5px] text-[#736E9B]">vs last week</span>
                    </div>
                  </div>
                </div>

                {/* 4. Conversion rate */}
                <div className="bg-white rounded-[20px] p-5 border border-[#EAE3F7] shadow-[0_4px_20px_rgba(23,17,54,0.04)] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#FF9F43] to-[#FFC93C] flex items-center justify-center text-white shadow-md shadow-[#FF9F43]/20">
                      <IconTarget className="w-5 h-5" />
                    </div>
                    <span className="text-[11.5px] font-semibold text-[#736E9B]">
                      Conversion rate
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-[25px] text-[#171136] tracking-tight block">
                      3.8%
                    </span>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#FFE6EA] text-[#D2455C] text-[11px] font-extrabold flex items-center gap-1">
                        <IconTrendingDown className="w-3 h-3" />
                        0.6%
                      </span>
                      <span className="text-[10.5px] text-[#736E9B]">vs last week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Row Grid: Sales Overview (Left) + Top Selling Products (Right) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sales Overview Card */}
                <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-[22px] border border-[#EAE3F7] p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-[16.5px] text-[#171136]">
                          Sales overview
                        </h2>
                        <p className="text-xs text-[#736E9B] mt-0.5">
                          Revenue trend for the last 7 days
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-[11.5px] font-semibold">
                        <span className="flex items-center gap-1.5 text-[#3B3468]">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D]" />
                          This week
                        </span>
                        <span className="flex items-center gap-1.5 text-[#736E9B]">
                          <span className="w-3.5 h-0.5 rounded-full bg-[#D8D2EE]" />
                          Last week
                        </span>
                      </div>
                    </div>

                    {/* SVG Area Chart matching brickverse-admin-dashboard.svg */}
                    <div className="w-full relative h-[250px] select-none">
                      <svg viewBox="0 0 650 240" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGradientFillAdmin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#FF4D6D" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#FF4D6D" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        <line x1="25" y1="190" x2="630" y2="190" stroke="#F0EBFA" strokeWidth="1.2" />
                        <text x="16" y="194" fontFamily="inherit" fontSize="10" fontWeight="500" fill="#736E9B" textAnchor="end">0k</text>

                        <line x1="25" y1="148" x2="630" y2="148" stroke="#F0EBFA" strokeWidth="1.2" />
                        <text x="16" y="152" fontFamily="inherit" fontSize="10" fontWeight="500" fill="#736E9B" textAnchor="end">6k</text>

                        <line x1="25" y1="106" x2="630" y2="106" stroke="#F0EBFA" strokeWidth="1.2" />
                        <text x="16" y="110" fontFamily="inherit" fontSize="10" fontWeight="500" fill="#736E9B" textAnchor="end">12k</text>

                        <line x1="25" y1="64" x2="630" y2="64" stroke="#F0EBFA" strokeWidth="1.2" />
                        <text x="16" y="68" fontFamily="inherit" fontSize="10" fontWeight="500" fill="#736E9B" textAnchor="end">18k</text>

                        <line x1="25" y1="22" x2="630" y2="22" stroke="#F0EBFA" strokeWidth="1.2" />
                        <text x="16" y="26" fontFamily="inherit" fontSize="10" fontWeight="500" fill="#736E9B" textAnchor="end">24k</text>

                        {/* Gradient Area Fill */}
                        <path
                          d="M 30 120 L 130 92 L 230 106 L 330 65 L 430 78 L 530 40 L 630 70 L 630 190 L 30 190 Z"
                          fill="url(#chartGradientFillAdmin)"
                        />

                        {/* Last Week muted path */}
                        <path
                          d="M 30 128 L 130 118 L 230 114 L 330 102 L 430 110 L 530 88 L 630 92"
                          fill="none"
                          stroke="#D8D2EE"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* This Week active path */}
                        <path
                          d="M 30 120 L 130 92 L 230 106 L 330 65 L 430 78 L 530 40 L 630 70"
                          fill="none"
                          stroke="#FF4D6D"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Data Points */}
                        {[
                          { x: 30, y: 120, day: "Mon" },
                          { x: 130, y: 92, day: "Tue" },
                          { x: 230, y: 106, day: "Wed" },
                          { x: 330, y: 65, day: "Thu" },
                          { x: 430, y: 78, day: "Fri" },
                          { x: 530, y: 40, day: "Sat", active: true },
                          { x: 630, y: 70, day: "Sun" },
                        ].map((pt, i) => (
                          <g key={i}>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="4.5"
                              fill="#FFFFFF"
                              stroke="#FF4D6D"
                              strokeWidth="3"
                              className="transition-all hover:scale-125 cursor-pointer"
                            />
                            <text
                              x={pt.x}
                              y="214"
                              fontFamily="inherit"
                              fontSize="11"
                              fontWeight="600"
                              fill="#736E9B"
                              textAnchor="middle"
                            >
                              {pt.day}
                            </text>
                          </g>
                        ))}

                        {/* Active Saturday Indicator & Tooltip Badge */}
                        <line x1="530" y1="36" x2="530" y2="190" stroke="#FF4D6D" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
                        <rect x="500" y="8" width="60" height="26" rx="8" fill="#171136" />
                        <text x="530" y="25" fontFamily="inherit" fontSize="11" fontWeight="800" fill="#FFFFFF" textAnchor="middle">
                          ৳8.8k
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Top Selling Products Card */}
                <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-[22px] border border-[#EAE3F7] p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-[16.5px] text-[#171136]">
                        Top selling products
                      </h2>
                      <button
                        onClick={() => navigateTo("products-all")}
                        className="text-xs font-bold text-[#FF4D6D] hover:underline cursor-pointer"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        {
                          name: "Neo Samurai",
                          category: "Anime figures",
                          sold: "312 sold",
                          revenue: "৳10,918",
                          percent: 92,
                          bg: "#FFEAF0",
                          image: "/images/figure-samurai-red.svg",
                        },
                        {
                          name: "Galaxy Station",
                          category: "Bricks & sets",
                          sold: "248 sold",
                          revenue: "৳19,837",
                          percent: 74,
                          bg: "#E4F7F8",
                          image: "/images/bricks-stack-sunny.svg",
                        },
                        {
                          name: "Robo Coder",
                          category: "Coding kits",
                          sold: "190 sold",
                          revenue: "৳16,910",
                          percent: 58,
                          bg: "#FFF4DA",
                          image: "/images/robot-yellow.svg",
                        },
                        {
                          name: "Sky Ninja",
                          category: "Anime figures",
                          sold: "164 sold",
                          revenue: "৳4,838",
                          percent: 45,
                          bg: "#EFE9FF",
                          image: "/images/figure-ninja-gold.svg",
                        },
                      ].map((prod, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center p-1 shrink-0 border border-black/5"
                              style={{ backgroundColor: prod.bg }}
                            >
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-[family-name:var(--font-display)] font-extrabold text-[13px] text-[#171136] truncate">
                                  {prod.name}
                                </h4>
                                <span className="font-[family-name:var(--font-display)] font-extrabold text-[12.5px] text-[#171136] font-mono shrink-0 ml-2">
                                  {prod.revenue}
                                </span>
                              </div>
                              <p className="text-[10.5px] text-[#736E9B]">
                                {prod.category} · {prod.sold}
                              </p>
                            </div>
                          </div>
                          {/* Progress track & fill bar */}
                          <div className="w-full bg-[#F0EBFA] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#FF4D6D] transition-all duration-500"
                              style={{ width: `${prod.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders Card */}
              <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-6 shadow-[0_4px_25px_rgba(23,17,54,0.04)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-[16.5px] text-[#171136]">
                    Recent orders
                  </h2>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        setOrdersMenuOpen(true);
                        setActiveNav("orders-all");
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#F6F1FF] border border-[#EAE3F7] text-xs font-semibold text-[#3B3468] hover:bg-[#EFE9FF] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <IconFilter className="w-3.5 h-3.5 text-[#736E9B]" />
                      <span>Filter</span>
                    </button>
                    <button
                      onClick={() => {
                        setOrdersMenuOpen(true);
                        setActiveNav("orders-all");
                      }}
                      className="px-4 py-1.5 rounded-full bg-[#171136] hover:bg-[#251c4a] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      View all
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE3F7] text-[10.5px] font-bold text-[#736E9B] uppercase tracking-wider">
                        <th className="pb-3 pr-4">ORDER</th>
                        <th className="pb-3 px-4">CUSTOMER</th>
                        <th className="pb-3 px-4">ITEMS</th>
                        <th className="pb-3 px-4">DATE</th>
                        <th className="pb-3 px-4">STATUS</th>
                        <th className="pb-3 px-4 text-right">TOTAL</th>
                        <th className="pb-3 pl-4 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5F1FB]">
                      {(orders.length > 0 ? orders.slice(0, 6) : [
                        { id: 10482, order_number: "BV-10482", customer_name: "Priya Menon", status: "delivered", total_amount: "94.98", created_at: "2026-09-08", items_preview: "Neo Samurai + 1 more" },
                        { id: 10481, order_number: "BV-10481", customer_name: "Daniel Cho", status: "processing", total_amount: "79.99", created_at: "2026-09-08", items_preview: "Galaxy Station" },
                        { id: 10480, order_number: "BV-10480", customer_name: "Fahim Rahman", status: "shipped", total_amount: "89.00", created_at: "2026-09-07", items_preview: "Robo Coder" },
                        { id: 10479, order_number: "BV-10479", customer_name: "Ayesha Khan", status: "delivered", total_amount: "146.50", created_at: "2026-09-07", items_preview: "Sky Ninja + 2 more" },
                        { id: 10478, order_number: "BV-10478", customer_name: "Marcus Webb", status: "cancelled", total_amount: "49.99", created_at: "2026-09-06", items_preview: "Circuit Lab" },
                        { id: 10477, order_number: "BV-10477", customer_name: "Nadia Islam", status: "delivered", total_amount: "18.00", created_at: "2026-09-06", items_preview: "Ronin Base" },
                      ]).map((o: any) => {
                        const statusColorsMap: Record<string, { bg: string; text: string; dot: string; label: string }> = {
                          delivered: { bg: "#E7F8F0", text: "#2ECC8F", dot: "#2ECC8F", label: "Delivered" },
                          processing: { bg: "#FFF4D6", text: "#C08A00", dot: "#C08A00", label: "Processing" },
                          shipped: { bg: "#E7EDFF", text: "#3667D6", dot: "#3667D6", label: "Shipped" },
                          cancelled: { bg: "#FFE6EA", text: "#D2455C", dot: "#D2455C", label: "Cancelled" },
                        };
                        const statusColors = statusColorsMap[String(o.status || "").toLowerCase()] || { bg: "#FFF4D6", text: "#C08A00", dot: "#C08A00", label: o.status || "Processing" };

                        return (
                          <tr key={o.id} className="hover:bg-[#F9F7FD] transition-colors">
                            <td className="py-4 pr-4">
                              <span className="font-[family-name:var(--font-display)] font-extrabold text-[12.5px] text-[#FF4D6D]">
                                #{o.order_number || `BV-${o.id}`}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center font-extrabold text-[11px] shrink-0">
                                  {(o.customer_name ? o.customer_name[0] : "C").toUpperCase()}
                                </div>
                                <span className="font-semibold text-xs text-[#171136]">
                                  {o.customer_name || "Valued Customer"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-[#3B3468] font-medium text-xs">
                              {o.items_preview || (o.items && o.items[0]?.name ? `${o.items[0].name}${o.items.length > 1 ? ` + ${o.items.length - 1} more` : ""}` : "Collector Items")}
                            </td>
                            <td className="py-4 px-4 text-[#736E9B] text-xs">
                              {o.created_at ? new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Sep 8, 2026"}
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                                style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColors.dot }} />
                                {statusColors.label}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-[family-name:var(--font-display)] font-extrabold text-[13.5px] text-[#171136] font-mono">
                                ৳{Number(o.total_amount || 0).toFixed(2)}
                              </span>
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <button
                                onClick={() => setSelectedOrder(o)}
                                className="text-xs font-bold text-[#FF4D6D] hover:underline cursor-pointer"
                              >
                                Details ↗
                              </button>
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
                    onClick={openAddCategoryModal}
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
                      {/* Category Header with Icon & Edit Button */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border border-[#EAE3F7]/80"
                            style={{ backgroundColor: `${cat.color || "#FF4D6D"}20` }}
                          >
                            <CategoryGlyph id={cat.id} color={cat.color || "#FF4D6D"} icon={cat.category_icon || cat.categoryIcon || cat.icon_type} />
                          </span>
                          <div>
                            <h2 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136] leading-tight">
                              {cat.label}
                            </h2>
                            <span className="text-[10.5px] text-[#8A84A6] font-mono">{cat.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F6F1FF] text-[#7B5CFF]">
                            {cat.subcategories?.length || 0} subs
                          </span>
                          <button
                            onClick={() => openEditCategoryModal(cat)}
                            className="w-7 h-7 rounded-lg bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Parent Category & Icon"
                          >
                            <IconEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingCategory(cat)}
                            className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Parent Category"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Category Icon Path Badge if defined */}
                      {(cat.category_icon || cat.categoryIcon) && (
                        <div className="mb-3 px-2.5 py-1 rounded-lg bg-[#FAF8FE] border border-[#EAE3F7] text-[10px] font-mono text-[#736E9B] truncate flex items-center gap-1.5">
                          <span className="font-bold text-[#171136]">Icon:</span>
                          <span className="truncate">{cat.category_icon || cat.categoryIcon}</span>
                        </div>
                      )}

                      {/* Nested Subcategories Pill List */}
                      <div className="space-y-1.5 mt-2 pt-2.5 border-t border-[#F0EBF8]">
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

                    {/* Quick Action Buttons */}
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

                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="text-xs font-bold text-[#7B5CFF] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <IconEdit className="w-3 h-3" />
                        <span>Edit Category</span>
                      </button>
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

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Orders Card */}
                <div className="bg-white rounded-[18px] border border-[#EAE3F7] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-[13px] bg-[#FFF1F4] flex items-center justify-center shrink-0">
                    <IconBag className="w-5 h-5 text-[#FF4D6D]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#736E9B]">Total Orders</p>
                    <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                      {orders.length}
                    </p>
                  </div>
                </div>

                {/* Processing Card */}
                <div className="bg-white rounded-[18px] border border-[#EAE3F7] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-[13px] bg-[#FFF4D6] flex items-center justify-center shrink-0">
                    <IconRefresh className="w-5 h-5 text-[#C08A00]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#736E9B]">Processing</p>
                    <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                      {orders.filter((o) => o.status === "processing").length}
                    </p>
                  </div>
                </div>

                {/* Shipped Card */}
                <div className="bg-white rounded-[18px] border border-[#EAE3F7] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-[13px] bg-[#E3F0FF] flex items-center justify-center shrink-0">
                    <IconTruck className="w-5 h-5 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#736E9B]">Shipped</p>
                    <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                      {orders.filter((o) => o.status === "shipped").length}
                    </p>
                  </div>
                </div>

                {/* Delivered Card */}
                <div className="bg-white rounded-[18px] border border-[#EAE3F7] p-4 flex items-center gap-3.5 shadow-2xs">
                  <div className="w-11 h-11 rounded-[13px] bg-[#E7F8F0] flex items-center justify-center shrink-0">
                    <IconCheck className="w-5 h-5 text-[#2ECC8F]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-[#736E9B]">Delivered</p>
                    <p className="font-[family-name:var(--font-display)] font-extrabold text-2xl text-[#171136]">
                      {orders.filter((o) => o.status === "delivered").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex border-b border-[#EAE3F7] gap-2 overflow-x-auto whitespace-nowrap">
                {[
                  { id: "all", label: `All Orders (${orders.length})` },
                  { id: "pending", label: "Pending" },
                  { id: "processing", label: "Processing" },
                  { id: "shipped", label: "Shipped" },
                  { id: "delivered", label: "Delivered" },
                  { id: "cancelled", label: "Cancelled" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`pb-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all capitalize cursor-pointer ${
                      orderStatusFilter === st.id
                        ? "border-[#FF4D6D] text-[#FF4D6D]"
                        : "border-transparent text-[#736E9B] hover:text-[#171136]"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Orders Data Table */}
              <div className="bg-white rounded-[22px] border border-[#EAE3F7] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#EAE3F7] text-[#8A84A6] bg-[#FDFBFF]">
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px]">ORDER</th>
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px]">CUSTOMER</th>
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px]">ITEMS</th>
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px]">DATE</th>
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px]">STATUS</th>
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px]">TOTAL</th>
                        <th className="py-4 px-5 font-bold tracking-wider text-[10.5px] text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EBF8]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-sm text-[#736E9B]">
                            No orders found matching your filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((o) => {
                          const initial = (o.customer_name?.[0] || o.customer_email?.[0] || "O").toUpperCase();
                          const dateInfo = formatOrderDate(o.created_at);
                          const relTime = formatOrderRelativeTime(o.created_at);

                          return (
                            <tr key={o.id} className="hover:bg-[#F8F6FD] transition-colors">
                              {/* ORDER */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <p className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136]">
                                  {o.order_number}
                                </p>
                                {relTime && (
                                  <p className="text-[10px] text-[#8A84A6] font-medium mt-0.5">{relTime}</p>
                                )}
                              </td>

                              {/* CUSTOMER */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-9 h-9 rounded-full ${getOrderAvatarBg(
                                      initial
                                    )} font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs`}
                                  >
                                    {initial}
                                  </div>
                                  <div>
                                    <p className="font-bold text-[#171136] text-sm leading-snug">
                                      {o.customer_name || "Guest Customer"}
                                    </p>
                                    <p className="text-[11px] text-[#736E9B]">{o.customer_email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* ITEMS */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <span className="font-semibold text-[#171136] text-xs">
                                  {o.items?.length || 1} {o.items?.length === 1 ? "item" : "items"}
                                </span>
                              </td>

                              {/* DATE */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <p className="font-medium text-[#171136] text-xs">{dateInfo.date}</p>
                                {dateInfo.time && (
                                  <p className="text-[10px] text-[#8A84A6] mt-0.5">{dateInfo.time}</p>
                                )}
                              </td>

                              {/* STATUS */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <div className="relative inline-flex items-center">
                                  <select
                                    value={o.status}
                                    onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                                    className={`appearance-none pl-6 pr-6 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border outline-none ${
                                      o.status === "delivered"
                                        ? "bg-[#E7F8F0] text-[#2ECC8F] border-[#2ECC8F]/30"
                                        : o.status === "shipped"
                                        ? "bg-[#E3F0FF] text-[#3B82F6] border-[#3B82F6]/30"
                                        : o.status === "cancelled"
                                        ? "bg-[#FFF1F4] text-[#FF4D6D] border-[#FF4D6D]/30"
                                        : "bg-[#FFF4D6] text-[#C08A00] border-[#C08A00]/30"
                                    }`}
                                  >
                                    <option value="pending" className="bg-white text-[#171136]">Pending</option>
                                    <option value="processing" className="bg-white text-[#171136]">Processing</option>
                                    <option value="shipped" className="bg-white text-[#171136]">Shipped</option>
                                    <option value="delivered" className="bg-white text-[#171136]">Delivered</option>
                                    <option value="cancelled" className="bg-white text-[#171136]">Cancelled</option>
                                  </select>
                                  <span
                                    className={`absolute left-2.5 w-2 h-2 rounded-full pointer-events-none ${
                                      o.status === "delivered"
                                        ? "bg-[#2ECC8F]"
                                        : o.status === "shipped"
                                        ? "bg-[#3B82F6]"
                                        : o.status === "cancelled"
                                        ? "bg-[#FF4D6D]"
                                        : "bg-[#C08A00]"
                                    }`}
                                  />
                                  <span className="absolute right-2 pointer-events-none text-[8px] opacity-60">▼</span>
                                </div>
                              </td>

                              {/* TOTAL */}
                              <td className="py-4 px-5 whitespace-nowrap">
                                <span
                                  className={`font-extrabold font-[family-name:var(--font-display)] text-sm text-[#171136] ${
                                    o.status === "cancelled" ? "opacity-40 line-through" : ""
                                  }`}
                                >
                                  ৳{Number(o.total_amount || 0).toLocaleString()}
                                </span>
                              </td>

                              {/* ACTIONS */}
                              <td className="py-4 px-5 whitespace-nowrap text-right">
                                <div className="inline-flex items-center gap-2 justify-end">
                                  <button
                                    onClick={() => setSelectedOrder(o)}
                                    className="px-3.5 py-1.5 bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] font-bold text-xs rounded-xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs"
                                  >
                                    View ↗
                                  </button>
                                  <button
                                    onClick={() => setSelectedOrder(o)}
                                    className="p-1.5 bg-[#FFF1F4] hover:bg-[#FFE4EA] text-[#FF4D6D] rounded-xl transition-all cursor-pointer"
                                    title="Order Details"
                                  >
                                    <IconDots className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
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
                  <label className="font-bold text-[#171136] block mb-1">Fallback Icon Type</label>
                  <select
                    name="icon_type"
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="figure">Figure</option>
                    <option value="toon">Cartoon</option>
                    <option value="brick">Bricks</option>
                    <option value="code">Coding</option>
                    <option value="robot">Robotics</option>
                    <option value="model">Model kits</option>
                    <option value="plush">Plush</option>
                    <option value="statue">Statue</option>
                  </select>
                </div>
              </div>

              {/* Category Icon File Upload Field */}
              <div>
                <label className="font-bold text-[#171136] block mb-1.5">Category Icon (Upload File)</label>
                {categoryIconPreviewUrl ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7]">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE3F7] p-2 flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={categoryIconPreviewUrl}
                        alt="Icon preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#171136] text-xs truncate">
                        {categoryIconFile ? categoryIconFile.name : "Category Icon"}
                      </p>
                      <p className="text-[10.5px] text-[#736E9B]">
                        {categoryIconFile ? `${(categoryIconFile.size / 1024).toFixed(1)} KB` : "Ready"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="px-2.5 py-1.5 rounded-xl bg-white border border-[#EAE3F7] text-[11px] font-bold text-[#7B5CFF] hover:bg-[#F6F1FF] cursor-pointer transition-all">
                        Change
                        <input
                          type="file"
                          accept="image/*,.svg"
                          onChange={handleCategoryIconFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeCategoryIconFile}
                        className="p-1.5 rounded-xl bg-white border border-[#EAE3F7] text-red-500 hover:bg-red-50 cursor-pointer transition-all"
                        title="Remove Icon"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#D9CEEE] hover:border-[#FF4D6D] bg-[#FAF8FE] hover:bg-[#FFF5F7] transition-all cursor-pointer group text-center">
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={handleCategoryIconFileChange}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-[#F0EBF8] group-hover:bg-[#FFE6EC] flex items-center justify-center text-[#7B5CFF] group-hover:text-[#FF4D6D] mb-1.5 transition-colors">
                      <IconPhoto className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-[#171136] text-xs">
                      Upload Category Icon
                    </p>
                    <p className="text-[10.5px] text-[#736E9B] mt-0.5">
                      Upload SVG, PNG, JPG, or WebP icon file
                    </p>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#F0EBF8]">
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
      {/* MODAL: EDIT PARENT CATEGORY (Includes Category Icon File Upload) */}
      {/* ============================================================= */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-xl text-[#171136]">
                  Edit Parent Category
                </h3>
                <p className="text-xs text-[#736E9B] font-mono">ID: {editingCategory.id}</p>
              </div>
              <button
                onClick={() => setEditingCategory(null)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#171136] cursor-pointer"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#171136] block mb-1">Category Label / Name</label>
                <input
                  name="label"
                  required
                  defaultValue={editingCategory.label}
                  className="w-full p-2.5 rounded-xl border border-[#EAE3F7] focus:outline-none focus:border-[#FF4D6D] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#171136] block mb-1">Accent Color</label>
                  <select
                    name="color"
                    defaultValue={editingCategory.color || "#FF4D6D"}
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="#FF4D6D">Pink (#FF4D6D)</option>
                    <option value="#7B5CFF">Purple (#7B5CFF)</option>
                    <option value="#13BFC9">Teal / Cyan (#13BFC9)</option>
                    <option value="#00B4D8">Blue (#00B4D8)</option>
                    <option value="#FFC93C">Gold (#FFC93C)</option>
                    <option value="#FF8A5B">Orange (#FF8A5B)</option>
                    <option value="#10B981">Green (#10B981)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#171136] block mb-1">Fallback Icon Type</label>
                  <select
                    name="icon_type"
                    defaultValue={editingCategory.icon_type || editingCategory.id}
                    className="w-full p-2.5 rounded-xl border border-[#EAE3F7] bg-white focus:outline-none focus:border-[#FF4D6D]"
                  >
                    <option value="figure">Figure</option>
                    <option value="brick">Bricks</option>
                    <option value="code">Coding</option>
                    <option value="toon">Cartoon</option>
                    <option value="robot">Robotics</option>
                    <option value="model">Model kits</option>
                    <option value="plush">Plush</option>
                    <option value="statue">Statue</option>
                  </select>
                </div>
              </div>

              {/* Category Icon File Upload Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-[#171136]">Category Icon (Upload File)</label>
                  <span className="text-[10px] text-[#7B5CFF] font-semibold">Image / SVG</span>
                </div>

                {categoryIconPreviewUrl ? (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F6FD] border border-[#EAE3F7]">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#EAE3F7] p-2 flex items-center justify-center shrink-0 shadow-2xs">
                      <img
                        src={categoryIconPreviewUrl}
                        alt="Icon preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#171136] text-xs truncate">
                        {categoryIconFile ? categoryIconFile.name : (editingCategory.category_icon || editingCategory.categoryIcon || "Active Category Icon")}
                      </p>
                      <p className="text-[10.5px] text-[#736E9B]">
                        {categoryIconFile ? `${(categoryIconFile.size / 1024).toFixed(1)} KB (New upload)` : "Current icon on file"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="px-2.5 py-1.5 rounded-xl bg-white border border-[#EAE3F7] text-[11px] font-bold text-[#7B5CFF] hover:bg-[#F6F1FF] cursor-pointer transition-all">
                        Replace
                        <input
                          type="file"
                          accept="image/*,.svg"
                          onChange={handleCategoryIconFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={removeCategoryIconFile}
                        className="p-1.5 rounded-xl bg-white border border-[#EAE3F7] text-red-500 hover:bg-red-50 cursor-pointer transition-all"
                        title="Remove Icon"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-[#D9CEEE] hover:border-[#FF4D6D] bg-[#FAF8FE] hover:bg-[#FFF5F7] transition-all cursor-pointer group text-center">
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={handleCategoryIconFileChange}
                      className="hidden"
                    />
                    <div className="w-9 h-9 rounded-xl bg-[#F0EBF8] group-hover:bg-[#FFE6EC] flex items-center justify-center text-[#7B5CFF] group-hover:text-[#FF4D6D] mb-1.5 transition-colors">
                      <IconPhoto className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-[#171136] text-xs">
                      Upload Category Icon
                    </p>
                    <p className="text-[10.5px] text-[#736E9B] mt-0.5">
                      Upload SVG, PNG, JPG, or WebP to update this category's icon
                    </p>
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0EBF8]">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold cursor-pointer hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#171136] text-white font-bold hover:bg-[#251c4a] shadow-md cursor-pointer transition-all"
                >
                  Save Category Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: DELETE PARENT CATEGORY CONFIRMATION */}
      {/* ============================================================= */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-[#171136]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <IconTrash className="w-6 h-6" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg text-[#171136] mb-1">
              Delete Category?
            </h3>
            <p className="text-xs text-[#736E9B] mb-5">
              Are you sure you want to delete category <strong>{deletingCategory.label}</strong> ({deletingCategory.id})?
            </p>
            <div className="flex justify-center gap-2 text-xs font-bold">
              <button
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
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
      {/* MODAL: ORDER SINGLE DETAILS & INVOICE */}
      {/* ============================================================= */}
      {selectedOrder && (() => {
        const initial = (selectedOrder.customer_name?.[0] || selectedOrder.customer_email?.[0] || "O").toUpperCase();
        const dateInfo = formatOrderDate(selectedOrder.created_at);
        const trackingNum = selectedOrder.tracking_number || `BV-TRACK-${selectedOrder.id ? String(selectedOrder.id).slice(0, 5).toUpperCase() : "88219"}`;
        
        // Calculate items subtotal
        const items = selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items : [
          {
            id: "fallback-1",
            product_name: "Brickverse Custom Order Item",
            price: selectedOrder.total_amount,
            quantity: 1,
          }
        ];
        
        const subtotal = items.reduce((acc: number, item: any) => acc + (Number(item.price || 0) * (item.quantity || 1)), 0);

        // Timeline status active logic
        const statusLevels: Record<string, number> = {
          pending: 1,
          processing: 2,
          shipped: 3,
          delivered: 4,
          cancelled: 0,
        };
        const currentLevel = statusLevels[selectedOrder.status] ?? 1;

        return (
          <div className="fixed inset-0 z-50 bg-[#171136]/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="bg-[#F6F2FC] rounded-3xl max-w-5xl w-full max-h-[94vh] overflow-y-auto border border-[#EAE3F7] p-5 sm:p-8 shadow-2xl space-y-6 relative text-[#171136] animate-in zoom-in-95">
              {/* Top Navigation & Breadcrumb */}
              <div className="flex items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] font-bold text-xs rounded-xl border border-[#EAE3F7] transition-all cursor-pointer shadow-2xs"
                  >
                    ← Back
                  </button>
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    <span className="text-[#736E9B]">Orders</span>
                    <span className="text-[#8A84A6]">/</span>
                    <span className="font-bold text-[#171136]">#{selectedOrder.order_number}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-[#FFE4EA] text-[#736E9B] hover:text-[#FF4D6D] border border-[#EAE3F7] flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                >
                  <IconClose className="w-4 h-4" />
                </button>
              </div>

              {/* Order Header Section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#EAE3F7] p-5 shadow-2xs">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-3xl text-[#171136] tracking-tight">
                    Order #{selectedOrder.order_number}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#736E9B] font-medium mt-1">
                    Placed on {dateInfo.date} {dateInfo.time ? `at ${dateInfo.time}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs capitalize ${
                      selectedOrder.status === "delivered"
                        ? "bg-[#E7F8F0] text-[#2ECC8F]"
                        : selectedOrder.status === "shipped"
                        ? "bg-[#E3F0FF] text-[#3B82F6]"
                        : selectedOrder.status === "cancelled"
                        ? "bg-[#FFF1F4] text-[#FF4D6D]"
                        : "bg-[#FFF4D6] text-[#C08A00]"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        selectedOrder.status === "delivered"
                          ? "bg-[#2ECC8F]"
                          : selectedOrder.status === "shipped"
                          ? "bg-[#3B82F6]"
                          : selectedOrder.status === "cancelled"
                          ? "bg-[#FF4D6D]"
                          : "bg-[#C08A00]"
                      }`}
                    />
                    {selectedOrder.status}
                  </div>

                  {/* Update Status Dropdown */}
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newSt = e.target.value;
                      handleUpdateStatus(selectedOrder.id, newSt);
                      setSelectedOrder((prev: any) => ({ ...prev, status: newSt }));
                    }}
                    className="px-3.5 py-1.5 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs rounded-xl transition-all cursor-pointer outline-none shadow-2xs"
                  >
                    <option value="pending" className="bg-white text-[#171136]">Status: Pending</option>
                    <option value="processing" className="bg-white text-[#171136]">Status: Processing</option>
                    <option value="shipped" className="bg-white text-[#171136]">Status: Shipped</option>
                    <option value="delivered" className="bg-white text-[#171136]">Status: Delivered</option>
                    <option value="cancelled" className="bg-white text-[#171136]">Status: Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Order Info */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Customer Information Card */}
                  <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-xs space-y-4">
                    <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136]">
                      Customer Information
                    </h3>
                    <div className="border-t border-[#F0EBF8] pt-3 flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-full ${getOrderAvatarBg(
                          initial
                        )} font-extrabold flex items-center justify-center text-sm shrink-0 shadow-2xs`}
                      >
                        {initial}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#171136] leading-tight">
                          {selectedOrder.customer_name || "Guest Customer"}
                        </p>
                        <p className="text-xs text-[#736E9B] mt-0.5">{selectedOrder.customer_email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider block">
                          PHONE
                        </span>
                        <p className="font-semibold text-[#171136] mt-0.5">
                          {selectedOrder.customer_phone || "—"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider block">
                          SHIPPING ADDRESS
                        </span>
                        <p className="font-medium text-[#171136] mt-0.5 leading-relaxed">
                          {selectedOrder.shipping_address || "Standard Customer Address"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status & Tracking Card */}
                  <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-xs space-y-4">
                    <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136]">
                      Status & Tracking
                    </h3>
                    <div className="border-t border-[#F0EBF8] pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider block mb-1">
                          ORDER STATUS
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold capitalize ${
                            selectedOrder.status === "delivered"
                              ? "bg-[#E7F8F0] text-[#2ECC8F]"
                              : selectedOrder.status === "shipped"
                              ? "bg-[#E3F0FF] text-[#3B82F6]"
                              : selectedOrder.status === "cancelled"
                              ? "bg-[#FFF1F4] text-[#FF4D6D]"
                              : "bg-[#FFF4D6] text-[#C08A00]"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              selectedOrder.status === "delivered"
                                ? "bg-[#2ECC8F]"
                                : selectedOrder.status === "shipped"
                                ? "bg-[#3B82F6]"
                                : selectedOrder.status === "cancelled"
                                ? "bg-[#FF4D6D]"
                                : "bg-[#C08A00]"
                            }`}
                          />
                          {selectedOrder.status}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider block mb-1">
                          TRACKING NUMBER
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#171136] font-mono">
                            {trackingNum}
                          </span>
                          <button
                            onClick={() => copyTracking(trackingNum)}
                            className="px-2 py-0.5 bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#7B5CFF] font-bold text-[10.5px] rounded-lg transition-all cursor-pointer"
                            title="Copy Tracking Number"
                          >
                            {copiedTracking ? "Copied! ✓" : "Copy ↗"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information Card */}
                  <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-xs space-y-4">
                    <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136]">
                      Payment Information
                    </h3>
                    <div className="border-t border-[#F0EBF8] pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider block mb-1">
                          PAYMENT METHOD
                        </span>
                        <p className="font-semibold text-[#171136]">
                          Cash on Delivery / Card
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#8A84A6] uppercase tracking-wider block mb-1">
                          PAYMENT STATUS
                        </span>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-lg text-[10.5px] font-bold ${
                            selectedOrder.status === "delivered"
                              ? "bg-[#E7F8F0] text-[#2ECC8F]"
                              : "bg-[#FFF4D6] text-[#C08A00]"
                          }`}
                        >
                          {selectedOrder.status === "delivered" ? "Paid ✓" : "Pending COD"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Order Items & Summary */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Order Items Card */}
                  <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136]">
                        Ordered Items
                      </h3>
                      <span className="text-xs font-semibold text-[#736E9B]">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    </div>

                    <div className="overflow-x-auto border-t border-[#F0EBF8] pt-2">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-[#8A84A6] border-b border-[#F0EBF8]">
                            <th className="py-2.5 font-bold text-[10.5px] tracking-wider uppercase">PRODUCT</th>
                            <th className="py-2.5 font-bold text-[10.5px] tracking-wider uppercase text-center">QTY</th>
                            <th className="py-2.5 font-bold text-[10.5px] tracking-wider uppercase text-right">PRICE</th>
                            <th className="py-2.5 font-bold text-[10.5px] tracking-wider uppercase text-right">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0EBF8]">
                          {items.map((item: any, idx: number) => {
                            const itemInitial = (item.product_name?.[0] || "P").toUpperCase();
                            const itemTotal = Number(item.price || 0) * (item.quantity || 1);
                            return (
                              <tr key={idx} className="hover:bg-[#F8F6FD]/60 transition-colors">
                                <td className="py-3 pr-2">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#FFF1F4] text-[#FF4D6D] font-extrabold flex items-center justify-center text-xs shrink-0">
                                      {itemInitial}
                                    </div>
                                    <div>
                                      <p className="font-bold text-[#171136] text-xs leading-tight">
                                        {item.product_name}
                                      </p>
                                      <p className="text-[10px] text-[#736E9B] mt-0.5">
                                        SKU: BV-ITEM-{idx + 101}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-center font-semibold text-[#171136]">
                                  ×{item.quantity || 1}
                                </td>
                                <td className="py-3 px-2 text-right font-medium text-[#736E9B]">
                                  ৳{Number(item.price || 0).toLocaleString()}
                                </td>
                                <td className="py-3 pl-2 text-right font-extrabold text-[#171136]">
                                  ৳{itemTotal.toLocaleString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-[#F0EBF8] pt-3 space-y-1.5 text-xs text-right">
                      <div className="flex justify-end gap-6 text-[#736E9B]">
                        <span>Subtotal</span>
                        <span className="font-semibold text-[#171136] w-20">৳{subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-end gap-6 text-[#736E9B]">
                        <span>Standard Delivery</span>
                        <span className="font-semibold text-emerald-600 w-20">৳0</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Total Card */}
                  <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10.5px] font-bold text-[#8A84A6] uppercase tracking-wider block">
                        Order Total
                      </span>
                      <p className="font-[family-name:var(--font-display)] font-extrabold text-3xl text-[#FF4D6D] mt-0.5">
                        ৳{Number(selectedOrder.total_amount || 0).toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Download Invoice ↓
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom: Order Activity Timeline */}
              <div className="bg-white rounded-[22px] border border-[#EAE3F7] p-5 shadow-xs space-y-4">
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-sm text-[#171136]">
                  Order Activity Timeline
                </h3>
                <div className="border-t border-[#F0EBF8] pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                  {/* Step 1: Placed */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFF1F4] text-[#FF4D6D] flex items-center justify-center shrink-0 font-bold">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-[#171136]">Order Placed</p>
                      <p className="text-[11px] text-[#736E9B] mt-0.5">
                        Order #{selectedOrder.order_number} confirmed.
                      </p>
                      <p className="text-[10px] text-[#8A84A6] font-medium mt-1">{dateInfo.date}</p>
                    </div>
                  </div>

                  {/* Step 2: Processing */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                        currentLevel >= 2
                          ? "bg-[#FFF4D6] text-[#C08A00]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {currentLevel >= 2 ? "✓" : "2"}
                    </div>
                    <div>
                      <p className={`font-bold ${currentLevel >= 2 ? "text-[#171136]" : "text-gray-400"}`}>
                        Processing
                      </p>
                      <p className="text-[11px] text-[#736E9B] mt-0.5">
                        Picking and packing at warehouse.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Shipped */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                        currentLevel >= 3
                          ? "bg-[#E3F0FF] text-[#3B82F6]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {currentLevel >= 3 ? "✓" : "3"}
                    </div>
                    <div>
                      <p className={`font-bold ${currentLevel >= 3 ? "text-[#171136]" : "text-gray-400"}`}>
                        Order Shipped
                      </p>
                      <p className="text-[11px] text-[#736E9B] mt-0.5 font-mono">
                        {trackingNum}
                      </p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                        currentLevel >= 4
                          ? "bg-[#E7F8F0] text-[#2ECC8F]"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {currentLevel >= 4 ? "✓" : "4"}
                    </div>
                    <div>
                      <p className={`font-bold ${currentLevel >= 4 ? "text-[#171136]" : "text-gray-400"}`}>
                        Delivered
                      </p>
                      <p className="text-[11px] text-[#736E9B] mt-0.5">
                        Delivered to shipping address.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

