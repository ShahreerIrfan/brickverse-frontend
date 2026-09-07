"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/components/productData";
import { loginUser, registerCustomer, logoutUser, getCurrentUser } from "@/lib/api";

type AuthMode = "login" | "signup";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authMode: AuthMode;
  openLoginModal: () => void;
  openSignupModal: () => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: AuthMode) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "brickverse_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  // Load user from localStorage or API on initial render
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to read user from storage", e);
    }

    // Verify session with backend
    getCurrentUser()
      .then((res) => {
        if (res && res.authenticated && res.user) {
          setUser(res.user);
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
        } else if (!stored) {
          setUser(null);
        }
      })
      .catch(() => {
        // Keep stored user if offline
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const openLoginModal = () => {
    setAuthMode("login");
    setIsAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      closeAuthModal();
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || res.error || "Login failed" };
  };

  const signup = async (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => {
    const res = await registerCustomer(data);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      closeAuthModal();
      return { success: true, message: res.message };
    }
    return { success: false, message: res.message || res.error || "Sign up failed" };
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authMode,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        setAuthMode,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
