"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Product } from "@/components/productData";

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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "brickverse_shopping_cart";
const FREE_DELIVERY_THRESHOLD = 500; // ৳500 / $60 threshold

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
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const subtotalFormatted = useMemo(() => {
    return formatPrice(subtotal);
  }, [subtotal]);

  const isFreeDeliveryUnlocked = subtotal >= FREE_DELIVERY_THRESHOLD;
  const freeDeliveryRemaining = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

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
    const seller = product.seller || product.brand || "Brickverse Official";
    const category = product.category || "General";
    const slug = product.slug || product.id;

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
    };

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        return [...prevItems, newItem];
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
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
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

  return (
    <CartContext.Provider
      value={{
        items,
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
