"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Product } from "@/components/productData";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  priceFormatted: string;
  image: string;
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
const FREE_DELIVERY_THRESHOLD = 500; // ৳500

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

// Initial items matching the design demonstration
const INITIAL_DEMO_ITEMS: CartItem[] = [
  {
    id: "demo-item-1",
    name: "Live Rui 2.5 Kg - 3.5 Kg (Culture)",
    price: 335.0,
    priceFormatted: "৳335.00",
    image: "/images/figure-samurai-red.svg",
    quantity: 1,
    seller: "Eezy Mart Official",
    category: "Fresh Catch",
    slug: "live-rui",
  },
  {
    id: "demo-item-2",
    name: "Bagda Prawn (60-85 Pcs)",
    price: 700.0,
    priceFormatted: "৳700.00",
    image: "/images/figure-mecha-teal.svg",
    quantity: 1,
    seller: "Eezy Mart Official",
    category: "Fresh Catch",
    slug: "bagda-prawn",
  },
];

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
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        } else {
          setItems(INITIAL_DEMO_ITEMS);
        }
      } else {
        setItems(INITIAL_DEMO_ITEMS);
      }
    } catch (e) {
      console.warn("Failed to load cart from storage", e);
      setItems(INITIAL_DEMO_ITEMS);
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
    const id = String(product.id || product.slug || Date.now());
    const name = product.name || "Collector Product";
    const image = product.image || "/images/figure-samurai-red.svg";
    const seller = product.seller || product.brand || "Brickverse Official";
    const category = product.category || "General";
    const slug = product.slug || product.id;

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
        const newItem: CartItem = {
          id,
          name,
          price: numPrice,
          priceFormatted: formatPrice(numPrice),
          image,
          quantity,
          seller,
          category,
          slug,
        };
        return [...prevItems, newItem];
      }
    });

    const addedItem: CartItem = {
      id,
      name,
      price: numPrice,
      priceFormatted: formatPrice(numPrice),
      image,
      quantity,
      seller,
      category,
      slug,
    };
    setLastAddedItem(addedItem);
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
