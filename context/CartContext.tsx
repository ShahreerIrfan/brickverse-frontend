"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Product } from "@/components/productData";
import { getApiBaseUrl } from "@/lib/api";

export interface ActiveLotInfo {
  id?: number;
  lotNumber?: string;
  remainingQuantity: number;
  mrp?: string;
  discountedPrice?: string;
  tradePrice?: string;
  sellingPrice?: number;
}

export interface CartItem {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  priceFormatted: string;
  image: string;
  cardBg?: string;
  quantity: number;
  seller?: string;
  category?: string;
  slug?: string;
  /** Units in stock when added; the cart never goes above this. Undefined = unknown/unlimited. */
  maxStock?: number;
  /** Simple product with no stock: sold as a pre-order, so no stock cap applies. */
  preorder?: boolean;
  activeLots?: ActiveLotInfo[];
}

export interface CartItemTotalBreakdown {
  lotNumber?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CartItemTotalResult {
  total: number;
  breakdown: CartItemTotalBreakdown[];
}

export function calculateCartItemTotal(item: CartItem): CartItemTotalResult {
  const lots = item.activeLots;
  if (Array.isArray(lots) && lots.length > 0) {
    let remaining = item.quantity;
    let total = 0;
    const breakdown: CartItemTotalBreakdown[] = [];

    for (const lot of lots) {
      if (remaining <= 0) break;
      const lotQty = Math.max(0, Number(lot.remainingQuantity || 0));
      if (lotQty <= 0) continue;

      const take = Math.min(lotQty, remaining);
      let unitPrice = Number(lot.sellingPrice);
      if (isNaN(unitPrice) || unitPrice <= 0) {
        unitPrice = parsePrice(lot.discountedPrice || lot.mrp || item.price);
      }
      if (unitPrice <= 0) {
        unitPrice = item.price;
      }

      const lineTotal = take * unitPrice;
      total += lineTotal;
      remaining -= take;

      breakdown.push({
        lotNumber: lot.lotNumber,
        quantity: take,
        unitPrice,
        total: lineTotal,
      });
    }

    if (remaining > 0) {
      const fallbackPrice = breakdown.length > 0 ? breakdown[breakdown.length - 1].unitPrice : item.price;
      const lineTotal = remaining * fallbackPrice;
      total += lineTotal;
      breakdown.push({
        quantity: remaining,
        unitPrice: fallbackPrice,
        total: lineTotal,
      });
    }

    return { total, breakdown };
  }

  return {
    total: item.price * item.quantity,
    breakdown: [
      {
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      },
    ],
  };
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  showAddedToast: boolean;
  lastAddedItem: CartItem | null;
  totalItems: number;
  subtotal: number;
  subtotalFormatted: string;
  freeDeliveryThreshold: number;
  isFreeDeliveryUnlocked: boolean;
  freeDeliveryRemaining: number;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product | any, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  closeToast: () => void;
  getItemTotal: (item: CartItem) => CartItemTotalResult;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "brickverse_shopping_cart";
// Free delivery threshold removed per policy: delivery is always charged (৳60 inside Dhaka, ৳120 outside Dhaka)
const FREE_DELIVERY_THRESHOLD = 0;

export function parsePrice(priceVal: string | number | undefined): number {
  if (typeof priceVal === "number") return priceVal;
  if (!priceVal) return 0;
  const cleaned = String(priceVal).replace(/[^\d.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      } else {
        setItems([]);
      }
    } catch (e) {
      console.warn("Failed to load cart from storage", e);
      setItems([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Listen for logout event to clear cart so old user products do not remain in guest cart
  useEffect(() => {
    const handleAuthLogout = () => {
      setItems([]);
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
      } catch (e) {
        console.warn("Failed to clear cart on logout", e);
      }
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => {
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn("Failed to save cart to storage", e);
      }
    }
  }, [items, isInitialized]);

  // Derived metrics
  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + calculateCartItemTotal(item).total, 0);
  }, [items]);

  const subtotalFormatted = useMemo(() => {
    return formatPrice(subtotal);
  }, [subtotal]);

  // Delivery is never free
  const isFreeDeliveryUnlocked = false;
  const freeDeliveryRemaining = 0;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeToast = () => setShowAddedToast(false);

  const addToCart = (product: Product | any, quantity = 1, openDrawer = true) => {
    const rawPrice = product.discountedPrice || product.price || product.regularPrice || 0;
    const numPrice = parsePrice(rawPrice);
    const rawOriginalPrice = product.originalPrice || product.regularPrice;
    const numOriginalPrice = rawOriginalPrice ? parsePrice(rawOriginalPrice) : undefined;
    const id = String(product.id || product.slug || Date.now());
    const name = product.name || "Collector Product";
    const subtitle = product.subtitle || product.series || undefined;
    const image = product.image || "/images/figure-samurai-red.svg";
    const cardBg = product.cardBg || undefined;
    const seller = product.seller || product.brand || "Kawaii Subete Official";
    const category = product.category || "General";
    const slug = product.slug || product.id;
    const stockNum: number | undefined = typeof product.stock === "number" ? Math.max(0, product.stock) : undefined;
    const preorder = stockNum === 0 && product.productType !== "grouped";
    if (stockNum === 0 && !preorder) return; // a bundle with no complete set available can't be sold
    const maxStock = preorder ? undefined : stockNum;

    const activeLots: ActiveLotInfo[] | undefined = Array.isArray(product.activeLots)
      ? product.activeLots
      : undefined;

    const newItem: CartItem = {
      id,
      name,
      subtitle,
      price: numPrice,
      originalPrice: numOriginalPrice && numOriginalPrice > numPrice ? numOriginalPrice : undefined,
      priceFormatted: formatPrice(numPrice),
      image,
      cardBg,
      quantity,
      seller,
      category,
      slug,
      maxStock,
      preorder: preorder || undefined,
      activeLots,
    };

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const current = updated[existingIndex];
        const cap = maxStock ?? current.maxStock;
        const wanted = current.quantity + quantity;
        updated[existingIndex] = {
          ...current,
          maxStock: cap,
          quantity: cap !== undefined ? Math.min(cap, wanted) : wanted,
          activeLots: activeLots || current.activeLots,
        };
        return updated;
      } else {
        return [...prevItems, { ...newItem, quantity: maxStock !== undefined ? Math.min(maxStock, quantity) : quantity }];
      }
    });

    setLastAddedItem(newItem);
    setShowAddedToast(true);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.maxStock !== undefined ? Math.min(item.maxStock, quantity) : quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
      } catch (e) {
        console.warn("Failed to clear cart storage", e);
      }
    }
  };

  // Synchronize cart items with live product active lots from API
  useEffect(() => {
    if (!isInitialized || items.length === 0) return;

    let isMounted = true;
    const syncLots = async () => {
      try {
        const ids = items.map((i) => i.id).filter(Boolean);
        if (ids.length === 0) return;

        const res = await fetch(`${getApiBaseUrl()}/products/?ids=${encodeURIComponent(ids.join(","))}`, {
          cache: "no-store",
        });
        if (!res.ok) return;

        const data = await res.json();
        const prods: any[] = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : []);
        if (prods.length === 0 || !isMounted) return;

        const prodMap = new Map<string, any>();
        prods.forEach((p) => {
          if (p.id) prodMap.set(String(p.id), p);
          if (p.slug) prodMap.set(String(p.slug), p);
        });

        setItems((currentItems) => {
          let hasDiff = false;
          const updated = currentItems.map((item) => {
            const liveProd = prodMap.get(item.id) || prodMap.get(item.slug || "");
            if (!liveProd) return item;

            const liveLots = Array.isArray(liveProd.activeLots) ? liveProd.activeLots : [];
            const liveStock = typeof liveProd.stock === "number" ? Math.max(0, liveProd.stock) : item.maxStock;
            const livePrice = parsePrice(liveProd.discountedPrice || liveProd.price || liveProd.regularPrice || item.price);

            const lotsChanged = JSON.stringify(liveLots) !== JSON.stringify(item.activeLots || []);
            const stockChanged = liveStock !== item.maxStock;
            const priceChanged = livePrice !== item.price && livePrice > 0;

            if (lotsChanged || stockChanged || priceChanged) {
              hasDiff = true;
              return {
                ...item,
                activeLots: liveLots,
                maxStock: liveStock,
                price: livePrice > 0 ? livePrice : item.price,
                priceFormatted: formatPrice(livePrice > 0 ? livePrice : item.price),
              };
            }
            return item;
          });

          return hasDiff ? updated : currentItems;
        });
      } catch (err) {
        console.warn("Failed to sync cart items with live lots:", err);
      }
    };

    syncLots();
    return () => {
      isMounted = false;
    };
  }, [isInitialized, isCartOpen]);

  return (
    <CartContext.Provider
      value={{
        items,
        getItemTotal: calculateCartItemTotal,
        isCartOpen,
        showAddedToast,
        lastAddedItem,
        totalItems,
        subtotal,
        subtotalFormatted,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        isFreeDeliveryUnlocked,
        freeDeliveryRemaining,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        closeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
