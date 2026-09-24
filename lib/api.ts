import { ProductSection, Category, Product, HeroSlide } from "@/components/productData";
import type { BlogPost, BlogPostListResponse, BlogPostDraft, BlogCategoryRef, BlogTagRef } from "@/lib/blogTypes";

// Single source of truth for mapping a site hostname to its backend API base.
// Used by both the browser (client components) and the server (via
// getServerApiBaseUrl, which reads the real request Host header) so a
// visitor always hits the same backend no matter where the fetch runs -
// avoids SSR and client code silently talking to two different backends
// (and therefore two different databases) when NEXT_PUBLIC_API_URL doesn't
// match the domain actually being served.
function resolveApiBaseFromHost(host: string): string {
  if (host.includes("kawaiisubete.com")) {
    return "https://api.kawaiisubete.com/api";
  }
  if (host.includes("brickverse.eezzymart.tech") || host.includes("eezzymart.tech")) {
    return "https://brickbackend.eezzymart.tech/api";
  }
  if (host === "localhost" || host === "127.0.0.1" || host.startsWith("localhost:") || host.startsWith("127.0.0.1:")) {
    return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "https://api.kawaiisubete.com/api";
}

export function getApiBaseUrl(): string {
  // 1. Client-side browser runtime dynamic detection
  if (typeof window !== "undefined") {
    return resolveApiBaseFromHost(window.location.hostname);
  }

  // 2. Explicit NEXT_PUBLIC_API_URL environment variable
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes("127.0.0.1") && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/+$/, "");
  }

  // 3. Server-side production fallback
  if (process.env.NODE_ENV === "production") {
    return "https://api.kawaiisubete.com/api";
  }

  // 4. Default for local development
  return envUrl || "http://127.0.0.1:8000/api";
}

// Server-only: resolves the API base from the actual incoming request's
// Host header, so a Server Component's fetch targets the same backend the
// visitor's browser would (per resolveApiBaseFromHost), instead of trusting
// a NEXT_PUBLIC_API_URL build-time env var that may not match the domain
// this deployment is actually being served under. Falls back to
// getApiBaseUrl() if headers() isn't available (e.g. outside a request).
export async function getServerApiBaseUrl(): Promise<string> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const host = h.get("host");
    if (host) return resolveApiBaseFromHost(host);
  } catch {
    // not in a request context (e.g. build-time) - fall through
  }
  return getApiBaseUrl();
}

export function getMediaUrl(path?: string | null): string {
  if (!path) return "/images/figure-samurai-red.svg";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  if (path.startsWith("/images/")) {
    return path;
  }
  const apiBase = getApiBaseUrl().replace(/\/api\/?$/, "");
  if (path.startsWith("/media/")) {
    return `${apiBase}${path}`;
  }
  if (path.startsWith("media/")) {
    return `${apiBase}/${path}`;
  }
  if (path.startsWith("/products/") || path.startsWith("products/")) {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `${apiBase}/media${clean}`;
  }
  return `${apiBase}/media/${path.replace(/^\/+/, "")}`;
}

const getApi = () => getApiBaseUrl();

