import { ProductSection, Category, Product } from "@/components/productData";

export function getApiBaseUrl(): string {
  // 1. Client-side browser runtime dynamic detection
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("kawaiisubete.com")) {
      return "https://api.kawaiisubete.com/api";
    }
    if (host.includes("brickverse.eezzymart.tech") || host.includes("eezzymart.tech")) {
      return "https://brickbackend.eezzymart.tech/api";
    }
    if (host === "localhost" || host === "127.0.0.1") {
      return process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    return "https://api.kawaiisubete.com/api";
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

export function getMediaUrl(path?: string | null): string {
  if (!path) return "/images/figure-samurai-red.svg";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  if (path.startsWith("/media/")) {
    const apiBase = getApiBaseUrl().replace(/\/api\/?$/, "");
    return `${apiBase}${path}`;
  }
  return path;
}

const getApi = () => getApiBaseUrl();

// -------------------------------------------------------------
// Products App APIs
// -------------------------------------------------------------
export async function getProductSections(): Promise<ProductSection[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/sections/`, {
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

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${getApiBaseUrl()}/categories/`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn("[API] Categories API unreachable:", error);
    return [];
  }
}

export async function getSubCategories(categoryId?: string) {
  try {
    const url = categoryId
      ? `${getApiBaseUrl()}/subcategories/?category=${encodeURIComponent(categoryId)}`
      : `${getApiBaseUrl()}/subcategories/`;
    const res = await fetch(url, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Subcategories API unreachable:", error);
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

export async function getAllProducts(params?: { category?: string; subcategory?: string; search?: string }) {
  try {
    let url = `${getApiBaseUrl()}/products/`;
    const queryParts = [];
    if (params?.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params?.subcategory) queryParts.push(`subcategory=${encodeURIComponent(params.subcategory)}`);
    if (params?.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (queryParts.length > 0) url += `?${queryParts.join("&")}`;

    const res = await fetch(url, { next: { revalidate: 15 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.warn("[API] Failed to fetch all products:", error);
    return [];
  }
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
    return { success: res.ok, data };
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
    return { success: res.ok, data };
  } catch (error) {
    return { success: false, error: "Failed to update product" };
  }
}


export async function deleteProduct(id: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/${encodeURIComponent(id)}/`, {
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

export async function createSubCategory(data: any) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/subcategories/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to create subcategory" };
  }
}

export async function updateSubCategory(id: string, data: any) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/subcategories/${encodeURIComponent(id)}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return { success: res.ok, data: result };
  } catch (error) {
    return { success: false, error: "Failed to update subcategory" };
  }
}

export async function deleteSubCategory(id: string) {
  try {
    const res = await fetch(`${getApiBaseUrl()}/products/subcategories/${encodeURIComponent(id)}/`, {
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



