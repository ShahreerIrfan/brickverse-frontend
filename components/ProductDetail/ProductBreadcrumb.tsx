import Link from "next/link";
import { IconChevronRight, IconArrowLeft } from "../icons";
import type { Product } from "../productData";

interface ProductBreadcrumbProps {
  product: Product;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  const categoryName = product.category || "Anime figures";
  const seriesName = product.series || product.subtitle?.split("·")[0]?.trim() || "Ronin series";

  return (
    <div className="flex items-center justify-between py-3 text-xs sm:text-[13px] border-b border-[#EAE3F7]/80 flex-wrap gap-2">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-[#736E9B] overflow-x-auto whitespace-nowrap py-1">
        <Link href="/" className="hover:text-[#FF4D6D] transition-colors font-medium">
          Home
        </Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA] shrink-0" />
        <Link href={`/?category=${encodeURIComponent(categoryName)}`} className="hover:text-[#FF4D6D] transition-colors font-medium">
          {categoryName}
        </Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA] shrink-0" />
        <span className="hover:text-[#FF4D6D] transition-colors font-medium cursor-pointer">
          {seriesName}
        </span>
        <IconChevronRight className="w-3.5 h-3.5 text-[#B9B2DA] shrink-0" />
        <span className="font-extrabold text-[#171136] truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736E9B] hover:text-[#FF4D6D] transition-colors shrink-0"
      >
        <IconArrowLeft className="w-3.5 h-3.5" />
        <span>Back to {categoryName.toLowerCase()}</span>
      </Link>
    </div>
  );
}