// -------------------------------------------------------------
// Products App APIs
// -------------------------------------------------------------
export async function getProductSections(apiBaseOverride?: string): Promise<ProductSection[]> {
  try {
    const base = apiBaseOverride || getApiBaseUrl();
    const res = await fetch(`${base}/sections/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[API] Products API unreachable:", error);
    return [];
  }
}

// Storefront: admin-selected top-level categories as homepage sections, each
// with its newest products, mapped onto the ProductSection shape ProductGrid
// already renders. Empty when the admin hasn't picked any (callers then fall
// back to the fixed sections).
export async function getHomepageSections(apiBaseOverride?: string): Promise<ProductSection[]> {
  try {
    const base = apiBaseOverride || getApiBaseUrl();
    const res = await fetch(`${base}/products/homepage-sections/`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    type HomepageSectionPayload = { id: string; label: string; color: string; productCount: number; products?: Product[] };
    return (data as HomepageSectionPayload[]).map((s) => ({
      id: s.id,
      eyebrow: "",
      eyebrowColor: s.color,
      title: s.label,
      itemCount: `${s.productCount} items`,
      accent: s.color,
      products: s.products || [],
      href: `/shop?category=${encodeURIComponent(s.id)}`,
    }));
  } catch (error) {
    console.warn("[API] Homepage sections API unreachable:", error);
    return [];
  }
}

export async function getCategories(apiBaseOverride?: string): Promise<Category[]> {
  try {
    const base = apiBaseOverride || getApiBaseUrl();
    const res = await fetch(`${base}/categories/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[API] Categories API unreachable:", error);
    return [];
  }
}

// Public: active hero carousel slides, in display order.
export async function getHeroSlides(apiBaseOverride?: string): Promise<HeroSlide[]> {
  try {
    const base = apiBaseOverride || getApiBaseUrl();
    const res = await fetch(`${base}/marketing/hero-slides/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[API] Hero slides API unreachable:", error);
    return [];
  }
}

// Admin: every hero slide, active or not.
export async function getHeroSlidesAdmin(): Promise<HeroSlide[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/marketing/hero-slides/all/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[API] Hero slides API unreachable:", error);
    return [];
  }
}

export async function createHeroSlide(data: FormData) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/marketing/hero-slides/all/`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to create hero slide" };
  }
}

export async function updateHeroSlide(id: number, data: FormData) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/marketing/hero-slides/${id}/`, {
      method: "PATCH",
      body: data,
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to update hero slide" };
  }
}

export async function deleteHeroSlide(id: number) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/marketing/hero-slides/${id}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

// Admin: every category at every depth, flat (each row carries its own
// `parent` id) - used to build the full tree view and the parent picker.
export async function getCategoryTree(): Promise<Category[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/categories/all/`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[API] Category tree API unreachable:", error);
    return [];
  }
}

export async function registerCustomer(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return {
      success: res.ok,
      user: result.user,
      message: result.message,
      error: result.error || (result.email ? result.email[0] : undefined),
    };
  } catch (error) {
    return { success: false, error: "Registration failed. Server unreachable." };
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    return {
      success: res.ok,
      user: result.user,
      message: result.message,
      error: result.error,
    };
  } catch (error) {
    return { success: false, error: "Login failed. Server unreachable." };
  }
}

export async function logoutUser() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/logout/`, {
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    return { message: "Logged out locally." };
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/me/`);
    if (!res.ok) return { authenticated: false, user: null };
    return await res.json();
  } catch (error) {
    return { authenticated: false, user: null };
  }
}

export async function searchProducts(query: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/?search=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Product search failed:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/${encodeURIComponent(id)}/`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn(`[API] Failed to fetch product ${id}:`, error);
  }
  return null;
}

export async function getRelatedProducts(category?: string, excludeId?: string): Promise<Product[]> {
  try {
    const url = category
      ? `${getApiBaseUrl()}/products/?category=${encodeURIComponent(category)}`
      : `${getApiBaseUrl()}/products/`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((p: Product) => p.id !== excludeId).slice(0, 4);
      }
    }
  } catch (error) {
    console.warn("[API] Failed to fetch related products:", error);
  }
  return [];
}

// -------------------------------------------------------------
// Promotions App APIs
// -------------------------------------------------------------
export async function getPromotions() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/promotions/all/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[API] Promotions API unreachable:", error);
    return null;
  }
}

// -------------------------------------------------------------
// Orders, Cart & Trust Perks APIs
// -------------------------------------------------------------
export async function getTrustPerks() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/trust-perks/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[API] Trust perks API unreachable:", error);
    return null;
  }
}

export async function getCart(sessionId: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/cart/?session_id=${sessionId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function addToCart(sessionId: string, productId: string, quantity = 1) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/cart/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, productId, quantity }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function toggleWishlist(sessionId: string, productId: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/wishlist/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, productId }),
    });
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function trackOrder(orderNumber: string, email?: string) {
  try {
    let url = `${getApiBaseUrl()}/orders/track/?order_number=${encodeURIComponent(orderNumber)}`;
    if (email) url += `&email=${encodeURIComponent(email)}`;
    const res = await fetch(url);
    if (!res.ok) return { error: "Order not found" };
    return await res.json();
  } catch (error) {
    return { error: "Could not connect to tracking service" };
  }
}

// -------------------------------------------------------------
// Marketing & Content APIs
// -------------------------------------------------------------
export async function subscribeNewsletter(email: string, source = "footer_banner") {
  try {
    const res = await fetch(`${getApiBaseUrl()}/newsletter/subscribe/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source }),
    });
    const data = await res.json();
    return {
      success: res.ok,
      message: data.message || data.error || "Subscription processed.",
    };
  } catch (error) {
    return { success: false, message: "Could not connect to server. Please try again." };
  }
}

