"use client";

import { useState, useEffect } from "react";
import ProductGrid from "./ProductGrid";
import type { ProductSection, Product } from "./productData";
import { getHomepageSections, getProductSections, getNewArrivals } from "@/lib/api";

interface HomepageSectionsFeedProps {
  initialSections: ProductSection[];
  initialNewArrivals: Product[];
}

export default function HomepageSectionsFeed({
  initialSections,
  initialNewArrivals,
}: HomepageSectionsFeedProps) {
  const [sections, setSections] = useState<ProductSection[]>(initialSections || []);
  const [newArrivals, setNewArrivals] = useState<Product[]>(initialNewArrivals || []);

  useEffect(() => {
    // If the server provided sections and arrivals, keep them
    if (initialSections && initialSections.length > 0) {
      setSections(initialSections);
    }
    if (initialNewArrivals && initialNewArrivals.length > 0) {
      setNewArrivals(initialNewArrivals);
    }

    // Client-side fallback: If server rendered 0 sections or 0 arrivals (e.g. backend restart/timeout),
    // fetch directly in browser so products always appear!
    if (!initialSections || initialSections.length === 0 || !initialNewArrivals || initialNewArrivals.length === 0) {
      Promise.all([
        getHomepageSections(),
        getProductSections(),
        getNewArrivals(10),
      ])
        .then(([catSections, fixSections, arrivals]) => {
          const resolved = catSections && catSections.length > 0 ? catSections : fixSections;
          if (resolved && resolved.length > 0) {
            setSections(resolved);
          }
          if (arrivals && arrivals.length > 0) {
            setNewArrivals(arrivals);
          }
        })
        .catch(() => {});
    }
  }, [initialSections, initialNewArrivals]);

  const newArrivalsSection: ProductSection = {
    id: "new-arrivals",
    eyebrow: "JUST LANDED IN STORE",
    eyebrowColor: "#FF4D6D",
    title: "New Arrivals",
    itemCount: `${newArrivals.length} items`,
    accent: "#FF4D6D",
    products: newArrivals,
    href: "/shop?sort=newest",
  };

  return (
    <>
      {sections.map((section) => (
        <ProductGrid key={section.id} section={section} />
      ))}

      {newArrivals.length > 0 && (
        <ProductGrid section={newArrivalsSection} />
      )}
    </>
  );
}
