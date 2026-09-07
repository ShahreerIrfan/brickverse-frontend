"use client";

import { useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default function AdminRedirectPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug || [];

  useEffect(() => {
    const target = slug.length ? `/en/admin/${slug.join("/")}` : "/en/admin";
    router.replace(target);
  }, [slug, router]);

  return (
    <div className="min-h-screen bg-[#FFF6EE] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-[#736E9B]">Redirecting to Admin Portal...</p>
      </div>
    </div>
  );
}
