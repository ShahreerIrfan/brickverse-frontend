import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import CartPage from "@/components/CartPage";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "Shopping Cart | Brickverse",
  description:
    "Review your Brickverse shopping cart with authentic anime figures, building sets, and STEM coding kits.",
};

export default function Cart() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE] pb-16 lg:pb-0">
      <Navbar />
      <NavLinks />

      <main className="flex-1">
        <CartPage />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}
