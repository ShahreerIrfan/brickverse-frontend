"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  IconHeart,
  IconBag,
  IconStar,
  IconSearch,
  IconChevronRight,
  IconChevronDown,
  IconFilter,
  IconEye,
  IconCheck,
  IconX,
  IconArrowRight,
} from "./icons";
import { CategoryGlyph } from "./CategoryRail";
import type { Product, Category, SubCategory } from "./productData";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

type ShopCatalogProps = {
  initialProducts: Product[];
  initialCategories: Category[];
};

function ShopCatalogContent({ initialProducts, initialCategories }: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const router = useRouter();
  const { openLoginModal } = useAuth();

  // URL Query parameter states
  const paramCategory = searchParams.get("category") || "all";
  const paramSubcategory = searchParams.get("subcategory") || "all";
  const paramSearch = searchParams.get("search") || "";

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(paramCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(paramSubcategory);
  const [searchQuery, setSearchQuery] = useState<string>(paramSearch);
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Quick view modal state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [wishlistProductIds, setWishlistProductIds] = useState<Set<string>>(new Set());

  // Keep state in sync if URL parameters change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSelectedSubcategory(searchParams.get("subcategory") || "all");
    if (searchParams.get("search")) {
      setSearchQuery(searchParams.get("search") || "");
    }
  }, [searchParams]);

  // Auto-expand category if selected from URL
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "all") {
      setExpandedCategories((prev) => ({ ...prev, [selectedCategory]: true }));
    }
  }, [selectedCategory]);

  const toggleCategoryExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory("all");
    setExpandedCategories((prev) => ({ ...prev, [catId]: true }));
    setMobileFilterOpen(false);
  };

  const handleSelectSubcategory = (catId: string, subId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory(subId);
    setMobileFilterOpen(false);
  };

  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = parseFloat(minPriceInput);
    const max = parseFloat(maxPriceInput);
    setAppliedMinPrice(!isNaN(min) && min >= 0 ? min : null);
    setAppliedMaxPrice(!isNaN(max) && max >= 0 ? max : null);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedSubcategory("all");
    setSearchQuery("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setAppliedMinPrice(null);
    setAppliedMaxPrice(null);
    setSelectedRating(null);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy("newest");
    setMobileFilterOpen(false);
  };

  const toggleWishlist = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Helper to extract numeric price
  const parsePrice = (priceStr?: string): number => {
    if (!priceStr) return 0;
    const num = parseFloat(priceStr.replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== "all") {
        const productCat = (product.category || "").toLowerCase();
        const targetCat = selectedCategory.toLowerCase();
        if (!productCat.includes(targetCat) && targetCat !== productCat) {
          return false;
        }
      }

      // 2. Subcategory Filter
      if (selectedSubcategory !== "all") {
        const productSubId = typeof product.subcategory === "object" ? product.subcategory?.id : product.subcategoryId || product.subcategory;
        if (productSubId !== selectedSubcategory) {
          return false;
        }
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = product.name?.toLowerCase().includes(query);
        const matchDesc = product.description?.toLowerCase().includes(query);
        const matchCategory = product.category?.toLowerCase().includes(query);
        const matchSku = product.sku?.toLowerCase().includes(query);
        if (!matchName && !matchDesc && !matchCategory && !matchSku) {
          return false;
        }
      }

      // 4. Price Filter
      const priceVal = parsePrice(product.discountedPrice || product.price);
      if (appliedMinPrice !== null && priceVal < appliedMinPrice) {
        return false;
      }
      if (appliedMaxPrice !== null && priceVal > appliedMaxPrice) {
        return false;
      }

      // 5. Rating Filter
      if (selectedRating !== null) {
        const rating = product.rating ?? 5.0;
        if (rating < selectedRating) {
          return false;
        }
      }

      // 6. Stock Filter
      if (inStockOnly && (product.stock ?? 1) <= 0) {
        return false;
      }

      // 7. On Sale Filter
      if (onSaleOnly) {
        const regular = parsePrice(product.regularPrice || product.originalPrice);
        const disc = parsePrice(product.discountedPrice || product.price);
        if (regular <= disc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") {
        return parsePrice(a.discountedPrice || a.price) - parsePrice(b.discountedPrice || b.price);
      }
      if (sortBy === "price_desc") {
        return parsePrice(b.discountedPrice || b.price) - parsePrice(a.discountedPrice || a.price);
      }
      if (sortBy === "rating") {
        return (b.rating ?? 5) - (a.rating ?? 5);
      }
      if (sortBy === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "discount") {
        const discA = a.discountPercent ?? 0;
        const discB = b.discountPercent ?? 0;
        return discB - discA;
      }
      // default "newest"
      return 0;
    });
  }, [
    initialProducts,
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    appliedMinPrice,
    appliedMaxPrice,
    selectedRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  // Current active category object
  const currentCategoryObj = initialCategories.find(
    (c) => c.id.toLowerCase() === selectedCategory.toLowerCase()
  );

  const activeFilterCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSubcategory !== "all" ? 1 : 0) +
    (appliedMinPrice !== null || appliedMaxPrice !== null ? 1 : 0) +
    (selectedRating !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 sm:pb-12">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#736E9B] mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-[#FF4D6D] transition-colors font-medium shrink-0">
          Home
        </Link>
        <IconChevronRight className="w-3.5 h-3.5 text-[#A59FC2] shrink-0" />
        <button
          onClick={handleResetFilters}
          className={`hover:text-[#FF4D6D] transition-colors font-medium shrink-0 ${
            selectedCategory === "all" ? "text-[#171136] font-bold" : ""
          }`}
        >
          All Products
        </button>
        {currentCategoryObj && (
          <>
            <IconChevronRight className="w-3.5 h-3.5 text-[#A59FC2] shrink-0" />
            <span className="text-[#171136] font-bold truncate">{currentCategoryObj.label}</span>
          </>
        )}
      </nav>

      {/* 2. Top Header Title & Sorting Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 pb-4 border-b border-[#EAE3F7] mb-5 sm:mb-6">
        <div>
          <h1 className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-3xl text-[#171136] tracking-tight">
            {currentCategoryObj ? currentCategoryObj.label : "All Products"}
          </h1>
          <p className="text-xs sm:text-sm text-[#736E9B] mt-0.5 sm:mt-1 font-medium">
            Showing <span className="font-bold text-[#171136]">{filteredProducts.length}</span>{" "}
            products {searchQuery ? `for "${searchQuery}"` : ""}
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-[#F6F1FF] hover:bg-[#EFE9FF] border border-[#EAE3F7] text-[#171136] font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl sm:rounded-full shadow-xs active:scale-95 transition-all"
          >
            <IconFilter className="w-4 h-4 text-[#FF4D6D]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#FF4D6D] text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="hidden sm:inline text-xs font-semibold text-[#736E9B]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#EAE3F7] text-[#171136] font-semibold text-xs sm:text-sm rounded-xl px-2.5 sm:px-3.5 py-2 sm:py-2.5 outline-none focus:border-[#FF4D6D] shadow-xs cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="discount">Biggest Discount</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Layout: Left Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-6 xl:gap-8">
        
        {/* Desktop Sidebar (Left filter system) */}
        <aside className="hidden lg:block w-[280px] shrink-0 bg-white border border-[#EAE3F7] rounded-[22px] shadow-[0_16px_0_-4px_rgba(23,17,54,0.06)] p-5 space-y-6">
          <FilterSidebarContent
            categories={initialCategories}
            products={initialProducts}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            expandedCategories={expandedCategories}
            toggleCategoryExpand={toggleCategoryExpand}
            handleSelectCategory={handleSelectCategory}
            handleSelectSubcategory={handleSelectSubcategory}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            setMinPriceInput={setMinPriceInput}
            setMaxPriceInput={setMaxPriceInput}
            handleApplyPrice={handleApplyPrice}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            onSaleOnly={onSaleOnly}
            setOnSaleOnly={setOnSaleOnly}
            handleResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl">
              <span className="text-xs font-bold text-[#736E9B]">Active Filters:</span>

              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#FF4D6D]/30 text-[#FF4D6D] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Category: {currentCategoryObj?.label || selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:opacity-75">
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubcategory !== "all" && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#7B5CFF]/30 text-[#7B5CFF] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Subcategory: {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory("all")} className="hover:opacity-75">
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(appliedMinPrice !== null || appliedMaxPrice !== null) && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#EAE3F7] text-[#171136] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Price: ৳{appliedMinPrice ?? 0} - ৳{appliedMaxPrice ?? "Max"}
                  <button
                    onClick={() => {
                      setAppliedMinPrice(null);
                      setAppliedMaxPrice(null);
                      setMinPriceInput("");
                      setMaxPriceInput("");
                    }}
                    className="hover:opacity-75"
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedRating !== null && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#EAE3F7] text-[#171136] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  ★ {selectedRating} stars & up
                  <button onClick={() => setSelectedRating(null)} className="hover:opacity-75">
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#EAE3F7] text-[#171136] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  In Stock Only
                  <button onClick={() => setInStockOnly(false)} className="hover:opacity-75">
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              )}

              {onSaleOnly && (
                <span className="inline-flex items-center gap-1.5 bg-white border border-[#EAE3F7] text-[#171136] text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
                  On Sale
                  <button onClick={() => setOnSaleOnly(false)} className="hover:opacity-75">
                    <IconX className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#FF4D6D] hover:underline ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Grid of Products */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#EAE3F7] rounded-[24px] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFF1F4] flex items-center justify-center mb-4">
                <IconSearch className="w-7 h-7 sm:w-8 sm:h-8 text-[#FF4D6D]" />
              </div>
              <h3 className="font-[family-name:var(--font-display)] font-extrabold text-base sm:text-lg text-[#171136]">
                No products found
              </h3>
              <p className="text-xs sm:text-sm text-[#736E9B] mt-1 max-w-sm">
                We couldn't find any products matching your current filters. Try changing or clearing your filter settings.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-5 bg-[#FF4D6D] hover:bg-[#ff3358] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4.5">
              {filteredProducts.map((product) => {
                const isWishlisted = wishlistProductIds.has(product.id);
                const regularPrice = product.regularPrice || product.originalPrice;
                const discountedPrice = product.discountedPrice || product.price;
                const discountPercent =
                  product.discountPercent ||
                  (() => {
                    const reg = parsePrice(regularPrice);
                    const disc = parsePrice(discountedPrice);
                    if (reg > disc && disc > 0) return Math.round(((reg - disc) / reg) * 100);
                    return null;
                  })();

                return (
                  <div
                    key={product.id}
                    className="relative bg-white border border-[#EAE3F7] rounded-2xl sm:rounded-[20px] shadow-[0_10px_0_-5px_rgba(23,17,54,0.06)] hover:shadow-[0_16px_28px_-6px_rgba(23,17,54,0.12)] overflow-hidden flex flex-col group transition-all hover:-translate-y-1"
                  >
                    {/* Top Image Box */}
                    <div className="relative h-[130px] sm:h-[180px] bg-[#FAF7FF] flex items-center justify-center p-2.5 sm:p-3 overflow-hidden">
                      {discountPercent ? (
                        <span className="absolute left-2 top-2 bg-[#FF4D6D] text-white text-[9px] sm:text-[10.5px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full z-10 shadow-xs">
                          -{discountPercent}%
                        </span>
                      ) : null}

                      {/* Top Right Actions (Heart + Quick View Eye) */}
                      <div className="absolute right-1.5 top-1.5 sm:right-2 sm:top-2 z-10 flex flex-col gap-1 sm:gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          aria-label="Wishlist"
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                            isWishlisted ? "text-[#FF4D6D]" : "text-[#736E9B] hover:text-[#FF4D6D]"
                          }`}
                        >
                          <IconHeart className="w-3.5 h-3.5" style={{ fill: isWishlisted ? "#FF4D6D" : "none" }} />
                        </button>

                        <button
                          type="button"
                          aria-label="Quick View"
                          onClick={() => setQuickViewProduct(product)}
                          className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xs text-[#736E9B] hover:text-[#7B5CFF] transition-colors cursor-pointer"
                        >
                          <IconEye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link
                        href={`/product/${product.slug || product.id}`}
                        className="w-full h-full flex items-center justify-center p-1"
                      >
                        <Image
                          src={product.image || "/images/figure-samurai-red.svg"}
                          alt={product.name}
                          width={140}
                          height={160}
                          className="w-[70px] sm:w-[110px] h-auto max-h-[115px] sm:max-h-[160px] object-contain transition-transform group-hover:scale-105 drop-shadow-sm"
                        />
                      </Link>
                    </div>

                    {/* Card Content Details */}
                    <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between gap-1.5 sm:gap-2.5">
                      <div>
                        <span
                          className="text-[8.5px] sm:text-[10px] font-bold tracking-wide uppercase block truncate"
                          style={{ color: product.categoryColor || "#7B5CFF" }}
                        >
                          {product.category}
                        </span>
                        <Link
                          href={`/product/${product.slug || product.id}`}
                          className="font-[family-name:var(--font-display)] font-extrabold text-[12px] sm:text-[14.5px] text-[#171136] hover:text-[#FF4D6D] transition-colors line-clamp-2 mt-0.5 leading-snug"
                        >
                          {product.name}
                        </Link>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IconStar
                            key={i}
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                            filled={i < Math.round(product.rating ?? 5)}
                          />
                        ))}
                        <span className="text-[9.5px] sm:text-[11px] text-[#736E9B] font-medium ml-1">
                          ({product.reviews ?? 0})
                        </span>
                      </div>

                      {/* Price & Add to Cart Action Button */}
                      <div className="pt-2 sm:pt-2.5 border-t border-[#F0EBF9] flex items-center justify-between gap-1.5 mt-auto">
                        <div className="flex flex-col min-w-0">
                          <span className="font-[family-name:var(--font-display)] font-extrabold text-[13px] sm:text-[16px] text-[#171136] leading-none truncate">
                            {discountedPrice}
                          </span>
                          {regularPrice && regularPrice !== discountedPrice && (
                            <span className="text-[9.5px] sm:text-[11px] text-[#736E9B] line-through font-medium mt-0.5 truncate">
                              {regularPrice}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product, 1, true);
                          }}
                          aria-label={`Add ${product.name} to cart`}
                          title={`Add ${product.name} to cart`}
                          className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-[#FF4D6D] hover:bg-[#E63956] text-white text-[11px] sm:text-[12.5px] font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-full shadow-[0_3px_10px_rgba(255,77,109,0.28)] active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                          <IconBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                          <span className="hidden min-[380px]:inline font-extrabold">Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 4. Mobile Filter Slide-out Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-[85%] max-w-[320px] bg-white h-full overflow-y-auto p-5 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE3F7] mb-5">
              <div className="flex items-center gap-2">
                <IconFilter className="w-4 h-4 text-[#FF4D6D]" />
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-base text-[#171136]">
                  Filter Products
                </h3>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F6F1FF] flex items-center justify-center text-[#736E9B]"
              >
                <IconX className="w-4 h-4" />
              </button>
            </div>

            <FilterSidebarContent
              categories={initialCategories}
              products={initialProducts}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
              expandedCategories={expandedCategories}
              toggleCategoryExpand={toggleCategoryExpand}
              handleSelectCategory={handleSelectCategory}
              handleSelectSubcategory={handleSelectSubcategory}
              minPriceInput={minPriceInput}
              maxPriceInput={maxPriceInput}
              setMinPriceInput={setMinPriceInput}
              setMaxPriceInput={setMaxPriceInput}
              handleApplyPrice={handleApplyPrice}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              onSaleOnly={onSaleOnly}
              setOnSaleOnly={setOnSaleOnly}
              handleResetFilters={handleResetFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>
        </div>
      )}

      {/* 5. Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setQuickViewProduct(null)}
          />
          <div className="relative z-10 bg-white rounded-[24px] sm:rounded-[28px] max-w-2xl w-full p-5 sm:p-8 shadow-2xl border border-[#EAE3F7] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto flex flex-col sm:flex-row gap-5 sm:gap-6">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F6F1FF] hover:bg-[#EFE9FF] flex items-center justify-center text-[#171136] cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>

            <div className="sm:w-1/2 h-[180px] sm:h-auto bg-[#FAF7FF] rounded-2xl flex items-center justify-center p-4">
              <Image
                src={quickViewProduct.image || "/images/figure-samurai-red.svg"}
                alt={quickViewProduct.name}
                width={180}
                height={220}
                className="max-h-[160px] sm:max-h-[190px] w-auto drop-shadow-md object-contain"
              />
            </div>

            <div className="sm:w-1/2 flex flex-col justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase text-[#7B5CFF]">
                  {quickViewProduct.category}
                </span>
                <h3 className="font-[family-name:var(--font-display)] font-extrabold text-lg sm:text-xl text-[#171136] mt-1 leading-tight">
                  {quickViewProduct.name}
                </h3>
                <p className="text-xs text-[#736E9B] mt-2 line-clamp-3 leading-relaxed">
                  {quickViewProduct.description || "Authentic limited collector item from the Kawaii Subete universe."}
                </p>

                <div className="mt-3 sm:mt-4 flex items-baseline gap-2">
                  <span className="font-[family-name:var(--font-display)] font-extrabold text-xl sm:text-2xl text-[#171136]">
                    {quickViewProduct.discountedPrice || quickViewProduct.price}
                  </span>
                  {quickViewProduct.regularPrice && (
                    <span className="text-xs sm:text-sm text-[#736E9B] line-through">
                      {quickViewProduct.regularPrice}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(quickViewProduct, 1, true);
                    setQuickViewProduct(null);
                  }}
                  className="flex-1 bg-[#FF4D6D] hover:bg-[#E63956] text-white flex items-center justify-center gap-2 font-extrabold text-xs sm:text-sm py-2.5 sm:py-3 rounded-full shadow-[0_4px_12px_rgba(255,77,109,0.28)] active:scale-95 transition-all cursor-pointer"
                >
                  <IconBag className="w-4 h-4 text-white" />
                  <span>Add to Cart</span>
                </button>
                <Link
                  href={`/product/${quickViewProduct.slug || quickViewProduct.id}`}
                  onClick={() => setQuickViewProduct(null)}
                  className="px-4 py-2.5 sm:py-3 bg-[#F6F1FF] hover:bg-[#EFE9FF] text-[#171136] text-center font-bold text-xs sm:text-sm rounded-full transition-all"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Filter Sidebar Content (Used for Desktop sidebar & Mobile Drawer)
function FilterSidebarContent({
  categories,
  products,
  selectedCategory,
  selectedSubcategory,
  expandedCategories,
  toggleCategoryExpand,
  handleSelectCategory,
  handleSelectSubcategory,
  minPriceInput,
  maxPriceInput,
  setMinPriceInput,
  setMaxPriceInput,
  handleApplyPrice,
  selectedRating,
  setSelectedRating,
  inStockOnly,
  setInStockOnly,
  onSaleOnly,
  setOnSaleOnly,
  handleResetFilters,
  activeFilterCount,
}: any) {
  return (
    <div className="space-y-6">
      
      {/* 1. CATEGORIES ACCORDION */}
      <div>
        <h4 className="text-[12px] font-extrabold tracking-wider text-[#FF4D6D] uppercase mb-3">
          CATEGORIES
        </h4>
        <div className="flex flex-col gap-1">
          {/* All Products Option */}
          <button
            onClick={() => handleSelectCategory("all")}
            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-bold transition-all text-left ${
              selectedCategory === "all"
                ? "bg-[#FFF1F4] text-[#FF4D6D] border-l-3 border-[#FF4D6D]"
                : "text-[#3B3468] hover:bg-[#FAF7FF]"
            }`}
          >
            <span>All Products</span>
            <span className="text-[11px] text-[#736E9B] font-semibold">{products.length}</span>
          </button>

          {/* Parent Categories with Subcategory expansion */}
          {categories.map((cat: Category) => {
            const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
            const isExpanded = !!expandedCategories[cat.id];
            const subs = cat.subcategories || [];

            return (
              <div key={cat.id} className="flex flex-col">
                <div
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#F3EEFF] text-[#171136] font-bold"
                      : "text-[#3B3468] hover:bg-[#FAF7FF]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <CategoryGlyph id={cat.id} color={cat.color} icon={cat.category_icon || cat.categoryIcon || cat.icon_type} />
                    </span>
                    <span className="truncate uppercase text-[12px]">{cat.label}</span>
                  </div>

                  {subs.length > 0 ? (
                    <button
                      type="button"
                      onClick={(e) => toggleCategoryExpand(cat.id, e)}
                      className="w-6 h-6 rounded-md hover:bg-black/5 flex items-center justify-center text-[#736E9B]"
                    >
                      <IconChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      />
                    </button>
                  ) : null}
                </div>

                {/* Subcategories (Expanded view) */}
                {isExpanded && subs.length > 0 && (
                  <div className="ml-7 pl-2.5 border-l-2 border-[#EAE3F7] my-1 flex flex-col gap-1">
                    {subs.map((sub: SubCategory) => {
                      const isSubSelected =
                        isSelected && selectedSubcategory === sub.id;
                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubcategory(cat.id, sub.id)}
                          className={`text-left text-[12px] py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                            isSubSelected
                              ? "font-bold text-[#FF4D6D] bg-[#FFF1F4]"
                              : "text-[#736E9B] hover:text-[#171136] hover:bg-[#FAF7FF]"
                          }`}
                        >
                          <span className="truncate">{sub.label}</span>
                          {isSubSelected && <IconCheck className="w-3 h-3 text-[#FF4D6D] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <hr className="border-[#F0EBF9]" />

      {/* 2. PRICE RANGE (Exact Match to Reference Image) */}
      <div>
        <h4 className="text-[12px] font-extrabold tracking-wider text-[#171136] uppercase mb-1">
          PRICE RANGE
        </h4>
        <p className="text-[11px] text-[#736E9B] font-medium mb-2.5">
          ৳0 - ৳15,000+
        </p>
        <form onSubmit={handleApplyPrice} className="space-y-2.5">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="w-full bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl px-3 py-1.5 text-xs text-[#171136] outline-none focus:border-[#FF4D6D]"
            />
            <span className="text-[#736E9B] text-xs font-bold">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="w-full bg-[#FAF7FF] border border-[#EAE3F7] rounded-xl px-3 py-1.5 text-xs text-[#171136] outline-none focus:border-[#FF4D6D]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#FFF1F4] hover:bg-[#ffe2e8] text-[#FF4D6D] font-extrabold text-xs py-2 rounded-xl border border-[#FF4D6D]/20 active:scale-98 transition-all cursor-pointer"
          >
            Apply
          </button>
        </form>
      </div>

      <hr className="border-[#F0EBF9]" />

      {/* 3. CUSTOMER RATING (Exact Match to Reference Image) */}
      <div>
        <h4 className="text-[12px] font-extrabold tracking-wider text-[#171136] uppercase mb-3">
          CUSTOMER RATING
        </h4>
        <div className="space-y-2">
          {[
            { stars: 5, label: "only" },
            { stars: 4, label: "& up" },
            { stars: 3, label: "& up" },
            { stars: 2, label: "& up" },
            { stars: 1, label: "& up" },
          ].map((item) => {
            const isChecked = selectedRating === item.stars;
            return (
              <label
                key={item.stars}
                onClick={() => setSelectedRating(isChecked ? null : item.stars)}
                className="flex items-center gap-2.5 cursor-pointer text-xs group"
              >
                <input
                  type="radio"
                  checked={isChecked}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 text-[#FF4D6D] accent-[#FF4D6D] cursor-pointer"
                />
                <div className="flex items-center gap-0.5 text-[#FFB800]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconStar key={i} className="w-3 h-3" filled={i < item.stars} />
                  ))}
                </div>
                <span className="text-[#736E9B] group-hover:text-[#171136] font-medium text-[11.5px]">
                  {item.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <hr className="border-[#F0EBF9]" />

      {/* 4. AVAILABILITY & DEALS */}
      <div>
        <h4 className="text-[12px] font-extrabold tracking-wider text-[#171136] uppercase mb-3">
          AVAILABILITY
        </h4>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF4D6D] accent-[#FF4D6D] cursor-pointer"
            />
            <span className="text-[#3B3468] font-semibold text-[12px]">In Stock only</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) => setOnSaleOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF4D6D] accent-[#FF4D6D] cursor-pointer"
            />
            <span className="text-[#3B3468] font-semibold text-[12px]">On Sale / Deals only</span>
          </label>
        </div>
      </div>

      {/* 5. RESET ALL FILTERS */}
      {activeFilterCount > 0 && (
        <button
          onClick={handleResetFilters}
          className="w-full bg-[#FAF7FF] hover:bg-[#F3EEFF] border border-[#EAE3F7] text-[#736E9B] hover:text-[#171136] font-bold text-xs py-2.5 rounded-xl transition-all"
        >
          Reset All Filters ({activeFilterCount})
        </button>
      )}

    </div>
  );
}

export default function ShopCatalog(props: ShopCatalogProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#736E9B]">Loading Shop...</div>}>
      <ShopCatalogContent {...props} />
    </Suspense>
  );
}