export async function getNavLinks() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/marketing/nav-links/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function getCustomerOrders(email?: string) {
  try {
    const url = email
      ? `${getApiBaseUrl()}/orders/list/?email=${encodeURIComponent(email)}`
      : `${getApiBaseUrl()}/orders/list/`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch orders:", error);
    return [];
  }
}

export async function getAllOrders() {
  return getCustomerOrders();
}

export async function updateOrderStatus(orderId: number | string, status: string, trackingNumber?: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/${orderId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, ...(trackingNumber ? { tracking_number: trackingNumber } : {}) }),
    });
    return { success: res.ok, data: await res.json() };
  } catch (error) {
    return { success: false, error: "Failed to update order" };
  }
}

export async function deleteOrder(orderId: number | string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/${orderId}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function getAllProducts(params?: {
  category?: string;
  subcategory?: string;
  search?: string;
  all?: boolean;
  is_active?: string | boolean;
}) {
  try {
    let url = `${getApiBaseUrl()}/products/`;
    const queryParts = [];
    if (params?.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params?.subcategory) queryParts.push(`subcategory=${encodeURIComponent(params.subcategory)}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params?.all) queryParts.push(`all=1`);
    if (params?.is_active !== undefined) queryParts.push(`is_active=${encodeURIComponent(String(params.is_active))}`);
    if (queryParts.length > 0) url += `?${queryParts.join("&")}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch all products:", error);
    return [];
  }
}

export async function toggleProductActive(id: string, is_active: boolean) {
  return updateProduct(id, { is_active });
}

export type ShopProductQuery = {
  category?: string;
  subcategory?: string;
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minRating?: number | null;
  onSale?: boolean;
  sort?: string;
};

export type ShopProductPage = { results: Product[]; count: number; hasMore: boolean };

// One page of the shop grid. Filtering, sorting and paging all happen on the
// server, so the browser only ever holds the pages it has scrolled through.
export async function getProductsPage(
  query: ShopProductQuery,
  page: number,
  pageSize = 20,
  signal?: AbortSignal
): Promise<ShopProductPage> {
  const qs = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (query.category && query.category !== "all") qs.set("category", query.category);
  if (query.subcategory && query.subcategory !== "all") qs.set("subcategory", query.subcategory);
  if (query.search?.trim()) qs.set("search", query.search.trim());
  if (query.minPrice != null) qs.set("min_price", String(query.minPrice));
  if (query.maxPrice != null) qs.set("max_price", String(query.maxPrice));
  if (query.minRating != null) qs.set("min_rating", String(query.minRating));
  if (query.onSale) qs.set("on_sale", "1");
  if (query.sort && query.sort !== "newest") qs.set("sort", query.sort);

  const res = await fetch(`${getApiBaseUrl()}/products/?${qs.toString()}`, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`Products request failed (${res.status})`);
  const data = await res.json();
  return {
    results: Array.isArray(data.results) ? data.results : [],
    count: typeof data.count === "number" ? data.count : 0,
    hasMore: Boolean(data.hasMore),
  };
}

// DRF returns validation failures as {field: ["message"]}; flatten that so the
// admin sees why a save failed instead of a generic "check fields".
function describeApiError(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const parts = Object.entries(data as Record<string, unknown>).map(([field, msg]) => {
    const text = Array.isArray(msg) ? msg.join(" ") : String(msg);
    return field === "detail" || field === "error" ? text : `${field}: ${text}`;
  });
  return parts.length ? parts.join(" | ") : undefined;
}

export async function createProduct(productData: any) {
  try {
    const isFormData = typeof FormData !== "undefined" && productData instanceof FormData;
    const res = await fetch(`${getApiBaseUrl()}/products/`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    const data = await res.json();
    return { success: res.ok, data, error: res.ok ? undefined : describeApiError(data) };
  } catch (error) {
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, productData: any) {
  try {
    const isFormData = typeof FormData !== "undefined" && productData instanceof FormData;
    const res = await fetch(`${getApiBaseUrl()}/products/${encodeURIComponent(id)}/`, {
      method: "PATCH",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    const data = await res.json();
    return { success: res.ok, data, error: res.ok ? undefined : describeApiError(data) };
  } catch (error) {
    return { success: false, error: "Failed to update product" };
  }
}


export async function deleteProduct(id: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/${encodeURIComponent(id)}/`, {
      method: "DELETE",
    });
    if (res.ok) return { success: true };
    const data = await res.json().catch(() => null);
    return { success: false, error: describeApiError(data) };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteProductGalleryImage(galleryId: number | string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/gallery/${galleryId}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function bulkDeleteProducts(ids: string[]) {
  if (!ids || ids.length === 0) return { success: true, count: 0 };
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/bulk-delete/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    // A 400 is a deliberate refusal (e.g. a product still used in a bundle):
    // report it instead of retrying one by one and claiming success.
    if (res.status === 400) {
      const data = await res.json().catch(() => null);
      return { success: false, error: describeApiError(data) };
    }
    // Fallback: parallel deleteProduct
    await Promise.all(ids.map((id) => deleteProduct(id)));
    return { success: true };
  } catch (error) {
    try {
      await Promise.all(ids.map((id) => deleteProduct(id)));
      return { success: true };
    } catch (e) {
      return { success: false, error: "Failed to bulk delete products" };
    }
  }
}

export async function createCategory(data: any) {
  try {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await fetch(`${getApiBaseUrl()}/products/categories/`, {
      method: "POST",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: any) {
  try {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await fetch(`${getApiBaseUrl()}/products/categories/${encodeURIComponent(id)}/`, {
      method: "PATCH",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? data : JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to update category" };
  }
}

export async function reorderMegaMenuCategories(ids: string[]) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/categories/mega-menu/reorder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const result = await res.json().catch(() => null);
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to save mega menu order" };
  }
}

export async function reorderHomepageSections(ids: string[]) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/categories/homepage-sections/reorder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    const result = await res.json().catch(() => null);
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to save homepage sections" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/categories/${encodeURIComponent(id)}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}


export async function getAllUsers(role?: string, search?: string) {
  try {
    let url = `${getApiBaseUrl()}/auth/all/`;
    const params = [];
    if (role && role !== "all") params.push(`role=${encodeURIComponent(role)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch users:", error);
    return [];
  }
}

export async function updateUserRole(userId: number | string, role: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/${userId}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    return { success: res.ok, data: await res.json() };
  } catch (error) {
    return { success: false };
  }
}

export async function createUser(userData: any) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/all/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return { success: res.ok, data: await res.json() };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteUser(userId: number | string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/${userId}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function getAdminStats() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/admin-stats/`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch admin stats:", error);
    return null;
  }
}

export async function getAllCustomers() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/auth/customers/`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch customers:", error);
    return [];
  }
}

export async function getStoreInfo() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/marketing/store-info/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function createOrder(orderData: {
  first_name: string;
  last_name: string;
  customer_name?: string;
  customer_phone: string;
  customer_email?: string;
  city: string;
  address: string;
  shipping_address?: string;
  total_amount: number;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/orders/list/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || "Failed to create order" };
    }
    const data = await res.json();
    return { success: true, order: data };
  } catch (error) {
    console.warn("[API] Order placement network fallback:", error);
    return {
      success: true,
      order: {
        id: Date.now(),
        order_number: `KS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        ...orderData,
        status: "pending",
        created_at: new Date().toISOString(),
      },
    };
  }
}

// -------------------------------------------------------------
// Partner Stores App APIs
// -------------------------------------------------------------
export async function getAllStores(params?: { status?: string; search?: string }) {
  try {
    let url = `${getApiBaseUrl()}/stores/`;
    const q: string[] = [];
    if (params?.status && params.status !== "all") q.push(`status=${encodeURIComponent(params.status)}`);
    if (params?.search) q.push(`search=${encodeURIComponent(params.search)}`);
    if (q.length) url += `?${q.join("&")}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch stores:", error);
    return [];
  }
}

export async function getStoreById(id: number | string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${id}/`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch store by id:", error);
    return null;
  }
}

export async function createStore(data: any) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to create store" };
  }
}

export async function updateStore(id: number | string, data: any) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to update store" };
  }
}

export async function deleteStore(id: number | string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${id}/`, { method: "DELETE" });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function addStoreProduct(storeId: number | string, productId: string, qty: number) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${storeId}/add-product/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? (data?.error || "Failed to add product") : undefined };
  } catch (error) {
    return { success: false, error: "Failed to add product" };
  }
}

export async function recordStoreSale(storeId: number | string, lineId: number, qty: number) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${storeId}/record-sale/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId, qty }),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? (data?.error || "Failed to record sale") : undefined };
  } catch (error) {
    return { success: false, error: "Failed to record sale" };
  }
}

