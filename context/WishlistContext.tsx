"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId?: string | number | null) => boolean;
  toggleWishlist: (productId?: string | number | null, productName?: string) => void;
  addToWishlist: (productId?: string | number | null, productName?: string) => void;
  removeFromWishlist: (productId?: string | number | null) => void;
  wishlistToast: string | null;
  closeWishlistToast: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "brickverse_wishlist_ids";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [wishlistToast, setWishlistToast] = useState<string | null>(null);

  // Load wishlist from localStorage on mount (preserves items across sessions/login/logout)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistIds(parsed.map(String));
        }
      }
    } catch (e) {
      console.warn("Failed to load wishlist from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage on changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
      } catch (e) {
        console.warn("Failed to save wishlist to storage", e);
      }
    }
  }, [wishlistIds, isInitialized]);

  const closeWishlistToast = useCallback(() => {
    setWishlistToast(null);
  }, []);

  const isInWishlist = useCallback(
    (productId?: string | number | null) => {
      if (productId === undefined || productId === null) return false;
      const idStr = String(productId);
      return wishlistIds.includes(idStr);
    },
    [wishlistIds]
  );

  const addToWishlist = useCallback((productId?: string | number | null, productName?: string) => {
    if (productId === undefined || productId === null) return;
    const idStr = String(productId);
    setWishlistIds((prev) => {
      if (prev.includes(idStr)) return prev;
      return [...prev, idStr];
    });
    setWishlistToast(productName ? `Added "${productName}" to your wishlist!` : "Added to your wishlist!");
    setTimeout(() => {
      setWishlistToast(null);
    }, 2800);
  }, []);

  const removeFromWishlist = useCallback((productId?: string | number | null) => {
    if (productId === undefined || productId === null) return;
    const idStr = String(productId);
    setWishlistIds((prev) => prev.filter((id) => id !== idStr));
  }, []);

  const toggleWishlist = useCallback(
    (productId?: string | number | null, productName?: string) => {
      if (productId === undefined || productId === null) return;
      const idStr = String(productId);
      if (wishlistIds.includes(idStr)) {
        removeFromWishlist(idStr);
        setWishlistToast(productName ? `Removed "${productName}" from wishlist` : "Removed from wishlist");
        setTimeout(() => {
          setWishlistToast(null);
        }, 2500);
      } else {
        addToWishlist(idStr, productName);
      }
    },
    [wishlistIds, addToWishlist, removeFromWishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        wishlistToast,
        closeWishlistToast,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
