import Link from "next/link";
import Navbar from "@/components/Navbar";
import NavLinks from "@/components/NavLinks";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "404: Page Not Found | Kawaii Subete",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFF6EE]">
      <Navbar />
      <NavLinks />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#FFEAF0] text-[#FF4D6D] flex items-center justify-center text-3xl font-extrabold mb-6 shadow-sm">
          404
        </div>
        <h1 className="font-[family-name:var(--font-display)] font-extrabold text-2xl sm:text-4xl text-[#171136] tracking-tight">
          Oops! Page Not Found
        </h1>
        <p className="text-sm sm:text-base text-[#736E9B] mt-2.5 max-w-md">
          The collectible, category, or article you are looking for doesn&apos;t exist or might have been relocated.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            href="/shop"
            className="px-6 py-3 rounded-full bg-[#FF4D6D] hover:bg-[#e83e5f] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF4D6D]/20 transition-all active:scale-95"
          >
            Browse All Collectibles
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-white hover:bg-[#F6F1FF] text-[#171136] text-xs sm:text-sm font-bold border border-[#EAE3F7] shadow-sm transition-all active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

