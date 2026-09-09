"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CustomerDashboard from "@/components/CustomerDashboard";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default function CustomerDashboardSlugPage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];

  // Map slug array to CustomerDashboard tab & parameter:
  // /dashboard                     -> account
  // /dashboard/orders              -> orders
  // /dashboard/orders/[orderNum]   -> orders-single (with orderNum)
  // /dashboard/track-order         -> track
  // /dashboard/track-order/[orderNum] -> track (with orderNum)
  // /dashboard/wishlist            -> wishlist
  // /dashboard/coupons             -> coupons
  // /dashboard/password            -> password
  let initialTab: "account" | "orders" | "orders-single" | "track" | "wishlist" | "coupons" | "password" = "account";
  let initialOrderParam: string | undefined = undefined;

  if (slug.length === 0) {
    initialTab = "account";
  } else if (slug[0] === "orders") {
    if (slug.length >= 2) {
      initialTab = "orders-single";
      initialOrderParam = slug[1];
    } else {
      initialTab = "orders";
    }
  } else if (slug[0] === "track-order" || slug[0] === "track") {
    initialTab = "track";
    if (slug.length >= 2) {
      initialOrderParam = slug[1];
    }
  } else if (slug[0] === "wishlist") {
    initialTab = "wishlist";
  } else if (slug[0] === "coupons") {
    initialTab = "coupons";
  } else if (slug[0] === "password") {
    initialTab = "password";
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && isAuthenticated && user?.role === "admin") {
      router.replace("/en/admin");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF6EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#736E9B]">Loading Brickverse workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role === "admin") {
    return null;
  }

  return (
    <CustomerDashboard
      user={user}
      initialTab={initialTab}
      initialOrderParam={initialOrderParam}
    />
  );
}