export async function recordStoreReturn(storeId: number | string, lineId: number, qty: number) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${storeId}/record-return/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId, qty }),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? (data?.error || "Failed to record return") : undefined };
  } catch (error) {
    return { success: false, error: "Failed to record return" };
  }
}

export async function recordStorePayment(storeId: number | string, amount: number, paymentDate: string, note?: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${storeId}/payments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, payment_date: paymentDate, note }),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? (data?.error || "Failed to record payment") : undefined };
  } catch (error) {
    return { success: false, error: "Failed to record payment" };
  }
}

export async function getStoreSettlement(storeId: number | string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/stores/${storeId}/settlement/`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

// -------------------------------------------------------------
// System Logs & Request Monitoring APIs
// -------------------------------------------------------------
export interface SystemLogItem {
  id: number | string;
  level: "INFO" | "WARNING" | "ERROR" | "CRITICAL" | "REQUEST";
  source: string;
  method?: string;
  path?: string;
  status_code?: number;
  ip_address?: string;
  user_agent?: string;
  duration_ms?: number;
  message: string;
  details?: Record<string, any>;
  traceback?: string;
  created_at: string;
}

export interface SystemLogsResponse {
  logs: SystemLogItem[];
  metrics: {
    total_logs: number;
    error_count: number;
    warning_count: number;
    request_count: number;
    avg_duration_ms: number;
    uptime_seconds: number;
    server_status: string;
    python_version: string;
    django_version: string;
  };
}

export async function getSystemLogs(params?: {
  level?: string;
  status_code?: string;
  method?: string;
  search?: string;
  limit?: number;
}): Promise<SystemLogsResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.level && params.level !== "all") searchParams.set("level", params.level);
    if (params?.status_code && params.status_code !== "all") searchParams.set("status_code", params.status_code);
    if (params?.method && params.method !== "all") searchParams.set("method", params.method);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const qs = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const res = await fetch(`${getApiBaseUrl()}/logs/${qs}`, { cache: "no-store" });
    if (!res.ok) {
      return {
        logs: [],
        metrics: {
          total_logs: 0,
          error_count: 0,
          warning_count: 0,
          request_count: 0,
          avg_duration_ms: 0,
          uptime_seconds: 0,
          server_status: "Offline",
          python_version: "3.13",
          django_version: "5.1",
        },
      };
    }
    return await res.json();
  } catch (error) {
    return {
      logs: [],
      metrics: {
        total_logs: 0,
        error_count: 0,
        warning_count: 0,
        request_count: 0,
        avg_duration_ms: 0,
        uptime_seconds: 0,
        server_status: "Offline",
        python_version: "3.13",
        django_version: "5.1",
      },
    };
  }
}

export async function clearSystemLogs(): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/logs/clear/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, message: data?.message };
  } catch (error) {
    return { success: false, message: "Network connection error" };
  }
}

export async function generateTestLog(level: "INFO" | "WARNING" | "ERROR" = "INFO", message?: string): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/logs/test/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, message }),
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function getLogRetention(): Promise<{
  retention_days: number;
  is_auto_delete_enabled: boolean;
  last_cleaned_at?: string;
}> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/logs/retention/?_t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return { retention_days: 1, is_auto_delete_enabled: true };
    return await res.json();
  } catch {
    return { retention_days: 1, is_auto_delete_enabled: true };
  }
}

export async function updateLogRetention(
  retention_days: number,
  is_auto_delete_enabled: boolean = true
): Promise<{ success: boolean; message?: string; pruned_count?: number }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/logs/retention/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ retention_days, is_auto_delete_enabled }),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, message: data?.message, pruned_count: data?.pruned_count };
  } catch {
    return { success: false, message: "Network connection error" };
  }
}

export async function pruneLogs(days?: number): Promise<{ success: boolean; deleted_count: number; message?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/logs/prune/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(days !== undefined ? { days } : {}),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, deleted_count: data?.deleted_count || 0, message: data?.message };
  } catch {
    return { success: false, deleted_count: 0, message: "Network error" };
  }
}

// -------------------------------------------------------------
// Blog App APIs
// -------------------------------------------------------------

function blogQueryString(params?: Record<string, string | number | undefined>): string {
  if (!params) return "";
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  return parts.length ? `?${parts.join("&")}` : "";
}

export async function getBlogPosts(params?: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
}): Promise<BlogPostListResponse> {
  const empty: BlogPostListResponse = { count: 0, next: null, previous: null, results: [] };
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/posts/${blogQueryString(params)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return empty;
    const data = await res.json();
    if (Array.isArray(data)) return { count: data.length, next: null, previous: null, results: data };
    return {
      count: data?.count ?? 0,
      next: data?.next ?? null,
      previous: data?.previous ?? null,
      results: data?.results ?? [],
    };
  } catch (error) {
    console.warn("[API] Failed to fetch blog posts:", error);
    return empty;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/posts/${encodeURIComponent(slug)}/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch blog post by slug:", error);
    return null;
  }
}

export async function getBlogCategories(): Promise<BlogCategoryRef[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/categories/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results ?? [];
  } catch (error) {
    console.warn("[API] Failed to fetch blog categories:", error);
    return [];
  }
}

export async function getBlogTags(): Promise<BlogTagRef[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/tags/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results ?? [];
  } catch (error) {
    console.warn("[API] Failed to fetch blog tags:", error);
    return [];
  }
}

export async function getBlogPostsAdmin(params?: {
  status?: string;
  search?: string;
  page?: number;
}): Promise<BlogPostListResponse> {
  const empty: BlogPostListResponse = { count: 0, next: null, previous: null, results: [] };
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/posts/${blogQueryString(params)}`, {
      cache: "no-store",
    });
    if (!res.ok) return empty;
    const data = await res.json();
    if (Array.isArray(data)) return { count: data.length, next: null, previous: null, results: data };
    return {
      count: data?.count ?? 0,
      next: data?.next ?? null,
      previous: data?.previous ?? null,
      results: data?.results ?? [],
    };
  } catch (error) {
    console.warn("[API] Failed to fetch admin blog posts:", error);
    return empty;
  }
}

