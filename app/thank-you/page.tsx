import { Suspense } from "react";
import { Metadata } from "next";
import ThankYouPage from "@/components/ThankYouPage";

export const metadata: Metadata = {
  title: "Order Confirmed | Brickverse",
  description: "Thank you for your order! Your Brickverse collectibles are on their way.",
};

export default function ThankYou() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF6EE] flex items-center justify-center font-[family-name:var(--font-sans)]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#FF4D6D] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-[#736E9B]">Loading order confirmation...</p>
          </div>
        </div>
      }
    >
      <ThankYouPage />
    </Suspense>
  );
}
