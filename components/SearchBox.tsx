"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconChevronRight, IconSearch } from "./icons";
import type { Product } from "./productData";
import { getMediaUrl, getProductsPage } from "@/lib/api";

const MIN_CHARS = 1;
const DEBOUNCE_MS = 250;
const SUGGESTION_COUNT = 6;

// Header search with live suggestions: each keystroke (debounced) asks the
// server for the best few matches; stale requests are cancelled.
export default function SearchBox() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const query = term.trim();

  useEffect(() => {
    if (query.length < MIN_CHARS) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      setFailed(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      getProductsPage({ search: query }, 1, SUGGESTION_COUNT, controller.signal)
        .then((data) => {
          setResults(data.results);
          setTotal(data.count);
          setFailed(false);
          setActive(-1);
        })
        .catch(() => {
          if (!controller.signal.aborted) setFailed(true);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close when clicking anywhere outside the search box.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const goToResults = () => {
    setOpen(false);
    router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  const goToProduct = (p: Product) => {
    setOpen(false);
    router.push(`/product/${p.slug || p.id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) goToProduct(results[active]);
    else goToResults();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  const showPanel = open && query.length >= MIN_CHARS;

  return (
    <div ref={wrapRef} className="relative w-full lg:flex-1 lg:mx-4 min-w-0">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-[#F6F1FF] border border-[#EAE3F7] rounded-full h-11 sm:h-12.5 px-3.5 sm:px-5 gap-2 min-w-0"
      >
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1.5 text-[13px] font-semibold text-[#171136] shrink-0 hover:text-[#FF4D6D] transition-colors"
        >
          All categories
          <IconChevronRight className="w-3.5 h-3.5 text-[#736E9B]" />
        </Link>
        <span className="hidden sm:block w-px h-6 bg-[#EAE3F7] shrink-0" />
        <IconSearch className="w-4 h-4 text-[#736E9B] shrink-0" />
        <input
          value={term}
          onChange={(e) => {
            setTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search figures, brick sets, coding kits…"
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          className="bg-transparent outline-none text-xs sm:text-[13.5px] text-[#3B3468] placeholder:text-[#736E9B] flex-1 min-w-0"
        />
        {loading && (
          <span className="w-4 h-4 border-2 border-[#FF4D6D] border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        <button
          type="submit"
          aria-label="Search"
          className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-full bg-[#FF4D6D] hover:bg-[#ff3358] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        >
          <IconSearch className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
        </button>
      </form>

      {showPanel && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white border border-[#EAE3F7] rounded-2xl shadow-[0_16px_40px_-8px_rgba(23,17,54,0.18)] overflow-hidden"
        >
          {failed ? (
            <p className="px-4 py-5 text-xs text-[#736E9B] text-center">Search is unavailable right now. Press Enter to search the shop.</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-5 text-xs text-[#736E9B] text-center">
              {loading ? "Searching…" : `No products found for "${query}"`}
            </p>
          ) : (
            <>
              <ul className="max-h-[70vh] overflow-y-auto divide-y divide-[#F0EBF8]">
                {results.map((p, i) => (
                  <li key={p.id} role="option" aria-selected={i === active}>
                    <Link
                      href={`/product/${p.slug || p.id}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 transition-colors ${
                        i === active ? "bg-[#F6F1FF]" : "hover:bg-[#FAF7FF]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getMediaUrl(p.image || p.image_file)}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover bg-[#F6F1FF] shrink-0"
                      />
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-bold text-[#171136] truncate">{p.name}</span>
                        <span className="block text-[10.5px] font-bold tracking-wide uppercase text-[#FF4D6D] truncate">
                          {p.category}
                        </span>
                      </span>
                      <span className="text-[13px] font-extrabold text-[#171136] shrink-0">
                        {p.discountedPrice || p.price}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToResults}
                className="w-full px-4 py-3 bg-[#FAF7FF] hover:bg-[#F3EEFF] text-xs font-bold text-[#FF4D6D] text-center cursor-pointer transition-colors"
              >
                {total > results.length ? `See all ${total} results for "${query}"` : `View in shop`}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