export async function getBlogPostAdmin(id: string | number): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/posts/${encodeURIComponent(String(id))}/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch admin blog post:", error);
    return null;
  }
}

// Isolated on purpose: this is the one place that decides how category/tag
// foreign keys are written to the backend. Nested read serializers return
// full objects (`category: {id, name, slug}`), but DRF writable nested FKs
// usually expect plain ids under a distinct key - if the backend agent's
// admin serializer expects a different key (e.g. plain `category` id instead
// of `category_id`), this is the only function that needs to change.
function toBlogPostWritePayload(draft: BlogPostDraft) {
  return {
    title: draft.title,
    slug: draft.slug,
    excerpt: draft.excerpt,
    featuredImage: draft.featuredImage || null,
    status: draft.status,
    categoryId: draft.categoryId || null,
    tagIds: draft.tagIds || [],
    blocks: (draft.blocks || []).map((b, index) => {
      const isRealId = b.id !== undefined && b.id !== null && !String(b.id).startsWith("tmp-");
      return {
        ...(isRealId ? { id: b.id } : {}),
        order: index,
        blockType: b.blockType,
        data: b.data,
      };
    }),
  };
}

export async function createBlogPost(draft: BlogPostDraft): Promise<{ success: boolean; data?: BlogPost; error?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/posts/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBlogPostWritePayload(draft)),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.detail || data?.message || "Failed to create post" };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to create post" };
  }
}

