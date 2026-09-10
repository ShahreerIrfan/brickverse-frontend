"use client";

import React, { useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/AdminDashboard";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default function AdminRoutePage({ params }: PageProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];

  // Map slug array to AdminDashboard tab
  // /en/admin                       -> dashboard
  // /en/admin/products              -> products-all
  // /en/admin/products/new          -> products-form
  // /en/admin/products/taxonomy     -> products-taxonomy
  // /en/admin/orders                -> orders-all
  // /en/admin/users                 -> users-all
  let initialNav:
    | "dashboard"
    | "products-all"
    | "products-form"
    | "products-taxonomy"
    | "orders-all"
    | "orders-single"
    | "users-all"
    | "stores-all"
    | "stores-single"
    | "stores-form" = "dashboard";
  let initialOrderId: string | undefined = undefined;
  let initialStoreId: string | undefined = undefined;

  if (slug.length >= 2 && slug[0] === "products") {
    if (slug[1] === "new" || slug[1] === "edit" || slug[1] === "add") {
      initialNav = "products-form";
    } else if (slug[1] === "taxonomy" || slug[1] === "categories") {
      initialNav = "products-taxonomy";
    } else {
      initialNav = "products-all";
    }
  } else if (slug.length === 1 && slug[0] === "products") {
    initialNav = "products-all";
  } else if (slug[0] === "orders") {
    if (slug.length >= 2) {
      initialNav = "orders-single";
      initialOrderId = slug[1];
    } else {
      initialNav = "orders-all";
    }
  } else if (slug[0] === "users") {
    initialNav = "users-all";
  } else if (slug[0] === "stores") {
    if (slug.length >= 2 && slug[1] === "new") {
      initialNav = "stores-form";
    } else if (slug.length >= 2) {
      initialNav = "stores-single";
      initialStoreId = slug[1];
    } else {
      initialNav = "stores-all";
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && isAuthenticated && user?.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF6EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#736E9B]">Loading Brickverse Admin Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null;
  }

  return (
    <AdminDashboard
      user={user}
      initialNav={initialNav}
      initialOrderId={initialOrderId}
      initialStoreId={initialStoreId}
    />
  );
}