export async function updateBlogPost(
  id: string | number,
  draft: BlogPostDraft
): Promise<{ success: boolean; data?: BlogPost; error?: string }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/posts/${encodeURIComponent(String(id))}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toBlogPostWritePayload(draft)),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return { success: false, error: data?.detail || data?.message || "Failed to update post" };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Failed to update post" };
  }
}

export async function deleteBlogPost(id: string | number): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/posts/${encodeURIComponent(String(id))}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function getBlogCategoriesAdmin(): Promise<BlogCategoryRef[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/categories/`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results ?? [];
  } catch (error) {
    console.warn("[API] Failed to fetch admin blog categories:", error);
    return [];
  }
}

export async function createBlogCategory(payload: { name: string; slug?: string }) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/categories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? data?.detail || "Failed to create category" : undefined };
  } catch (error) {
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateBlogCategory(id: string | number, payload: { name?: string; slug?: string }) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/categories/${encodeURIComponent(String(id))}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? data?.detail || "Failed to update category" : undefined };
  } catch (error) {
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteBlogCategory(id: string | number): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/categories/${encodeURIComponent(String(id))}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function getBlogTagsAdmin(): Promise<BlogTagRef[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/tags/`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data?.results ?? [];
  } catch (error) {
    console.warn("[API] Failed to fetch admin blog tags:", error);
    return [];
  }
}

export async function createBlogTag(payload: { name: string; slug?: string }) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/tags/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? data?.detail || "Failed to create tag" : undefined };
  } catch (error) {
    return { success: false, error: "Failed to create tag" };
  }
}

export async function updateBlogTag(id: string | number, payload: { name?: string; slug?: string }) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/tags/${encodeURIComponent(String(id))}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);
    return { success: res.ok, data, error: !res.ok ? data?.detail || "Failed to update tag" : undefined };
  } catch (error) {
    return { success: false, error: "Failed to update tag" };
  }
}

export async function deleteBlogTag(id: string | number): Promise<{ success: boolean }> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/blog/admin/tags/${encodeURIComponent(String(id))}/`, {
      method: "DELETE",
    });
    return { success: res.ok };
  } catch (error) {
    return { success: false };
  }
}

export async function uploadBlogMedia(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${getApiBaseUrl()}/blog/media/upload/`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.url) return { success: false, error: data?.detail || "Failed to upload file" };
    return { success: true, url: data.url };
  } catch (error) {
    return { success: false, error: "Failed to upload file" };
  }
}

